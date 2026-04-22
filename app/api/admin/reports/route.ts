import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { reportId, action, admin_note } = await req.json();
  if (!reportId || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const statusMap: Record<string, string> = {
    dismiss: "dismissed",
    action:  "actioned",
    review:  "reviewed",
  };
  const newStatus = statusMap[action];
  if (!newStatus) return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  const { error } = await supabase.from("admin_reports").update({
    status: newStatus,
    admin_note: admin_note ?? null,
  }).eq("id", reportId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
