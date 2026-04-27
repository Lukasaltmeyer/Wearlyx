"use client";

import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/database";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface ProductGridProps {
  products: Product[];
  currentUserId?: string;
}


function EmptyState() {
  return (
    <div className="px-4 py-6">
      {/* CTA vendre */}
      <Link href="/sell/ai" className="block mb-4 active:scale-[0.98] transition-transform">
        <div className="relative rounded-2xl overflow-hidden p-5"
          style={{ background: "linear-gradient(135deg, #4C1D95 0%, #8B5CF6 50%, #7C3AED 100%)" }}>
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/8" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-[16px]">Sois le premier à vendre !</p>
              <p className="text-white/65 text-[12px] mt-0.5">Publie un article en 30s avec l&apos;IA</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Skeleton grid — donne l'impression de contenu */}
      <p className="text-[11px] font-bold text-white/20 uppercase tracking-wider mb-3">Articles bientôt disponibles</p>
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-white/[0.05]" style={{ background: "#11111A" }}>
            <div className="aspect-square bg-white/[0.04] animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
            <div className="p-2.5 space-y-2">
              <div className="h-3 rounded bg-white/[0.06] w-2/3 animate-pulse" style={{ animationDelay: `${i * 150 + 100}ms` }} />
              <div className="h-2.5 rounded bg-white/[0.04] w-full animate-pulse" style={{ animationDelay: `${i * 150 + 200}ms` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductGrid({ products, currentUserId }: ProductGridProps) {
  if (!products.length) return <EmptyState />;

  return (
    <div className="pb-4 mt-2">
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