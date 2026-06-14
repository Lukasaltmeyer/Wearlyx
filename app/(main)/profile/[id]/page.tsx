export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { ProfileView } from "@/components/ProfileView";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: products }, { data: reviews }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    supabase.from("products").select("*").eq("seller_id", id).eq("status", "active").order("created_at", { ascending: false }),
    supabase.from("reviews").select("*, reviewer:profiles!reviews_reviewer_id_fkey(id, username, full_name, avatar_url)").eq("reviewed_id", id).order("created_at", { ascending: false }).limit(50),
  ]);

  if (!profile) notFound();

  const device = await getDeviceType();
  const isOwner = user?.id === id;

  if (device === "desktop") {
    let isFollowing = false;
    if (user && !isOwner) {
      const { data } = await supabase.from("follows").select("id").match({ follower_id: user.id, following_id: id }).maybeSingle();
      isFollowing = !!data;
    }
    const { DesktopProfile } = await import("@/components/desktop/DesktopProfile");
    return (
      <DesktopProfile
        profile={profile}
        products={products ?? []}
        reviews={reviews ?? []}
        isOwnProfile={isOwner}
        currentUserId={user?.id}
        isFollowing={isFollowing}
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
