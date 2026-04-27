"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart, Bookmark, Share2, ChevronLeft, Star, ShieldCheck, ArrowRight, Eye, Package
} from "lucide-react";
import type { Product } from "@/types/database";
import { formatPrice, conditionLabel, timeAgo, cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { OfferModal } from "@/components/marketplace/OfferModal";
import { CheckoutModal } from "@/components/marketplace/CheckoutModal";

interface ProductDetailProps {
  product: Product;
  currentUserId?: string;
}

export function ProductDetail({ product, currentUserId }: ProductDetailProps) {
  const router = useRouter();
  const supabase = createClient();

  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(product.is_liked ?? false);
  const [saved, setSaved] = useState(product.is_saved ?? false);
  const [likesCount, setLikesCount] = useState(product.likes_count ?? 0);
  const [actionLoading, setActionLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  const isOwner = currentUserId === product.seller_id;
  const images = product.images?.length ? product.images : [];

  useEffect(() => {
    if (!product.category) return;
    supabase
      .from("products")
      .select("*, seller:profiles(id, username, full_name, avatar_url)")
      .eq("status", "active")
      .eq("category", product.category)
      .neq("id", product.id)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => { if (data) setSimilarProducts(data as Product[]); });
  }, [product.id, product.category]);

  const toggleLike = async () => {
    if (!currentUserId) { router.push("/auth"); return; }
    setActionLoading(true);
    if (liked) {
      await supabase.from("likes").delete().match({ user_id: currentUserId, product_id: product.id });
      setLiked(false); setLikesCount((c) => c - 1);
    } else {
      await supabase.from("likes").insert({ user_id: currentUserId, product_id: product.id });
      setLiked(true); setLikesCount((c) => c + 1);
    }
    setActionLoading(false);
  };

  const toggleSave = async () => {
    if (!currentUserId) { router.push("/auth"); return; }
    setActionLoading(true);
    if (saved) {
      await supabase.from("saved_items").delete().match({ user_id: currentUserId, product_id: product.id });
      setSaved(false);
    } else {
      await supabase.from("saved_items").insert({ user_id: currentUserId, product_id: product.id });
      setSaved(true);
    }
    setActionLoading(false);
  };

  const contactSeller = async () => {
    if (!currentUserId) { router.push("/auth"); return; }
    setContactLoading(true);
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .match({ product_id: product.id, buyer_id: currentUserId, seller_id: product.seller_id })
      .single();
    if (existing) { router.push(`/messages/${existing.id}`); return; }
    const { data: conv } = await supabase
      .from("conversations")
      .insert({ product_id: product.id, buyer_id: currentUserId, seller_id: product.seller_id })
      .select("id").single();
    if (conv) router.push(`/messages/${conv.id}`);
    setContactLoading(false);
  };

  const handleShare = async () => {
    if (navigator.share) await navigator.share({ title: product.title, url: window.location.href });
    else await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="bg-[#07070A] min-h-[100dvh] animate-fadeIn pb-32">

      {/* Floating top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 pt-4">
        <button onClick={() => router.back()}
          className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 bg-black/60 backdrop-blur-md active:scale-95 transition-transform">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex gap-2">
          <button onClick={handleShare}
            className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 bg-black/60 backdrop-blur-md active:scale-95 transition-transform">
            <Share2 className="w-4 h-4 text-white/70" />
          </button>
          <button onClick={toggleSave}
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center border backdrop-blur-md active:scale-95 transition-all",
              saved ? "bg-[#8B5CF6] border-[#8B5CF6]" : "border-white/10 bg-black/60"
            )}>
            <Bookmark className={cn("w-4 h-4", saved ? "text-white fill-white" : "text-white/70")} />
          </button>
        </div>
      </div>

      {/* Main image */}
      <div className="-mt-14">
        <div className="relative aspect-square bg-[#0F0F18] overflow-hidden">
          {images.length > 0 ? (
            <Image src={images[activeImage]} alt={product.title} fill className="object-cover" priority sizes="100vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-16 h-16 text-white/10" />
            </div>
          )}
          {/* Gradient bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07070A] to-transparent pointer-events-none" />

          {product.status !== "active" && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="font-black text-white text-xl px-6 py-2.5 rounded-2xl border-2 border-white/40 backdrop-blur-sm uppercase tracking-wide">
                {product.status === "sold" ? "Vendu" : "Réservé"}
              </span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)}
                className={cn(
                  "flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all active:scale-95",
                  activeImage === i ? "border-[#8B5CF6]" : "border-white/10"
                )}>
                <Image src={img} alt="" width={56} height={56} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-2 space-y-4">

        {/* FOMO badges */}
        {product.status === "active" && (() => {
          const isTrending = likesCount >= 5;
          const isDeal = product.price < 15;
          const isHot = (product.views ?? 0) >= 40;
          const interested = likesCount + Math.floor((product.views ?? 0) * 0.08);
          if (!isTrending && !isDeal && !isHot && interested < 3) return null;
          return (
            <div className="flex flex-wrap gap-2">
              {isTrending && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black text-orange-300 border border-orange-500/30 bg-orange-500/10">
                  🔥 Tendance
                </span>
              )}
              {isDeal && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black text-emerald-300 border border-emerald-500/30 bg-emerald-500/10">
                  💸 Bonne affaire
                </span>
              )}
              {isHot && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black text-yellow-300 border border-yellow-500/30 bg-yellow-500/10">
                  ⚡ Part vite
                </span>
              )}
              {interested >= 3 && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white/50 border border-white/8 bg-white/4">
                  👁 {interested} personnes intéressées
                </span>
              )}
            </div>
          );
        })()}

        {/* Price + Title */}
        <div>
          {/* Price — very visible */}
          <div className="flex items-center gap-3 mb-2">
            <p className="text-[32px] font-black text-white leading-none">{formatPrice(product.price)}</p>
            {product.price < 15 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400">-{Math.round((1 - product.price / 30) * 100)}%*</span>
            )}
          </div>
          <h1 className="text-[18px] font-black text-white leading-tight mb-2">{product.title}</h1>

          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.condition && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                {conditionLabel(product.condition)}
              </span>
            )}
            {product.size && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/6 text-white/60 border border-white/8">
                Taille {product.size}
              </span>
            )}
            {product.brand && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/25">
                {product.brand}
              </span>
            )}
            {product.category && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/7">
                {product.category}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-[11px] text-white/25">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{product.views} vues</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{likesCount} j'aime</span>
            <span>{timeAgo(product.created_at)}</span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-4">
            <p className="text-[12px] font-bold text-white/30 uppercase tracking-wider mb-2">Description</p>
            <p className="text-[13px] text-white/70 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Seller */}
        {product.seller && (
          <Link href={`/profile/${product.seller.id}`}
            className="flex items-center gap-3 rounded-2xl border border-white/7 bg-white/[0.025] p-3.5 active:bg-white/5 transition-all">
            <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
              {product.seller.avatar_url ? (
                <Image src={product.seller.avatar_url} alt="" width={44} height={44} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
                  <span className="text-white font-black text-[16px]">
                    {(product.seller.full_name || product.seller.username || "?")[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-[14px] truncate">{product.seller.full_name || product.seller.username}</p>
              <p className="text-[11px] text-white/35">@{product.seller.username}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-[11px] font-bold text-white/60">{product.seller.rating?.toFixed(1)}</span>
                <span className="text-[11px] text-white/25">· {product.seller.sales_count} ventes</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 flex-shrink-0" />
          </Link>
        )}

        {/* Protection */}
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-3.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-emerald-300">Protection acheteur incluse</p>
            <p className="text-[11px] text-emerald-400/60">Paiement sécurisé · Remboursement garanti</p>
          </div>
        </div>

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <div>
            <p className="text-[15px] font-black text-white mb-3">Articles similaires</p>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {similarProducts.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`}
                  className="flex-shrink-0 w-[120px] rounded-2xl overflow-hidden border border-white/7 active:scale-[0.97] transition-transform"
                  style={{ background: "#0E0E16" }}>
                  <div className="relative aspect-[3/4] bg-[#0F0F18]">
                    {p.images?.[0] && (
                      <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="120px" />
                    )}
                    <div className="absolute bottom-1.5 left-2">
                      <p className="text-[12px] font-black text-white drop-shadow-sm">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                  <div className="px-2 pt-1.5 pb-2">
                    <p className="text-[11px] font-semibold text-white/70 line-clamp-1">{p.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-8 pt-3 safe-bottom"
        style={{ background: "linear-gradient(to top, #07070A 70%, transparent)" }}>
        <div className="flex gap-2.5">
          <button onClick={toggleLike} disabled={actionLoading}
            className={cn(
              "w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 transition-all active:scale-95",
              liked ? "bg-red-500 border-red-500" : "border-white/12 bg-white/5"
            )}>
            <Heart className={cn("w-5 h-5 transition-all", liked ? "fill-white text-white" : "text-white/50")} />
          </button>

          {isOwner ? (
            <Link href={`/sell/edit/${product.id}`} className="flex-1">
              <button className="w-full h-12 rounded-2xl border border-white/15 bg-white/5 text-white font-bold text-[14px] active:scale-[0.98] transition-all">
                Modifier l'annonce
              </button>
            </Link>
          ) : product.status !== "active" ? (
            <button disabled className="flex-1 h-12 rounded-2xl bg-white/5 text-white/30 font-bold text-[14px]">
              Article vendu
            </button>
          ) : (
            <div className="flex-1 flex gap-2">
              <button
                onClick={() => { if (!currentUserId) { router.push("/auth"); return; } setShowOffer(true); }}
                className="w-14 h-12 rounded-2xl border border-[#8B5CF6]/50 text-[#A78BFA] text-[12px] font-bold active:scale-[0.98] transition-all flex items-center justify-center flex-shrink-0 bg-[#8B5CF6]/8">
                Offre
              </button>
              <button
                onClick={() => { if (!currentUserId) { router.push("/auth"); return; } setShowCheckout(true); }}
                className="flex-1 h-12 rounded-2xl text-white text-[15px] font-black active:scale-[0.97] transition-all shadow-lg"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.5)" }}>
                Acheter maintenant
              </button>
            </div>
          )}
        </div>
      </div>

      {showOffer && currentUserId && (
        <OfferModal productId={product.id} sellerId={product.seller_id} productPrice={product.price}
          productTitle={product.title} currentUserId={currentUserId} onClose={() => setShowOffer(false)} />
      )}
      {showCheckout && currentUserId && (
        <CheckoutModal productId={product.id} sellerId={product.seller_id} productTitle={product.title}
          productPrice={product.price} currentUserId={currentUserId} onClose={() => setShowCheckout(false)} />
      )}
    </div>
  );
}