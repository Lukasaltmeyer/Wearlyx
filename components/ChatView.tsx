"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Send, Package, Check, X, RefreshCw } from "lucide-react";
import type { Conversation, Message } from "@/types/database";
import { Avatar } from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase/client";
import { timeAgo, cn } from "@/lib/utils";

interface ChatViewProps {
  conversation: Conversation;
  initialMessages: Message[];
  currentUserId: string;
}

const QUICK_REPLIES = [
  "Toujours dispo ?",
  "Je prends !",
  "Dernier prix ?",
  "Livraison possible ?",
  "Tu acceptes une offre ?",
];

// ─── Offer data embedded in message content ───────────────────────────────────
interface OfferData {
  id: string;
  amount: number;
  title: string;
  buyerId: string;
  status: "pending" | "accepted" | "declined" | "countered";
}

function parseOffer(content: string): OfferData | null {
  if (!content.startsWith("__OFFER__:")) return null;
  try {
    return JSON.parse(content.slice("__OFFER__:".length));
  } catch {
    return null;
  }
}

function parseSystem(content: string): string | null {
  if (!content.startsWith("__SYSTEM__:")) return null;
  return content.slice("__SYSTEM__:".length);
}

// ─── Offer card ───────────────────────────────────────────────────────────────
function OfferCard({
  offer,
  isMine,
  onAction,
}: {
  offer: OfferData;
  isMine: boolean;
  onAction: (offerId: string, action: "accepted" | "declined", counterAmount?: number) => Promise<void>;
}) {
  const [loading, setLoading] = useState<"accepted" | "declined" | "counter" | null>(null);
  const [showCounter, setShowCounter] = useState(false);
  const [counterAmount, setCounterAmount] = useState("");
  const isSeller = !isMine; // seller sees the offer sent by buyer

  const handle = async (action: "accepted" | "declined", amount?: number) => {
    setLoading(action);
    await onAction(offer.id, action, amount);
    setLoading(null);
    setShowCounter(false);
  };

  const statusColors: Record<string, string> = {
    accepted: "border-emerald-500/30 bg-emerald-500/8",
    declined: "border-red-500/30 bg-red-500/8",
    pending: "border-[#22C55E]/30 bg-[#22C55E]/8",
    countered: "border-amber-500/30 bg-amber-500/8",
  };

  const statusLabels: Record<string, string> = {
    accepted: "✓ Offre acceptée",
    declined: "✗ Offre refusée",
    pending: "⏳ En attente",
    countered: "↩ Contre-offre",
  };

  return (
    <div className={cn("rounded-2xl border p-4 max-w-[280px] w-full", statusColors[offer.status] ?? statusColors.pending)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-[#22C55E]/25 flex items-center justify-center text-[14px]">💰</div>
        <div>
          <p className="text-[11px] text-white/40 font-medium">Offre d'achat</p>
          <p className="text-[10px] text-white/25 truncate max-w-[180px]">{offer.title}</p>
        </div>
      </div>

      {/* Amount */}
      <p className="text-[26px] font-black text-white leading-none mb-1">
        {offer.amount.toFixed(2)} €
      </p>

      {/* Status */}
      {offer.status !== "pending" && (
        <p className={cn("text-[12px] font-bold mt-2", {
          "text-emerald-400": offer.status === "accepted",
          "text-red-400": offer.status === "declined",
          "text-amber-400": offer.status === "countered",
        })}>
          {statusLabels[offer.status]}
        </p>
      )}

      {/* Actions — only shown to seller when pending */}
      {isSeller && offer.status === "pending" && (
        <div className="mt-3 space-y-2">
          {!showCounter ? (
            <div className="flex gap-2">
              <button
                onClick={() => handle("accepted")}
                disabled={!!loading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[12px] font-bold active:scale-95 transition-all disabled:opacity-50"
              >
                {loading === "accepted"
                  ? <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin" />
                  : <><Check className="w-3 h-3" /> Accepter</>}
              </button>
              <button
                onClick={() => handle("declined")}
                disabled={!!loading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-[12px] font-bold active:scale-95 transition-all disabled:opacity-50"
              >
                {loading === "declined"
                  ? <span className="w-3.5 h-3.5 rounded-full border-2 border-red-400/30 border-t-red-400 animate-spin" />
                  : <><X className="w-3 h-3" /> Refuser</>}
              </button>
            </div>
          ) : null}
          <button
            onClick={() => setShowCounter((v) => !v)}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-[12px] font-semibold active:scale-95 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            {showCounter ? "Annuler" : "Proposer un autre prix"}
          </button>
          {showCounter && (
            <div className="flex gap-2 items-center mt-1">
              <input
                type="number"
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                placeholder="Montant €"
                className="flex-1 px-3 py-2 rounded-xl bg-white/6 border border-white/10 text-[13px] text-white outline-none focus:border-[#22C55E]/50 placeholder-white/20"
              />
              <button
                onClick={() => {
                  const amt = parseFloat(counterAmount.replace(",", "."));
                  if (!isNaN(amt) && amt > 0) handle("declined", amt);
                }}
                disabled={!!loading || !counterAmount}
                className="px-3 py-2 rounded-xl bg-[#22C55E] text-white text-[12px] font-bold active:scale-95 disabled:opacity-40"
              >
                Envoyer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Buyer sees waiting state */}
      {isMine && offer.status === "pending" && (
        <p className="text-[11px] text-white/30 mt-2 font-medium">En attente de réponse du vendeur…</p>
      )}
    </div>
  );
}

// ─── Main ChatView ────────────────────────────────────────────────────────────
export function ChatView({ conversation, initialMessages, currentUserId }: ChatViewProps) {
  const router = useRouter();
  const supabase = createClient();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(initialMessages.length === 0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const other = conversation.buyer_id === currentUserId ? conversation.seller : conversation.buyer;
  const product = conversation.product as any;
  const otherId = conversation.buyer_id === currentUserId ? conversation.seller_id : conversation.buyer_id;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversation.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversation.id}`,
      }, async (payload) => {
        if (payload.new.sender_id !== currentUserId) {
          const { data: msgWithSender } = await supabase
            .from("messages")
            .select("*, sender:profiles(id, username, full_name, avatar_url)")
            .eq("id", payload.new.id)
            .single();
          if (msgWithSender) setMessages((prev) => [...prev, msgWithSender]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversation.id, currentUserId]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    setInput("");
    setShowQuickReplies(false);
    setSending(true);

    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: conversation.id,
      sender_id: currentUserId,
      content,
      read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: currentUserId,
      content,
    });

    fetch("/api/push/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toUserId: otherId,
        title: "💬 Nouveau message",
        body: content.length > 60 ? content.slice(0, 60) + "…" : content,
        url: `/messages/${conversation.id}`,
        tag: `msg-${conversation.id}`,
      }),
    }).then(undefined, () => {});

    setSending(false);
  };

  const handleOfferAction = useCallback(async (
    offerId: string,
    action: "accepted" | "declined",
    counterAmount?: number,
  ) => {
    // Update offer status in DB
    await supabase.from("offers").update({ status: action }).eq("id", offerId);

    let systemText = "";
    if (action === "accepted") {
      systemText = "✅ Offre acceptée ! Passez à l'étape de paiement.";
    } else if (counterAmount) {
      systemText = `↩ Contre-offre : ${counterAmount.toFixed(2)} €`;
    } else {
      systemText = "❌ Offre refusée.";
    }

    // Insert system message
    const sysContent = `__SYSTEM__:${systemText}`;
    const { data: sysMsg } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        sender_id: currentUserId,
        content: sysContent,
      })
      .select("*, sender:profiles(id, username, full_name, avatar_url)")
      .single();

    if (sysMsg) setMessages((prev) => [...prev, sysMsg]);

    // Update local offer status in messages state
    setMessages((prev) =>
      prev.map((m) => {
        const o = parseOffer(m.content);
        if (o && o.id === offerId) {
          const updated = { ...o, status: counterAmount ? "countered" as const : action };
          return { ...m, content: `__OFFER__:${JSON.stringify(updated)}` };
        }
        return m;
      })
    );

    // Push notif to buyer
    fetch("/api/push/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toUserId: otherId,
        title: action === "accepted" ? "🎉 Offre acceptée !" : counterAmount ? "↩ Contre-offre reçue" : "❌ Offre refusée",
        body: systemText,
        url: `/messages/${conversation.id}`,
        tag: `offer-resp-${offerId}`,
      }),
    }).then(undefined, () => {});
  }, [conversation.id, currentUserId, otherId, supabase]);

  return (
    <div className="flex flex-col h-[100dvh] bg-[#08080F]">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 pt-5 flex-shrink-0 border-b border-white/6"
        style={{ background: "rgba(8,8,15,0.97)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white active:scale-95 transition-all -ml-1"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="relative flex-shrink-0">
          <Avatar src={(other as any)?.avatar_url} name={(other as any)?.full_name || (other as any)?.username} size="sm" />
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#08080F]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-[15px] leading-tight truncate">
            {(other as any)?.full_name || (other as any)?.username}
          </p>
          <p className="text-[11px] text-white/30">Membre Wearlyx</p>
        </div>
      </div>

      {/* Product reference */}
      {product && (
        <Link
          href={`/products/${product.id}`}
          className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5 active:bg-white/3 transition-colors"
          style={{ background: "rgba(34,197,94,0.07)" }}
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
            {product.images?.[0] ? (
              <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5">
                <Package className="w-4 h-4 text-white/20" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white/60 truncate">{product.title}</p>
            <p className="text-[13px] text-[#4ADE80] font-black">{product.price} €</p>
          </div>
          <ChevronLeft className="w-4 h-4 text-white/20 rotate-180 flex-shrink-0" />
        </Link>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-2xl mb-3 flex items-center justify-center border border-white/8 bg-white/4 overflow-hidden">
              <Avatar src={(other as any)?.avatar_url} name={(other as any)?.full_name} size="sm" />
            </div>
            <p className="text-[13px] text-white/40 font-semibold">Démarre la conversation</p>
            <p className="text-[11px] text-white/20 mt-1">Utilise une réponse rapide ci-dessous</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMine = msg.sender_id === currentUserId;
          const prevMsg = messages[i - 1];
          const nextMsg = messages[i + 1];
          const showTime = !prevMsg || new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() > 300000;
          const isLastInGroup = !nextMsg || nextMsg.sender_id !== msg.sender_id;
          const isFirstInGroup = !prevMsg || prevMsg.sender_id !== msg.sender_id;

          const offerData = parseOffer(msg.content);
          const systemText = parseSystem(msg.content);

          return (
            <div key={msg.id}>
              {showTime && (
                <div className="flex justify-center my-4">
                  <span className="text-[10px] text-white/20 bg-white/4 px-3 py-1 rounded-full border border-white/6">
                    {timeAgo(msg.created_at)}
                  </span>
                </div>
              )}

              {/* System message */}
              {systemText && (
                <div className="flex justify-center my-3">
                  <span className="text-[12px] text-white/50 bg-white/5 border border-white/8 px-4 py-2 rounded-2xl font-medium text-center max-w-[280px]">
                    {systemText}
                  </span>
                </div>
              )}

              {/* Offer card */}
              {offerData && (
                <div className={cn("flex mt-2", isMine ? "justify-end" : "justify-start")}>
                  <OfferCard
                    offer={offerData}
                    isMine={isMine}
                    onAction={handleOfferAction}
                  />
                </div>
              )}

              {/* Regular text message */}
              {!offerData && !systemText && (
                <div className={cn(
                  "flex items-end gap-2",
                  isMine ? "justify-end" : "justify-start",
                  isFirstInGroup ? "mt-2" : "mt-0.5"
                )}>
                  {!isMine && (
                    <div className="w-6 flex-shrink-0">
                      {isLastInGroup && (
                        <Avatar src={(msg.sender as any)?.avatar_url} name={(msg.sender as any)?.full_name} size="xs" />
                      )}
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[78%] px-3.5 py-2.5 text-[14px] leading-relaxed",
                      isMine
                        ? cn("rounded-2xl text-white", isLastInGroup ? "rounded-br-sm" : "")
                        : cn("rounded-2xl text-white/90 border border-white/7", isLastInGroup ? "rounded-bl-sm" : ""),
                      msg.id.startsWith("temp-") && "opacity-60"
                    )}
                    style={isMine
                      ? { background: "linear-gradient(135deg, #22C55E, #22C55E)" }
                      : { background: "rgba(255,255,255,0.07)" }
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {showQuickReplies && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar animate-fadeIn">
          {QUICK_REPLIES.map((r) => (
            <button
              key={r}
              onClick={() => sendMessage(r)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold text-[#4ADE80] border border-[#22C55E]/35 bg-[#22C55E]/8 active:scale-95 transition-all whitespace-nowrap"
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="px-4 py-3 flex-shrink-0 border-t border-white/5"
        style={{ background: "rgba(8,8,15,0.98)" }}
      >
        <div className="flex items-center gap-2.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => messages.length === 0 && setShowQuickReplies(true)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Écris un message…"
            className="flex-1 bg-white/6 border border-white/8 rounded-2xl px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-[#22C55E]/50 transition-all"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || sending}
            className={cn(
              "w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95",
              input.trim() ? "text-white shadow-lg shadow-[#22C55E]/25" : "bg-white/5 text-white/20"
            )}
            style={input.trim() ? { background: "linear-gradient(135deg, #22C55E, #16A34A)" } : {}}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
