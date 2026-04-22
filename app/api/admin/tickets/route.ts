import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { ticketId, status, admin_note } = await req.json();
  if (!ticketId || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const validStatuses = ["open", "in_progress", "resolved", "closed"];
  if (!validStatuses.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const { error } = await supabase.from("support_tickets").update({
    status,
    admin_note: admin_note ?? null,
    updated_at: new Date().toISOString(),
  }).eq("id", ticketId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify user when resolved
  if (status === "resolved") {
    const { data: ticket } = await supabase.from("support_tickets").select("user_id, subject").eq("id", ticketId).single();
    if (ticket?.user_id) {
      await supabase.from("notifications").insert({
        user_id: ticket.user_id, type: "dispute_resolved",
        title: "✅ Ticket résolu",
        body: `Ton ticket "${ticket.subject}" a été résolu par l'équipe Wearlyx.`,
        data: { ticketId },
      }).then(undefined, () => {});
    }
  }

  return NextResponse.json({ ok: true });
}
