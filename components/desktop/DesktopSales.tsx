"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag, Package, Tag, Star, AlertTriangle,
  MessageCircle, TrendingUp, ChevronRight, Plus,
  CheckCircle, Clock, Truck, XCircle, RefreshCw,
  Shield, Zap, ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/utils";

// ── Status maps ──────────────────────────────────────────────────────────────

const ORDER_STATUS: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending:    { label: "En attente",  color: "#F59E0B", bg: "rgba(245,158,11,0.1)",   icon: Clock        },
  paid:       { label: "Payé",        color: "#3B82F6", bg: "rgba(59,130,246,0.1)",   icon: CheckCircle  },
  shipped:    { label: "Expédié",     color: "#8B5CF6", bg: "rgba(139,92,246,0.1)",   icon: Truck        },
  in_transit: { label: "En transit",  color: "#6366F1", bg: "rgba(99,102,241,0.1)",   icon: Truck        },
  delivered:  { label: "Livré ✓",    color: "#10B981", bg: "rgba(16,185,129,0.1)",   icon: CheckCircle  },
  dispute:    { label: "Litige",      color: "#EF4444", bg: "rgba(239,68,68,0.1)",    icon: AlertTriangle},
  cancelled:  { label: "Annulé",      color: "#6B7280", bg: "rgba(107,114,128,0.1)",  icon: XCircle      },
  refunded:   { label: "Remboursé",   color: "#14B8A6", bg: "rgba(20,184,166,0.1)",   icon: RefreshCw    },
};

const OFFER_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "En attente",   color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },
  accepted:  { label: "Acceptée ✓",  color: "#10B981", bg: "rgba(16,185,129,0.1)"  },
  refused:   { label: "Refusée",      color: "#EF4444", bg: "rgba(239,68,68,0.1)"   },
  countered: { label: "Contre-offre", color: "#3B82F6", bg: "rgba(59,130,246,0.1)"  },
  expired:   { label: "Expirée",      color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
};

type Tab = "achats" | "ventes" | "offres" | "avis";

function StatusPill({ status, map }: { status: string; map: Record<string, { label: string; color: string; bg: string }> }) {
  const s = map[status] ?? { label: status, color: "#6B7280", bg: "rgba(107,114,128,0.1)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 700,
      background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  );
}

function Thumb({ images, title }: { images?: string[]; title?: string }) {
  if (images?.[0]) {
    return (
      <div style={{ position: "relative", width: 52, height: 52, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)" }}>
        <Image src={images[0]} alt={title ?? ""} fill style={{ objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div style={{ width: 52, height: 52, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <Package style={{ width: 20, height: 20, color: "rgba(255,255,255,0.2)" }} />
    </div>
  );
}

function ReviewModal({ order, currentUserId, onClose, onSubmitted }: {
  order: any; currentUserId: string; onClose: () => void; onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const product = Array.isArray(order.product) ? order.product[0] : order.product;
  const seller = Array.isArray(order.seller) ? order.seller[0] : order.seller;
  const isBuyer = order.buyer_id === currentUserId;
  const reviewedUser = isBuyer ? seller : (Array.isArray(order.buyer) ? order.buyer[0] : order.buyer);

  const submit = async () => {
    if (!rating) { setError("Choisis une note"); return; }
    setLoading(true);
    const { error: err } = await supabase.from("reviews").insert({
      reviewer_id: currentUserId,
      reviewed_id: reviewedUser?.id,
      order_id: order.id,
      rating,
      comment: comment.trim() || null,
    });
    if (err) { setError("Erreur lors de l'envoi"); setLoading(false); return; }
    await supabase.from("notifications").insert({
      user_id: reviewedUser?.id,
      type: "review",
      title: "Nouvel avis reçu !",
      body: `${rating}★ — ${comment.trim() || "Avis sans commentaire"}`,
      data: { reviewer_id: currentUserId },
    });
    onSubmitted();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div style={{ background: "#0F0E1A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "28px 32px", width: 440, maxWidth: "90vw" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: "0 0 8px" }}>
            Laisser un avis
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "white", letterSpacing: "-0.03em", margin: "0 0 4px" }}>
            {isBuyer ? "Note le vendeur" : "Note l'acheteur"}
          </h2>
          {reviewedUser && (
            <p style={{ fontSize: 13, color: "rgba(167,139,250,0.6)", margin: 0 }}>@{reviewedUser.username || reviewedUser.full_name}</p>
          )}
        </div>

        {/* Product ref */}
        {product && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 20 }}>
            <Thumb images={product.images} title={product.title} />
            <div>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>{product.title}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: 0 }}>Commande #{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        )}

        {/* Stars */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", margin: "0 0 10px" }}>Ta note</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, transition: "transform 0.1s" }}>
                <Star style={{
                  width: 32, height: 32,
                  color: s <= (hovered || rating) ? "#F59E0B" : "rgba(255,255,255,0.15)",
                  fill: s <= (hovered || rating) ? "#F59E0B" : "none",
                  transition: "all 0.12s",
                  transform: s <= (hovered || rating) ? "scale(1.15)" : "scale(1)",
                }} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ fontSize: 12, color: "#F59E0B", margin: "6px 0 0", fontWeight: 600 }}>
              {["", "Très mauvais", "Mauvais", "Correct", "Bien", "Excellent !"][rating]}
            </p>
          )}
        </div>

        {/* Comment */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>Commentaire (optionnel)</p>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Décris ton expérience…"
            rows={3}
            style={{
              width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "white",
              outline: "none", resize: "none", caretColor: "#8B5CF6",
              boxSizing: "border-box",
            }}
          />
        </div>

        {error && <p style={{ fontSize: 12, color: "#EF4444", margin: "0 0 12px" }}>{error}</p>}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", borderRadius: 10, fontSize: 13.5, fontWeight: 600,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)", cursor: "pointer",
          }}>
            Annuler
          </button>
          <button onClick={submit} disabled={loading || !rating} style={{
            flex: 2, padding: "11px", borderRadius: 10, fontSize: 13.5, fontWeight: 700,
            background: rating ? "linear-gradient(135deg,#8B5CF6,#7C3AED)" : "rgba(255,255,255,0.06)",
            border: "none", color: rating ? "white" : "rgba(255,255,255,0.2)",
            cursor: rating ? "pointer" : "default",
            boxShadow: rating ? "0 4px 18px rgba(139,92,246,0.35)" : "none",
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Envoi…" : "Publier l'avis"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props { userId: string }

export function DesktopSales({ userId }: Props) {
  const [tab, setTab] = useState<Tab>("achats");
  const [orders, setOrders] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);
  const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(new Set());
  const supabase = createClient();

  const fetchAll = async () => {
    setLoading(true);
    const [ordersRes, salesRes, offersRes, reviewsRes, reviewedRes] = await Promise.all([
      supabase.from("orders")
        .select("*, product:products(id,title,images,price), seller:profiles!orders_seller_id_fkey(id,username,full_name,avatar_url), shipment:shipments(*)")
        .eq("buyer_id", userId).order("created_at", { ascending: false }),
      supabase.from("orders")
        .select("*, product:products(id,title,images,price), buyer:profiles!orders_buyer_id_fkey(id,username,full_name,avatar_url), shipment:shipments(*)")
        .eq("seller_id", userId).order("created_at", { ascending: false }),
      supabase.from("offers")
        .select("*, product:products(id,title,images,price)")
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order("created_at", { ascending: false }),
      supabase.from("reviews")
        .select("*, reviewed:profiles!reviews_reviewed_id_fkey(id,username,full_name,avatar_url), reviewer:profiles!reviews_reviewer_id_fkey(id,username,full_name,avatar_url)")
        .or(`reviewer_id.eq.${userId},reviewed_id.eq.${userId}`)
        .order("created_at", { ascending: false }),
      supabase.from("reviews").select("order_id").eq("reviewer_id", userId),
    ]);
    setOrders(ordersRes.data ?? []);
    setSales(salesRes.data ?? []);
    setOffers(offersRes.data ?? []);
    setReviews(reviewsRes.data ?? []);
    setReviewedOrders(new Set((reviewedRes.data ?? []).map((r: any) => r.order_id).filter(Boolean)));
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [userId]);

  const markShipped = async (orderId: string, buyerId: string) => {
    setActionLoading(orderId);
    const tracking = `WRX${Date.now().toString(36).toUpperCase()}`;
    await supabase.from("shipments").update({ status: "in_transit", tracking_number: tracking, carrier: "Colissimo" }).eq("order_id", orderId);
    await supabase.from("orders").update({ status: "shipped" }).eq("id", orderId);
    await supabase.from("notifications").insert({
      user_id: buyerId, type: "order_shipped",
      title: "Ton colis est en route !", body: `Numéro de suivi : ${tracking}`,
      data: { order_id: orderId },
    });
    await fetchAll();
    setActionLoading(null);
  };

  const markDelivered = async (orderId: string, sellerId: string) => {
    setActionLoading(orderId);
    await supabase.from("shipments").update({ status: "delivered", delivered_at: new Date().toISOString() }).eq("order_id", orderId);
    await supabase.from("orders").update({ status: "delivered" }).eq("id", orderId);
    await supabase.from("notifications").insert({
      user_id: sellerId, type: "order_delivered",
      title: "Article livré !", body: "L'acheteur a confirmé la réception",
      data: { order_id: orderId },
    });
    await fetchAll();
    setActionLoading(null);
  };

  const acceptOffer = async (offerId: string, productId: string) => {
    setActionLoading(offerId);
    await supabase.from("offers").update({ status: "accepted" }).eq("id", offerId);
    await supabase.from("notifications").insert({
      user_id: userId, type: "offer",
      title: "Offre acceptée !", body: "Finalise ton achat",
      data: { offer_id: offerId, product_id: productId },
    });
    await fetchAll();
    setActionLoading(null);
  };

  const refuseOffer = async (offerId: string) => {
    setActionLoading(offerId);
    await supabase.from("offers").update({ status: "refused" }).eq("id", offerId);
    await fetchAll();
    setActionLoading(null);
  };

  // Stats
  const totalSpent = orders.reduce((s, o) => s + (o.total ?? 0), 0);
  const totalEarned = sales.filter(o => o.status === "delivered").reduce((s, o) => s + (o.amount ?? 0), 0);
  const pendingSales = sales.filter(o => o.status === "paid").length;
  const avgRating = reviews.filter(r => r.reviewed_id === userId).length > 0
    ? reviews.filter(r => r.reviewed_id === userId).reduce((s, r) => s + r.rating, 0) / reviews.filter(r => r.reviewed_id === userId).length
    : null;

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: "achats",  label: "Mes achats",  count: orders.length  },
    { key: "ventes",  label: "Mes ventes",  count: sales.length   },
    { key: "offres",  label: "Offres",      count: offers.length  },
    { key: "avis",    label: "Avis",        count: reviews.length },
  ];

  const currentList = tab === "achats" ? orders : tab === "ventes" ? sales : tab === "offres" ? offers : reviews;

  return (
    <div style={{ display: "flex", width: "100%", height: "100dvh", overflow: "hidden", background: "#07060F" }}>

      {/* ── LEFT SIDEBAR ── */}
      <div style={{
        width: 260, flexShrink: 0, display: "flex", flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.01)",
      }}>
        {/* Header */}
        <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <h1 style={{ fontSize: 19, fontWeight: 800, color: "white", letterSpacing: "-0.03em", margin: "0 0 4px" }}>
            Ventes & Achats
          </h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", margin: 0 }}>Gère tes transactions</p>
        </div>

        {/* Stats */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          {[
            { label: "Dépensé",     value: `${totalSpent.toFixed(0)}€`,  color: "#EF4444", icon: ShoppingBag },
            { label: "Gagné",       value: `${totalEarned.toFixed(0)}€`, color: "#10B981", icon: TrendingUp  },
            { label: "À expédier",  value: String(pendingSales),          color: "#F59E0B", icon: Package     },
            { label: "Note moy.",   value: avgRating ? `${avgRating.toFixed(1)}★` : "—", color: "#F59E0B", icon: Star },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "9px 12px", borderRadius: 10,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}15` }}>
                  <Icon style={{ width: 13, height: 13, color }} />
                </div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{label}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Nav tabs */}
        <nav style={{ padding: "8px 10px", flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
          {TABS.map(({ key, label, count }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "9px 12px", borderRadius: 9, marginBottom: 2,
              background: tab === key ? "rgba(139,92,246,0.1)" : "transparent",
              border: tab === key ? "1px solid rgba(139,92,246,0.2)" : "1px solid transparent",
              color: tab === key ? "#C4B5FD" : "rgba(255,255,255,0.38)",
              fontSize: 13, fontWeight: tab === key ? 600 : 400, cursor: "pointer",
              textAlign: "left", transition: "all 0.1s",
            }}
              onMouseEnter={e => { if (tab !== key) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (tab !== key) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <span>{label}</span>
              {(count ?? 0) > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  padding: "1px 7px", borderRadius: 10,
                  background: tab === key ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.07)",
                  color: tab === key ? "#A78BFA" : "rgba(255,255,255,0.3)",
                }}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sell CTA */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <Link href="/sell/ai" style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 11,
              background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(91,33,182,0.12))",
              border: "1px solid rgba(124,58,237,0.28)", cursor: "pointer",
            }}>
              <Zap style={{ width: 15, height: 15, color: "#A78BFA", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: "white", margin: "0 0 1px" }}>Vendre un article</p>
                <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", margin: 0 }}>Annonce IA en 30 sec</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", height: 60, flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", letterSpacing: "-0.02em", margin: 0 }}>
              {tab === "achats" ? "Mes achats" : tab === "ventes" ? "Mes ventes" : tab === "offres" ? "Offres reçues & envoyées" : "Avis"}
            </h2>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: "2px 0 0" }}>
              {currentList.length} élément{currentList.length > 1 ? "s" : ""}
            </p>
          </div>
          {tab === "ventes" && pendingSales > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 20,
              background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)",
            }}>
              <Package style={{ width: 13, height: 13, color: "#F59E0B" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#F59E0B" }}>{pendingSales} à expédier</span>
            </div>
          )}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
          {loading ? (
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ height: 78, borderRadius: 12, background: "rgba(255,255,255,0.04)", animation: "pulse 1.5s infinite" }} />
              ))}
            </div>
          ) : currentList.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60%", gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {tab === "achats" ? <ShoppingBag style={{ width: 22, height: 22, color: "rgba(255,255,255,0.2)" }} />
                  : tab === "ventes" ? <Tag style={{ width: 22, height: 22, color: "rgba(255,255,255,0.2)" }} />
                  : tab === "offres" ? <Package style={{ width: 22, height: 22, color: "rgba(255,255,255,0.2)" }} />
                  : <Star style={{ width: 22, height: 22, color: "rgba(255,255,255,0.2)" }} />}
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.22)", margin: "0 0 6px" }}>
                  {tab === "achats" ? "Aucun achat" : tab === "ventes" ? "Aucune vente" : tab === "offres" ? "Aucune offre" : "Aucun avis"}
                </p>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.16)", margin: 0 }}>
                  {tab === "achats" ? "Explore les articles pour commencer" : tab === "ventes" ? "Mets en vente tes articles" : tab === "offres" ? "Les offres apparaîtront ici" : "Les avis apparaîtront ici"}
                </p>
              </div>
              {(tab === "achats" || tab === "ventes") && (
                <Link href={tab === "achats" ? "/search" : "/sell/ai"} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "9px 20px", borderRadius: 20,
                    background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)",
                    color: "#A78BFA", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}>
                    {tab === "achats" ? "Explorer les articles" : "Vendre un article"}
                    <ArrowRight style={{ width: 13, height: 13 }} />
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <div style={{ padding: "12px 24px 24px" }}>

              {/* ── ORDERS (achats / ventes) ── */}
              {(tab === "achats" || tab === "ventes") && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {currentList.map((order: any) => {
                    const isBuyer = tab === "achats";
                    const product = Array.isArray(order.product) ? order.product[0] : order.product;
                    const other = isBuyer
                      ? (Array.isArray(order.seller) ? order.seller[0] : order.seller)
                      : (Array.isArray(order.buyer) ? order.buyer[0] : order.buyer);
                    const shipment = Array.isArray(order.shipment) ? order.shipment[0] : order.shipment;
                    const st = ORDER_STATUS[order.status] ?? ORDER_STATUS.pending;
                    const canShip = !isBuyer && order.status === "paid";
                    const canDeliver = isBuyer && (order.status === "shipped" || order.status === "in_transit");
                    const canReview = order.status === "delivered" && !reviewedOrders.has(order.id);
                    const isLoading = actionLoading === order.id;

                    return (
                      <div key={order.id} style={{
                        display: "flex", gap: 14, padding: "14px 16px", borderRadius: 12,
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                        transition: "border-color 0.12s",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}>

                        <Thumb images={product?.images} title={product?.title} />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.88)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                              {product?.title ?? "Article"}
                            </p>
                            <StatusPill status={order.status} map={ORDER_STATUS} />
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 800, color: "#A78BFA" }}>{order.total?.toFixed(2)}€</span>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                              {isBuyer ? "Vendeur" : "Acheteur"} · @{other?.username ?? "—"}
                            </span>
                            {shipment?.tracking_number && (
                              <span style={{ fontSize: 11, fontFamily: "monospace", color: "#8B5CF6", background: "rgba(139,92,246,0.1)", padding: "1px 7px", borderRadius: 5 }}>
                                {shipment.tracking_number}
                              </span>
                            )}
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>
                              {timeAgo(order.created_at)}
                            </span>
                          </div>

                          {/* Actions */}
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <Link href={`/orders/${order.id}`} style={{ textDecoration: "none" }}>
                              <button style={{
                                padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600,
                                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                                color: "rgba(255,255,255,0.55)", cursor: "pointer", transition: "all 0.1s",
                              }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}>
                                Voir détails →
                              </button>
                            </Link>
                            {other?.id && (
                              <Link href={`/messages?user=${other.id}`} style={{ textDecoration: "none" }}>
                                <button style={{
                                  display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 7,
                                  fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)",
                                  cursor: "pointer",
                                }}>
                                  <MessageCircle style={{ width: 12, height: 12 }} /> Message
                                </button>
                              </Link>
                            )}
                            {canShip && (
                              <button onClick={() => markShipped(order.id, other?.id)} disabled={isLoading} style={{
                                display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 7,
                                fontSize: 12, fontWeight: 700,
                                background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)",
                                color: "#A78BFA", cursor: "pointer", opacity: isLoading ? 0.6 : 1,
                              }}>
                                <Package style={{ width: 12, height: 12 }} />
                                {isLoading ? "…" : "Marquer expédié"}
                              </button>
                            )}
                            {canDeliver && (
                              <button onClick={() => markDelivered(order.id, other?.id)} disabled={isLoading} style={{
                                display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 7,
                                fontSize: 12, fontWeight: 700,
                                background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
                                color: "#10B981", cursor: "pointer", opacity: isLoading ? 0.6 : 1,
                              }}>
                                <CheckCircle style={{ width: 12, height: 12 }} />
                                {isLoading ? "…" : "Confirmer réception"}
                              </button>
                            )}
                            {canReview && (
                              <button onClick={() => setReviewOrder(order)} style={{
                                display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 7,
                                fontSize: 12, fontWeight: 700,
                                background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)",
                                color: "#F59E0B", cursor: "pointer",
                              }}>
                                <Star style={{ width: 12, height: 12 }} /> Laisser un avis
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── OFFERS ── */}
              {tab === "offres" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {offers.map((offer: any) => {
                    const product = Array.isArray(offer.product) ? offer.product[0] : offer.product;
                    const isMyOffer = offer.buyer_id === userId;
                    const canAct = !isMyOffer && offer.status === "pending";
                    const isLoading = actionLoading === offer.id;
                    return (
                      <div key={offer.id} style={{
                        display: "flex", gap: 14, padding: "14px 16px", borderRadius: 12,
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                      }}>
                        <Thumb images={product?.images} title={product?.title} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.88)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 10 }}>
                              {product?.title ?? "Article"}
                            </p>
                            <StatusPill status={offer.status} map={OFFER_STATUS} />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 800, color: "#A78BFA" }}>{offer.amount?.toFixed(2)}€</span>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                              {product?.price && <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.18)" }}>{product.price?.toFixed(2)}€</span>}
                            </span>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                              {isMyOffer ? "Ton offre" : "Offre reçue"} · {timeAgo(offer.created_at)}
                            </span>
                          </div>
                          {canAct && (
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => acceptOffer(offer.id, product?.id)} disabled={isLoading} style={{
                                padding: "6px 16px", borderRadius: 7, fontSize: 12, fontWeight: 700,
                                background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
                                color: "#10B981", cursor: "pointer",
                              }}>
                                ✓ Accepter
                              </button>
                              <button onClick={() => refuseOffer(offer.id)} disabled={isLoading} style={{
                                padding: "6px 16px", borderRadius: 7, fontSize: 12, fontWeight: 700,
                                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                                color: "#EF4444", cursor: "pointer",
                              }}>
                                ✕ Refuser
                              </button>
                            </div>
                          )}
                          {offer.status === "accepted" && isMyOffer && (
                            <Link href={`/products/${product?.id}`} style={{ textDecoration: "none" }}>
                              <button style={{
                                padding: "6px 16px", borderRadius: 7, fontSize: 12, fontWeight: 700,
                                background: "linear-gradient(135deg,#8B5CF6,#7C3AED)", border: "none",
                                color: "white", cursor: "pointer",
                              }}>
                                Finaliser l'achat →
                              </button>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── REVIEWS ── */}
              {tab === "avis" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {reviews.map((review: any) => {
                    const isReceived = review.reviewed_id === userId;
                    const person = isReceived
                      ? (Array.isArray(review.reviewer) ? review.reviewer[0] : review.reviewer)
                      : (Array.isArray(review.reviewed) ? review.reviewed[0] : review.reviewed);
                    return (
                      <div key={review.id} style={{
                        display: "flex", gap: 14, padding: "14px 16px", borderRadius: 12,
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                      }}>
                        {/* Avatar */}
                        <div style={{ width: 42, height: 42, borderRadius: "50%", flexShrink: 0, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                          {person?.avatar_url
                            ? <img src={person.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#8B5CF6,#6D28D9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "white" }}>
                                {(person?.username || person?.full_name || "?")[0].toUpperCase()}
                              </div>
                          }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
                                @{person?.username || person?.full_name}
                              </span>
                              <span style={{ fontSize: 10.5, background: isReceived ? "rgba(16,185,129,0.1)" : "rgba(139,92,246,0.1)", padding: "1px 8px", borderRadius: 10, color: isReceived ? "#10B981" : "#A78BFA" }}>
                                {isReceived ? "Reçu" : "Donné"}
                              </span>
                            </div>
                            <div style={{ display: "flex", gap: 3 }}>
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} style={{ width: 13, height: 13, color: s <= review.rating ? "#F59E0B" : "rgba(255,255,255,0.12)", fill: s <= review.rating ? "#F59E0B" : "none" }} />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 4px", lineHeight: 1.5 }}>{review.comment}</p>
                          )}
                          <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.2)", margin: 0 }}>{timeAgo(review.created_at)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT INFO PANEL ── */}
      <div style={{
        width: 260, flexShrink: 0, borderLeft: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.01)", overflowY: "auto", scrollbarWidth: "none",
        display: "flex", flexDirection: "column",
      }}>
        {/* Protection banner */}
        <div style={{ margin: "16px 16px 0", padding: "14px", borderRadius: 12, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Shield style={{ width: 16, height: 16, color: "#10B981" }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: "#10B981", margin: 0 }}>Protection acheteur</p>
          </div>
          <p style={{ fontSize: 11.5, color: "rgba(16,185,129,0.6)", margin: "0 0 10px", lineHeight: 1.5 }}>
            Tous tes achats sont protégés. Remboursement garanti si un problème survient.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {["Paiement sécurisé", "Remboursement si problème", "Support dédié 24h/24"].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <CheckCircle style={{ width: 11, height: 11, color: "#10B981", flexShrink: 0 }} />
                <span style={{ fontSize: 11.5, color: "rgba(16,185,129,0.55)" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commission recap */}
        <div style={{ margin: "12px 16px 0", padding: "14px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", margin: "0 0 10px" }}>
            Frais Wearlyx
          </p>
          {[
            { label: "Pour les vendeurs", value: "0%", color: "#10B981" },
            { label: "Commission acheteur", value: "5%", color: "#F59E0B" },
            { label: "Protection acheteur", value: "2%", color: "#3B82F6" },
            { label: "Livraison point relais", value: "3.49€", color: "#8B5CF6" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ margin: "12px 16px 16px" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", margin: "0 0 8px" }}>
            Raccourcis
          </p>
          {[
            { href: "/sell/ai", label: "Nouvelle annonce", icon: Plus },
            { href: "/search", label: "Explorer les articles", icon: ShoppingBag },
            { href: "/profile/menu", label: "Mon profil", icon: Star },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "9px 10px", borderRadius: 8, marginBottom: 3,
                cursor: "pointer", transition: "background 0.1s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon style={{ width: 13, height: 13, color: "rgba(139,92,246,0.6)" }} />
                  <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)" }}>{label}</span>
                </div>
                <ChevronRight style={{ width: 12, height: 12, color: "rgba(255,255,255,0.18)" }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Review modal */}
      {reviewOrder && (
        <ReviewModal
          order={reviewOrder}
          currentUserId={userId}
          onClose={() => setReviewOrder(null)}
          onSubmitted={() => { setReviewOrder(null); fetchAll(); }}
        />
      )}
    </div>
  );
}
