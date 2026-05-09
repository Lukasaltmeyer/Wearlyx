"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Zap, Crown, TrendingUp, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

function DesktopProductCard({ product, currentUserId }: { product: Product; currentUserId?: string }) {
  const [liked, setLiked] = useState(product.is_liked ?? false);
  const [pop, setPop] = useState(false);
  const supabase = createClient();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUserId) return;
    setPop(true); setTimeout(() => setPop(false), 350);
    if (liked) {
      await supabase.from("likes").delete().match({ user_id: currentUserId, product_id: product.id });
      setLiked(false);
    } else {
      await supabase.from("likes").insert({ user_id: currentUserId, product_id: product.id });
      setLiked(true);
    }
  };

  const img = product.images?.[0];

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div className="rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        style={{ background: "#0F0F18", border: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
          {img
            ? <Image src={img} alt={product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" sizes="20vw" />
            : <div className="absolute inset-0 flex items-center justify-center bg-white/3">
                <span className="text-white/10 text-4xl">👕</span>
              </div>
          }

          {/* Boost badge */}
          {product.is_boosted && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-black text-white"
              style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)", boxShadow: "0 0 16px rgba(124,58,237,0.5)" }}>
              <Zap className="w-2.5 h-2.5 fill-white" /> Boosté
            </div>
          )}

          {/* Like button */}
          <button onClick={handleLike}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200"
            style={{ transform: pop ? "scale(1.4)" : "scale(1)", transition: "transform 0.2s, opacity 0.2s" }}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md ${liked ? "bg-red-500 shadow-lg shadow-red-500/40" : "bg-black/60 border border-white/15"}`}>
              <Heart className={`w-4 h-4 text-white ${liked ? "fill-white" : ""}`} />
            </div>
          </button>

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(15,15,24,0.9) 0%, transparent 100%)" }} />

          {/* Price on image */}
          <div className="absolute bottom-2.5 left-2.5">
            <span className="text-[16px] font-black text-white drop-shadow-lg">{formatPrice(product.price)}</span>
          </div>
        </div>

        {/* Info */}
        <div className="px-3 pt-2.5 pb-3">
          <p className="text-[12px] text-white/50 truncate">{product.title}</p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {product.brand && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-[#A78BFA]"
                style={{ background: "rgba(139,92,246,0.12)" }}>{product.brand}</span>
            )}
            {product.size && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white/40"
                style={{ background: "rgba(255,255,255,0.06)" }}>{product.size}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function HeroSection() {
  return (
    <div className="relative rounded-3xl overflow-hidden mb-8 h-[280px] flex items-end"
      style={{ background: "linear-gradient(135deg, #1a0533, #3b0764 40%, #4c1d95 70%, #0a0a14)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(167,139,250,0.2) 0%, transparent 60%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 20% 80%, rgba(139,92,246,0.15) 0%, transparent 50%)" }} />

      {/* Decorative orbs */}
      <div className="absolute top-8 right-16 w-32 h-32 rounded-full opacity-20 blur-2xl"
        style={{ background: "radial-gradient(circle, #A78BFA, transparent)" }} />
      <div className="absolute top-12 right-32 w-20 h-20 rounded-full opacity-15 blur-xl"
        style={{ background: "radial-gradient(circle, #8B5CF6, transparent)" }} />

      <div className="relative z-10 px-10 pb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#A78BFA]" />
          <span className="text-[12px] font-bold text-[#A78BFA] uppercase tracking-widest">Tendances du moment</span>
        </div>
        <h1 className="text-[40px] font-black text-white leading-tight mb-4">
          Le futur de<br />
          <span style={{ background: "linear-gradient(90deg, #A78BFA, #C4B5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            la seconde main.
          </span>
        </h1>
        <div className="flex items-center gap-3">
          <Link href="/sell/ai"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold text-white transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.4)" }}>
            <Zap className="w-4 h-4" /> Vendre avec l'IA
          </Link>
          <Link href="/premium"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold text-[#F59E0B] transition-all hover:scale-[1.02] border"
            style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)" }}>
            <Crown className="w-4 h-4" /> Plan Premium
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-8 right-8 flex flex-col gap-2">
        {[
          { label: "membres", value: "+50K" },
          { label: "ventes/jour", value: "1 200" },
          { label: "note moyenne", value: "4.8 ★" },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-2 rounded-xl text-right"
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-[16px] font-black text-white">{value}</p>
            <p className="text-[10px] text-white/40">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  products: Product[];
  currentUserId?: string;
}

export function DesktopHomePage({ products, currentUserId }: Props) {
  return (
    <div>
      <HeroSection />

      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
          <h2 className="text-[18px] font-black text-white">Articles récents</h2>
          <span className="text-[13px] text-white/30 font-medium">{products.length} articles</span>
        </div>
        <Link href="/search" className="text-[13px] font-semibold text-[#A78BFA] hover:text-[#C4B5FD] transition-colors">
          Voir tout →
        </Link>
      </div>

      {/* 5-col grid */}
      {products.length > 0 ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
          {products.map((p, i) => (
            <div key={p.id} className="animate-fadeIn" style={{ animationDelay: `${i * 20}ms` }}>
              <DesktopProductCard product={p} currentUserId={currentUserId} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <Sparkles className="w-7 h-7 text-[#8B5CF6]/50" />
          </div>
          <p className="text-[16px] font-bold text-white/30 mb-1">Aucun article pour l'instant</p>
          <p className="text-[13px] text-white/20">Sois le premier à vendre sur Wearlyx</p>
        </div>
      )}
    </div>
  );
}
