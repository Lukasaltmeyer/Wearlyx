import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { shipmentId, action } = await req.json();
  if (!shipmentId || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const now = new Date().toISOString();

  if (action === "deliver") {
    const { error } = await supabase.from("shipments").update({
      status: "delivered", delivered_at: now, updated_at: now,
    }).eq("id", shipmentId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Also mark the order as delivered
    const { data: shipment } = await supabase.from("shipments").select("order_id").eq("id", shipmentId).single();
    if (shipment?.order_id) {
      await supabase.from("orders").update({ status: "delivered", updated_at: now }).eq("id", shipment.order_id);
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "fail") {
    const { error } = await supabase.from("shipments").update({ status: "failed", updated_at: now }).eq("id", shipmentId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "transit") {
    const { error } = await supabase.from("shipments").update({ status: "in_transit", updated_at: now }).eq("id", shipmentId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
