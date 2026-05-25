"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Bookmark, Share2, Star, ShieldCheck, Package, Eye, ArrowLeft, MessageCircle, Zap } from "lucide-react";
import type { Product } from "@/types/database";
import { formatPrice, conditionLabel, timeAgo, cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { OfferModal } from "@/components/marketplace/OfferModal";
import { CheckoutModal } from "@/components/marketplace/CheckoutModal";

interface Props {
  product: Product;
  currentUserId?: string;
}

export function DesktopProductDetail({ product, currentUserId }: Props) {
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
    supabase.from("products").select("*, seller:profiles(id, username, full_name, avatar_url)")
      .eq("status", "active").eq("category", product.category).neq("id", product.id)
      .order("created_at", { ascending: false }).limit(4)
      .then(({ data }) => { if (data) setSimilarProducts(data as Product[]); });
  }, [product.id, product.category]);

  const toggleLike = async () => {
    if (!currentUserId) { router.push("/auth"); return; }
    setActionLoading(true);
    if (liked) {
      await supabase.from("likes").delete().match({ user_id: currentUserId, product_id: product.id });
      setLiked(false); setLikesCount(c => c - 1);
    } else {
      await supabase.from("likes").insert({ user_id: currentUserId, product_id: product.id });
      setLiked(true); setLikesCount(c => c + 1);
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
    const { data: existing } = await supabase.from("conversations")
      .select("id").match({ product_id: product.id, buyer_id: currentUserId, seller_id: product.seller_id }).single();
    if (existing) { router.push(`/messages/${existing.id}`); return; }
    const { data: conv } = await supabase.from("conversations")
      .insert({ product_id: product.id, buyer_id: currentUserId, seller_id: product.seller_id })
      .select("id").single();
    if (conv) router.push(`/messages/${conv.id}`);
    setContactLoading(false);
  };

  const isTrending = likesCount >= 5;
  const isDeal = product.price < 15;
  const isHot = (product.views ?? 0) >= 40;

  return (
    <div className="min-h-screen" style={{ background: "#07070A" }}>
      {/* Back */}
      <div className="px-8 pt-6 pb-4">
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-white/35 hover:text-white/65 transition-colors text-[13px] font-medium">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
      </div>

      <div className="px-8 pb-16 flex gap-12">

        {/* ── Left: gallery ── */}
        <div className="w-[480px] flex-shrink-0">
          {/* Main image */}
          <div className="relative rounded-[22px] overflow-hidden bg-[#0F0F18]" style={{ aspectRatio: "1/1" }}>
            {images.length > 0 ? (
              <Image src={images[activeImage]} alt={product.title} fill className="object-cover" priority sizes="480px" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-20 h-20 text-white/8" />
              </div>
            )}
            {product.status !== "active" && (
              <div className="absolute inset-0 bg-black/65 flex items-center justify-center rounded-[22px]">
                <span className="font-black text-white text-xl px-6 py-2.5 rounded-2xl border-2 border-white/40 uppercase tracking-wide">
                  {product.status === "sold" ? "Vendu" : "Réservé"}
                </span>
              </div>
            )}
            {/* FOMO badge */}
            {isTrending && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black text-orange-300"
                style={{ background: "rgba(249,115,22,0.18)", border: "1px solid rgba(249,115,22,0.25)" }}>
                🔥 Tendance
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2.5 mt-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={cn("w-16 h-16 rounded-[12px] overflow-hidden border-2 transition-all flex-shrink-0",
                    activeImage === i ? "border-[#8B5CF6]" : "border-white/10 opacity-60 hover:opacity-80")}>
                  <Image src={img} alt="" width={64} height={64} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}

          {/* Similar */}
          {similarProducts.length > 0 && (
            <div className="mt-8">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>
                Articles similaires
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {similarProducts.map(p => (
                  <Link key={p.id} href={`/products/${p.id}`}
                    className="rounded-[14px] overflow-hidden border border-white/7 hover:border-white/15 transition-all group"
                    style={{ background: "#0E0E16" }}>
                    <div className="relative aspect-square bg-[#0F0F18]">
                      {p.images?.[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover group-hover:scale-[1.03] transition-transform" sizes="160px" />}
                      <div className="absolute bottom-1.5 left-2">
                        <p className="text-[12px] font-black text-white drop-shadow-sm">{formatPrice(p.price)}</p>
                      </div>
                    </div>
                    <div className="px-2.5 py-2">
                      <p className="text-[11.5px] font-semibold text-white/60 line-clamp-1">{p.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: info ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Badges */}
          {(isTrending || isDeal || isHot) && (
            <div className="flex flex-wrap gap-2">
              {isDeal && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300 border border-emerald-500/25 bg-emerald-500/8">
                  💸 Bonne affaire
                </span>
              )}
              {isHot && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold text-yellow-300 border border-yellow-500/25 bg-yellow-500/8">
                  ⚡ Part vite
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div>
            <p className="text-[44px] font-black text-white leading-none mb-2">{formatPrice(product.price)}</p>
            <h1 className="text-[22px] font-black text-white/90 leading-tight">{product.title}</h1>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.condition && (
              <span className="text-[12px] font-bold px-3 py-1.5 rounded-full bg-[#8B5CF6]/12 text-[#A78BFA] border border-[#8B5CF6]/22">
                {conditionLabel(product.condition)}
              </span>
            )}
            {product.size && (
              <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/6 text-white/55 border border-white/9">
                Taille {product.size}
              </span>
            )}
            {product.brand && (
              <span className="text-[12px] font-bold px-3 py-1.5 rounded-full bg-[#8B5CF6]/12 text-[#A78BFA] border border-[#8B5CF6]/22">
                {product.brand}
              </span>
            )}
            {product.category && (
              <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/5 text-white/40 border border-white/7">
                {product.category}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5 text-[12px] text-white/28">
            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{product.views ?? 0} vues</span>
            <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" />{likesCount} j'aime</span>
            <span>{timeAgo(product.created_at)}</span>
          </div>

          {/* Description */}
          {product.description && (
            <div className="rounded-[16px] p-5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>Description</p>
              <p className="text-[13.5px] text-white/65 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Seller */}
          {product.seller && (
            <Link href={`/profile/${product.seller.id}`}
              className="flex items-center gap-4 p-4 rounded-[16px] transition-all group"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; }}>
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/12">
                {product.seller.avatar_url ? (
                  <Image src={product.seller.avatar_url} alt="" width={48} height={48} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
                    <span className="text-white font-black text-[18px]">
                      {(product.seller.full_name || product.seller.username || "?")[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white/85 text-[15px]">{product.seller.full_name || product.seller.username}</p>
                <p className="text-[12px] text-white/35 mt-0.5">@{product.seller.username}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[12px] font-bold text-white/55">{product.seller.rating?.toFixed(1)}</span>
                  <span className="text-[11px] text-white/25">· {product.seller.sales_count} ventes</span>
                </div>
              </div>
              <button onClick={e => { e.preventDefault(); contactSeller(); }}
                disabled={contactLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-[12.5px] font-bold text-white/60 transition-all hover:text-white hover:bg-white/8"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                <MessageCircle className="w-3.5 h-3.5" />
                {contactLoading ? "…" : "Contacter"}
              </button>
            </Link>
          )}

          {/* Protection */}
          <div className="flex items-center gap-3 rounded-[14px] px-4 py-3.5"
            style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.14)" }}>
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-[13.5px] font-bold text-emerald-300">Protection acheteur incluse</p>
              <p className="text-[12px] text-emerald-400/55 mt-0.5">Paiement sécurisé · Remboursement garanti si problème</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3 mt-2">
            <button onClick={toggleLike} disabled={actionLoading}
              className={cn("w-12 h-12 rounded-[12px] border flex items-center justify-center flex-shrink-0 transition-all",
                liked ? "bg-red-500 border-red-500" : "border-white/12 bg-white/5 hover:bg-white/8")}>
              <Heart className={cn("w-5 h-5", liked ? "fill-white text-white" : "text-white/50")} />
            </button>
            <button onClick={toggleSave} disabled={actionLoading}
              className={cn("w-12 h-12 rounded-[12px] border flex items-center justify-center flex-shrink-0 transition-all",
                saved ? "bg-[#8B5CF6] border-[#8B5CF6]" : "border-white/12 bg-white/5 hover:bg-white/8")}>
              <Bookmark className={cn("w-5 h-5", saved ? "fill-white text-white" : "text-white/50")} />
            </button>

            {isOwner ? (
              <Link href={`/sell/edit/${product.id}`} className="flex-1">
                <button className="w-full h-12 rounded-[12px] border border-white/15 bg-white/5 text-white font-bold text-[14px] hover:bg-white/8 transition-all">
                  Modifier l'annonce
                </button>
              </Link>
            ) : product.status !== "active" ? (
              <button disabled className="flex-1 h-12 rounded-[12px] bg-white/5 text-white/25 font-bold text-[14px]">
                Article vendu
              </button>
            ) : (
              <>
                <button onClick={() => { if (!currentUserId) { router.push("/auth"); return; } setShowOffer(true); }}
                  className="flex-1 h-12 rounded-[12px] text-[#A78BFA] text-[13.5px] font-bold transition-all hover:bg-[#8B5CF6]/12"
                  style={{ border: "1px solid rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.07)" }}>
                  Faire une offre
                </button>
                <button onClick={() => { if (!currentUserId) { router.push("/auth"); return; } setShowCheckout(true); }}
                  className="flex-[1.4] h-12 rounded-[12px] text-white text-[15px] font-black transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.4)" }}>
                  <Zap className="w-4 h-4 fill-white" />
                  Acheter
                </button>
              </>
            )}
          </div>
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
