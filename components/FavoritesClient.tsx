"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/database";

interface Props {
  products: Product[];
  currentUserId: string;
}

export function FavoritesClient({ products, currentUserId }: Props) {
  const router = useRouter();

  return (
    <div
      className="min-h-[100dvh]"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.07) 0%, transparent 40%), radial-gradient(ellipse at 80% 100%, rgba(139,92,246,0.07) 0%, transparent 40%), #07070A",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-5">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60 active:scale-95 transition-transform"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
          </div>
          <h1 className="text-[17px] font-black text-white">Mes favoris</h1>
          {products.length > 0 && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}
            >
              {products.length}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pb-24">
        {products.length === 0 ? (
          <div
            className="mx-1 py-20 rounded-3xl flex flex-col items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.12)" }}
            >
              <Heart className="w-7 h-7 text-red-400/30" />
            </div>
            <p className="text-[15px] font-black text-white/40">Aucun favori</p>
            <p className="text-[12.5px] text-white/25 mt-1.5 text-center px-6">
              Appuie sur ❤ pour sauvegarder des articles
            </p>
            <button
              onClick={() => router.push("/search")}
              className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 16px rgba(139,92,246,0.3)" }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Explorer les articles
            </button>
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
