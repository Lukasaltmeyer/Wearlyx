"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Heart, Bookmark, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  { id: "all",            label: "Tout",           emoji: "✦" },
  { id: "femme",          label: "Femmes",         emoji: "👗" },
  { id: "homme",          label: "Hommes",         emoji: "👕" },
  { id: "createurs",      label: "Créateurs",      emoji: "✨" },
  { id: "enfant",         label: "Enfants",        emoji: "🧸" },
  { id: "maison",         label: "Maison",         emoji: "🏠" },
  { id: "electronique",   label: "Électronique",   emoji: "📱" },
  { id: "divertissement", label: "Divertissement", emoji: "🎮" },
  { id: "loisirs",        label: "Loisirs",        emoji: "⚽" },
  { id: "sport",          label: "Sport",          emoji: "🏃" },
];

const POPULAR_SEARCHES = [
  { label: "Streetwear", emoji: "🔥" },
  { label: "Vintage", emoji: "🕹" },
  { label: "Nike", emoji: "✔" },
  { label: "Jordan", emoji: "🏀" },
  { label: "Luxury", emoji: "💎" },
  { label: "Y2K", emoji: "⭐" },
  { label: "Oversized", emoji: "🧥" },
  { label: "Denim", emoji: "👖" },
];

const PROTECTION_RATE = 0.07;

function conditionShort(c: string) {
  if (!c) return "";
  if (c.includes("neuf") && c.includes("étiquette")) return "Neuf";
  if (c === "new" || c === "neuf") return "Neuf";
  if (c.includes("très") || c === "very_good") return "Très bon";
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
  const router = useRouter();
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
    <div className="min-h-[100dvh] bg-[#08080F] pb-24">
      {/* Header */}
      {!isSearching && (
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <h1 className="text-[22px] font-black text-white">Explorer</h1>
          <button
            onClick={() => router.refresh()}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/70 active:scale-90 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search bar */}
      <div className={cn("px-4 transition-all", isSearching ? "pt-5 pb-0" : "pb-3")}>
        <div className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all",
          focused ? "border-[#6C3AED]/50 bg-white/7" : "border-white/8 bg-white/5"
        )}>
          <Search className={cn("w-4 h-4 flex-shrink-0 transition-colors", focused ? "text-[#a78bfa]" : "text-white/30")} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Rechercher un article, une marque…"
            className="flex-1 bg-transparent text-[14px] text-white placeholder-white/25 outline-none"
          />
          {isSearching && (
            <button
              onClick={() => { setQ(""); setFocused(false); }}
              className="text-[13px] text-white/50 hover:text-white transition-colors flex-shrink-0 font-medium"
            >
              Annuler
            </button>
          )}
        </div>
      </div>

      {/* Search suggestions (focused + empty) */}
      {showSuggestions && (
        <div className="px-4 pt-4 animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-white/30" />
            <p className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Recherches populaires</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map(({ label, emoji }) => (
              <button
                key={label}
                onMouseDown={() => { setQ(label); setFocused(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold text-white/70 border border-white/10 bg-white/4 active:scale-95 transition-all hover:border-white/20"
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Categories quick access */}
          <p className="text-[11px] font-bold text-white/30 uppercase tracking-wider mt-5 mb-3">Catégories</p>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.filter(c => c.id !== "all").slice(0, 6).map((c) => (
              <button
                key={c.id}
                onMouseDown={() => { setCategory(c.id); setFocused(false); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white/60 border border-white/8 bg-white/3 active:scale-95 transition-all text-left"
              >
                <span>{c.emoji}</span>
                <span className="truncate">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search mode — tabs Articles / Membres */}
      {isSearching && !showSuggestions ? (
        <div>
          <div className="flex border-b border-white/8 mt-4">
            {(["articles", "membres"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSearchTab(t)}
                className={cn(
                  "flex-1 py-3 text-[14px] font-bold transition-all relative capitalize",
                  searchTab === t ? "text-white" : "text-white/35"
                )}
              >
                {t === "articles" ? "Articles" : "Membres"}
                {searchTab === t && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                    style={{ background: "linear-gradient(135deg, #6C3AED, #C026D3)" }} />
                )}
              </button>
            ))}
          </div>

          {searchTab === "articles" && (
            <div className="px-3 pt-4">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Search className="w-10 h-10 text-white/10 mb-3" />
                  <p className="text-white/40 font-semibold">Aucun article trouvé</p>
                  {q && <p className="text-white/25 text-[13px] mt-1">pour « {q} »</p>}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} liked={likedIds.has(product.id)} onLike={handleLike} />
                  ))}
                </div>
              )}
            </div>
          )}

          {searchTab === "membres" && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-white/40 font-semibold">Recherche un membre</p>
              <p className="text-white/25 text-[13px] mt-1">Tape un nom d'utilisateur</p>
            </div>
          )}
        </div>
      ) : !isSearching && (
        <>
          {/* Category pills */}
          <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-1 mb-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all active:scale-95",
                  category === c.id
                    ? "text-white shadow-md"
                    : "bg-white/5 border border-white/8 text-white/50"
                )}
                style={category === c.id ? {
                  background: "linear-gradient(135deg, #6C3AED, #C026D3)",
                  boxShadow: "0 2px 12px rgba(108,58,237,0.35)",
                } : {}}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {filtered.length > 0 && (
            <p className="px-4 text-[12px] text-white/25 mb-3">
              {filtered.length} article{filtered.length > 1 ? "s" : ""}
              {category !== "all" && ` · ${CATEGORIES.find(c => c.id === category)?.label}`}
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, rgba(108,58,237,0.12), rgba(192,38,211,0.08))", border: "1px solid rgba(108,58,237,0.18)" }}>
                <Search className="w-9 h-9" style={{ color: "#a78bfa" }} />
              </div>
              <p className="text-[17px] font-black text-white mb-1.5">Aucun article trouvé</p>
              <p className="text-[13px] text-white/35 leading-relaxed">
                Aucun article dans cette catégorie pour l&apos;instant.
              </p>
            </div>
          ) : (
            <div className="px-3 grid grid-cols-2 gap-2.5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} liked={likedIds.has(product.id)} onLike={handleLike} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ProductCard({ product, liked, onLike }: {
  product: any;
  liked: boolean;
  onLike: (e: React.MouseEvent, id: string) => void;
}) {
  const firstImage = product.images?.[0];
  const protection = (product.price * PROTECTION_RATE).toFixed(2);
  return (
    <Link href={`/products/${product.id}`} className="block group active:scale-[0.97] transition-transform duration-150">
      <div className="rounded-2xl overflow-hidden border border-white/7 transition-all group-hover:border-white/14"
        style={{ background: "#0f0f1a" }}>
        <div className="relative aspect-[3/4] bg-[#141422]">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
              sizes="50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-white/8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          {/* Price overlay */}
          <div className="absolute bottom-2 left-2.5">
            <p className="text-[14px] font-black text-white drop-shadow-sm">{product.price?.toFixed(2)} €</p>
          </div>

          {/* Like button */}
          <button
            onClick={(e) => onLike(e, product.id)}
            className={cn(
              "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-110",
              liked ? "bg-red-500 text-white shadow-md shadow-red-500/40" : "bg-black/50 text-white/70 backdrop-blur-sm"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", liked && "fill-current")} />
          </button>

          {/* Bookmark */}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-10 right-2 w-7 h-7 rounded-full bg-black/50 text-white/50 backdrop-blur-sm flex items-center justify-center active:scale-110 transition-all"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-2.5">
          {product.brand && (
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider mb-0.5">{product.brand}</p>
          )}
          <p className="text-[12px] font-semibold text-white/85 line-clamp-1 leading-snug mb-1.5">{product.title}</p>
          <div className="flex flex-wrap gap-1">
            {product.size && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-white/6 text-white/40">T.{product.size}</span>
            )}
            {product.condition && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-white/6 text-white/40">{conditionShort(product.condition)}</span>
            )}
          </div>
          <p className="text-[9px] text-white/20 mt-1.5">🛡 +{protection} € protection</p>
        </div>
      </div>
    </Link>
  );
}
