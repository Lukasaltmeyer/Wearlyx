import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { reviewId, action, reason } = await req.json();
  if (!reviewId || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  if (action === "delete") {
    const { error } = await supabase.from("reviews").update({
      is_deleted: true, deleted_by: user.id, deleted_reason: reason ?? "Modéré par admin",
    }).eq("id", reviewId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "restore") {
    const { error } = await supabase.from("reviews").update({
      is_deleted: false, deleted_by: null, deleted_reason: null,
    }).eq("id", reviewId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
