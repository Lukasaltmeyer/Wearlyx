import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("email_notifications_enabled, marketing_consent")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    email_notifications_enabled: profile?.email_notifications_enabled ?? true,
    marketing_consent: profile?.marketing_consent ?? false,
  });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const body = await req.json();
  const update: Record<string, boolean> = {};

  if (typeof body.email_notifications_enabled === "boolean") {
    update.email_notifications_enabled = body.email_notifications_enabled;
  }
  if (typeof body.marketing_consent === "boolean") {
    update.marketing_consent = body.marketing_consent;
  }

  if (!Object.keys(update).length) {
    return NextResponse.json({ error: "Aucune donnée valide" }, { status: 400 });
  }

  const { error } = await supabase.from("profiles").update(update).eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
