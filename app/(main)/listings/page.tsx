export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { ListingsClient } from "@/components/ListingsClient";
import { DesktopProfile } from "@/components/desktop/DesktopProfile";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";

export default async function ListingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const device = await getDeviceType();

  const [{ data: profile }, { data: products }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("products")
      .select("*, likes(count)")
      .eq("seller_id", user.id)
      .neq("status", "deleted")
      .order("created_at", { ascending: false }),
  ]);

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const enriched = (products ?? []).map((p: any) => ({
    ...p,
    likes_count: p.likes?.[0]?.count ?? 0,
    likes: undefined,
  }));

  if (device === "desktop") {
    return (
      <DesktopProfile
        profile={profile}
        products={enriched}
        reviews={reviews ?? []}
        isOwnProfile
      />
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24">
        <ListingsClient
          products={enriched}
          reviews={reviews ?? []}
          profile={profile}
          userId={user.id}
        />
      </main>
      <BottomNav />
    </>
  );
}
