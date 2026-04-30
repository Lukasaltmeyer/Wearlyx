"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Search, X, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  { id: "all",            label: "Tout" },
  { id: "femme",          label: "Femmes" },
  { id: "homme",          label: "Hommes" },
  { id: "createurs",      label: "Créateurs" },
  { id: "enfant",         label: "Enfants" },
  { id: "maison",         label: "Maison" },
  { id: "electronique",   label: "Électronique" },
  { id: "sport",          label: "Sport" },
  { id: "loisirs",        label: "Loisirs" },
];

const POPULAR_SEARCHES = ["Streetwear", "Vintage", "Nike", "Jordan", "Luxury", "Y2K", "Oversized", "Denim"];

function conditionShort(c: string) {
  if (!c) return "";
  if (c === "new" || c.includes("neuf")) return "Neuf";
  if (c.includes("très") || c === "very_good" || c === "like_new") return "Très bon";
  if (c.includes("bon") || c === "good") return "Bon";
  if (c.includes("correct") || c === "fair") return "Correct";
  return c;
}

interface Props {
  products: any[];
  currentUserId?: string;
  initialQ?: string;
  initialCategory?: string;
}

export function ExplorerClient({ products, currentUserId, initialQ, initialCategory }: Props) {
  useRouter();
  const [q, setQ] = useState(initialQ ?? "");
  const [focused, setFocused] = useState(false);
  const [searchTab, setSearchTab] = useState<"articles" | "membres">("articles");
  const [category, setCategory] = useState(initialCategory ?? "all");
  const [likedIds, setLikedIds] = useState<Set<string>>(
    new Set(products.filter((p) => p.is_liked).map((p) => p.id))
  );
  const supabase = createClient();

  const isSearching = focused || q.length > 0;
  const showSuggestions = focused && q.length === 0;

  const filtered = products.filter((p) => {
    if (q) {
      const s = q.toLowerCase();
      if (!p.title?.toLowerCase().includes(s) && !p.brand?.toLowerCase().includes(s)) return false;
    }
    if (category !== "all" && p.category !== category) return false;
    return true;
  });

  const handleLike = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUserId) return;
    if (likedIds.has(productId)) {
      await supabase.from("likes").delete().match({ user_id: currentUserId, product_id: productId });
      setLikedIds((prev) => { const s = new Set(prev); s.delete(productId); return s; });
    } else {
      await supabase.from("likes").insert({ user_id: currentUserId, product_id: productId });
      setLikedIds((prev) => new Set([...prev, productId]));
    }
  };

  return (
    <div className="min-h-[100dvh] pb-24" style={{ background: "#0A0A0A" }}>

      {/* Search bar */}
      <div className="px-3 pt-3 pb-2">
        <div className={cn(
          "flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all",
          focused ? "border-[#8B5CF6]/40 bg-white/6" : "border-white/8 bg-white/5"
        )}>
          <Search className={cn("w-4 h-4 flex-shrink-0", focused ? "text-[#A78BFA]" : "text-white/30")} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Rechercher un article ou une marque…"
            className="flex-1 bg-transparent text-[14px] text-white placeholder-white/25 outline-none"
          />
          {(q || focused) && (
            <button onClick={() => { setQ(""); setFocused(false); }} className="flex-shrink-0">
              <X className="w-4 h-4 text-white/30" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions overlay */}
      {showSuggestions && (
        <div className="px-3 pt-2 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2.5">
            <TrendingUp className="w-3.5 h-3.5 text-white/25" />
            <p className="text-[11px] font-bold text-white/25 uppercase tracking-wider">Tendances</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SEARCHES.map((label) => (
              <button key={label} onMouseDown={() => { setQ(label); setFocused(false); }}
                className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-white/60 border border-white/8 bg-white/4 active:scale-95 transition-all">
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search tabs */}
      {isSearching && !showSuggestions && (
        <div className="flex border-b border-white/8 mt-1">
          {(["articles", "membres"] as const).map((t) => (
            <button key={t} onClick={() => setSearchTab(t)}
              className={cn("flex-1 py-2.5 text-[13px] font-bold transition-all relative capitalize",
                searchTab === t ? "text-white" : "text-white/35")}>
              {t === "articles" ? "Articles" : "Membres"}
              {searchTab === t && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#8B5CF6]" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Category chips */}
      {!isSearching && (
        <div className="flex gap-1.5 px-3 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all active:scale-95",
                category === c.id ? "text-white" : "bg-white/5 border border-white/8 text-white/50"
              )}
              style={category === c.id ? { background: "#8B5CF6" } : {}}>
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {(!isSearching || searchTab === "articles") && (
        <>
          {filtered.length === 0 ? (
            <EmptyState category={category} onCategory={setCategory} />
          ) : (
            <div className="px-2 grid grid-cols-2 gap-2">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product}
                  liked={likedIds.has(product.id)} onLike={handleLike} />
              ))}
            </div>
          )}
        </>
      )}

      {isSearching && searchTab === "membres" && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-white/40 font-semibold text-[14px]">Recherche un membre</p>
          <p className="text-white/25 text-[12px] mt-1">Tape un nom d'utilisateur</p>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onCategory }: { category?: string; onCategory: (c: string) => void }) {
  return (
    <div className="px-3 pt-6 pb-8 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
        style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
        <Search className="w-6 h-6" style={{ color: "#8B5CF6" }} />
      </div>
      <p className="text-[15px] font-black text-white mb-1">Aucun article</p>
      <p className="text-[12px] text-white/30 mb-5">Sois le premier à vendre dans cette catégorie !</p>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {["Nike", "Jordan", "Adidas", "Supreme", "Off-White", "Levi's"].map((brand) => (
          <button key={brand} onClick={() => onCategory("all")}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-white/50 border border-white/8 bg-white/4 active:scale-95 transition-all">
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, liked, onLike }: {
  product: any; liked: boolean;
  onLike: (e: React.MouseEvent, id: string) => void;
}) {
  const firstImage = product.images?.[0];
  return (
    <Link href={`/products/${product.id}`} className="block active:scale-[0.97] transition-transform duration-150">
      <div className="rounded-2xl overflow-hidden" style={{ background: "#111827" }}>

        {/* Image */}
        <div className="relative aspect-[3/4] bg-[#0D0D18]">
          {firstImage ? (
            <Image src={firstImage} alt={product.title} fill
              className="object-cover" sizes="50vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Like */}
          <button onClick={(e) => onLike(e, product.id)}
            className={cn(
              "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-110",
              liked ? "bg-red-500 text-white" : "bg-black/55 backdrop-blur-sm text-white/70"
            )}>
            <Heart className={cn("w-3.5 h-3.5", liked && "fill-current")} />
          </button>
        </div>

        {/* Info */}
        <div className="px-2.5 pt-2 pb-2.5">
          <p className="text-[17px] font-black text-white leading-none mb-1">
            {product.price?.toFixed(0)} €
          </p>
          {product.brand && (
            <p className="text-[11px] text-white/40 font-semibold truncate mb-1">{product.brand}</p>
          )}
          <p className="text-[11px] text-white/35 truncate line-clamp-1 mb-1.5">{product.title}</p>
          <div className="flex gap-1 flex-wrap">
            {product.size && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: "rgba(139,92,246,0.1)", color: "#A78BFA" }}>
                {product.size}
              </span>
            )}
            {product.condition && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}>
                {conditionShort(product.condition)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
