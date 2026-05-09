"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, Sparkles, Zap, Filter, Grid3X3, LayoutGrid, TrendingUp,
  ArrowRight, Search, Package, ChevronRight
} from "lucide-react";
import type { Product } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const FILTERS = ["Tout", "Vêtements", "Sneakers", "Accessoires", "Luxe"];

const TRENDING_SEARCHES = [
  "Nike Air Force 1", "Jacquemus", "Zara 2024", "Jordan 1 Retro",
  "Vintage Levi's", "Sac Prada", "Veste Carhartt",
];

const CATEGORIES = [
  { label: "Sneakers",     emoji: "👟", color: "#8B5CF6", count: "4.2K+" },
  { label: "Vêtements",   emoji: "👕", color: "#3B82F6", count: "12K+" },
  { label: "Accessoires", emoji: "👜", color: "#EC4899", count: "3.1K+" },
  { label: "Luxe",        emoji: "💎", color: "#F59E0B", count: "890+" },
  { label: "Vintage",     emoji: "🕶️", color: "#10B981", count: "2.4K+" },
  { label: "Sport",       emoji: "🏃", color: "#EF4444", count: "1.8K+" },
];

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
      style={{ opacity: removing ? 0 : 1, transition: "opacity 0.3s, transform 0.3s", transform: removing ? "scale(0.95)" : "scale(1)" }}>
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

function EmptyState() {
  return (
    <div className="flex flex-col gap-10">
      {/* Hero empty */}
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.05), rgba(109,40,217,0.03))", border: "1px solid rgba(139,92,246,0.1)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 60%)" }} />
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 mx-auto"
            style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.06))", border: "1px solid rgba(239,68,68,0.2)", boxShadow: "0 0 40px rgba(239,68,68,0.1)" }}>
            <Heart className="w-9 h-9 text-red-400/60" />
          </div>
          <h2 className="text-[22px] font-black text-white mb-2">Aucun favori pour l'instant</h2>
          <p className="text-[14px] text-white/35 mb-6 max-w-[380px] leading-relaxed">
            Clique sur ♡ sur n'importe quel article pour le sauvegarder ici et ne plus jamais le perdre de vue.
          </p>
          <Link href="/search"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-[14px] font-bold text-white transition-all hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.35)" }}>
            <Search className="w-4 h-4" /> Explorer les articles
          </Link>
        </div>
      </div>

      {/* Categories grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-black text-white">Explorer par catégorie</h3>
          <Link href="/search" className="flex items-center gap-1 text-[12px] text-[#A78BFA] hover:text-white transition-colors">
            Tout voir <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
          {CATEGORIES.map(({ label, emoji, color, count }) => (
            <Link key={label} href={`/search?category=${encodeURIComponent(label)}`}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] group"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}35`; (e.currentTarget as HTMLElement).style.background = `${color}08`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}>
              <span className="text-2xl flex-shrink-0">{emoji}</span>
              <div>
                <p className="text-[13px] font-bold text-white">{label}</p>
                <p className="text-[10px] text-white/30">{count} articles</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending searches */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
          <h3 className="text-[16px] font-black text-white">Tendances du moment</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING_SEARCHES.map((t) => (
            <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold text-white/50 transition-all hover:text-white hover:bg-white/8"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Search className="w-3 h-3 flex-shrink-0" />
              {t}
            </Link>
          ))}
        </div>
      </div>

      {/* IA recommendations CTA */}
      <Link href="/search"
        className="flex items-center gap-5 px-6 py-5 rounded-2xl transition-all hover:-translate-y-0.5"
        style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(109,40,217,0.04))", border: "1px solid rgba(139,92,246,0.18)" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(139,92,246,0.18)", boxShadow: "0 0 20px rgba(139,92,246,0.2)" }}>
          <Sparkles className="w-5 h-5 text-[#A78BFA]" />
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-bold text-white mb-0.5">Sélection personnalisée par l'IA</p>
          <p className="text-[12px] text-white/35">Articles choisis pour toi selon tes goûts et ta taille</p>
        </div>
        <ArrowRight className="w-5 h-5 text-white/20 flex-shrink-0" />
      </Link>
    </div>
  );
}

export function DesktopFavorites({ products: initial }: { products: Product[]; currentUserId: string }) {
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
          <h1 className="text-[28px] font-black text-white flex items-center gap-3">
            Mes favoris
            {products.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[14px] font-bold text-white"
                style={{ background: "rgba(239,68,68,0.15)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                {products.length}
              </span>
            )}
          </h1>
          <p className="text-[13px] text-white/30 mt-0.5">
            {products.length === 0 ? "Aucun article sauvegardé" : `${products.length} article${products.length !== 1 ? "s" : ""} sauvegardé${products.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {products.length > 0 && (
          <div className="flex items-center gap-2">
            <button onClick={() => setDense(v => !v)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ color: dense ? "#A78BFA" : "rgba(255,255,255,0.4)", background: dense ? "rgba(139,92,246,0.1)" : "transparent", border: "1px solid rgba(255,255,255,0.07)" }}>
              {dense ? <LayoutGrid className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Filters */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-white/25 flex-shrink-0" />
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

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Package className="w-8 h-8 text-white/15 mb-3" />
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
        </>
      )}
    </div>
  );
}
