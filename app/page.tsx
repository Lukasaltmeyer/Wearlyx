export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProductGrid } from "@/components/ProductGrid";
import { FilterBar } from "@/components/FilterBar";
import { HeroBanner } from "@/components/HeroBanner";
import type { Product } from "@/types/database";

interface SearchParams {
  category?: string;
  sort?: string;
  q?: string;
}

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase") &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Visiteur non connecté → page d'accueil/auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  let enrichedProducts: Product[] = [];
  let userId: string | undefined;

  if (isSupabaseConfigured) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;

    let query = supabase
      .from("products")
      .select("*, seller:profiles(id, username, full_name, avatar_url, rating), likes(count)")
      .eq("status", "active");

    if (params.category && params.category !== "all") {
      query = query.eq("category", params.category);
    }
    if (params.q) {
      query = query.ilike("title", `%${params.q}%`);
    }
    switch (params.sort) {
      case "price_asc":  query = query.order("price", { ascending: true });  break;
      case "price_desc": query = query.order("price", { ascending: false }); break;
      default:           query = query.order("created_at", { ascending: false });
    }

    const { data: products } = await query.limit(40);

    let likedIds = new Set<string>();
    let savedIds = new Set<string>();
    if (user) {
      const [{ data: likes }, { data: saved }] = await Promise.all([
        supabase.from("likes").select("product_id").eq("user_id", user.id),
        supabase.from("saved_items").select("product_id").eq("user_id", user.id),
      ]);
      likedIds = new Set((likes ?? []).map((l: any) => l.product_id));
      savedIds = new Set((saved ?? []).map((s: any) => s.product_id));
    }

    enrichedProducts = (products ?? []).map((p: any) => ({
      ...p,
      likes_count: p.likes?.[0]?.count ?? 0,
      is_liked: likedIds.has(p.id),
      is_saved: savedIds.has(p.id),
      likes: undefined,
      seller: Array.isArray(p.seller) ? p.seller[0] : p.seller,
    }));
  }

  return (
    <>
      <Navbar />
      <main className="w-full bg-[#07070A] min-h-[100dvh] pb-[120px]">
        <HeroBanner />
        <FilterBar activeCategory={params.category} activeSort={params.sort} />
        <ProductGrid products={enrichedProducts} currentUserId={userId} />
      </main>

      {/* Frais de port bar */}
      <div className="fixed bottom-[60px] left-0 right-0 z-30 flex items-center justify-center gap-2 py-2 border-t border-white/6"
        style={{ background: "rgba(8,8,15,0.97)" }}>
        <svg className="w-3 h-3 text-white/25 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-[11px] text-white/25">Les frais de port sont calculés lors du paiement</p>
      </div>

      <BottomNav />
    </>
  );
}