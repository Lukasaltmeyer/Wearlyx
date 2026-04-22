import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { disputeId, action, admin_note } = await req.json();
  if (!disputeId || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const now = new Date().toISOString();

  const { data: dispute, error: fetchErr } = await supabase
    .from("disputes").select("order_id, opened_by").eq("id", disputeId).single();
  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });

  // Map action → status + notifications
  type ActionMap = { dispute: string; order?: string; notify?: string };
  const actions: Record<string, ActionMap> = {
    validate:         { dispute: "validated",         notify: "Ton litige a été accepté. Choisis ta solution souhaitée." },
    reject:           { dispute: "rejected",          order: undefined, notify: "Ton litige a été refusé par l'administration." },
    review:           { dispute: "under_review",      notify: "Ton litige est en cours d'examen par l'équipe Wearlyx." },
    accept_solution:  { dispute: "solution_accepted", order: "refunded", notify: "Ta solution a été acceptée. Elle va être mise en place." },
    refuse_solution:  { dispute: "solution_refused",  notify: "Ta solution proposée a été refusée. L'équipe va te contacter." },
    close:            { dispute: "rejected",          notify: "Ton litige a été fermé par l'administration." },
  };

  const mapping = actions[action];
  if (!mapping) return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  const { error } = await supabase.from("disputes").update({
    status: mapping.dispute,
    admin_note: admin_note ?? null,
    updated_at: now,
  }).eq("id", disputeId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (mapping.order && dispute?.order_id) {
    await supabase.from("orders").update({ status: mapping.order, updated_at: now }).eq("id", dispute.order_id);
  }

  if (dispute?.opened_by && mapping.notify) {
    await supabase.from("notifications").insert({
      user_id: dispute.opened_by, type: "dispute_resolved",
      title: "🛡️ Mise à jour litige",
      body: mapping.notify,
      data: { disputeId, action },
    }).then(undefined, () => {});
  }

  return NextResponse.json({ ok: true });
}
