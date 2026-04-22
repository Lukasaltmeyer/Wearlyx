export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ListingsClient } from "@/components/ListingsClient";
import { Navbar } from "@/components/layout/Navbar";

export default async function ListingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: products } = await supabase
    .from("products")
    .select("*, likes(count)")
    .eq("seller_id", user.id)
    .neq("status", "deleted")
    .order("created_at", { ascending: false });

  const enriched = (products ?? []).map((p: any) => ({
    ...p,
    likes_count: p.likes?.[0]?.count ?? 0,
    likes: undefined,
  }));

  return (
    <>
      <Navbar />
      <main className="bg-[#08080F] min-h-[100dvh] pb-24">
        <ListingsClient products={enriched} userId={user.id} />
      </main>
    </>
  );
}
