"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Bell, Search, Lock } from "lucide-react";
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
      className="min-h-[100dvh] pb-8 relative overflow-hidden"
    >
      {/* Ambient orbs */}
      <div className="absolute pointer-events-none animate-orb"
        style={{ top: -100, left: "30%", transform: "translateX(-50%)", width: 380, height: 380,
          background: "radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 65%)", filter: "blur(50px)" }} />
      <div className="absolute pointer-events-none animate-orb-r"
        style={{ top: "60%", right: -80, width: 260, height: 260,
          background: "radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* Header */}
      <div className="relative z-10 px-4 pt-7 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-[26px] font-black text-white tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Messages
          </h1>
          {unread > 0 && (
            <span
              className="text-[11px] font-black px-3 py-1.5 rounded-full text-white"
              style={{
                background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                boxShadow: "0 4px 16px rgba(139,92,246,0.45), 0 1px 0 rgba(255,255,255,0.12) inset",
              }}
            >
              {unread} non lu{unread > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="relative z-10 flex mx-4 mb-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        {(["messages", "notifications"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-3 text-[13.5px] font-bold transition-all duration-200 relative capitalize",
              tab === t ? "text-white" : "text-white/25"
            )}
          >
            {t === "messages" ? (
              <span className="flex items-center justify-center gap-1.5">
                Messages
                {unread > 0 && (
                  <span
                    className="w-4 h-4 rounded-full text-[8px] font-black text-white flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                      boxShadow: "0 0 8px rgba(139,92,246,0.5)" }}
                  >
                    {unread}
                  </span>
                )}
              </span>
            ) : "Notifications"}
            {tab === t && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full animate-tab-in"
                style={{ width: 28, background: "linear-gradient(90deg, #8B5CF6, #C4B5FD)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Messages tab */}
      {tab === "messages" && (
        <div className="relative z-10">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              {/* Icon */}
              <div className="relative mb-6">
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(109,40,217,0.20) 0%, transparent 70%)", filter: "blur(32px)", transform: "scale(2)" }} />
                <div
                  className="relative w-[72px] h-[72px] rounded-[22px] flex items-center justify-center overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, rgba(124,58,237,0.13) 0%, rgba(109,40,217,0.06) 100%)",
                    border: "1px solid rgba(124,58,237,0.18)",
                    boxShadow: "0 8px 36px rgba(109,40,217,0.14), 0 1px 0 rgba(255,255,255,0.07) inset",
                  }}
                >
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(circle at 42% 28%, rgba(167,139,250,0.12) 0%, transparent 58%)" }} />
                  <MessageCircle
                    style={{ width: 30, height: 30, color: "rgba(167,139,250,0.60)", position: "relative", zIndex: 1 }}
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              <p className="text-[18px] font-black text-white mb-2 tracking-tight" style={{ letterSpacing: "-0.03em" }}>
                Aucun message
              </p>
              <p className="text-[12.5px] leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.25)", maxWidth: 230 }}>
                Contacte un vendeur ou fais une offre pour démarrer une conversation.
              </p>

              {/* CTA */}
              <Link
                href="/search"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-[14px] text-[13px] font-semibold text-white transition-all active:scale-[0.97] relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.85) 0%, rgba(109,40,217,0.85) 100%)",
                  boxShadow: "0 6px 24px rgba(109,40,217,0.30), 0 1px 0 rgba(255,255,255,0.12) inset",
                  border: "1px solid rgba(167,139,250,0.18)",
                }}
              >
                <Search style={{ width: 14, height: 14, position: "relative", zIndex: 1 }} />
                <span className="relative z-10">Explorer les articles</span>
              </Link>
              <div className="flex items-center justify-center gap-1.5 mt-4">
                <Lock style={{ width: 9, height: 9, color: "rgba(255,255,255,0.15)" }} />
                <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.15)" }}>
                  Messages chiffrés de bout en bout
                </p>
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
                    className="flex items-center gap-3.5 px-4 py-4 transition-all relative active:bg-white/[0.025]"
                    style={isUnread ? { background: "rgba(139,92,246,0.04)" } : {}}
                  >
                    {/* Unread accent */}
                    {isUnread && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-r-full"
                        style={{ background: "linear-gradient(180deg, #A78BFA, #7C3AED)" }}
                      />
                    )}

                    {/* Product thumb + avatar */}
                    <div className="relative flex-shrink-0">
                      {product?.images?.[0] ? (
                        <div
                          className="relative w-[50px] h-[50px] rounded-[15px] overflow-hidden"
                          style={{ border: "1px solid rgba(255,255,255,0.09)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
                        >
                          <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div
                          className="w-[50px] h-[50px] rounded-[15px] flex-shrink-0"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        />
                      )}
                      <div
                        className="absolute -bottom-1 -right-1 w-[22px] h-[22px] rounded-full flex items-center justify-center ring-2 ring-[#07070A]"
                        style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                          boxShadow: "0 2px 6px rgba(139,92,246,0.5)" }}
                      >
                        <span className="text-[8.5px] font-black text-white">
                          {(other?.full_name || other?.username || "?")[0].toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={cn(
                          "text-[13.5px] truncate",
                          isUnread ? "font-black text-white" : "font-semibold text-white/55"
                        )}>
                          {other?.full_name || other?.username}
                        </p>
                        <p className={cn(
                          "text-[10.5px] flex-shrink-0 ml-2",
                          isUnread ? "font-semibold" : "text-white/18"
                        )}
                          style={isUnread ? { color: "#A78BFA" } : {}}>
                          {timeAgo(conv.last_message_at)}
                        </p>
                      </div>
                      {product && (
                        <p className="text-[11px] font-semibold truncate mb-0.5" style={{ color: "rgba(167,139,250,0.5)" }}>
                          {product.title}
                        </p>
                      )}
                      <p className={cn(
                        "text-[12px] truncate",
                        isUnread ? "font-medium text-white/50" : "text-white/20"
                      )}>
                        {conv.last_message ?? "Nouvelle conversation"}
                      </p>
                    </div>

                    {isUnread && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background: "#8B5CF6",
                          boxShadow: "0 0 6px rgba(139,92,246,0.45)",
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Notifications tab */}
      {tab === "notifications" && (
        <div className="relative z-10 flex flex-col items-center justify-center py-20 px-8 text-center">
          <div
            className="w-[84px] h-[84px] rounded-[26px] flex items-center justify-center mb-7 relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(250,204,21,0.09) 0%, rgba(245,158,11,0.04) 100%)",
              border: "1px solid rgba(250,204,21,0.14)",
              boxShadow: "0 0 40px rgba(250,204,21,0.07), 0 1px 0 rgba(255,255,255,0.06) inset",
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 25%, rgba(250,204,21,0.12) 0%, transparent 60%)" }} />
            <Bell style={{ width: 36, height: 36, color: "rgba(250,204,21,0.45)" }} strokeWidth={1.5} />
          </div>
          <p className="text-[19px] font-black text-white mb-2 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Aucune notification
          </p>
          <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.25)", maxWidth: 220 }}>
            Offres, messages et mises à jour apparaîtront ici.
          </p>

          <div className="mt-9 flex flex-col gap-2 w-full" style={{ maxWidth: 280 }}>
            <p className="text-[9.5px] font-black uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.18)" }}>
              Activez les alertes pour
            </p>
            {["Nouvelles offres reçues", "Messages non lus", "Baisse de prix favoris"].map((t, i) => (
              <div
                key={t}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl animate-fade-up"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#8B5CF6", boxShadow: "0 0 6px rgba(139,92,246,0.6)" }} />
                <span className="text-[12.5px] font-medium" style={{ color: "rgba(255,255,255,0.42)" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
