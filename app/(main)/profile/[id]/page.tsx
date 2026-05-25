export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { ProfileView } from "@/components/ProfileView";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: products }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    supabase.from("products").select("*").eq("seller_id", id).eq("status", "active").order("created_at", { ascending: false }),
  ]);

  if (!profile) notFound();

  const device = await getDeviceType();
  const isOwner = user?.id === id;

  if (device === "desktop") {
    const { DesktopProfile } = await import("@/components/desktop/DesktopProfile");
    return (
      <DesktopProfile
        profile={profile}
        products={products ?? []}
        reviews={[]}
        isOwnProfile={isOwner}
      />
    );
  }

  return (
    <ProfileView
      profile={profile}
      products={products ?? []}
      savedProducts={[]}
      isOwner={isOwner}
      currentUserId={user?.id}
    />
  );
}
