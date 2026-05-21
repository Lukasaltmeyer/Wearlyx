"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { TrackingTimeline } from "./TrackingTimeline";
import { DisputeForm } from "./DisputeForm";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/database";

interface Props {
  order: any;
  currentUserId: string;
  isDesktop?: boolean;
}

export function OrderDetailClient({ order, currentUserId, isDesktop }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [showDispute, setShowDispute] = useState(false);
  const [markLoading, setMarkLoading] = useState(false);
  const isBuyer = order.buyer_id === currentUserId;
  const isSeller = order.seller_id === currentUserId;
  const product = order.product;
  const shipment = Array.isArray(order.shipment) ? order.shipment[0] : order.shipment;

  const markShipped = async () => {
    setMarkLoading(true);
    const tracking = `WRX${Date.now().toString(36).toUpperCase()}`;
    await supabase.from("shipments").update({ status: "in_transit", tracking_number: tracking, carrier: "Colissimo" }).eq("order_id", order.id);
    await supabase.from("orders").update({ status: "shipped" }).eq("id", order.id);
    await supabase.from("notifications").insert({
      user_id: order.buyer_id,
      type: "order_shipped",
      title: "Ton colis est en route !",
      body: `Numéro de suivi : ${tracking}`,
      data: { order_id: order.id },
    });
    router.refresh();
    setMarkLoading(false);
  };

  const markDelivered = async () => {
    setMarkLoading(true);
    await supabase.from("shipments").update({ status: "delivered", delivered_at: new Date().toISOString() }).eq("order_id", order.id);
    await supabase.from("orders").update({ status: "delivered" }).eq("id", order.id);
    await supabase.from("notifications").insert({
      user_id: order.seller_id,
      type: "order_delivered",
      title: "Article livré !",
      body: "L'acheteur a confirmé la réception",
      data: { order_id: order.id },
    });
    router.refresh();
    setMarkLoading(false);
  };

  const priceRecap = (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-[13px]"><span className="text-white/50">Article</span><span className="text-white">{order.amount.toFixed(2)} €</span></div>
      <div className="flex justify-between text-[13px]"><span className="text-white/50">Livraison</span><span className="text-white">{order.shipping_fee.toFixed(2)} €</span></div>
      <div className="flex justify-between text-[13px]"><span className="text-white/50">Protection acheteur</span><span className="text-white">{order.protection_fee.toFixed(2)} €</span></div>
      <div className="h-px my-1" style={{ background: "rgba(255,255,255,0.06)" }} />
      <div className="flex justify-between text-[17px] font-black"><span className="text-white">Total</span><span className="text-white">{order.total.toFixed(2)} €</span></div>
    </div>
  );

  const actions = (
    <>
      {isSeller && order.status === "paid" && (
        <button onClick={markShipped} disabled={markLoading}
          className="w-full py-3.5 rounded-[12px] text-[14px] font-bold text-white transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 16px rgba(139,92,246,0.3)" }}>
          {markLoading ? "..." : "📦 Marquer comme expédié"}
        </button>
      )}
      {isBuyer && order.status === "in_transit" && (
        <button onClick={markDelivered} disabled={markLoading}
          className="w-full py-3.5 rounded-[12px] text-[14px] font-bold text-white transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #4CAF50, #10B981)", boxShadow: "0 4px 16px rgba(76,175,80,0.3)" }}>
          {markLoading ? "..." : "✅ Confirmer la réception"}
        </button>
      )}
      {isBuyer && ["paid", "shipped", "in_transit"].includes(order.status) && (
        <button onClick={() => setShowDispute(!showDispute)}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-[12px] text-[13px] font-semibold text-orange-400"
          style={{ border: "1px solid rgba(249,115,22,0.2)", background: "rgba(249,115,22,0.04)" }}>
          <AlertTriangle className="w-4 h-4" />
          Ouvrir un litige
        </button>
      )}
      {showDispute && (
        <div className="p-4 rounded-[12px]" style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.2)" }}>
          <DisputeForm orderId={order.id} currentUserId={currentUserId} onClose={() => setShowDispute(false)} />
        </div>
      )}
    </>
  );

  if (isDesktop) {
    return (
      <div className="flex gap-10">
        {/* Left — product + tracking */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-[20px] px-7 py-6"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(167,139,250,0.04) 100%)", border: "1px solid rgba(139,92,246,0.14)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(167,139,250,0.5)" }}>Commande</p>
                <p className="text-[22px] font-black text-white tracking-tight">#{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          {/* Product */}
          <div className="rounded-[16px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="px-5 pt-4 pb-1" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>Article</p>
            </div>
            <Link href={`/products/${product?.id}`} className="flex items-center gap-4 px-5 pb-4 hover:bg-white/[0.02] transition-colors"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              {product?.images?.[0] && (
                <div className="relative w-16 h-16 rounded-[12px] overflow-hidden flex-shrink-0">
                  <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-white truncate">{product?.title}</p>
                <p className="text-[13px] text-white/40 mt-0.5">{order.amount.toFixed(2)} €</p>
              </div>
              <span className="text-[12px] text-white/25">Voir l'annonce →</span>
            </Link>
          </div>

          {/* Tracking */}
          {shipment && (
            <div className="rounded-[16px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="px-5 pt-4 pb-1" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4" style={{ color: "#8B5CF6" }} />
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.22)" }}>Suivi du colis</p>
                </div>
              </div>
              <div className="px-5 pb-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <TrackingTimeline
                  status={shipment.status}
                  trackingNumber={shipment.tracking_number}
                  carrier={shipment.carrier}
                  estimatedDelivery={shipment.estimated_delivery}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right — recap + actions */}
        <div className="w-[300px] flex-shrink-0 flex flex-col gap-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.22)" }}>Récapitulatif</p>
          <div className="rounded-[14px] p-5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {priceRecap}
          </div>
          <div className="flex flex-col gap-3">
            {actions}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#07070A] pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/60">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-[18px] font-black text-white">Commande</h1>
          <p className="text-[11px] text-white/30 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <div className="ml-auto">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Product */}
        <Link href={`/products/${product?.id}`} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/8">
          {product?.images?.[0] && (
            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-white truncate">{product?.title}</p>
            <p className="text-[12px] text-white/40">{order.amount.toFixed(2)} €</p>
          </div>
        </Link>

        {/* Tracking */}
        {shipment && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/8">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-[#8B5CF6]" />
              <p className="text-[14px] font-black text-white">Suivi du colis</p>
            </div>
            <TrackingTimeline
              status={shipment.status}
              trackingNumber={shipment.tracking_number}
              carrier={shipment.carrier}
              estimatedDelivery={shipment.estimated_delivery}
            />
          </div>
        )}

        {/* Price recap */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/8 flex flex-col gap-2">
          <p className="text-[12px] font-bold text-white/40 uppercase tracking-wider mb-1">Récapitulatif</p>
          {priceRecap}
        </div>

        <div className="flex flex-col gap-3">{actions}</div>
      </div>
    </div>
  );
}