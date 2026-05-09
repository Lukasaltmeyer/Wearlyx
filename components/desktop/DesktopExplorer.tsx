"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, TrendingUp, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  { label: "Tout", value: "" },
  { label: "Femme", value: "femme" },
  { label: "Homme", value: "homme" },
  { label: "Enfant", value: "enfant" },
  { label: "Luxe", value: "luxe" },
  { label: "Sneakers", value: "sneakers" },
  { label: "Robes", value: "robes" },
  { label: "Manteaux", value: "manteaux" },
  { label: "Accessoires", value: "accessoires" },
  { label: "Sport", value: "sport" },
  { label: "Vintage", value: "vintage" },
];

const SORTS = [
  { label: "Récents", value: "recent" },
  { label: "Prix croissant", value: "price_asc" },
  { label: "Prix décroissant", value: "price_desc" },
  { label: "Populaires", value: "popular" },
];

const TRENDING_SEARCHES = ["Nike Air Force 1", "Jordan 1", "Jacquemus bag", "Vintage Levi's", "Zara SS24", "Balenciaga sneakers"];

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
            ? <Image src={img} alt={product.title} fill sizes="(max-width: 1400px) 18vw, 220px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
            : <div className="absolute inset-0 flex items-center justify-center text-3xl" style={{ background: "rgba(139,92,246,0.05)" }}>👕</div>
          }
          {product.is_boosted && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[9px] font-black text-white flex items-center gap-1"
              style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}>
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
  const [showFilters, setShowFilters] = useState(false);

  const filtered = products.filter(p => {
    const matchQ = !q || p.title?.toLowerCase().includes(q.toLowerCase()) || p.brand?.toLowerCase().includes(q.toLowerCase());
    const matchCat = !category || p.category?.toLowerCase() === category;
    return matchQ && matchCat;
  });

  return (
    <div className="min-h-[100dvh]" style={{ background: "#07070A" }}>

      {/* Top search bar */}
      <div className="sticky top-0 z-30 px-8 py-4 border-b"
        style={{ background: "rgba(7,7,10,0.95)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Rechercher marques, articles, styles…"
              className="flex-1 bg-transparent text-[14px] text-white placeholder-white/25 outline-none" />
            {q && <button onClick={() => setQ("")}><X className="w-4 h-4 text-white/25 hover:text-white/50" /></button>}
          </div>
          <button onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[13px] font-semibold transition-all"
            style={{ background: showFilters ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.05)", border: showFilters ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.08)", color: showFilters ? "#A78BFA" : "rgba(255,255,255,0.5)" }}>
            <SlidersHorizontal className="w-4 h-4" /> Filtres
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[12.5px] font-semibold transition-all whitespace-nowrap"
              style={{
                background: category === c.value ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
                border: category === c.value ? "1px solid rgba(139,92,246,0.35)" : "1px solid transparent",
                color: category === c.value ? "#A78BFA" : "rgba(255,255,255,0.4)",
              }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Filters sidebar */}
        {showFilters && (
          <div className="w-[220px] flex-shrink-0 p-5 border-r" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-3">Trier par</p>
            <div className="flex flex-col gap-1">
              {SORTS.map(s => (
                <button key={s.value} onClick={() => setSort(s.value)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium text-left transition-all"
                  style={{ background: sort === s.value ? "rgba(139,92,246,0.12)" : "transparent", color: sort === s.value ? "#A78BFA" : "rgba(255,255,255,0.45)" }}>
                  {sort === s.value && <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />}
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 px-8 py-6">
          {!q && !category && (
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
                <p className="text-[14px] font-bold text-white">Recherches tendances</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map(t => (
                  <button key={t} onClick={() => setQ(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium text-white/55 hover:text-white transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <Sparkles className="w-3 h-3 text-[#8B5CF6]" /> {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-5">
            <p className="text-[14px] font-bold text-white">
              {q ? `Résultats pour "${q}"` : category ? CATEGORIES.find(c => c.value === category)?.label : "Tous les articles"}
              <span className="text-white/25 font-normal ml-2">{filtered.length} articles</span>
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Search className="w-12 h-12 text-white/10 mb-4" />
              <p className="text-[15px] font-bold text-white/25">Aucun résultat</p>
              <p className="text-[13px] text-white/15 mt-1">Essaie d'autres mots-clés</p>
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
              {filtered.map((p, i) => (
                <div key={p.id} className="animate-fadeIn" style={{ animationDelay: `${i * 20}ms` }}>
                  <ProductCard product={p} currentUserId={currentUserId} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
