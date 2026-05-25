import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPlanInfo } from "@/lib/usage";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product_id } = await req.json();
  if (!product_id) return NextResponse.json({ error: "Missing product_id" }, { status: 400 });

  // Check ownership
  const { data: product } = await supabase
    .from("products")
    .select("id, seller_id, is_boosted")
    .eq("id", product_id)
    .single();

  if (!product || product.seller_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (product.is_boosted) {
    return NextResponse.json({ error: "Already boosted" }, { status: 400 });
  }

  // Check usage limits
  const { data: usage } = await supabase
    .from("user_usage")
    .select("plan, boost_used")
    .eq("user_id", user.id)
    .single();

  const plan = getPlanInfo((usage?.plan ?? "free") as any);
  const boostUsed = usage?.boost_used ?? 0;

  if (plan.boostLimit !== null && boostUsed >= plan.boostLimit) {
    return NextResponse.json({ error: "boost_limit_reached", plan: plan.id }, { status: 403 });
  }

  // Apply boost — expires after 24h
  const boostExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  await supabase.from("products").update({ is_boosted: true, boosted_until: boostExpiry }).eq("id", product_id);

  // Increment counter
  if (plan.boostLimit !== null) {
    await supabase.rpc("increment_boost_used", { uid: user.id, amount: 1 });
  }

  return NextResponse.json({ success: true, boosted_until: boostExpiry });
}
