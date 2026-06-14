export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/analytics");

  const [{ data: products }, { data: orders }, { data: profile }] = await Promise.all([
    supabase
      .from("products")
      .select("id, title, price, images, status, created_at, views_count, likes(count)")
      .eq("seller_id", user.id)
      .neq("status", "deleted")
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("id, total_price, status, created_at, product_id")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("sales_count, followers_count").eq("id", user.id).single(),
  ]);

  const device = await getDeviceType();

  if (device === "desktop") {
    const { DesktopAnalytics } = await import("@/components/desktop/DesktopAnalytics");
    return (
      <DesktopAnalytics
        userId={user.id}
        products={products ?? []}
        orders={orders ?? []}
        salesCount={profile?.sales_count ?? 0}
        followersCount={profile?.followers_count ?? 0}
      />
    );
  }

  // Mobile fallback — redirect to sales page
  redirect("/sales");
}
