"use client";

import { useState } from "react";
import { X, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  productId: string;
  sellerId: string;
  productPrice: number;
  productTitle: string;
  currentUserId: string;
  onClose: () => void;
}

export function OfferModal({ productId, sellerId, productPrice, productTitle, currentUserId, onClose }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const minOffer = Math.ceil(productPrice * 0.6 * 100) / 100;
  const parsed = parseFloat(amount.replace(",", "."));
  const isValid = !isNaN(parsed) && parsed >= minOffer && parsed < productPrice;
  const discount = isValid ? Math.round((1 - parsed / productPrice) * 100) : 0;

  const submit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError("");

    // Insert offer
    await supabase.from("offers").insert({
      product_id: productId,
      buyer_id: currentUserId,
      seller_id: sellerId,
      amount: parsed,
      message: message.trim() || null,
    });

    // Get offer ID back (query after insert to avoid RLS select issues)
    const { data: offerRow } = await supabase
      .from("offers")
      .select("id")
      .eq("product_id", productId)
      .eq("buyer_id", currentUserId)
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Find or create conversation between buyer and seller for this product
    let convId: string | null = null;
    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id")
      .eq("product_id", productId)
      .eq("buyer_id", currentUserId)
      .eq("seller_id", sellerId)
      .maybeSingle();

    if (existingConv) {
      convId = existingConv.id;
    } else {
      const { data: newConv } = await supabase
        .from("conversations")
        .insert({ product_id: productId, buyer_id: currentUserId, seller_id: sellerId })
        .select("id")
        .single();
      convId = newConv?.id ?? null;
    }

    if (convId) {
      const offerContent = `__OFFER__:${JSON.stringify({
        id: offerRow?.id ?? "unknown",
        amount: parsed,
        title: productTitle,
        buyerId: currentUserId,
        status: "pending",
      })}`;
      await supabase.from("messages").insert({
        conversation_id: convId,
        sender_id: currentUserId,
        content: offerContent,
      });
      // Update conversation preview
      await supabase
        .from("conversations")
        .update({
          last_message: `💰 Offre de ${parsed.toFixed(2)} €`,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", convId);
    }

    // In-app notification
    await supabase.from("notifications").insert({
      user_id: sellerId,
      type: "offer_received",
      title: "Nouvelle offre reçue",
      body: `Offre de ${parsed.toFixed(2)}€ sur "${productTitle}"`,
      data: { product_id: productId, conversation_id: convId },
    }).then(undefined, () => {});

    // Push notification — redirect to conversation
    fetch("/api/push/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toUserId: sellerId,
        title: "💰 Nouvelle offre reçue",
        body: `${parsed.toFixed(2)} € sur "${productTitle}"`,
        url: convId ? `/messages/${convId}` : `/sales?tab=offres`,
        tag: `offer-${offerRow?.id ?? "new"}`,
      }),
    }).then(undefined, () => {});

    setSuccess(true);
    setLoading(false);

    // Navigate to conversation
    setTimeout(() => {
      onClose();
      if (convId) {
        router.push(`/messages/${convId}`);
      } else {
        router.refresh();
      }
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[600px] bg-[#12121C] rounded-t-3xl p-6 pb-10 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[18px] font-black text-white">Faire une offre</h2>
            <p className="text-[12px] text-white/40 mt-0.5">Prix demandé : {productPrice.toFixed(2)} €</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="w-14 h-14 rounded-full bg-[#4CAF50]/20 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-white font-bold">Offre envoyée !</p>
            <p className="text-white/40 text-[13px]">Redirection vers la conversation…</p>
          </div>
        ) : (
          <>
            {/* Amount input */}
            <div className="mb-4">
              <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2 block">Ton offre (€)</label>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/6 border border-white/10 focus-within:border-[#6C63FF]/50">
                <Tag className="w-4 h-4 text-white/30 flex-shrink-0" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Min ${minOffer.toFixed(2)} €`}
                  className="flex-1 bg-transparent text-[18px] font-bold text-white outline-none placeholder-white/20"
                />
                {isValid && (
                  <span className="text-[12px] font-bold text-[#4CAF50] flex-shrink-0">-{discount}%</span>
                )}
              </div>
              <p className="text-[11px] text-white/25 mt-1.5">Minimum : {minOffer.toFixed(2)} € (60% du prix)</p>
              {amount && !isValid && (
                <p className="text-[11px] text-red-400 mt-1">
                  {parseFloat(amount) >= productPrice
                    ? "L'offre doit être inférieure au prix"
                    : `Offre minimum : ${minOffer.toFixed(2)} €`}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="mb-5">
              <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2 block">Message (optionnel)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explique ta proposition au vendeur..."
                rows={2}
                className="w-full px-4 py-3 rounded-2xl bg-white/6 border border-white/10 text-[14px] text-white placeholder-white/20 outline-none resize-none focus:border-[#6C63FF]/50"
              />
            </div>

            {error && <p className="text-[12px] text-red-400 mb-3">{error}</p>}

            <button
              onClick={submit}
              disabled={!isValid || loading}
              className={cn(
                "w-full py-4 rounded-2xl text-[15px] font-bold text-white transition-all",
                isValid && !loading
                  ? "bg-[#6C63FF] shadow-lg shadow-[#6C63FF]/25 active:scale-[0.98]"
                  : "bg-white/10 opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? "Envoi..." : `Envoyer l'offre — ${isValid ? parsed.toFixed(2) : "0.00"} €`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
