"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Zap, Crown, Sparkles, Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// ── Product Card ───────────────────────────────────────────────────────────────

function DesktopProductCard({ product, currentUserId }: { product: Product; currentUserId?: string }) {
  const [liked, setLiked] = useState(product.is_liked ?? false);
  const [pop, setPop] = useState(false);
  const supabase = createClient();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!currentUserId) return;
    setPop(true); setTimeout(() => setPop(false), 300);
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
      <div className="rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_48px_rgba(0,0,0,0.7)]"
        style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.05)" }}>

        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
          {img
            ? <Image src={img} alt={product.title} fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                sizes="(max-width: 1400px) 20vw, 240px" />
            : <div className="absolute inset-0 flex items-center justify-center text-4xl"
                style={{ background: "rgba(139,92,246,0.05)" }}>👕</div>
          }

          {product.is_boosted && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black text-white"
              style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)", boxShadow: "0 0 12px rgba(124,58,237,0.6)" }}>
              <Zap className="w-2.5 h-2.5 fill-white" /> BOOST
            </div>
          )}

          {/* Like */}
          <button onClick={handleLike}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ transform: pop ? "scale(1.35)" : "scale(1)", transition: "transform 0.2s, opacity 0.2s" }}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm ${liked ? "bg-red-500" : "bg-black/60 border border-white/15"}`}>
              <Heart className={`w-3.5 h-3.5 text-white ${liked ? "fill-white" : ""}`} />
            </div>
          </button>

          {/* Price overlay */}
          <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-6"
            style={{ background: "linear-gradient(to top, rgba(15,15,26,0.95) 0%, transparent 100%)" }}>
            <p className="text-[17px] font-black text-white leading-none">{formatPrice(product.price)}</p>
          </div>
        </div>

        <div className="px-3 pt-2 pb-3">
          <p className="text-[12px] text-white/45 truncate">{product.title}</p>
          {(product.brand || product.size) && (
            <div className="flex gap-1 mt-1.5">
              {product.brand && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-[#A78BFA]"
                  style={{ background: "rgba(139,92,246,0.1)" }}>{product.brand}</span>
              )}
              {product.size && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white/35"
                  style={{ background: "rgba(255,255,255,0.05)" }}>{product.size}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [search, setSearch] = useState("");

  return (
    <div className="relative overflow-hidden" style={{ minHeight: "340px" }}>
      {/* Background */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #0a0014 0%, #1a0533 25%, #2d1062 55%, #4c1d95 80%, #1a0533 100%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 60% 0%, rgba(167,139,250,0.25) 0%, transparent 55%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 10% 100%, rgba(124,58,237,0.2) 0%, transparent 50%)" }} />

      {/* Floating orbs */}
      <div className="absolute top-8 right-[10%] w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, #A78BFA, transparent)" }} />
      <div className="absolute bottom-0 left-[20%] w-64 h-32 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />

      <div className="relative z-10 px-8 py-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-[11px] font-bold text-[#C4B5FD] uppercase tracking-widest"
          style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(167,139,250,0.25)" }}>
          <Sparkles className="w-3 h-3" /> La marketplace mode n°1 en France
        </div>

        {/* Title */}
        <h1 className="text-[52px] font-black text-white leading-[1.02] tracking-tight mb-2">
          Le futur de{" "}
          <span style={{ background: "linear-gradient(90deg, #C4B5FD 0%, #A78BFA 40%, #8B5CF6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            la seconde main.
          </span>
        </h1>
        <p className="text-[17px] text-white/45 mb-7">Achète et vends de la mode premium. Livraison sécurisée.</p>

        {/* Search bar */}
        <form onSubmit={(e) => { e.preventDefault(); if (search) window.location.href = `/search?q=${encodeURIComponent(search)}`; }}
          className="flex gap-3 mb-7 max-w-[540px]">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}>
            <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Jordan 1, Zara robe, Jacquemus…"
              className="flex-1 bg-transparent text-[14px] text-white placeholder-white/30 outline-none" />
          </div>
          <button type="submit"
            className="px-5 py-3 rounded-2xl text-[14px] font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.4)" }}>
            Rechercher
          </button>
        </form>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link href="/sell/ai"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold text-white transition-all hover:scale-[1.03]"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <Zap className="w-4 h-4 text-[#A78BFA]" /> Vendre avec l'IA
          </Link>
          <Link href="/premium"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all hover:scale-[1.03]"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" }}>
            <Crown className="w-4 h-4" /> Plan Premium
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Categories ────────────────────────────────────────────────────────────────

const CATS = ["Tout", "Femme", "Homme", "Enfant", "Luxe", "Sneakers", "Robes", "Manteaux", "Accessoires", "Sport", "Vintage"];

function CategoryBar({ active }: { active?: string }) {
  return (
    <div className="sticky top-0 z-30 px-8 py-3 flex items-center gap-2 overflow-x-auto"
      style={{ background: "rgba(7,7,10,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)", scrollbarWidth: "none" }}>
      {CATS.map((cat) => {
        const isActive = cat === "Tout" ? !active || active === "all" : active === cat.toLowerCase();
        return (
          <Link key={cat}
            href={cat === "Tout" ? "/" : `/?category=${cat.toLowerCase()}`}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap"
            style={{
              background: isActive ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
              border: isActive ? "1px solid rgba(139,92,246,0.35)" : "1px solid transparent",
              color: isActive ? "#A78BFA" : "rgba(255,255,255,0.4)",
            }}>
            {cat}
          </Link>
        );
      })}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface Props {
  products: Product[];
  currentUserId?: string;
  activeCategory?: string;
}

export function DesktopHomePage({ products, currentUserId, activeCategory }: Props) {
  return (
    <div className="min-h-[100dvh]" style={{ background: "#07070A" }}>
      <HeroSection />
      <CategoryBar active={activeCategory} />

      <div className="px-8 py-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-black text-white flex items-center gap-2">
            Articles récents
            <span className="text-[13px] font-normal text-white/25">{products.length} articles</span>
          </h2>
          <Link href="/search"
            className="flex items-center gap-1.5 text-[13px] font-semibold text-[#A78BFA] hover:text-[#C4B5FD] transition-colors">
            Voir tout <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
            {products.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 20}ms` }} className="animate-fadeIn">
                <DesktopProductCard product={p} currentUserId={currentUserId} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <Sparkles className="w-7 h-7 text-[#8B5CF6]/50" />
            </div>
            <p className="text-[15px] font-bold text-white/25 mb-1">Aucun article</p>
            <p className="text-[13px] text-white/15 mb-6">Sois le premier à vendre sur Wearlyx</p>
            <Link href="/sell/ai"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
              <Zap className="w-4 h-4" /> Vendre avec l'IA
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
