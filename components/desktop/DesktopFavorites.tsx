"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, Zap, Filter, Grid3X3, LayoutGrid } from "lucide-react";
import type { Product } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const FILTERS = ["Tout", "Vêtements", "Sneakers", "Accessoires", "Luxe"];

function ProductCard({ product, onUnlike }: { product: Product; onUnlike: (id: string) => void }) {
  const [removing, setRemoving] = useState(false);
  const supabase = createClient();

  const handleUnlike = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setRemoving(true);
    await supabase.from("likes").delete().match({ product_id: product.id });
    setTimeout(() => onUnlike(product.id), 300);
  };

  const img = product.images?.[0];

  return (
    <Link href={`/products/${product.id}`} className="block group"
      style={{ opacity: removing ? 0 : 1, transition: "opacity 0.3s", transform: removing ? "scale(0.95)" : "scale(1)" }}>
      <div className="rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
        style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
          {img
            ? <Image src={img} alt={product.title} fill sizes="20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
            : <div className="absolute inset-0 flex items-center justify-center text-3xl" style={{ background: "rgba(139,92,246,0.05)" }}>👕</div>
          }
          <button onClick={handleUnlike}
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Retirer des favoris">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </button>
          {product.is_boosted && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[9px] font-black text-white flex items-center gap-1"
              style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}>
              <Zap className="w-2.5 h-2.5 fill-white" /> BOOST
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-8"
            style={{ background: "linear-gradient(to top, rgba(15,15,26,0.95), transparent)" }}>
            <p className="text-[16px] font-black text-white">{formatPrice(product.price)}</p>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3">
          <p className="text-[11.5px] text-white/45 truncate">{product.title}</p>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {product.brand && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-[#A78BFA]" style={{ background: "rgba(139,92,246,0.1)" }}>{product.brand}</span>}
            {product.size && <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full text-white/35" style={{ background: "rgba(255,255,255,0.05)" }}>{product.size}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function DesktopFavorites({ products: initial, currentUserId }: { products: Product[]; currentUserId: string }) {
  const [products, setProducts] = useState(initial);
  const [filter, setFilter] = useState("Tout");
  const [dense, setDense] = useState(false);

  const filtered = filter === "Tout" ? products : products.filter(p =>
    p.category?.toLowerCase().includes(filter.toLowerCase()) ||
    p.title?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-[100dvh] px-8 py-7" style={{ background: "#07070A" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-black text-white">Mes favoris</h1>
          <p className="text-[14px] text-white/35 mt-0.5">{products.length} article{products.length !== 1 ? "s" : ""} sauvegardé{products.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDense(v => !v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/8"
            style={{ color: dense ? "#A78BFA" : "rgba(255,255,255,0.4)", background: dense ? "rgba(139,92,246,0.1)" : "transparent" }}>
            {dense ? <LayoutGrid className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-white/25" />
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-[12.5px] font-semibold transition-all"
            style={{
              background: filter === f ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
              border: filter === f ? "1px solid rgba(139,92,246,0.35)" : "1px solid transparent",
              color: filter === f ? "#A78BFA" : "rgba(255,255,255,0.4)",
            }}>
            {f}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <Heart className="w-7 h-7 text-red-400/40" />
          </div>
          <p className="text-[16px] font-bold text-white/25 mb-1">Aucun favori</p>
          <p className="text-[13px] text-white/15 mb-6">Ajoute des articles en cliquant sur ♡</p>
          <Link href="/search"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
            <Sparkles className="w-4 h-4" /> Explorer les articles
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-[14px] text-white/25">Aucun article dans cette catégorie</p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: dense ? "repeat(auto-fill, minmax(140px, 1fr))" : "repeat(auto-fill, minmax(190px, 1fr))" }}>
          {filtered.map((p, i) => (
            <div key={p.id} className="animate-fadeIn" style={{ animationDelay: `${i * 20}ms` }}>
              <ProductCard product={p} onUnlike={(id) => setProducts(prev => prev.filter(x => x.id !== id))} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
