export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      seller:profiles(id, username, full_name, avatar_url, rating, sales_count, created_at),
      likes(count)
    `)
    .eq("id", id)
    .neq("status", "deleted")
    .single();

  if (!product) notFound();

  let isLiked = false;
  let isSaved = false;

  if (user) {
    const [{ data: like }, { data: saved }] = await Promise.all([
      supabase.from("likes").select("id").match({ user_id: user.id, product_id: id }).single(),
      supabase.from("saved_items").select("id").match({ user_id: user.id, product_id: id }).single(),
    ]);
    isLiked = !!like;
    isSaved = !!saved;
  }

  // Increment views
  await supabase.from("products").update({ views: (product.views ?? 0) + 1 }).eq("id", id);

  const enriched = {
    ...product,
    likes_count: (product.likes as unknown as { count: number }[])?.[0]?.count ?? 0,
    is_liked: isLiked,
    is_saved: isSaved,
    likes: undefined,
  };

  return <ProductDetail product={enriched} currentUserId={user?.id} />;
}
