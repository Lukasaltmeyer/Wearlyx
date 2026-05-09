export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { isAdminUser } from "@/lib/admin";
import { Navbar } from "@/components/layout/Navbar";
import { ProfileMenuClient } from "@/components/ProfileMenuClient";
import { DesktopProfile } from "@/components/desktop/DesktopProfile";

export default async function ProfileMenuPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const [{ data: profile }, { data: products }, { data: reviews }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("products").select("*").eq("seller_id", user.id).neq("status", "deleted"),
    supabase.from("reviews").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
  ]);

  const device = await getDeviceType();

  if (device === "desktop") {
    return <DesktopProfile profile={profile} products={products ?? []} reviews={reviews ?? []} isOwnProfile />;
  }

  const productsCount = products?.length ?? 0;
  const salesCount = profile?.sales_count ?? 0;
  const credits = salesCount * 100 + productsCount * 10;
  const adminUser = isAdminUser(user);

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24">
        <ProfileMenuClient
          profile={profile}
          credits={adminUser ? 99999 : credits}
          badgesEarned={adminUser ? 48 : (productsCount >= 1 ? 1 : 0)}
          totalBadges={48}
          levelsEarned={adminUser ? 12 : (credits >= 0 ? 1 : 0)}
          totalLevels={12}
          isAdmin={adminUser}
        />
      </main>
    </>
  );
}
