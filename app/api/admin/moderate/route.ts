import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";

async function notify(supabase: any, userId: string, title: string, body: string, data: object) {
  try {
    await supabase.from("notifications").insert({ user_id: userId, type: "moderation", title, body, data });
  } catch {}
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { targetUserId, action, reason, durationDays } = await req.json();
  if (!targetUserId || !action) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const now = new Date().toISOString();

  if (action === "lift") {
    const { error } = await supabase.from("user_moderation").update({
      status: "none", lifted_at: now, lifted_by: user.id,
    }).eq("user_id", targetUserId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "warn") {
    const { data: existing } = await supabase
      .from("user_moderation").select("id, warn_count").eq("user_id", targetUserId).maybeSingle();

    let dbError;
    if (existing) {
      const { error } = await supabase.from("user_moderation").update({
        status: "warned",
        warn_count: (existing.warn_count ?? 0) + 1,
        last_reason: reason ?? "Avertissement de l'admin",
        updated_at: now,
      }).eq("user_id", targetUserId);
      dbError = error;
    } else {
      const { error } = await supabase.from("user_moderation").insert({
        user_id: targetUserId, status: "warned", warn_count: 1,
        last_reason: reason ?? "Avertissement de l'admin",
        created_at: now, updated_at: now,
      });
      dbError = error;
    }
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    await notify(supabase, targetUserId, "⚠️ Avertissement",
      reason ?? "Tu as reçu un avertissement de la part de l'équipe Wearlyx.", { action: "warn" });
    return NextResponse.json({ ok: true });
  }

  if (action === "suspend") {
    const days = durationDays ?? 7;
    const expiresAt = new Date(Date.now() + days * 86400000).toISOString();

    const { data: existing } = await supabase
      .from("user_moderation").select("id").eq("user_id", targetUserId).maybeSingle();

    let dbError;
    if (existing) {
      const { error } = await supabase.from("user_moderation").update({
        status: "suspended", expires_at: expiresAt,
        last_reason: reason ?? `Suspension ${days} jours`,
        updated_at: now, lifted_at: null,
      }).eq("user_id", targetUserId);
      dbError = error;
    } else {
      const { error } = await supabase.from("user_moderation").insert({
        user_id: targetUserId, status: "suspended", expires_at: expiresAt,
        last_reason: reason ?? `Suspension ${days} jours`,
        warn_count: 0, created_at: now, updated_at: now,
      });
      dbError = error;
    }
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    await notify(supabase, targetUserId, "🔒 Compte suspendu",
      `Ton compte a été suspendu ${days} jours. Raison : ${reason ?? "Non précisée"}.`, { action: "suspend", days });
    return NextResponse.json({ ok: true });
  }

  if (action === "ban") {
    const { data: existing } = await supabase
      .from("user_moderation").select("id").eq("user_id", targetUserId).maybeSingle();

    let dbError;
    if (existing) {
      const { error } = await supabase.from("user_moderation").update({
        status: "banned", expires_at: null,
        last_reason: reason ?? "Bannissement définitif",
        updated_at: now, lifted_at: null,
      }).eq("user_id", targetUserId);
      dbError = error;
    } else {
      const { error } = await supabase.from("user_moderation").insert({
        user_id: targetUserId, status: "banned",
        last_reason: reason ?? "Bannissement définitif",
        warn_count: 0, created_at: now, updated_at: now,
      });
      dbError = error;
    }
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    await notify(supabase, targetUserId, "🚫 Compte banni",
      `Ton compte a été banni définitivement. Raison : ${reason ?? "Non précisée"}.`, { action: "ban" });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
