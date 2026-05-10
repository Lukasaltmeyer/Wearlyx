"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, Sparkles, Zap, Filter, Grid3X3, LayoutGrid,
  ArrowRight, Search, Package, ChevronRight,
  Flame, Users
} from "lucide-react";
import type { Product } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const FILTERS = ["Tout", "Vêtements", "Sneakers", "Accessoires", "Luxe"];

const CATEGORIES = [
  { label: "Sneakers",     emoji: "👟", color: "#8B5CF6", count: "4.2K+" },
  { label: "Vêtements",   emoji: "👕", color: "#3B82F6", count: "12K+" },
  { label: "Accessoires", emoji: "👜", color: "#EC4899", count: "3.1K+" },
  { label: "Luxe",        emoji: "💎", color: "#F59E0B", count: "890+" },
  { label: "Vintage",     emoji: "🕶️", color: "#10B981", count: "2.4K+" },
  { label: "Sport",       emoji: "🏃", color: "#EF4444", count: "1.8K+" },
];

const TRENDING_SEARCHES = [
  "Nike Air Force 1", "Jacquemus", "Zara 2024", "Jordan 1 Retro",
  "Vintage Levi's", "Sac Prada", "Veste Carhartt", "Cap Supreme",
];

const POPULAR_SELLERS = [
  { name: "stylebylea",    sales: "124 ventes", color: "#8B5CF6" },
  { name: "vintageking",   sales: "98 ventes",  color: "#EC4899" },
  { name: "luxmode_paris", sales: "76 ventes",  color: "#F59E0B" },
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
        style={{ background: "rgba(14,10,26,0.92)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(8px)", boxShadow: "0 2px 20px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.07) inset" }}>
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
          {img
            ? <Image src={img} alt={product.title} fill sizes="20vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
            : <div className="absolute inset-0 flex items-center justify-center text-3xl" style={{ background: "rgba(139,92,246,0.05)" }}>👕</div>
          }
          <button onClick={handleUnlike}
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
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

function EmptyDiscovery() {
  return (
    <div className="flex gap-7">
      {/* Main discovery content */}
      <div className="flex-1 min-w-0">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden mb-7 px-10 py-10"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(109,40,217,0.05) 100%)", border: "1px solid rgba(139,92,246,0.15)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.15) 0%, transparent 60%)" }} />
          <div className="relative z-10 flex items-center gap-8">
            <div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <Heart className="w-7 h-7 text-red-400/70" />
              </div>
              <h2 className="text-[22px] font-black text-white mb-2">Aucun favori pour l'instant</h2>
              <p className="text-[14px] text-white/35 leading-relaxed max-w-[420px]">
                Clique sur ♡ sur n'importe quel article pour le sauvegarder ici.
              </p>
            </div>
            <div className="ml-auto flex-shrink-0">
              <Link href="/search"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[14px] font-bold text-white transition-all hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.35)" }}>
                <Search className="w-4 h-4" /> Explorer les articles
              </Link>
            </div>
          </div>
        </div>

        {/* Categories grid */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-black text-white">Explorer par catégorie</h3>
            <Link href="/search" className="flex items-center gap-1 text-[12px] text-[#A78BFA] hover:text-white transition-colors">
              Tout voir <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}>
            {CATEGORIES.map(({ label, emoji, color, count }) => (
              <Link key={label} href={`/search?category=${encodeURIComponent(label)}`}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5 group"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}35`; (e.currentTarget as HTMLElement).style.background = `${color}08`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}>
                <span className="text-2xl flex-shrink-0">{emoji}</span>
                <div>
                  <p className="text-[13px] font-bold text-white">{label}</p>
                  <p className="text-[10px] text-white/28">{count} articles</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending searches */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-orange-400" />
            <h3 className="text-[16px] font-black text-white">Tendances du moment</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map(t => (
              <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold text-white/45 transition-all hover:text-white/80 hover:bg-white/7"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Search className="w-3 h-3 flex-shrink-0" />{t}
              </Link>
            ))}
          </div>
        </div>

        {/* IA CTA */}
        <Link href="/search"
          className="flex items-center gap-5 px-6 py-5 rounded-2xl transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(109,40,217,0.04))", border: "1px solid rgba(139,92,246,0.18)" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(139,92,246,0.18)" }}>
            <Sparkles className="w-5 h-5 text-[#A78BFA]" />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-bold text-white mb-0.5">Sélection personnalisée par l'IA</p>
            <p className="text-[12px] text-white/30">Articles choisis pour toi selon tes goûts</p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/18 flex-shrink-0" />
        </Link>
      </div>

      {/* Right panel */}
      <div className="w-[260px] flex-shrink-0">
        {/* Popular sellers */}
        <div className="rounded-2xl p-5 mb-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">Vendeurs populaires</p>
          </div>
          {POPULAR_SELLERS.map(s => (
            <Link key={s.name} href={`/search?seller=${s.name}`}
              className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl hover:bg-white/4 transition-all group">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black text-white"
                style={{ background: `linear-gradient(135deg, ${s.color}50, ${s.color}28)` }}>
                {s.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-white/60 group-hover:text-white/85 transition-colors">@{s.name}</p>
                <p className="text-[10px] text-white/25">⭐ {s.sales}</p>
              </div>
              <button className="text-[10px] font-bold px-2.5 py-1 rounded-full text-[#A78BFA] hover:bg-[#8B5CF6]/15 transition-all"
                style={{ border: "1px solid rgba(139,92,246,0.25)" }}>
                Suivre
              </button>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="rounded-2xl p-5"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.07), rgba(109,40,217,0.03))", border: "1px solid rgba(139,92,246,0.12)" }}>
          <p className="text-[11px] font-black text-[#8B5CF6]/60 uppercase tracking-widest mb-3">Live · Wearlyx</p>
          {[
            { label: "Articles en ligne", value: "32 K" },
            { label: "Ventes aujourd'hui",value: "1 247" },
            { label: "Note moyenne",      value: "4.8 ★" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-[11px] text-white/30">{label}</span>
              <span className="text-[12px] font-black text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
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
    <div className="min-h-[100dvh] px-8 py-7 relative" style={{ background: "#07070A" }}>
      <div className="fixed pointer-events-none" style={{ top: -150, left: "25%", width: 700, height: 700, background: "radial-gradient(circle, rgba(139,92,246,0.055) 0%, transparent 65%)", filter: "blur(90px)", zIndex: 0 }} />
      <div className="fixed pointer-events-none" style={{ bottom: -80, right: "15%", width: 500, height: 500, background: "radial-gradient(circle, rgba(109,40,217,0.04) 0%, transparent 70%)", filter: "blur(110px)", zIndex: 0 }} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] font-black text-white flex items-center gap-3">
            Mes favoris
            {products.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[13px] font-bold"
                style={{ background: "rgba(239,68,68,0.12)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                {products.length}
              </span>
            )}
          </h1>
          <p className="text-[13px] text-white/28 mt-0.5">
            {products.length === 0 ? "Aucun article sauvegardé" : `${products.length} article${products.length !== 1 ? "s" : ""} sauvegardé${products.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {products.length > 0 && (
          <button onClick={() => setDense(v => !v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ color: dense ? "#A78BFA" : "rgba(255,255,255,0.4)", background: dense ? "rgba(139,92,246,0.1)" : "transparent", border: "1px solid rgba(255,255,255,0.07)" }}>
            {dense ? <LayoutGrid className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </button>
        )}
      </div>

      {products.length === 0 ? <EmptyDiscovery /> : (
        <>
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
            <div className="flex flex-col items-center py-20">
              <Package className="w-8 h-8 text-white/15 mb-3" />
              <p className="text-[14px] text-white/25">Aucun article dans cette catégorie</p>
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: dense ? "repeat(auto-fill, minmax(140px, 1fr))" : "repeat(auto-fill, minmax(190px, 1fr))" }}>
              {filtered.map((p, i) => (
                <div key={p.id} className="animate-fadeIn" style={{ animationDelay: `${i * 20}ms` }}>
                  <ProductCard product={p} onUnlike={id => setProducts(prev => prev.filter(x => x.id !== id))} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
