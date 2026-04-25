"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart, Share2, ChevronLeft, Star, ShieldCheck, Package, MessageCircle, Truck
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
  const [likesCount, setLikesCount] = useState(product.likes_count ?? 0);
  const [heartPop, setHeartPop] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const touchStartX = useRef<number>(0);

  const isOwner = currentUserId === product.seller_id;
  const images = product.images?.length ? product.images : [];
  const buyerProtection = Math.round(product.price * 0.02 * 100) / 100;
  const commission = Math.round(product.price * 0.05 * 100) / 100;
  const totalWithProtection = (product.price + buyerProtection + commission).toFixed(2);

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
    if (actionLoading) return;
    setActionLoading(true);
    setHeartPop(true);
    setTimeout(() => setHeartPop(false), 400);
    if (liked) {
      await supabase.from("likes").delete().match({ user_id: currentUserId, product_id: product.id });
      setLiked(false); setLikesCount((c) => c - 1);
    } else {
      await supabase.from("likes").insert({ user_id: currentUserId, product_id: product.id });
      setLiked(true); setLikesCount((c) => c + 1);
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
      .maybeSingle();
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

  const nextImage = () => setActiveImage((i) => (i + 1) % images.length);
  const prevImage = () => setActiveImage((i) => (i - 1 + images.length) % images.length);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? nextImage() : prevImage();
  };

  return (
    <div className="bg-[#08080F] min-h-[100dvh] animate-fadeIn pb-32">

      {/* Image carousel — full width */}
      <div className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full aspect-square bg-[#141422] overflow-hidden">
          {images.length > 0 ? (
            <Image
              src={images[activeImage]}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-20 h-20 text-white/10" />
            </div>
          )}

          {/* Top gradient for buttons */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          {/* Top buttons */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 pb-2 z-10">
            <button onClick={() => router.back()}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md active:scale-95 transition-transform">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={handleShare}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md active:scale-95 transition-transform">
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Like button — bottom right over image */}
          <button
            onClick={toggleLike}
            className={cn(
              "absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-2 rounded-full backdrop-blur-md transition-all active:scale-95",
              liked ? "bg-red-500/90" : "bg-black/50",
              heartPop ? "scale-110" : ""
            )}
          >
            <Heart className={cn("w-4 h-4 transition-all", liked ? "fill-white text-white" : "text-white")} />
            {likesCount > 0 && <span className="text-[12px] font-bold text-white">{likesCount}</span>}
          </button>

          {/* Sold/reserved overlay */}
          {product.status !== "active" && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
              <span className="font-black text-white text-xl px-6 py-2.5 rounded-2xl border-2 border-white/40 backdrop-blur-sm uppercase tracking-wide">
                {product.status === "sold" ? "Vendu" : "Réservé"}
              </span>
            </div>
          )}

          {/* Carousel dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {images.map((_, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={cn(
                    "rounded-full transition-all",
                    i === activeImage ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 space-y-4">

        {/* Title + meta row */}
        <div>
          <h1 className="text-[20px] font-black text-white leading-tight mb-2">{product.title}</h1>

          {/* Single-line info — Vinted style */}
          <p className="text-[13px] text-white/40 mb-3">
            {[
              product.size && `Taille ${product.size}`,
              product.condition && conditionLabel(product.condition),
              product.brand,
              timeAgo(product.created_at),
            ].filter(Boolean).join(" · ")}
          </p>

          {/* Price block */}
          <div className="mb-2">
            <p className="text-[34px] font-black text-white leading-none">{formatPrice(product.price)}</p>
            <p className="text-[12px] text-white/35 mt-1">
              {totalWithProtection} € au total · <span className="text-white/25">protection 2% + commission 5%</span>
            </p>
          </div>
        </div>

        {/* FOMO */}
        {product.status === "active" && (() => {
          const isTrending = likesCount >= 5;
          const isHot = (product.views ?? 0) >= 40;
          const interested = likesCount + Math.floor((product.views ?? 0) * 0.08);
          if (!isTrending && !isHot && interested < 3) return null;
          return (
            <div className="flex flex-wrap gap-2">
              {isTrending && <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black text-orange-300 border border-orange-500/30 bg-orange-500/10">🔥 Tendance</span>}
              {isHot && <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black text-yellow-300 border border-yellow-500/30 bg-yellow-500/10">⚡ Part vite</span>}
              {interested >= 3 && <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white/50 border border-white/8 bg-white/4">👁 {interested} personnes intéressées</span>}
            </div>
          );
        })()}

        {/* Description */}
        {product.description && (
          <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-4">
            <p className="text-[11px] font-bold text-white/25 uppercase tracking-wider mb-2">Description</p>
            <p className="text-[14px] text-white/70 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Seller card */}
        {product.seller && (
          <div className="rounded-2xl border border-white/7 bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${product.seller.id}`} className="flex-1 flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                  {product.seller.avatar_url ? (
                    <Image src={product.seller.avatar_url} alt="" width={44} height={44} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #6C3AED, #C026D3)" }}>
                      <span className="text-white font-black text-[16px]">
                        {(product.seller.full_name || product.seller.username || "?")[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-[14px] truncate">{product.seller.full_name || product.seller.username}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[12px] font-bold text-white/60">{(product.seller.rating ?? 5).toFixed(1)}</span>
                    <span className="text-[11px] text-white/25">({product.seller.sales_count ?? 0} ventes)</span>
                  </div>
                </div>
              </Link>

              {!isOwner && (
                <button
                  onClick={contactSeller}
                  disabled={contactLoading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/12 bg-white/5 text-white/70 text-[12px] font-semibold active:bg-white/10 transition-all flex-shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Message
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-2.5 pl-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-white/35">Publie activement</span>
            </div>
          </div>
        )}

        {/* Protection acheteur */}
        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-bold text-emerald-300">Frais de Protection acheteur</p>
              <p className="text-[12px] text-emerald-400/55 mt-0.5 leading-relaxed">
                Pour tout achat effectué via le bouton Acheter, des frais couvrant notre Protection acheteurs sont appliqués. Remboursement garanti si l'article ne correspond pas.
              </p>
            </div>
          </div>
        </div>

        {/* Frais de port */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-3.5">
          <Truck className="w-4 h-4 text-white/30 flex-shrink-0" />
          <span className="flex-1 text-[13px] text-white/60 font-medium">Frais de port</span>
          <span className="text-[13px] font-bold text-white/70">à partir de 4,65 €</span>
        </div>

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <div>
            <p className="text-[15px] font-black text-white mb-3">Articles similaires</p>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {similarProducts.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`}
                  className="flex-shrink-0 w-[110px] rounded-xl overflow-hidden border border-white/7 active:scale-[0.97] transition-transform"
                  style={{ background: "#111827" }}>
                  <div className="relative aspect-square bg-[#1a1f2e]">
                    {p.images?.[0] && (
                      <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="110px" />
                    )}
                    <div className="absolute bottom-1.5 left-2">
                      <p className="text-[12px] font-black text-white drop-shadow-sm">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                  <div className="px-2 pt-1.5 pb-2">
                    <p className="text-[10px] font-medium text-[#9CA3AF] line-clamp-1">{p.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA — Vinted style : 2 boutons égaux */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-8 pt-3 safe-bottom"
        style={{ background: "linear-gradient(to top, #08080F 70%, transparent)" }}>
        {isOwner ? (
          <Link href={`/sell/edit/${product.id}`}>
            <button className="w-full h-13 rounded-2xl border border-white/15 bg-white/5 text-white font-bold text-[15px] active:scale-[0.98] transition-all py-3.5">
              Modifier l'annonce
            </button>
          </Link>
        ) : product.status !== "active" ? (
          <button disabled className="w-full h-13 rounded-2xl bg-white/5 text-white/30 font-bold text-[15px] py-3.5">
            Article vendu
          </button>
        ) : (
          <div className="flex gap-2.5">
            <button
              onClick={() => { if (!currentUserId) { router.push("/auth"); return; } setShowOffer(true); }}
              className="flex-1 py-3.5 rounded-2xl border border-white/15 bg-white/5 text-white text-[15px] font-bold active:scale-[0.98] transition-all">
              Faire une offre
            </button>
            <button
              onClick={() => { if (!currentUserId) { router.push("/auth"); return; } setShowCheckout(true); }}
              className="flex-1 py-3.5 rounded-2xl text-white text-[15px] font-black active:scale-[0.97] transition-all"
              style={{ background: "linear-gradient(135deg, #5B21B6, #7C3AED, #C026D3)", boxShadow: "0 6px 24px rgba(108,58,237,0.5)" }}>
              Acheter — {formatPrice(product.price)}
            </button>
          </div>
        )}
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
