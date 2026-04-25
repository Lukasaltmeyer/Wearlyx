"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { MessageCircle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";

interface Props {
  conversations: any[];
  currentUserId: string;
}

export function MessagesPageClient({ conversations, currentUserId }: Props) {
  const [tab, setTab] = useState<"messages" | "notifications">("messages");

  return (
    <div className="min-h-[100dvh] bg-[#08080F] pb-24">
      {/* Header */}
      <div className="px-4 pt-5 pb-0">
        <h1 className="text-[22px] font-black text-white mb-4">Messages</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/8">
        <button
          onClick={() => setTab("messages")}
          className={cn("flex-1 py-3 text-[14px] font-bold transition-all relative", tab === "messages" ? "text-white" : "text-white/35")}
        >
          Messages
          {tab === "messages" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4A90E2] rounded-full" />}
        </button>
        <button
          onClick={() => setTab("notifications")}
          className={cn("flex-1 py-3 text-[14px] font-bold transition-all relative", tab === "notifications" ? "text-white" : "text-white/35")}
        >
          Notifications
          {tab === "notifications" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4A90E2] rounded-full" />}
        </button>
      </div>

      {/* Messages tab */}
      {tab === "messages" && (
        <>
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, rgba(108,58,237,0.15), rgba(192,38,211,0.1))", border: "1px solid rgba(108,58,237,0.2)" }}>
                <MessageCircle className="w-9 h-9" style={{ color: "#a78bfa" }} />
              </div>
              <p className="text-[17px] font-black text-white mb-1.5">Aucun message</p>
              <p className="text-[13px] text-white/35 leading-relaxed max-w-[240px]">
                Contacte un vendeur sur un article qui t'intéresse pour démarrer une conversation.
              </p>
              <Link href="/search"
                className="mt-5 flex items-center gap-2 px-5 py-3 rounded-2xl text-[13px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #6C3AED, #C026D3)" }}>
                Explorer les articles
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
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
                        <div className="w-12 h-12 rounded-xl bg-white/8 flex-shrink-0" />
                      )}
                      {/* Avatar overlay */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#4CAF50] flex items-center justify-center border-2 border-[#08080F]">
                        <span className="text-[9px] font-black text-white">
                          {(other?.full_name || other?.username || "?")[0].toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white text-[14px]">{other?.full_name || other?.username}</p>
                        <p className="text-[11px] text-white/30 flex-shrink-0 ml-2">{timeAgo(conv.last_message_at)}</p>
                      </div>
                      {product && <p className="text-[11px] text-[#6C63FF] font-medium mt-0.5 truncate">{product.title}</p>}
                      <p className="text-[13px] text-white/40 truncate mt-0.5">{conv.last_message ?? "Nouvelle conversation"}</p>
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
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,191,36,0.07))", border: "1px solid rgba(245,158,11,0.18)" }}>
            <Bell className="w-9 h-9 text-amber-400/60" />
          </div>
          <p className="text-[17px] font-black text-white mb-1.5">Aucune notification</p>
          <p className="text-[13px] text-white/35 leading-relaxed max-w-[220px]">
            Offres, messages et mises à jour apparaîtront ici.
          </p>
        </div>
      )}
    </div>
  );
}
