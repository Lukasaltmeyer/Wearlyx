export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProfileView } from "@/components/ProfileView";
import { isAdminUser } from "@/lib/admin";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: products }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    supabase.from("products")
      .select("*, likes(count)")
      .eq("seller_id", id)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
  ]);

  if (!profile) notFound();

  const enriched = (products ?? []).map((p) => ({
    ...p,
    likes_count: (p.likes as unknown as { count: number }[])?.[0]?.count ?? 0,
    likes: undefined,
  }));

  const adminUser = user ? isAdminUser(user) : false;

  return (
    <ProfileView
      profile={profile}
      products={enriched}
      savedProducts={[]}
      isOwner={user?.id === id}
      currentUserId={user?.id}
      isAdmin={adminUser}
    />
  );
}
