import { createClient } from "@/lib/supabase/client";

export type Plan = "free" | "starter" | "pro" | "premium";

export interface PlanInfo {
  id: Plan;
  label: string;
  emoji: string;
  color: string;
  aiPhotosLimit: number | null; // null = unlimited
  price: string;
}

export const PLANS: PlanInfo[] = [
  { id: "free",     label: "Gratuit",     emoji: "🆓", color: "#9CA3AF", aiPhotosLimit: 5,    price: "0€" },
  { id: "starter",  label: "Starter",     emoji: "🚀", color: "#60A5FA", aiPhotosLimit: 20,   price: "4.99€/mois" },
  { id: "pro",      label: "Vendeur Pro", emoji: "⚡", color: "#4ADE80", aiPhotosLimit: 60,   price: "9.99€/mois" },
  { id: "premium",  label: "Premium",     emoji: "👑", color: "#FCD34D", aiPhotosLimit: null, price: "19.99€/mois" },
];

export function getPlanInfo(plan: Plan): PlanInfo {
  return PLANS.find((p) => p.id === plan) ?? PLANS[0];
}

export interface UsageData {
  plan: Plan;
  ai_photos_used: number;
  reset_date: string;
  limit: number | null;
  remaining: number | null;
  pct: number; // 0–100
}

const ADMIN_ID = "4580beb3-695d-4220-875c-aa74690c9fd5";

/** Fetch or create usage row for current user */
export async function getUsage(): Promise<UsageData | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Admin gets unlimited premium access
  if (user.id === ADMIN_ID) {
    return { plan: "premium", ai_photos_used: 0, reset_date: "2099-12-31", limit: null, remaining: null, pct: 0 };
  }

  // Try to get existing row
  let { data, error } = await supabase
    .from("user_usage")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Create if not exists
  if (error || !data) {
    const resetDate = new Date();
    resetDate.setMonth(resetDate.getMonth() + 1);
    const { data: created } = await supabase
      .from("user_usage")
      .insert({
        user_id: user.id,
        plan: "free",
        ai_photos_used: 0,
        reset_date: resetDate.toISOString().split("T")[0],
      })
      .select()
      .single();
    data = created;
  }

  if (!data) return null;

  // Auto-reset if past reset_date
  if (new Date(data.reset_date) < new Date()) {
    const nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);
    await supabase
      .from("user_usage")
      .update({ ai_photos_used: 0, reset_date: nextReset.toISOString().split("T")[0] })
      .eq("user_id", user.id);
    data.ai_photos_used = 0;
    data.reset_date = nextReset.toISOString().split("T")[0];
  }

  const plan = (data.plan ?? "free") as Plan;
  const info = getPlanInfo(plan);
  const limit = info.aiPhotosLimit;
  const used = data.ai_photos_used ?? 0;
  const remaining = limit === null ? null : Math.max(0, limit - used);
  const pct = limit === null ? 0 : Math.min(100, (used / limit) * 100);

  return { plan, ai_photos_used: used, reset_date: data.reset_date, limit, remaining, pct };
}

/** Check if user can enhance (returns true if allowed) */
export async function canEnhance(): Promise<{ allowed: boolean; usage: UsageData | null }> {
  const usage = await getUsage();
  if (!usage) return { allowed: false, usage: null };
  if (usage.limit === null) return { allowed: true, usage }; // unlimited
  return { allowed: (usage.remaining ?? 0) > 0, usage };
}

/** Increment usage counter after successful enhancement */
export async function recordEnhancement(count = 1): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  if (user.id === ADMIN_ID) return; // admin usage never counted

  await supabase.rpc("increment_ai_photos_used", { uid: user.id, amount: count });
}
