"use client";

import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/database";
import { Sparkles, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface ProductGridProps {
  products: Product[];
  currentUserId?: string;
}

function SectionRow({ title, products, currentUserId }: {
  title: string;
  icon?: React.ReactNode;
  products: Product[];
  currentUserId?: string;
}) {
  if (!products.length) return null;
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between px-3 mb-2.5">
        <p className="text-[15px] font-black text-white">{title}</p>
        <span className="text-[11px] text-white/25">{products.length} articles</span>
      </div>
      <div className="flex gap-2 overflow-x-auto px-3 scrollbar-none pb-1">
        {products.slice(0, 8).map((p) => (
          <div key={p.id} className="flex-shrink-0 w-[130px]">
            <ProductCard product={p} currentUserId={currentUserId} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-3xl mb-4 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #6C3AED22, #C026D322)" }}>
        <ShoppingBag className="w-7 h-7 text-[#a78bfa]" />
      </div>
      <p className="font-black text-white text-[17px] mb-1">Sois le premier !</p>
      <p className="text-[13px] text-white/35 mb-5">Aucun article pour l&apos;instant. Lance-toi !</p>
      <Link href="/sell/ai"
        className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[13px] font-bold text-white"
        style={{ background: "linear-gradient(135deg, #6C3AED, #C026D3)" }}>
        <Sparkles className="w-4 h-4" />
        Vendre avec l&apos;IA
      </Link>
    </div>
  );
}

export function ProductGrid({ products, currentUserId }: ProductGridProps) {
  if (!products.length) return <EmptyState />;

  const trending = [...products].sort((a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0)).slice(0, 8);
  const newItems = [...products].slice(0, 10);
  const deals = products.filter((p) => p.price < 20).slice(0, 8);
  const forYou = products.filter((p) => !trending.includes(p)).slice(0, 8);

  return (
    <div className="pb-4 mt-2">
      {trending.length > 0 && (
        <SectionRow title="🔥 Tendances" icon={null} products={trending} currentUserId={currentUserId} />
      )}
      {newItems.length > 0 && (
        <SectionRow title="✨ Nouveautés" icon={null} products={newItems} currentUserId={currentUserId} />
      )}
      {deals.length > 0 && (
        <SectionRow title="💸 Bonnes affaires" icon={null} products={deals} currentUserId={currentUserId} />
      )}
      {forYou.length > 0 && (
        <SectionRow title="❤️ Pour toi" icon={null} products={forYou} currentUserId={currentUserId} />
      )}

      {/* All articles title */}
      <div className="flex items-center justify-between px-3 mb-2.5 mt-1">
        <p className="text-[15px] font-black text-white">Tous les articles</p>
        <span className="text-[11px] text-white/25">{products.length}</span>
      </div>

      {/* Full grid */}
      <div className="px-3">
        <div className="grid grid-cols-2 gap-2">
          {products.map((product, i) => (
            <div key={product.id} className="animate-fadeIn" style={{ animationDelay: `${i * 30}ms` }}>
              <ProductCard product={product} currentUserId={currentUserId} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
