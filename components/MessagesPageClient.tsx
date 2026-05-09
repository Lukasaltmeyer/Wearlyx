"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Bell, ArrowRight, Search } from "lucide-react";
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
        background: "radial-gradient(ellipse at 30% 0%, rgba(139,92,246,0.09) 0%, transparent 50%), radial-gradient(ellipse at 75% 90%, rgba(109,40,217,0.06) 0%, transparent 40%), #07070A",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-black text-white tracking-tight">Messages</h1>
          {unread > 0 && (
            <span
              className="text-[10.5px] font-black px-2.5 py-1 rounded-full text-white"
              style={{
                background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                boxShadow: "0 4px 14px rgba(139,92,246,0.45)",
              }}
            >
              {unread} non lu{unread > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b mx-4 mb-2"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {(["messages", "notifications"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-3 text-[13.5px] font-bold transition-all duration-200 relative capitalize",
              tab === t ? "text-white" : "text-white/28"
            )}
          >
            {t === "messages" ? (
              <span className="flex items-center justify-center gap-1.5">
                Messages
                {unread > 0 && (
                  <span
                    className="w-4 h-4 rounded-full text-[8.5px] font-black text-white flex items-center justify-center"
                    style={{ background: "#8B5CF6" }}
                  >
                    {unread}
                  </span>
                )}
              </span>
            ) : "Notifications"}
            {tab === t && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full"
                style={{ background: "linear-gradient(90deg, #8B5CF6, #A78BFA)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Messages tab */}
      {tab === "messages" && (
        <>
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
              {/* Icon */}
              <div
                className="w-20 h-20 rounded-[24px] flex items-center justify-center mb-6 relative"
                style={{
                  background: "linear-gradient(145deg, rgba(139,92,246,0.12) 0%, rgba(109,40,217,0.06) 100%)",
                  border: "1px solid rgba(139,92,246,0.18)",
                  boxShadow: "0 0 40px rgba(139,92,246,0.12)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-[24px]"
                  style={{ background: "radial-gradient(circle at 50% 30%, rgba(167,139,250,0.12) 0%, transparent 60%)" }}
                />
                <MessageCircle
                  style={{ width: 34, height: 34, color: "#8B5CF6", position: "relative", zIndex: 1 }}
                  strokeWidth={1.5}
                />
              </div>

              <p className="text-[18px] font-black text-white mb-2 tracking-tight">Aucun message</p>
              <p className="text-[13px] text-white/30 leading-relaxed mb-7" style={{ maxWidth: 240 }}>
                Contacte un vendeur ou fais une offre pour démarrer une conversation.
              </p>

              {/* CTAs */}
              <div className="flex flex-col gap-2.5 w-full" style={{ maxWidth: 260 }}>
                <Link
                  href="/search"
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13.5px] font-bold text-white transition-all active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                    boxShadow: "0 6px 22px rgba(139,92,246,0.40), inset 0 1px 0 rgba(255,255,255,0.12)",
                  }}
                >
                  <Search style={{ width: 15, height: 15 }} />
                  Explorer les articles
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>
                <p className="text-[11px] text-white/18 text-center">Tous les messages sont chiffrés</p>
              </div>
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
                    className="flex items-center gap-3.5 px-4 py-3.5 transition-colors relative active:bg-white/[0.02]"
                    style={isUnread ? { background: "rgba(139,92,246,0.035)" } : {}}
                  >
                    {/* Unread accent */}
                    {isUnread && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-10 rounded-r-full"
                        style={{ background: "linear-gradient(180deg, #8B5CF6, #7C3AED)" }}
                      />
                    )}

                    {/* Product thumb + avatar */}
                    <div className="relative flex-shrink-0">
                      {product?.images?.[0] ? (
                        <div
                          className="relative w-12 h-12 rounded-[14px] overflow-hidden"
                          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div
                          className="w-12 h-12 rounded-[14px] flex-shrink-0"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        />
                      )}
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-[#07070A]"
                        style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}
                      >
                        <span className="text-[8px] font-black text-white">
                          {(other?.full_name || other?.username || "?")[0].toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={cn(
                          "text-[13.5px] truncate",
                          isUnread ? "font-black text-white" : "font-semibold text-white/60"
                        )}>
                          {other?.full_name || other?.username}
                        </p>
                        <p className={cn(
                          "text-[10.5px] flex-shrink-0 ml-2",
                          isUnread ? "text-[#A78BFA] font-semibold" : "text-white/18"
                        )}>
                          {timeAgo(conv.last_message_at)}
                        </p>
                      </div>
                      {product && (
                        <p className="text-[11px] font-medium truncate mb-0.5" style={{ color: "rgba(167,139,250,0.55)" }}>
                          {product.title}
                        </p>
                      )}
                      <p className={cn(
                        "text-[12px] truncate",
                        isUnread ? "text-white/55 font-medium" : "text-white/22"
                      )}>
                        {conv.last_message ?? "Nouvelle conversation"}
                      </p>
                    </div>

                    {isUnread && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background: "#8B5CF6",
                          boxShadow: "0 0 8px rgba(139,92,246,0.7)",
                        }}
                      />
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
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <div
            className="w-20 h-20 rounded-[24px] flex items-center justify-center mb-6"
            style={{
              background: "linear-gradient(145deg, rgba(250,204,21,0.08) 0%, rgba(245,158,11,0.04) 100%)",
              border: "1px solid rgba(250,204,21,0.12)",
              boxShadow: "0 0 32px rgba(250,204,21,0.06)",
            }}
          >
            <Bell style={{ width: 34, height: 34, color: "rgba(250,204,21,0.5)" }} strokeWidth={1.5} />
          </div>
          <p className="text-[18px] font-black text-white mb-2 tracking-tight">Aucune notification</p>
          <p className="text-[13px] text-white/25 leading-relaxed" style={{ maxWidth: 220 }}>
            Offres, messages et mises à jour apparaîtront ici.
          </p>

          {/* Suggestions */}
          <div className="mt-8 flex flex-col gap-2.5 w-full" style={{ maxWidth: 280 }}>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Activez les alertes pour</p>
            {["Nouvelles offres reçues", "Messages non lus", "Baisse de prix favoris"].map(t => (
              <div
                key={t}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#8B5CF6" }} />
                <span className="text-[12.5px] text-white/45 font-medium">{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
