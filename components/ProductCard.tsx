"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Flame } from "lucide-react";
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
    setTimeout(() => setHeartPop(false), 400);

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
  const isPopular = (likesCount ?? 0) >= 3;
  const isNew = product.created_at && (Date.now() - new Date(product.created_at).getTime()) < 1000 * 60 * 60 * 48;
  const isDeal = product.price < 15;

  return (
    <Link href={`/products/${product.id}`} className="block group active:scale-[0.97] transition-transform duration-150">
      <div className="rounded-2xl overflow-hidden border border-white/[0.07] transition-all duration-200 group-hover:border-white/14 group-hover:shadow-lg group-hover:shadow-black/40" style={{ background: "#0f0f1a" }}>
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#141422]">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

          {/* Badges */}
          {isPopular && !isDeal && (
            <div className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-500/90 backdrop-blur-sm">
              <Flame className="w-2.5 h-2.5 text-white fill-white" />
              <span className="text-[9px] font-black text-white">Tendance</span>
            </div>
          )}
          {isDeal && (
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-sm">
              <span className="text-[9px] font-black text-white">💸 Bonne affaire</span>
            </div>
          )}
          {isNew && !isPopular && !isDeal && (
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-[#6C3AED]/90 backdrop-blur-sm">
              <span className="text-[9px] font-black text-white">✨ Nouveau</span>
            </div>
          )}

          {/* Like button */}
          <button
            onClick={handleLike}
            className={cn(
              "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150",
              heartPop ? "scale-[1.35]" : "scale-100",
              liked
                ? "bg-red-500 text-white shadow-md shadow-red-500/40"
                : "bg-black/40 text-white/50 backdrop-blur-md hover:text-white/80"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5 transition-all", liked && "fill-current")} />
          </button>

          {/* Price overlay */}
          <div className="absolute bottom-2 left-2 right-9">
            <p className="text-[14px] font-black text-white drop-shadow-sm">{formatPrice(product.price)}</p>
          </div>

          {/* Likes count bottom right */}
          {likesCount > 0 && (
            <div className="absolute bottom-2 right-2 flex items-center gap-0.5">
              <Heart className="w-2.5 h-2.5 fill-red-400 text-red-400" />
              <span className="text-[9px] font-bold text-white/70">{likesCount}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-2.5 pt-2 pb-2.5">
          {product.brand && (
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider mb-0.5">{product.brand}</p>
          )}
          <p className="text-[12px] font-semibold text-white/85 line-clamp-1 leading-snug mb-1.5">{product.title}</p>
          <div className="flex items-center justify-between">
            {product.condition && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-white/6 text-white/40">
                {conditionLabel(product.condition)}
              </span>
            )}
            {product.size && (
              <span className="text-[9px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded font-medium">
                {product.size}
              </span>
            )}
          </div>
          {product.seller && (
            <p className="text-[10px] text-white/20 mt-1.5 truncate">
              @{product.seller.username || product.seller.full_name}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
