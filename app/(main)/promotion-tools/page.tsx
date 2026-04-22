export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

  return (
    <>
      <Navbar />
      <main className="bg-[#08080F] min-h-[100dvh] pb-24 animate-fadeIn">
        <PromotionToolsClient products={products ?? []} />
      </main>
    </>
  );
}
