"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/database";
import { formatPrice, cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface ProductCardProps {
  product: Product;
  currentUserId?: string;
  onLikeToggle?: (productId: string, liked: boolean) => void;
}

const CONDITION_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new:       { label: "Neuf ✦",    color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  like_new:  { label: "Très bon",  color: "#4ADE80", bg: "rgba(74,222,128,0.1)" },
  good:      { label: "Bon état",  color: "#FACC15", bg: "rgba(250,204,21,0.1)" },
  fair:      { label: "Correct",   color: "#FB923C", bg: "rgba(251,146,60,0.1)" },
};

export function ProductCard({ product, currentUserId, onLikeToggle }: ProductCardProps) {
  const [liked, setLiked] = useState(product.is_liked ?? false);
  const [, setLikesCount] = useState(product.likes_count ?? 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [heartPop, setHeartPop] = useState(false);
  const supabase = createClient();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUserId || likeLoading) return;
    setLikeLoading(true);
    setHeartPop(true);
    setTimeout(() => setHeartPop(false), 350);
    if (liked) {
      await supabase.from("likes").delete().match({ user_id: currentUserId, product_id: product.id });
      setLiked(false);
      setLikesCount((c) => c - 1);
      onLikeToggle?.(product.id, false);
    } else {
      await supabase.from("likes").insert({ user_id: currentUserId, product_id: product.id });
      setLiked(true);
      setLikesCount((c) => c + 1);
      onLikeToggle?.(product.id, true);
    }
    setLikeLoading(false);
  };

  const firstImage = product.images?.[0];
  const cond = CONDITION_CONFIG[product.condition] ?? null;

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div
        className="rounded-2xl overflow-hidden border transition-all duration-200 group-hover:-translate-y-[3px] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] group-active:scale-[0.97]"
        style={{ background: "#111827", borderColor: "rgba(255,255,255,0.06)" }}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#1a2235]">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Boost badge */}
          {product.is_boosted && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg"
              style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)", boxShadow: "0 0 10px rgba(34,197,94,0.4)" }}>
              <span className="text-[9px] font-black text-white tracking-wide">🔥 Boosté</span>
            </div>
          )}

          {/* Like */}
          <button
            onClick={handleLike}
            className={cn(
              "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150",
              heartPop ? "scale-[1.35]" : "scale-100",
              liked ? "bg-red-500 shadow-md shadow-red-500/40" : "bg-black/55 backdrop-blur-md"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5 text-white transition-all", liked && "fill-white")} />
          </button>

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>

        {/* Info */}
        <div className="px-2.5 pt-2 pb-2.5 space-y-1.5">
          {/* Price */}
          <p className="text-[17px] font-black text-white leading-none">{formatPrice(product.price)}</p>

          {/* Title */}
          <p className="text-[11.5px] text-white/45 line-clamp-1 leading-snug">{product.title}</p>

          {/* Badges */}
          {(product.size || product.brand || product.condition) && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {product.size && (
                <span className="text-[9.5px] font-bold px-1.5 py-[3px] rounded-md"
                  style={{ background: "rgba(34,197,94,0.1)", color: "#4ADE80" }}>
                  {product.size}
                </span>
              )}
              {product.brand && (
                <span className="text-[9.5px] font-bold px-1.5 py-[3px] rounded-md"
                  style={{ background: "rgba(34,197,94,0.12)", color: "#4ADE80" }}>
                  {product.brand}
                </span>
              )}
              {product.condition && cond && (
                <span className="text-[9.5px] font-bold px-1.5 py-[3px] rounded-md"
                  style={{ background: cond.bg, color: cond.color }}>
                  {cond.label}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
