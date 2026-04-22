"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, RefreshCw } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/database";

interface Props {
  products: Product[];
  currentUserId: string;
}

export function FavoritesClient({ products, currentUserId }: Props) {
  const router = useRouter();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <Heart className="w-4.5 h-4.5 text-red-500 fill-red-500" />
          <h1 className="text-[17px] font-bold text-white">Mes favoris</h1>
          <button className="ml-1 text-white/30 hover:text-white/60 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[12px] font-semibold text-white/50 hover:text-white transition-colors">
          <span className="text-[10px]">⊞</span>
          Collections
        </button>
      </div>

      {/* Content */}
      <div className="px-4">
        {products.length === 0 ? (
          <div className="p-10 rounded-2xl border border-white/8 bg-white/2 flex flex-col items-center justify-center">
            <Heart className="w-12 h-12 text-white/15 mb-3" />
            <p className="text-[15px] font-bold text-white">Aucun favori</p>
            <p className="text-[13px] text-white/35 mt-1">Appuyez sur ❤ pour sauvegarder des articles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} currentUserId={currentUserId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
