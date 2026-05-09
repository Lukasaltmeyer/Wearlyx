"use client";

import { useState } from "react";
import { Search, X, TrendingUp, Sparkles, Zap, SlidersHorizontal, ArrowUpRight, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  { label: "Tout", value: "", emoji: "✨" },
  { label: "Femme", value: "femme", emoji: "👗" },
  { label: "Homme", value: "homme", emoji: "👕" },
  { label: "Enfant", value: "enfant", emoji: "🧸" },
  { label: "Luxe", value: "luxe", emoji: "💎" },
  { label: "Sneakers", value: "sneakers", emoji: "👟" },
  { label: "Robes", value: "robes", emoji: "👘" },
  { label: "Manteaux", value: "manteaux", emoji: "🧥" },
  { label: "Accessoires", value: "accessoires", emoji: "👜" },
  { label: "Sport", value: "sport", emoji: "🏃" },
  { label: "Vintage", value: "vintage", emoji: "🕰" },
];

const SORTS = [
  { label: "Plus récents", value: "recent" },
  { label: "Prix croissant", value: "price_asc" },
  { label: "Prix décroissant", value: "price_desc" },
  { label: "Populaires", value: "popular" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42"];

const TRENDING_SEARCHES = [
  "Nike Air Force 1", "Jordan 1", "Jacquemus bag", "Vintage Levi's",
  "Zara SS24", "Balenciaga sneakers", "The North Face", "Carhartt",
];

const AI_PICKS = [
  { label: "Pièces uniques", icon: "✨", count: "234 articles" },
  { label: "Bon état · -60%", icon: "🏷️", count: "1.2K articles" },
  { label: "Livraison rapide", icon: "⚡", count: "456 articles" },
];

function ProductCard({ product, currentUserId }: { product: Product; currentUserId?: string }) {
  const [liked, setLiked] = useState(product.is_liked ?? false);
  const supabase = createClient();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!currentUserId) return;
    if (liked) {
      await supabase.from("likes").delete().match({ user_id: currentUserId, product_id: product.id });
    } else {
      await supabase.from("likes").insert({ user_id: currentUserId, product_id: product.id });
    }
    setLiked(v => !v);
  };

  const img = product.images?.[0];

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div className="rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
        style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
          {img
            ? <Image src={img} alt={product.title} fill sizes="220px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
            : <div className="absolute inset-0 flex items-center justify-center text-3xl" style={{ background: "rgba(139,92,246,0.05)" }}>👕</div>
          }
          {product.is_boosted && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[9px] font-black text-white flex items-center gap-1"
              style={{ background: "linear-gradient(135deg,#7C3AED,#6D28D9)" }}>
              <Zap className="w-2.5 h-2.5 fill-white" /> BOOST
            </div>
          )}
          <button onClick={handleLike}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm ${liked ? "bg-red-500" : "bg-black/60 border border-white/15"}`}>
              <Heart className={`w-3.5 h-3.5 text-white ${liked ? "fill-white" : ""}`} />
            </div>
          </button>
          <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-8"
            style={{ background: "linear-gradient(to top,rgba(15,15,26,0.95),transparent)" }}>
            <p className="text-[16px] font-black text-white">{formatPrice(product.price)}</p>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3">
          <p className="text-[11.5px] text-white/45 truncate">{product.title}</p>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {product.brand && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-[#A78BFA]" style={{ background: "rgba(139,92,246,0.10)" }}>{product.brand}</span>}
            {product.size && <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full text-white/35" style={{ background: "rgba(255,255,255,0.05)" }}>{product.size}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

interface Props {
  products: Product[];
  currentUserId?: string;
  initialQ?: string;
  initialCategory?: string;
}

export function DesktopExplorer({ products, currentUserId, initialQ, initialCategory }: Props) {
  const [q, setQ] = useState(initialQ ?? "");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [sort, setSort] = useState("recent");
  const [selectedSize, setSelectedSize] = useState("");

  const filtered = products
    .filter(p => {
      const matchQ = !q || p.title?.toLowerCase().includes(q.toLowerCase()) || p.brand?.toLowerCase().includes(q.toLowerCase());
      const matchCat = !category || p.category?.toLowerCase() === category;
      const matchSize = !selectedSize || p.size === selectedSize;
      return matchQ && matchCat && matchSize;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return (a.price ?? 0) - (b.price ?? 0);
      if (sort === "price_desc") return (b.price ?? 0) - (a.price ?? 0);
      return 0;
    });

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#07070A" }}>

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-30 px-6 py-3 border-b flex-shrink-0"
        style={{ background: "rgba(7,7,10,0.96)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            onFocus={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(124,58,237,.40)"}}
            onBlur={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.08)"}}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,.30)" }} />
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Marques, articles, styles…"
              className="flex-1 bg-transparent text-[14px] text-white outline-none"
              style={{ caretColor: "#A78BFA" }}
            />
            {q && <button onClick={() => setQ("")}><X className="w-4 h-4 text-white/25 hover:text-white/50 transition-colors" /></button>}
          </div>

          {/* Category pills — horizontal */}
          <div className="flex items-center gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map(c => (
              <button key={c.value} onClick={() => setCategory(c.value)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all whitespace-nowrap"
                style={{
                  background: category === c.value ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
                  border: category === c.value ? "1px solid rgba(139,92,246,0.35)" : "1px solid transparent",
                  color: category === c.value ? "#A78BFA" : "rgba(255,255,255,0.40)",
                }}>
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3-column body ── */}
      <div className="flex flex-1 min-h-0">

        {/* LEFT SIDEBAR — filters, always visible */}
        <div className="w-[220px] flex-shrink-0 border-r py-6 px-4 overflow-y-auto"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}>

          {/* Sort */}
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest mb-3"
              style={{ color: "rgba(255,255,255,.22)" }}>
              <SlidersHorizontal className="w-3 h-3 inline mr-1.5" />Trier
            </p>
            <div className="flex flex-col gap-0.5">
              {SORTS.map(s => (
                <button key={s.value} onClick={() => setSort(s.value)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12.5px] font-medium text-left transition-all"
                  style={{
                    background: sort === s.value ? "rgba(139,92,246,0.12)" : "transparent",
                    color: sort === s.value ? "#A78BFA" : "rgba(255,255,255,0.42)",
                  }}>
                  {sort === s.value && <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] flex-shrink-0" />}
                  {sort !== s.value && <span className="w-1.5 h-1.5 rounded-full bg-transparent flex-shrink-0" />}
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest mb-3"
              style={{ color: "rgba(255,255,255,.22)" }}>Taille</p>
            <div className="flex flex-wrap gap-1.5">
              {SIZES.map(sz => (
                <button key={sz} onClick={() => setSelectedSize(selectedSize === sz ? "" : sz)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                  style={{
                    background: selectedSize === sz ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
                    border: selectedSize === sz ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.07)",
                    color: selectedSize === sz ? "#A78BFA" : "rgba(255,255,255,0.38)",
                  }}>
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* IA Picks */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-3"
              style={{ color: "rgba(255,255,255,.22)" }}>
              <Sparkles className="w-3 h-3 inline mr-1.5 text-[#8B5CF6]" />Sélection IA
            </p>
            <div className="flex flex-col gap-1.5">
              {AI_PICKS.map(p => (
                <button key={p.label}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all group"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.07)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.18)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                  }}>
                  <span>{p.icon}</span>
                  <div>
                    <p className="text-[12px] font-semibold text-white/65">{p.label}</p>
                    <p className="text-[10px] text-white/28">{p.count}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER — product grid */}
        <div className="flex-1 px-6 py-6 overflow-y-auto">

          {/* Trending (default state) */}
          {!q && !category && (
            <div className="mb-6 p-4 rounded-2xl" style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.10)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-[#8B5CF6]" />
                <p className="text-[13px] font-bold text-white">Tendances du moment</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map(t => (
                  <button key={t} onClick={() => setQ(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,.55)" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.12)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.25)";
                      (e.currentTarget as HTMLElement).style.color = "#C4B5FD";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,.55)";
                    }}>
                    <TrendingUp className="w-3 h-3 text-[#8B5CF6]" /> {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Count + label */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[15px] font-bold text-white">
                {q ? `"${q}"` : category ? CATEGORIES.find(c => c.value === category)?.label : "Tous les articles"}
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,.28)" }}>
                {filtered.length} article{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search className="w-12 h-12 mb-4" style={{ color: "rgba(255,255,255,.08)" }} />
              <p className="text-[15px] font-bold text-white/20 mb-1">Aucun résultat</p>
              <p className="text-[13px] text-white/12">Essaie d'autres mots-clés ou filtres</p>
              <button onClick={() => { setQ(""); setCategory(""); setSelectedSize(""); }}
                className="mt-5 px-5 py-2 rounded-full text-[12.5px] font-semibold transition-all"
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#A78BFA" }}>
                Tout afficher
              </button>
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))" }}>
              {filtered.map((p, i) => (
                <div key={p.id} className="animate-fadeIn" style={{ animationDelay: `${i * 18}ms` }}>
                  <ProductCard product={p} currentUserId={currentUserId} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[260px] flex-shrink-0 border-l py-6 px-4 overflow-y-auto"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}>

          {/* Sell CTA */}
          <Link href="/sell"
            className="flex items-center justify-between px-4 py-3.5 rounded-2xl mb-5 transition-all group"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.20), rgba(91,33,182,0.12))", border: "1px solid rgba(124,58,237,0.28)" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.50)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.28)";
              (e.currentTarget as HTMLElement).style.transform = "";
            }}>
            <div>
              <p className="text-[12.5px] font-black text-white">Vends maintenant</p>
              <p className="text-[10.5px] text-white/40 mt-0.5">Annonce en 30 sec avec l'IA</p>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(139,92,246,0.22)" }}>
              <Zap className="w-4 h-4 text-[#A78BFA]" />
            </div>
          </Link>

          {/* Stats platform */}
          <div className="mb-5 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,.22)" }}>Plateforme</p>
            {[
              { label: "Articles en ligne", value: "32 540" },
              { label: "Ventes aujourd'hui", value: "1 280" },
              { label: "Membres actifs", value: "50 K+" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-1.5">
                <span className="text-[11.5px]" style={{ color: "rgba(255,255,255,.36)" }}>{label}</span>
                <span className="text-[13px] font-black" style={{ color: "rgba(255,255,255,.70)" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Trending searches */}
          <div className="mb-5">
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,.22)" }}>
              <TrendingUp className="w-3 h-3 inline mr-1.5 text-[#8B5CF6]" />Recherches
            </p>
            <div className="flex flex-col gap-1">
              {TRENDING_SEARCHES.slice(0, 5).map((t, i) => (
                <button key={t} onClick={() => setQ(t)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all group"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <span className="text-[12px]" style={{ color: "rgba(255,255,255,.48)" }}>{t}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#8B5CF6" }} />
                </button>
              ))}
            </div>
          </div>

          {/* AI recommendation CTA */}
          <div className="p-4 rounded-2xl" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.14)" }}>
            <Sparkles className="w-4 h-4 text-[#A78BFA] mb-2" />
            <p className="text-[12.5px] font-bold text-white mb-1">Sélection IA pour toi</p>
            <p className="text-[11px] text-white/35 mb-3">Basée sur tes centres d'intérêt</p>
            <button className="w-full py-2 rounded-xl text-[12px] font-semibold transition-all"
              style={{ background: "rgba(139,92,246,0.18)", color: "#C4B5FD", border: "1px solid rgba(139,92,246,0.25)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.28)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.18)"; }}>
              Découvrir →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
