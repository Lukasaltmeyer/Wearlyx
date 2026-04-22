import { createClient } from "@/lib/supabase/server";

export type ModerationStatus = "none" | "warned" | "suspended" | "banned";

export interface ModerationInfo {
  status: ModerationStatus;
  reason?: string;
  expiresAt?: string;
  warnCount?: number;
}

export async function getUserModeration(userId: string): Promise<ModerationInfo> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_moderation")
    .select("status, last_reason, expires_at, warn_count")
    .eq("user_id", userId)
    .single();

  if (!data) return { status: "none" };

  // Auto-lift expired suspensions
  if (data.status === "suspended" && data.expires_at) {
    if (new Date(data.expires_at) < new Date()) {
      await supabase
        .from("user_moderation")
        .update({ status: "none" })
        .eq("user_id", userId);
      return { status: "none" };
    }
  }

  return {
    status: data.status as ModerationStatus,
    reason: data.last_reason,
    expiresAt: data.expires_at,
    warnCount: data.warn_count,
  };
}
