"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Bell, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";

interface Props {
  conversations: any[];
  currentUserId: string;
}

export function MessagesPageClient({ conversations, currentUserId }: Props) {
  const [tab, setTab] = useState<"messages" | "notifications">("messages");

  return (
    <div className="min-h-[100dvh] bg-[#0B0B0F] pb-24">
      {/* Header */}
      <div className="px-4 pt-5 pb-0">
        <h1 className="text-[22px] font-black text-white mb-4">Messages</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/6">
        <button
          onClick={() => setTab("messages")}
          className={cn("flex-1 py-3 text-[14px] font-bold transition-all relative", tab === "messages" ? "text-white" : "text-white/30")}
        >
          Messages
          {tab === "messages" && <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full" style={{ background: "#22C55E" }} />}
        </button>
        <button
          onClick={() => setTab("notifications")}
          className={cn("flex-1 py-3 text-[14px] font-bold transition-all relative", tab === "notifications" ? "text-white" : "text-white/30")}
        >
          Notifications
          {tab === "notifications" && <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full" style={{ background: "#22C55E" }} />}
        </button>
      </div>

      {/* Messages tab */}
      {tab === "messages" && (
        <>
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="relative w-24 h-24 mb-5">
                <div className="absolute inset-0 rounded-3xl"
                  style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))", border: "1px solid rgba(34,197,94,0.15)" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageCircle className="w-10 h-10" style={{ color: "#22C55E" }} />
                </div>
              </div>
              <p className="text-[18px] font-black text-white mb-2">Aucun message</p>
              <p className="text-[13px] text-white/35 leading-relaxed max-w-[240px] mb-6">
                Fais une offre ou contacte un vendeur pour démarrer une conversation.
              </p>
              <Link href="/search"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-bold text-white active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)", boxShadow: "0 4px 16px rgba(34,197,94,0.25)" }}>
                Explorer les articles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/4">
              {conversations.map((conv) => {
                const other = conv.buyer_id === currentUserId ? conv.seller : conv.buyer;
                const product = conv.product;
                return (
                  <Link key={conv.id} href={`/messages/${conv.id}`}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/3 active:bg-white/5 transition-colors">
                    <div className="relative flex-shrink-0">
                      {product?.images?.[0] ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                          <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-white/6 flex-shrink-0" />
                      )}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#0B0B0F]"
                        style={{ background: "#22C55E" }}>
                        <span className="text-[9px] font-black text-white">
                          {(other?.full_name || other?.username || "?")[0].toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white text-[14px]">{other?.full_name || other?.username}</p>
                        <p className="text-[11px] text-white/25 flex-shrink-0 ml-2">{timeAgo(conv.last_message_at)}</p>
                      </div>
                      {product && <p className="text-[11px] font-semibold mt-0.5 truncate" style={{ color: "#22C55E" }}>{product.title}</p>}
                      <p className="text-[13px] text-white/35 truncate mt-0.5">{conv.last_message ?? "Nouvelle conversation"}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Notifications tab */}
      {tab === "notifications" && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="relative w-24 h-24 mb-5">
            <div className="absolute inset-0 rounded-3xl"
              style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.1), rgba(250,204,21,0.04))", border: "1px solid rgba(250,204,21,0.15)" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Bell className="w-10 h-10 text-amber-400/70" />
            </div>
          </div>
          <p className="text-[18px] font-black text-white mb-2">Aucune notification</p>
          <p className="text-[13px] text-white/35 leading-relaxed max-w-[220px]">
            Offres, messages et mises à jour apparaîtront ici.
          </p>
        </div>
      )}
    </div>
  );
}
