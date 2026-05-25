export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { ProductDetail } from "@/components/ProductDetail";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: product } = await supabase
    .from("products")
    .select("*, seller:profiles(id, username, full_name, avatar_url, rating)")
    .eq("id", id)
    .single();

  if (!product) notFound();

  let isLiked = false;
  let isSaved = false;
  if (user) {
    const [{ data: likes }, { data: saved }] = await Promise.all([
      supabase.from("likes").select("id").match({ user_id: user.id, product_id: id }).single(),
      supabase.from("saved_items").select("id").match({ user_id: user.id, product_id: id }).single(),
    ]);
    isLiked = !!likes;
    isSaved = !!saved;
  }

  const { data: likesCount } = await supabase
    .from("likes")
    .select("id", { count: "exact", head: true })
    .eq("product_id", id);

  const enriched = {
    ...product,
    seller: Array.isArray(product.seller) ? product.seller[0] : product.seller,
    is_liked: isLiked,
    is_saved: isSaved,
    likes_count: (likesCount as any)?.count ?? 0,
  };

  const device = await getDeviceType();

  if (device === "desktop") {
    const { DesktopProductDetail } = await import("@/components/desktop/DesktopProductDetail");
    return <DesktopProductDetail product={enriched} currentUserId={user?.id} />;
  }

  return <ProductDetail product={enriched} currentUserId={user?.id} />;
}
