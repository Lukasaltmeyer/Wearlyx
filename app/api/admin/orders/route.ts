import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { orderId, action } = await req.json();
  if (!orderId || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const now = new Date().toISOString();
  const statusMap: Record<string, string> = {
    refund: "refunded",
    cancel: "cancelled",
    resolve: "delivered",
    reopen: "paid",
  };

  const newStatus = statusMap[action];
  if (!newStatus) return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus, updated_at: now })
    .eq("id", orderId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify buyer on refund
  if (action === "refund") {
    const { data: order } = await supabase.from("orders").select("buyer_id, product:products(title)").eq("id", orderId).single();
    if (order?.buyer_id) {
      const title = (Array.isArray(order.product) ? order.product[0] : order.product)?.title ?? "produit";
      await supabase.from("notifications").insert({
        user_id: order.buyer_id, type: "order_delivered",
        title: "💸 Remboursement validé",
        body: `Ton remboursement pour "${title}" a été validé par l'administration.`,
        data: { orderId, action: "refund" },
      }).then(undefined, () => {});
    }
  }

  return NextResponse.json({ ok: true });
}
