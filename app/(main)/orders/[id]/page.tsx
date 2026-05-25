export const dynamic = "force-dynamic";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { OrderDetailClient } from "@/components/marketplace/OrderDetailClient";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: order } = await supabase
    .from("orders")
    .select("*, product:products(id,title,images,price), buyer:profiles!orders_buyer_id_fkey(id,username,full_name,avatar_url), seller:profiles!orders_seller_id_fkey(id,username,full_name,avatar_url), shipment:shipments(*)")
    .eq("id", id)
    .single();

  if (!order || (order.buyer_id !== user.id && order.seller_id !== user.id)) notFound();

  const device = await getDeviceType();
  const isDesktop = device === "desktop";

  if (isDesktop) {
    return (
      <main className="min-h-[100dvh] px-8 py-8">
        <OrderDetailClient order={order} currentUserId={user.id} isDesktop />
      </main>
    );
  }

  return <OrderDetailClient order={order} currentUserId={user.id} />;
}
