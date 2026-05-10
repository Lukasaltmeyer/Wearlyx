"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Zap, Crown, Sparkles, Search, ArrowRight, TrendingUp, Shield, Package } from "lucide-react";
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
      <div
        className="rounded-[18px] overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.016) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.07) inset",
          transform: "translateZ(0)",
        }}
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: "#0C0C18" }}>
          {img
            ? <Image src={img} alt={product.title} fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                sizes="(max-width: 1400px) 14vw, 200px" />
            : <div className="absolute inset-0 flex items-center justify-center text-4xl"
                style={{ background: "rgba(139,92,246,0.05)" }}>👕</div>
          }

          {/* Hover glow overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ boxShadow: "0 0 0 1px rgba(139,92,246,0.2) inset" }} />

          {product.is_boosted && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black text-white"
              style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)", boxShadow: "0 0 12px rgba(124,58,237,0.6)" }}>
              <Zap className="w-2.5 h-2.5 fill-white" /> BOOST
            </div>
          )}

          <button onClick={handleLike}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
            style={{ transform: pop ? "scale(1.4)" : "scale(1)", transition: "transform 0.2s, opacity 0.2s" }}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm ${liked ? "bg-red-500" : "bg-black/65 border border-white/15"}`}
              style={liked ? { boxShadow: "0 4px 12px rgba(239,68,68,0.5)" } : {}}>
              <Heart className={`w-3.5 h-3.5 text-white ${liked ? "fill-white" : ""}`} />
            </div>
          </button>

          <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-10"
            style={{ background: "linear-gradient(to top, rgba(7,7,15,0.96) 0%, transparent 100%)" }}>
            <p className="text-[17px] font-black text-white leading-none" style={{ letterSpacing: "-0.01em" }}>
              {formatPrice(product.price)}
            </p>
          </div>
        </div>

        <div className="px-3 pt-2 pb-3">
          <p className="text-[12px] text-white/38 truncate mb-1.5">{product.title}</p>
          {(product.brand || product.size) && (
            <div className="flex gap-1 flex-wrap">
              {product.brand && (
                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full text-[#A78BFA]"
                  style={{ background: "rgba(139,92,246,0.10)", border: "1px solid rgba(139,92,246,0.15)" }}>
                  {product.brand}
                </span>
              )}
              {product.size && (
                <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full text-white/32"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  {product.size}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [search, setSearch] = useState("");

  return (
    <div className="relative overflow-hidden" style={{ minHeight: "320px" }}>
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #080012 0%, #130728 30%, #221055 60%, #3a158e 85%, #110825 100%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 55% 0%, rgba(167,139,250,0.28) 0%, transparent 55%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 5% 100%, rgba(109,40,217,0.22) 0%, transparent 50%)" }} />
      <div className="absolute top-0 right-[8%] w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, #A78BFA, transparent)" }} />
      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
        style={{ background: "linear-gradient(to top, #07070A, transparent)" }} />

      <div className="relative z-10 px-8 pt-10 pb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-[11px] font-bold text-[#C4B5FD] uppercase tracking-widest"
          style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(167,139,250,0.25)" }}>
          <Sparkles className="w-3 h-3" /> La marketplace mode n°1 en France
        </div>

        <h1 className="text-[54px] font-black text-white leading-[1.0] tracking-tight mb-3"
          style={{ letterSpacing: "-0.03em" }}>
          Le futur de{" "}
          <span style={{
            background: "linear-gradient(90deg, #E9D5FF 0%, #C4B5FD 40%, #8B5CF6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            la seconde main.
          </span>
        </h1>
        <p className="text-[17px] mb-7 max-w-[500px]" style={{ color: "rgba(255,255,255,0.42)" }}>
          Achète et vends de la mode premium. Livraison sécurisée, commission 5%.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); if (search) window.location.href = `/search?q=${encodeURIComponent(search)}`; }}
          className="flex gap-3 mb-7 max-w-[520px]">
          <div className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.09)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}>
            <Search className="w-4 h-4 text-white/38 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Jordan 1, Zara robe, Jacquemus…"
              className="flex-1 bg-transparent text-[14px] text-white outline-none"
              style={{ caretColor: "#A78BFA" }} />
          </div>
          <button type="submit"
            className="px-6 py-3.5 rounded-2xl text-[14px] font-bold text-white flex-shrink-0 transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
              boxShadow: "0 6px 22px rgba(139,92,246,0.45), 0 1px 0 rgba(255,255,255,0.12) inset",
            }}>
            Rechercher
          </button>
        </form>

        <div className="flex items-center gap-3">
          <Link href="/sell/ai"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
            <Zap className="w-4 h-4 text-[#A78BFA]" /> Vendre avec l'IA
          </Link>
          <Link href="/premium"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all hover:-translate-y-0.5"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.28)", color: "#F59E0B" }}>
            <Crown className="w-4 h-4" /> Plan Premium
          </Link>
          <div className="flex items-center gap-6 ml-4 pl-4" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
            {[{ label: "50 K+", sub: "membres" }, { label: "32 K", sub: "articles" }, { label: "4.8 ★", sub: "note" }].map(({ label, sub }) => (
              <div key={sub} className="text-center">
                <p className="text-[16px] font-black text-white leading-none">{label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Category bar ───────────────────────────────────────────────────────────────

const CATS = ["Tout", "Femme", "Homme", "Enfant", "Luxe", "Sneakers", "Robes", "Manteaux", "Accessoires", "Sport", "Vintage"];

function CategoryBar({ active }: { active?: string }) {
  return (
    <div className="sticky top-0 z-30 px-6 py-2.5 flex items-center gap-2 overflow-x-auto"
      style={{
        background: "rgba(7,7,10,0.92)",
        backdropFilter: "blur(28px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        scrollbarWidth: "none",
      }}>
      {CATS.map((cat) => {
        const isActive = cat === "Tout" ? !active || active === "all" : active === cat.toLowerCase();
        return (
          <Link key={cat}
            href={cat === "Tout" ? "/" : `/?category=${cat.toLowerCase()}`}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-[12.5px] font-semibold transition-all whitespace-nowrap hover:-translate-y-0.5"
            style={{
              background: isActive
                ? "linear-gradient(135deg, rgba(139,92,246,0.22), rgba(109,40,217,0.14))"
                : "rgba(255,255,255,0.04)",
              border: isActive ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.06)",
              color: isActive ? "#C4B5FD" : "rgba(255,255,255,0.38)",
              boxShadow: isActive ? "0 0 16px rgba(139,92,246,0.15)" : "none",
            }}>
            {cat}
          </Link>
        );
      })}
    </div>
  );
}

// ── Trust strip ────────────────────────────────────────────────────────────────

function TrustStrip() {
  return (
    <div className="px-8 py-4 flex items-center gap-8 overflow-x-auto"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "linear-gradient(90deg, rgba(139,92,246,0.03), transparent 40%, rgba(139,92,246,0.02))",
        scrollbarWidth: "none",
      }}>
      {[
        { icon: Shield, label: "Paiements sécurisés", color: "#10B981" },
        { icon: TrendingUp, label: "Commission 5% seulement", color: "#8B5CF6" },
        { icon: Zap, label: "Vente en 30 secondes avec l'IA", color: "#F59E0B" },
        { icon: Package, label: "Livraison suivie incluse", color: "#3B82F6" },
      ].map(({ icon: Icon, label, color }) => (
        <div key={label} className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}18` }}>
            <Icon className="w-3.5 h-3.5" style={{ color }} />
          </div>
          <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

interface Props {
  products: Product[];
  currentUserId?: string;
  activeCategory?: string;
}

export function DesktopHomePage({ products, currentUserId, activeCategory }: Props) {
  return (
    <div className="min-h-[100dvh] relative overflow-hidden" style={{ background: "#07070A" }}>
      <HeroSection />
      <CategoryBar active={activeCategory} />
      <TrustStrip />

      <div className="px-6 py-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[18px] font-black text-white tracking-tight" style={{ letterSpacing: "-0.01em" }}>
              {activeCategory && activeCategory !== "all"
                ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
                : "Tous les articles"}
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
              {products.length} article{products.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/search"
            className="flex items-center gap-1.5 text-[13px] font-semibold transition-all hover:-translate-y-0.5"
            style={{ color: "#A78BFA" }}>
            Voir tout <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))" }}>
            {products.map((p, i) => (
              <div key={p.id} className="animate-fadeIn" style={{ animationDelay: `${Math.min(i * 15, 300)}ms` }}>
                <DesktopProductCard product={p} currentUserId={currentUserId} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.07) 0%, transparent 60%)" }} />
            <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.18)" }}>
              <Package className="w-7 h-7" style={{ color: "rgba(139,92,246,0.45)" }} />
            </div>
            <p className="relative z-10 text-[16px] font-bold mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>
              Aucun article
            </p>
            <p className="relative z-10 text-[13px] mb-7" style={{ color: "rgba(255,255,255,0.15)" }}>
              Sois le premier à vendre sur Wearlyx
            </p>
            <Link href="/sell/ai"
              className="relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold text-white transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                boxShadow: "0 6px 20px rgba(139,92,246,0.4), 0 1px 0 rgba(255,255,255,0.12) inset",
              }}>
              <Zap className="w-4 h-4" /> Vendre avec l'IA
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
