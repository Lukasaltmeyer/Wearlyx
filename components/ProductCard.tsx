"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/database";
import { formatPrice, conditionLabel, cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface ProductCardProps {
  product: Product;
  currentUserId?: string;
  onLikeToggle?: (productId: string, liked: boolean) => void;
}

export function ProductCard({ product, currentUserId, onLikeToggle }: ProductCardProps) {
  const [liked, setLiked] = useState(product.is_liked ?? false);
  const [likesCount, setLikesCount] = useState(product.likes_count ?? 0);
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

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div
        className="rounded-xl overflow-hidden border border-white/[0.06] transition-all duration-200 group-hover:-translate-y-[3px] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] group-active:scale-[0.97]"
        style={{ background: "#111827" }}
      >
        {/* Image 1:1 */}
        <div className="relative aspect-square overflow-hidden bg-[#1a1f2e]">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
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

          {/* Boost badge — top left */}
          {product.is_boosted && (
            <div
              className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md"
              style={{
                background: "linear-gradient(135deg, #9333EA, #EC4899)",
                boxShadow: "0 0 10px rgba(168,85,247,0.5)",
              }}
            >
              <span className="text-[9px] font-black text-white tracking-wide">🔥 Boosté</span>
            </div>
          )}

          {/* Like button — top right */}
          <button
            onClick={handleLike}
            className={cn(
              "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150",
              heartPop ? "scale-[1.35]" : "scale-100",
              liked
                ? "bg-red-500 shadow-md shadow-red-500/40"
                : "bg-black/50 backdrop-blur-md group-hover:bg-black/70"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5 text-white transition-all", liked && "fill-white")} />
          </button>

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>

        {/* Info */}
        <div className="px-2.5 pt-2 pb-2.5 space-y-1">
          {/* Price — first, most prominent */}
          <p className="text-[16px] font-bold text-white leading-none">{formatPrice(product.price)}</p>

          {/* Title */}
          <p className="text-[12px] text-[#9CA3AF] line-clamp-2 leading-snug">{product.title}</p>

          {/* Badges: size, brand, condition */}
          {(product.size || product.brand || product.condition) && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {product.size && (
                <span className="text-[10px] font-medium px-1.5 py-[3px] rounded-md text-[#D1D5DB]"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  {product.size}
                </span>
              )}
              {product.brand && (
                <span className="text-[10px] font-medium px-1.5 py-[3px] rounded-md text-[#D1D5DB]"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  {product.brand}
                </span>
              )}
              {product.condition && (
                <span className="text-[10px] font-medium px-1.5 py-[3px] rounded-md text-[#D1D5DB]"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  {conditionLabel(product.condition)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
