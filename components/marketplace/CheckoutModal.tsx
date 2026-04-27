"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ShieldCheck, Truck, Package, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ShippingMode } from "@/types/database";
import { cn } from "@/lib/utils";

const BUYER_PROTECTION_RATE = 0.02;  // 2%
const PLATFORM_FEE_RATE = 0.05;       // 5%

const SHIPPING_OPTIONS: { mode: ShippingMode; label: string; sublabel: string; price: number; icon: typeof Truck }[] = [
  { mode: "relay",  label: "Point relais",    sublabel: "Livraison en 2–4 jours",    price: 3.49, icon: MapPin  },
  { mode: "locker", label: "Consigne",         sublabel: "Disponible 24h/24",          price: 2.99, icon: Package },
  { mode: "home",   label: "À domicile",       sublabel: "Livraison en 1–3 jours",    price: 4.99, icon: Truck  },
];

interface Props {
  productId: string;
  sellerId: string;
  productTitle: string;
  productPrice: number;
  currentUserId: string;
  offerId?: string;
  offerAmount?: number;
  onClose: () => void;
}

export function CheckoutModal({
  productId, sellerId, productTitle, productPrice,
  currentUserId, offerId, offerAmount, onClose,
}: Props) {
  const router = useRouter();
  const supabase = createClient();
  const amount = offerAmount ?? productPrice;

  const [shippingMode, setShippingMode] = useState<ShippingMode>("relay");
  const [showShippingOptions, setShowShippingOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shippingFee = SHIPPING_OPTIONS.find((o) => o.mode === shippingMode)!.price;
  const buyerProtection = parseFloat((amount * BUYER_PROTECTION_RATE).toFixed(2));
  const platformFee = parseFloat((amount * PLATFORM_FEE_RATE).toFixed(2));
  const total = parseFloat((amount + shippingFee + buyerProtection + platformFee).toFixed(2));

  const placeOrder = async () => {
    setLoading(true);
    setError("");

    const { data: order, error: err } = await supabase.from("orders").insert({
      product_id: productId,
      buyer_id: currentUserId,
      seller_id: sellerId,
      offer_id: offerId ?? null,
      amount,
      protection_fee: buyerProtection + platformFee,
      shipping_fee: shippingFee,
      total,
      status: "paid",
      shipping_mode: shippingMode,
      shipping_address: null,
    }).select("id").single();

    if (err || !order) { setError("Erreur lors de la commande. Réessaie."); setLoading(false); return; }

    await Promise.all([
      supabase.from("products").update({ status: "sold" }).eq("id", productId),
      supabase.from("shipments").insert({ order_id: order.id, mode: shippingMode, status: "pending" }),
      supabase.from("notifications").insert({
        user_id: sellerId,
        type: "order_confirmed",
        title: "Nouvelle commande !",
        body: `"${productTitle}" a été acheté`,
        data: { order_id: order.id, product_id: productId },
      }),
    ]);

    router.push(`/orders/${order.id}`);
  };

  const selectedOption = SHIPPING_OPTIONS.find((o) => o.mode === shippingMode)!;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[600px] bg-[#11111A] rounded-t-3xl p-5 pb-10 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[18px] font-black text-white">Récapitulatif de commande</h2>
            <p className="text-[12px] text-white/35 mt-0.5 truncate max-w-[240px]">{productTitle}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Breakdown */}
        <div className="flex flex-col gap-2 mb-4">
          {/* Article */}
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
            <span className="text-[13px] text-white/65">Article</span>
            <span className="text-[14px] font-bold text-white">{amount.toFixed(2)} €</span>
          </div>

          {/* Livraison — cliquable pour changer */}
          <button
            onClick={() => setShowShippingOptions((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07] active:bg-white/[0.07] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <selectedOption.icon className="w-4 h-4 text-white/40" />
              <div className="text-left">
                <p className="text-[13px] text-white/65">Livraison · {selectedOption.label}</p>
                <p className="text-[11px] text-white/30">{selectedOption.sublabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-bold text-white">{shippingFee.toFixed(2)} €</span>
              {showShippingOptions
                ? <ChevronUp className="w-3.5 h-3.5 text-white/30" />
                : <ChevronDown className="w-3.5 h-3.5 text-white/30" />}
            </div>
          </button>

          {/* Shipping options dropdown */}
          {showShippingOptions && (
            <div className="flex flex-col gap-1.5 pl-2">
              {SHIPPING_OPTIONS.map((opt) => (
                <button
                  key={opt.mode}
                  onClick={() => { setShippingMode(opt.mode); setShowShippingOptions(false); }}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
                    opt.mode === shippingMode
                      ? "bg-[#4CAF50]/10 border-[#4CAF50]/30"
                      : "bg-white/[0.03] border-white/[0.06] active:bg-white/[0.06]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <opt.icon className={cn("w-4 h-4", opt.mode === shippingMode ? "text-[#4CAF50]" : "text-white/35")} />
                    <div className="text-left">
                      <p className={cn("text-[13px] font-semibold", opt.mode === shippingMode ? "text-[#4CAF50]" : "text-white/70")}>{opt.label}</p>
                      <p className="text-[11px] text-white/30">{opt.sublabel}</p>
                    </div>
                  </div>
                  <span className={cn("text-[13px] font-bold", opt.mode === shippingMode ? "text-[#4CAF50]" : "text-white/50")}>
                    {opt.price.toFixed(2)} €
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Protection acheteur */}
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/[0.12]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[13px] text-emerald-300">Protection acheteur (2%)</span>
            </div>
            <span className="text-[13px] font-bold text-emerald-300">+{buyerProtection.toFixed(2)} €</span>
          </div>

          {/* Commission plateforme */}
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[13px] text-white/45">Commission plateforme (5%)</span>
            <span className="text-[13px] font-bold text-white/45">+{platformFee.toFixed(2)} €</span>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between px-4 py-4 rounded-2xl bg-white/[0.07] border border-white/[0.1] mt-1">
            <span className="text-[16px] font-black text-white">Total à payer</span>
            <span className="text-[20px] font-black text-white">{total.toFixed(2)} €</span>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl bg-[#4CAF50]/[0.06] border border-[#4CAF50]/[0.12] mb-4">
          <ShieldCheck className="w-4 h-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
          <p className="text-[11.5px] text-[#4CAF50]/80 leading-relaxed">
            Le prix inclut les frais de protection acheteur et la livraison calculée automatiquement. Paiement sécurisé garanti.
          </p>
        </div>

        {error && <p className="text-[12px] text-red-400 mb-3">{error}</p>}

        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-[#4CAF50] text-[15px] font-bold text-white shadow-lg shadow-[#4CAF50]/20 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? "Traitement en cours…" : `Confirmer & Payer ${total.toFixed(2)} €`}
        </button>
      </div>
    </div>
  );
}