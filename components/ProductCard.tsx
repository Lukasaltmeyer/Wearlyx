"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Zap } from "lucide-react";
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
  new:       { label: "Neuf ✦",   color: "#C4B5FD", bg: "rgba(124,58,237,0.15)" },
  like_new:  { label: "Très bon", color: "#A78BFA", bg: "rgba(124,58,237,0.10)" },
  good:      { label: "Bon état", color: "#FCD34D", bg: "rgba(250,204,21,0.09)"  },
  fair:      { label: "Correct",  color: "#FB923C", bg: "rgba(251,146,60,0.09)"  },
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
        className="rounded-[20px] overflow-hidden transition-all duration-300 group-active:scale-[0.96] relative"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.016) 100%)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.07) inset",
          transform: "translateZ(0)",
        }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: "0 0 0 1px rgba(139,92,246,0.15) inset, 0 8px 32px rgba(139,92,246,0.08)" }}
        />

        {/* Image */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "1/1", background: "linear-gradient(145deg, #0C0C18, #0E0E1A)" }}
        >
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.06] group-active:scale-[1.02]"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 opacity-[0.07]" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Boost badge */}
          {product.is_boosted && (
            <div
              className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                boxShadow: "0 0 14px rgba(124,58,237,0.6)",
                backdropFilter: "blur(4px)",
              }}
            >
              <Zap className="w-2.5 h-2.5 fill-white text-white" />
              <span className="text-[8.5px] font-black text-white tracking-wide">BOOST</span>
            </div>
          )}

          {/* Like button */}
          <button
            onClick={handleLike}
            className={cn(
              "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
              heartPop ? "scale-[1.45]" : "scale-100",
            )}
            style={liked ? {
              background: "linear-gradient(135deg, #EF4444, #DC2626)",
              boxShadow: "0 4px 14px rgba(239,68,68,0.55)",
            } : {
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Heart className={cn("w-3.5 h-3.5 text-white transition-all", liked && "fill-white")} />
          </button>

          {/* Bottom gradient */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(7,7,15,0.92), transparent)" }}
          />
        </div>

        {/* Info */}
        <div className="px-3 pt-2.5 pb-3 space-y-1.5">
          {/* Price */}
          <p
            className="text-[18px] font-black text-white leading-none"
            style={{ letterSpacing: "-0.02em" }}
          >
            {formatPrice(product.price)}
          </p>

          {/* Title */}
          <p className="text-[11.5px] text-white/38 line-clamp-1 leading-snug font-medium">
            {product.title}
          </p>

          {/* Badges */}
          {(product.size || product.brand || product.condition) && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {product.size && (
                <span
                  className="text-[9px] font-bold px-1.5 py-[3px] rounded-md"
                  style={{
                    background: "rgba(124,58,237,0.13)",
                    color: "#C4B5FD",
                    border: "1px solid rgba(124,58,237,0.18)",
                  }}
                >
                  {product.size}
                </span>
              )}
              {product.brand && (
                <span
                  className="text-[9px] font-bold px-1.5 py-[3px] rounded-md"
                  style={{
                    background: "rgba(124,58,237,0.08)",
                    color: "#A78BFA",
                    border: "1px solid rgba(124,58,237,0.14)",
                  }}
                >
                  {product.brand}
                </span>
              )}
              {product.condition && cond && (
                <span
                  className="text-[9px] font-bold px-1.5 py-[3px] rounded-md"
                  style={{ background: cond.bg, color: cond.color, border: `1px solid ${cond.color}22` }}
                >
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
