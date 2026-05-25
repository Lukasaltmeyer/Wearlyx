import { createClient } from "@/lib/supabase/client";

export type Plan = "free" | "starter" | "pro" | "premium";

export interface PlanInfo {
  id: Plan;
  label: string;
  emoji: string;
  color: string;
  aiPhotosLimit: number | null;  // null = unlimited
  boostLimit: number | null;     // null = unlimited
  price: string;
  commissionRate: number;        // 0.0–1.0
  features: {
    backgroundRemoval: boolean;
    advancedStats: boolean;
    buyerFollowUp: boolean;
    customShop: boolean;
    prioritySupport: boolean;
  };
}

export const PLANS: PlanInfo[] = [
  {
    id: "free",
    label: "Gratuit",
    emoji: "🆓",
    color: "#9CA3AF",
    aiPhotosLimit: 5,
    boostLimit: 0,
    price: "0€",
    commissionRate: 0.05,
    features: { backgroundRemoval: false, advancedStats: false, buyerFollowUp: false, customShop: false, prioritySupport: false },
  },
  {
    id: "starter",
    label: "Starter",
    emoji: "🚀",
    color: "#60A5FA",
    aiPhotosLimit: 20,
    boostLimit: 5,
    price: "8€/mois",
    commissionRate: 0.05,
    features: { backgroundRemoval: false, advancedStats: false, buyerFollowUp: false, customShop: false, prioritySupport: false },
  },
  {
    id: "pro",
    label: "Vendeur Pro",
    emoji: "⚡",
    color: "#A78BFA",
    aiPhotosLimit: 60,
    boostLimit: 15,
    price: "18€/mois",
    commissionRate: 0.05,
    features: { backgroundRemoval: true, advancedStats: true, buyerFollowUp: true, customShop: false, prioritySupport: false },
  },
  {
    id: "premium",
    label: "Premium",
    emoji: "👑",
    color: "#FCD34D",
    aiPhotosLimit: null,
    boostLimit: null,
    price: "25€/mois",
    commissionRate: 0.0,
    features: { backgroundRemoval: true, advancedStats: true, buyerFollowUp: true, customShop: true, prioritySupport: true },
  },
];

export function getPlanInfo(plan: Plan): PlanInfo {
  return PLANS.find((p) => p.id === plan) ?? PLANS[0];
}

export interface UsageData {
  plan: Plan;
  ai_photos_used: number;
  boost_used: number;
  reset_date: string;
  limit: number | null;
  boost_limit: number | null;
  remaining: number | null;
  boost_remaining: number | null;
  pct: number;
}

const ADMIN_ID = "4580beb3-695d-4220-875c-aa74690c9fd5";

export async function getUsage(): Promise<UsageData | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  if (user.id === ADMIN_ID) {
    return {
      plan: "premium", ai_photos_used: 0, boost_used: 0,
      reset_date: "2099-12-31", limit: null, boost_limit: null,
      remaining: null, boost_remaining: null, pct: 0,
    };
  }

  let { data, error } = await supabase
    .from("user_usage")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    const resetDate = new Date();
    resetDate.setMonth(resetDate.getMonth() + 1);
    const { data: created } = await supabase
      .from("user_usage")
      .insert({
        user_id: user.id,
        plan: "free",
        ai_photos_used: 0,
        boost_used: 0,
        reset_date: resetDate.toISOString().split("T")[0],
      })
      .select()
      .single();
    data = created;
  }

  if (!data) return null;

  if (new Date(data.reset_date) < new Date()) {
    const nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);
    await supabase
      .from("user_usage")
      .update({ ai_photos_used: 0, boost_used: 0, reset_date: nextReset.toISOString().split("T")[0] })
      .eq("user_id", user.id);
    data.ai_photos_used = 0;
    data.boost_used = 0;
    data.reset_date = nextReset.toISOString().split("T")[0];
  }

  const plan = (data.plan ?? "free") as Plan;
  const info = getPlanInfo(plan);
  const limit = info.aiPhotosLimit;
  const boostLimit = info.boostLimit;
  const used = data.ai_photos_used ?? 0;
  const boostUsed = data.boost_used ?? 0;
  const remaining = limit === null ? null : Math.max(0, limit - used);
  const boostRemaining = boostLimit === null ? null : Math.max(0, boostLimit - boostUsed);
  const pct = limit === null ? 0 : Math.min(100, (used / limit) * 100);

  return {
    plan, ai_photos_used: used, boost_used: boostUsed,
    reset_date: data.reset_date, limit, boost_limit: boostLimit,
    remaining, boost_remaining: boostRemaining, pct,
  };
}

export async function canEnhance(): Promise<{ allowed: boolean; usage: UsageData | null }> {
  const usage = await getUsage();
  if (!usage) return { allowed: false, usage: null };
  if (usage.limit === null) return { allowed: true, usage };
  return { allowed: (usage.remaining ?? 0) > 0, usage };
}

export async function canBoost(): Promise<{ allowed: boolean; usage: UsageData | null }> {
  const usage = await getUsage();
  if (!usage) return { allowed: false, usage: null };
  if (usage.boost_limit === null) return { allowed: true, usage };
  if (usage.boost_limit === 0) return { allowed: false, usage };
  return { allowed: (usage.boost_remaining ?? 0) > 0, usage };
}

export async function canUseBackgroundRemoval(): Promise<boolean> {
  const usage = await getUsage();
  if (!usage) return false;
  return getPlanInfo(usage.plan).features.backgroundRemoval;
}

export async function hasFeature(feature: keyof PlanInfo["features"]): Promise<boolean> {
  const usage = await getUsage();
  if (!usage) return false;
  return getPlanInfo(usage.plan).features[feature];
}

export async function getCommissionRate(userId: string): Promise<number> {
  const supabase = createClient();
  const { data } = await supabase
    .from("user_usage")
    .select("plan")
    .eq("user_id", userId)
    .single();
  const plan = (data?.plan ?? "free") as Plan;
  return getPlanInfo(plan).commissionRate;
}

export async function recordEnhancement(count = 1): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id === ADMIN_ID) return;
  await supabase.rpc("increment_ai_photos_used", { uid: user.id, amount: count });
}

export async function recordBoost(): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id === ADMIN_ID) return;
  await supabase.rpc("increment_boost_used", { uid: user.id, amount: 1 });
}
