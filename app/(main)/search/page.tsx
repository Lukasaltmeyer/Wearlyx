export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { ExplorerClient } from "@/components/ExplorerClient";

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase");

interface SearchParams { q?: string; category?: string; }

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { q, category } = await searchParams;

  let products: any[] = [];
  let userId: string | undefined;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;

    let query = supabase
      .from("products")
      .select("*, seller:profiles(id, username, full_name, avatar_url, rating), likes(count)")
      .eq("status", "active");

    if (q) query = query.or(`title.ilike.%${q}%,brand.ilike.%${q}%`);
    if (category && category !== "all") query = query.eq("category", category);

    const { data } = await query.order("created_at", { ascending: false }).limit(40);

    let likedIds = new Set<string>();
    if (user) {
      const { data: likes } = await supabase.from("likes").select("product_id").eq("user_id", user.id);
      likedIds = new Set((likes ?? []).map((l: any) => l.product_id));
    }

    products = (data ?? []).map((p: any) => ({
      ...p,
      likes_count: p.likes?.[0]?.count ?? 0,
      is_liked: likedIds.has(p.id),
      likes: undefined,
      seller: Array.isArray(p.seller) ? p.seller[0] : p.seller,
    }));
  }

  return <ExplorerClient products={products} currentUserId={userId} initialQ={q} initialCategory={category} />;
}
