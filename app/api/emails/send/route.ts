import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail, generateUnsubscribeToken, EmailType } from "@/lib/email";
import { isAdminUser } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  const { type, to, data, filter } = body as {
    type: EmailType;
    to?: string;
    data?: Record<string, string | number>;
    filter?: "all" | "active" | "new_7d";
  };

  // Single recipient
  if (to) {
    // Marketing emails: check consent
    if (type.startsWith("marketing_")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("marketing_consent, email_notifications_enabled")
        .eq("id", to)
        .single();

      if (!profile?.marketing_consent) {
        return NextResponse.json({ error: "Utilisateur sans consentement marketing" }, { status: 400 });
      }
    }

    const { data: { user: targetUser } } = await supabase.auth.admin.getUserById(to).catch(() => ({ data: { user: null } }));
    const email = targetUser?.email;
    if (!email) return NextResponse.json({ error: "Email introuvable" }, { status: 404 });

    const result = await sendEmail({ to: email, type, data });
    return NextResponse.json(result);
  }

  // Bulk campaign (marketing only)
  if (!type.startsWith("marketing_")) {
    return NextResponse.json({ error: "Envoi groupé réservé aux emails marketing" }, { status: 400 });
  }

  // Fetch consenting users
  let query = supabase
    .from("profiles")
    .select("id, email_notifications_enabled, marketing_consent")
    .eq("marketing_consent", true)
    .eq("email_notifications_enabled", true);

  if (filter === "new_7d") {
    const d = new Date(); d.setDate(d.getDate() - 7);
    query = query.gte("created_at", d.toISOString());
  }

  const { data: profiles } = await query;
  if (!profiles?.length) return NextResponse.json({ sent: 0 });

  let sent = 0;
  const errors: string[] = [];

  for (const profile of profiles) {
    try {
      const { data: { user: u } } = await supabase.auth.admin.getUserById(profile.id);
      if (!u?.email) continue;

      const token = generateUnsubscribeToken(profile.id);
      await sendEmail({ to: u.email, type, data, unsubscribeToken: token });
      sent++;
    } catch (e: any) {
      errors.push(e.message);
    }
  }

  return NextResponse.json({ sent, errors: errors.length ? errors : undefined });
}
