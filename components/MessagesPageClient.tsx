"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Bell, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";

interface Props {
  conversations: any[];
  currentUserId: string;
}

export function MessagesPageClient({ conversations, currentUserId }: Props) {
  const [tab, setTab] = useState<"messages" | "notifications">("messages");
  const unread = conversations.filter(c => !c.read && c.last_message_sender_id !== currentUserId).length;

  return (
    <div
      className="min-h-[100dvh] pb-24"
      style={{
        background: "radial-gradient(ellipse at 30% 0%, rgba(139,92,246,0.1) 0%, transparent 45%), radial-gradient(ellipse at 70% 80%, rgba(109,40,217,0.07) 0%, transparent 40%), #07070A",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-black text-white">Messages</h1>
          {unread > 0 && (
            <span
              className="text-[11px] font-black px-2.5 py-1 rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 12px rgba(139,92,246,0.4)" }}
            >
              {unread} non lu{unread > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b mx-4 mb-0"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <button
          onClick={() => setTab("messages")}
          className={cn("flex-1 py-3 text-[14px] font-bold transition-all relative", tab === "messages" ? "text-white" : "text-white/30")}
        >
          <span className="flex items-center justify-center gap-1.5">
            Messages
            {unread > 0 && (
              <span className="w-4 h-4 rounded-full text-[9px] font-black text-white flex items-center justify-center"
                style={{ background: "#8B5CF6" }}>{unread}</span>
            )}
          </span>
          {tab === "messages" && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full"
              style={{ background: "linear-gradient(90deg, #8B5CF6, #A78BFA)" }} />
          )}
        </button>
        <button
          onClick={() => setTab("notifications")}
          className={cn("flex-1 py-3 text-[14px] font-bold transition-all relative", tab === "notifications" ? "text-white" : "text-white/30")}
        >
          Notifications
          {tab === "notifications" && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full"
              style={{ background: "linear-gradient(90deg, #8B5CF6, #A78BFA)" }} />
          )}
        </button>
      </div>

      {/* Messages tab */}
      {tab === "messages" && (
        <>
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.15)",
                  boxShadow: "0 0 32px rgba(139,92,246,0.1)",
                }}
              >
                <MessageCircle className="w-9 h-9 text-[#8B5CF6]/60" />
              </div>
              <p className="text-[18px] font-black text-white mb-2">Aucun message</p>
              <p className="text-[13px] text-white/30 leading-relaxed max-w-[240px] mb-6">
                Fais une offre ou contacte un vendeur pour démarrer une conversation.
              </p>
              <Link href="/search"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-bold text-white active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.35)" }}>
                <Sparkles className="w-4 h-4" />
                Explorer les articles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-0 mt-1">
              {conversations.map((conv) => {
                const other = conv.buyer_id === currentUserId ? conv.seller : conv.buyer;
                const product = conv.product;
                const isUnread = !conv.read && conv.last_message_sender_id !== currentUserId;

                return (
                  <Link
                    key={conv.id}
                    href={`/messages/${conv.id}`}
                    className="flex items-center gap-3.5 px-4 py-3.5 transition-all active:bg-white/3 relative"
                    style={isUnread ? { background: "rgba(139,92,246,0.04)" } : {}}
                  >
                    {isUnread && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                        style={{ background: "linear-gradient(180deg, #8B5CF6, #7C3AED)" }} />
                    )}
                    <div className="relative flex-shrink-0">
                      {product?.images?.[0] ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden"
                          style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                          <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl flex-shrink-0"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-[#07070A]"
                        style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
                        <span className="text-[8px] font-black text-white">
                          {(other?.full_name || other?.username || "?")[0].toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={cn("text-[14px] truncate", isUnread ? "font-black text-white" : "font-semibold text-white/65")}>
                          {other?.full_name || other?.username}
                        </p>
                        <p className={cn("text-[11px] flex-shrink-0 ml-2", isUnread ? "text-[#A78BFA] font-semibold" : "text-white/20")}>
                          {timeAgo(conv.last_message_at)}
                        </p>
                      </div>
                      {product && (
                        <p className="text-[11px] font-medium truncate mb-0.5" style={{ color: "rgba(167,139,250,0.6)" }}>
                          {product.title}
                        </p>
                      )}
                      <p className={cn("text-[12.5px] truncate", isUnread ? "text-white/55 font-medium" : "text-white/25")}>
                        {conv.last_message ?? "Nouvelle conversation"}
                      </p>
                    </div>
                    {isUnread && (
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #8B5CF6, #A78BFA)", boxShadow: "0 0 8px rgba(139,92,246,0.6)" }} />
                    )}
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
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: "rgba(250,204,21,0.06)",
              border: "1px solid rgba(250,204,21,0.12)",
              boxShadow: "0 0 24px rgba(250,204,21,0.06)",
            }}
          >
            <Bell className="w-9 h-9 text-amber-400/50" />
          </div>
          <p className="text-[18px] font-black text-white mb-2">Aucune notification</p>
          <p className="text-[13px] text-white/25 leading-relaxed max-w-[220px]">
            Offres, messages et mises à jour apparaîtront ici.
          </p>
        </div>
      )}
    </div>
  );
}
