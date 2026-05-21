export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { Navbar } from "@/components/layout/Navbar";
import { PromotionToolsClient } from "@/components/PromotionToolsClient";

export default async function PromotionToolsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: products } = await supabase
    .from("products")
    .select("id, title, price, images")
    .eq("seller_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const device = await getDeviceType();

  if (device === "desktop") {
    return (
      <main className="min-h-[100dvh] px-10 py-10">
        <div className="max-w-[860px] mx-auto">
          <h1 className="text-[28px] font-black tracking-tight text-white/90 mb-8">Outils de promotion</h1>
          <PromotionToolsClient products={products ?? []} isDesktop />
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24 animate-fadeIn">
        <PromotionToolsClient products={products ?? []} />
      </main>
    </>
  );
}
