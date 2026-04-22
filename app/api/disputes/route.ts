import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST: user opens a dispute on a delivered order
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderId, disputeType, description, photos } = await req.json();
  if (!orderId || !disputeType) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Verify user is the buyer of this order
  const { data: order } = await supabase.from("orders")
    .select("id, buyer_id, seller_id, status").eq("id", orderId).single();
  if (!order || order.buyer_id !== user.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  if (!["delivered", "shipped", "in_transit"].includes(order.status))
    return NextResponse.json({ error: "Order not eligible for dispute" }, { status: 400 });

  // Check no existing open dispute
  const { data: existing } = await supabase.from("disputes")
    .select("id").eq("order_id", orderId).not("status", "in", '("rejected","resolved","solution_accepted")').maybeSingle();
  if (existing) return NextResponse.json({ error: "Dispute already exists" }, { status: 409 });

  const { error: dErr } = await supabase.from("disputes").insert({
    order_id: orderId,
    opened_by: user.id,
    reason: disputeType,
    dispute_type: disputeType,
    description: description ?? null,
    photos: photos ?? [],
    status: "open",
  });
  if (dErr) return NextResponse.json({ error: dErr.message }, { status: 500 });

  await supabase.from("orders").update({ status: "dispute" }).eq("id", orderId);

  // Notify admin (via notification to seller for now)
  await supabase.from("notifications").insert({
    user_id: order.seller_id, type: "dispute_opened",
    title: "⚠️ Litige ouvert",
    body: "Un acheteur a ouvert un litige sur une de tes commandes.",
    data: { orderId },
  }).then(undefined, () => {});

  return NextResponse.json({ ok: true });
}

// PATCH: user proposes a solution
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { disputeId, solution } = await req.json();
  if (!disputeId || !solution) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { data: dispute } = await supabase.from("disputes")
    .select("id, opened_by, status").eq("id", disputeId).single();
  if (!dispute || dispute.opened_by !== user.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  if (dispute.status !== "validated")
    return NextResponse.json({ error: "Dispute not awaiting solution" }, { status: 400 });

  await supabase.from("disputes").update({
    user_solution: solution,
    status: "solution_proposed",
    updated_at: new Date().toISOString(),
  }).eq("id", disputeId);

  return NextResponse.json({ ok: true });
}
