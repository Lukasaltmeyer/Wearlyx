export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { Navbar } from "@/components/layout/Navbar";
import { FavoritesClient } from "@/components/FavoritesClient";
import { DesktopFavorites } from "@/components/desktop/DesktopFavorites";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: likes } = await supabase
    .from("likes")
    .select("product_id, products(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const products = (likes ?? []).map((l: any) => l.products).filter(Boolean);
  const device = await getDeviceType();

  if (device === "desktop") {
    return <DesktopFavorites products={products} currentUserId={user.id} />;
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24 animate-fadeIn">
        <FavoritesClient products={products} currentUserId={user.id} />
      </main>
    </>
  );
}
