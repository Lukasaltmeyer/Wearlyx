"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, Send, MoreHorizontal, Phone, Video, Info,
  Image as ImageIcon, Smile, MessageSquare,
  ShoppingBag, ArrowRight, Star, Package, Lock
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Conversation {
  id: string;
  product?: { id: string; title: string; images?: string[]; price?: number } | null;
  buyer?: { id: string; username: string | null; full_name: string | null; avatar_url: string | null } | null;
  seller?: { id: string; username: string | null; full_name: string | null; avatar_url: string | null } | null;
  last_message?: string | null;
  last_message_at?: string | null;
  unread_count?: number;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

const QUICK_SUGGESTIONS = [
  "Toujours disponible ?",
  "C'est votre dernier prix ?",
  "Vous faites les échanges ?",
  "Livraison possible ?",
];

function Avatar({ user, size = 36, online = false }: {
  user: { username?: string | null; full_name?: string | null; avatar_url?: string | null } | null | undefined;
  size?: number;
  online?: boolean;
}) {
  const name = user?.username || user?.full_name || "?";
  return (
    <div className="relative flex-shrink-0">
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt={name} className="rounded-full object-cover"
          style={{ width: size, height: size }} />
      ) : (
        <div className="rounded-full flex items-center justify-center font-black text-white"
          style={{
            width: size, height: size,
            background: "linear-gradient(145deg, #9B6FF8, #7C3AED)",
            fontSize: size * 0.38,
            boxShadow: "0 4px 14px rgba(139,92,246,0.35)",
          }}>
          {name[0]?.toUpperCase()}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 rounded-full border-2"
          style={{ width: 11, height: 11, background: "#34D399", borderColor: "#07070A", boxShadow: "0 0 8px rgba(52,211,153,0.7)" }} />
      )}
    </div>
  );
}

function EmptyConversations() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center py-16">
      <div className="relative mb-5">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)", filter: "blur(20px)", transform: "scale(1.5)" }} />
        <div className="relative w-12 h-12 rounded-[14px] flex items-center justify-center"
          style={{
            background: "linear-gradient(145deg, rgba(139,92,246,0.15), rgba(109,40,217,0.06))",
            border: "1px solid rgba(139,92,246,0.22)",
            boxShadow: "0 4px 16px rgba(139,92,246,0.12), 0 1px 0 rgba(255,255,255,0.07) inset",
          }}>
          <MessageSquare className="w-5 h-5" style={{ color: "rgba(139,92,246,0.6)" }} />
        </div>
      </div>
      <p className="text-[13px] font-bold mb-1.5" style={{ color: "rgba(255,255,255,0.38)" }}>Aucune conversation</p>
      <p className="text-[11.5px] leading-relaxed mb-5 max-w-[160px]" style={{ color: "rgba(255,255,255,0.18)" }}>
        Contacte un vendeur depuis une annonce
      </p>
      <Link href="/search"
        className="flex items-center gap-1.5 px-4 py-2 rounded-[11px] text-[12px] font-bold text-white transition-all hover:-translate-y-0.5"
        style={{
          background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
          boxShadow: "0 6px 20px rgba(124,58,237,0.35), 0 1px 0 rgba(255,255,255,0.12) inset",
        }}>
        <ShoppingBag className="w-3.5 h-3.5" /> Explorer
      </Link>
    </div>
  );
}

function EmptyChat({ other, product }: {
  other: Conversation["buyer"];
  product: Conversation["product"];
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12">
      <Avatar user={other} size={72} />
      <p className="text-[22px] font-black text-white mt-5 mb-1 tracking-tight"
        style={{ letterSpacing: "-0.025em" }}>
        {other?.username || other?.full_name || "Utilisateur"}
      </p>
      {other?.username && (
        <p className="text-[12px] mb-7" style={{ color: "rgba(167,139,250,0.5)" }}>@{other.username}</p>
      )}

      {product && (
        <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-[18px] mb-7"
          style={{
            background: "linear-gradient(145deg, rgba(139,92,246,0.09), rgba(109,40,217,0.04))",
            border: "1px solid rgba(139,92,246,0.18)",
            boxShadow: "0 4px 20px rgba(139,92,246,0.07), 0 1px 0 rgba(255,255,255,0.06) inset",
            maxWidth: 300,
          }}>
          {product.images?.[0] && (
            <div className="w-[50px] h-[50px] rounded-[13px] overflow-hidden flex-shrink-0"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
              <Image src={product.images[0]} alt={product.title} width={50} height={50} className="object-cover w-full h-full" />
            </div>
          )}
          <div className="text-left">
            <p className="text-[10px] mb-0.5 font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
              À propos de
            </p>
            <p className="text-[13px] font-semibold text-white truncate max-w-[180px]">{product.title}</p>
          </div>
        </div>
      )}

      <p className="text-[13px] mb-5" style={{ color: "rgba(255,255,255,0.22)" }}>Démarre la conversation</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {QUICK_SUGGESTIONS.map(s => (
          <button key={s}
            className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.42)" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.10)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.22)";
              (e.currentTarget as HTMLElement).style.color = "#C4B5FD";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.42)";
            }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function NoConvSelected() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full relative overflow-hidden">
      <div className="absolute pointer-events-none"
        style={{ top: "30%", left: "50%", transform: "translateX(-50%)", width: 360, height: 360,
          background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)", filter: "blur(60px)" }} />

      <div className="relative z-10 flex flex-col items-center text-center" style={{ maxWidth: 260 }}>
        <div className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-5"
          style={{
            background: "linear-gradient(145deg, rgba(139,92,246,0.11), rgba(109,40,217,0.05))",
            border: "1px solid rgba(139,92,246,0.16)",
            boxShadow: "0 2px 14px rgba(139,92,246,0.08), 0 1px 0 rgba(255,255,255,0.06) inset",
          }}>
          <MessageSquare className="w-[18px] h-[18px]" style={{ color: "rgba(167,139,250,0.52)" }} />
        </div>

        <p className="text-[14px] font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.38)", letterSpacing: "-0.01em" }}>
          Tes messages
        </p>
        <p className="text-[12px] leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.18)", maxWidth: 210 }}>
          Sélectionne une conversation ou contacte un vendeur depuis une annonce.
        </p>

        <div className="flex flex-col gap-1.5 w-full">
          {[
            { icon: ShoppingBag, label: "Trouver des articles", href: "/search",   color: "#8B5CF6" },
            { icon: Package,     label: "Mes annonces",         href: "/listings", color: "#10B981" },
          ].map(({ icon: Icon, label, href, color }) => (
            <Link key={label} href={href}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[11px] text-[12px] font-medium transition-all"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.055)",
                color: "rgba(255,255,255,0.35)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = `${color}09`;
                el.style.borderColor = `${color}22`;
                el.style.color = "rgba(255,255,255,0.65)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,255,255,0.025)";
                el.style.borderColor = "rgba(255,255,255,0.055)";
                el.style.color = "rgba(255,255,255,0.35)";
              }}>
              <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
              <span className="flex-1">{label}</span>
              <ArrowRight className="w-3 h-3 opacity-18" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mt-5">
          <Lock style={{ width: 9, height: 9, color: "rgba(255,255,255,0.12)" }} />
          <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.12)" }}>Messages chiffrés de bout en bout</p>
        </div>
      </div>
    </div>
  );
}

interface Props {
  conversations: Conversation[];
  currentUserId: string;
}

export function DesktopMessages({ conversations, currentUserId }: Props) {
  const [selected, setSelected] = useState<Conversation | null>(conversations[0] ?? null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const supabase = createClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const getOther = (c: Conversation) =>
    c.buyer?.id === currentUserId ? c.seller : c.buyer;

  const filtered = conversations.filter(c => {
    const other = getOther(c);
    const name = other?.username || other?.full_name || "";
    return name.toLowerCase().includes(search.toLowerCase()) ||
      (c.product?.title ?? "").toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    if (!selected) return;
    supabase.from("messages")
      .select("*")
      .eq("conversation_id", selected.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data ?? []));
  }, [selected?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (content?: string) => {
    const text = content ?? input.trim();
    if (!text || !selected) return;
    setInput("");
    const { data } = await supabase.from("messages")
      .insert({ conversation_id: selected.id, sender_id: currentUserId, content: text })
      .select().single();
    if (data) setMessages(prev => [...prev, data]);
  };

  const other = selected ? getOther(selected) : null;

  return (
    <div className="flex h-[100dvh] relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 40% 0%, #0b0618 0%, #070510 40%, #04030a 100%)" }}>

      {/* ── Cinematic background ── */}
      <div className="absolute pointer-events-none"
        style={{ top: -180, left: "35%", transform: "translateX(-50%)", width: 700, height: 700,
          background: "radial-gradient(circle, rgba(100,40,220,0.09) 0%, transparent 62%)", filter: "blur(90px)" }} />
      <div className="absolute pointer-events-none"
        style={{ bottom: -100, right: "20%", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(76,29,149,0.06) 0%, transparent 65%)", filter: "blur(100px)" }} />
      <div className="absolute pointer-events-none"
        style={{ top: "40%", left: 0, width: 300, height: 400,
          background: "radial-gradient(circle, rgba(88,28,200,0.05) 0%, transparent 65%)", filter: "blur(80px)" }} />

      {/* ── Left sidebar ── */}
      <div className="relative z-10 flex-shrink-0 flex flex-col" style={{ width: 340 }}>
        {/* Glass panel */}
        <div className="absolute inset-0"
          style={{
            background: "rgba(6,5,12,0.82)",
            backdropFilter: "blur(32px) saturate(190%)",
            WebkitBackdropFilter: "blur(32px) saturate(190%)",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "1px 0 0 rgba(255,255,255,0.02)",
          }} />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="px-5 pt-6 pb-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-[17px] font-black text-white" style={{ letterSpacing: "-0.02em" }}>
                Messages
              </h1>
              {conversations.length > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  {conversations.length}
                </span>
              )}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}>
              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher…"
                className="flex-1 bg-transparent text-[12.5px] text-white outline-none"
                style={{ caretColor: "#8B5CF6" }}
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto px-2" style={{ scrollbarWidth: "none" }}>
            {filtered.length === 0 ? (
              <EmptyConversations />
            ) : (
              <div className="flex flex-col gap-0.5 pb-3">
                {filtered.map(c => {
                  const o = getOther(c);
                  const isSelected = selected?.id === c.id;
                  const hasUnread = (c.unread_count ?? 0) > 0;
                  return (
                    <button key={c.id} onClick={() => setSelected(c)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-[13px] text-left transition-all relative"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(139,92,246,0.14), rgba(109,40,217,0.06))"
                          : "transparent",
                        boxShadow: isSelected
                          ? "0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 16px rgba(139,92,246,0.08)"
                          : "none",
                        border: isSelected ? "1px solid rgba(139,92,246,0.18)" : "1px solid transparent",
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                          (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.06)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                          (e.currentTarget as HTMLElement).style.border = "1px solid transparent";
                        }
                      }}>

                      {/* Active left accent */}
                      {isSelected && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[20px] rounded-r-full"
                          style={{ background: "linear-gradient(180deg, #C4B5FD, #8B5CF6)", boxShadow: "2px 0 8px rgba(139,92,246,0.5)" }} />
                      )}

                      <Avatar user={o} size={42} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className={`text-[13px] truncate ${hasUnread ? "font-bold text-white" : "font-semibold"}`}
                            style={!hasUnread ? { color: "rgba(255,255,255,0.62)" } : {}}>
                            {o?.username || o?.full_name || "Utilisateur"}
                          </p>
                          <span className="text-[9.5px] flex-shrink-0 ml-2"
                            style={{ color: hasUnread ? "rgba(167,139,250,0.7)" : "rgba(255,255,255,0.18)" }}>
                            {c.last_message_at ? timeAgo(c.last_message_at) : ""}
                          </span>
                        </div>
                        {c.product && (
                          <p className="text-[10px] truncate mb-0.5 font-medium" style={{ color: "rgba(139,92,246,0.5)" }}>
                            {c.product.title}
                          </p>
                        )}
                        <p className={`text-[11px] truncate ${hasUnread ? "font-semibold" : ""}`}
                          style={{ color: hasUnread ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.20)" }}>
                          {c.last_message || "Démarrer la conversation"}
                        </p>
                      </div>
                      {hasUnread && (
                        <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                            boxShadow: "0 3px 10px rgba(139,92,246,0.55)" }}>
                          {c.unread_count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Center chat ── */}
      {selected ? (
        <div className="relative z-10 flex-1 flex flex-col min-w-0">

          {/* Chat header */}
          <div className="flex items-center justify-between px-7 py-4 flex-shrink-0"
            style={{
              background: "rgba(7,5,14,0.80)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.02)",
            }}>
            <div className="flex items-center gap-3.5">
              <Avatar user={other} size={38} online />
              <div>
                <p className="text-[15px] font-bold text-white leading-none mb-0.5"
                  style={{ letterSpacing: "-0.01em" }}>
                  {other?.username || other?.full_name}
                </p>
                {selected.product ? (
                  <p className="text-[10.5px] font-medium" style={{ color: "rgba(167,139,250,0.6)" }}>
                    Re : {selected.product.title}
                  </p>
                ) : (
                  <p className="text-[10.5px]" style={{ color: "rgba(52,211,153,0.6)" }}>En ligne</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {[Phone, Video, Info, MoreHorizontal].map((Icon, i) => (
                <button key={i}
                  className="w-9 h-9 rounded-[11px] flex items-center justify-center transition-all"
                  style={{ color: "rgba(255,255,255,0.20)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.62)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.20)";
                  }}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-1.5" style={{ scrollbarWidth: "none" }}>
            {messages.length === 0 ? (
              <EmptyChat other={other} product={selected.product} />
            ) : (
              <>
                {selected.product && (
                  <div className="flex justify-center mb-5">
                    <div className="flex items-center gap-3.5 px-4 py-3 rounded-[16px]"
                      style={{
                        background: "linear-gradient(145deg, rgba(139,92,246,0.08), rgba(109,40,217,0.03))",
                        border: "1px solid rgba(139,92,246,0.14)",
                        boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset",
                      }}>
                      {selected.product.images?.[0] && (
                        <div className="w-10 h-10 rounded-[10px] overflow-hidden flex-shrink-0"
                          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
                          <Image src={selected.product.images[0]} alt={selected.product.title} width={40} height={40} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] mb-0.5 uppercase tracking-widest font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
                          Conversation à propos de
                        </p>
                        <p className="text-[12.5px] font-semibold text-white">{selected.product.title}</p>
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((m, idx) => {
                  const isMe = m.sender_id === currentUserId;
                  const prevSame = idx > 0 && messages[idx - 1].sender_id === m.sender_id;
                  return (
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"} ${prevSame ? "mt-0.5" : "mt-4"}`}>
                      {!isMe && !prevSame && (
                        <div className="mr-2.5 mt-0.5 flex-shrink-0"><Avatar user={other} size={28} /></div>
                      )}
                      {!isMe && prevSame && <div style={{ width: 38 }} />}
                      <div style={{ maxWidth: "58%" }}>
                        <div className="px-4 py-2.5 text-[13.5px] leading-relaxed"
                          style={{
                            background: isMe
                              ? "linear-gradient(135deg, #7C3AED, #6D28D9)"
                              : "rgba(255,255,255,0.07)",
                            border: isMe
                              ? "1px solid rgba(255,255,255,0.08)"
                              : "1px solid rgba(255,255,255,0.06)",
                            color: isMe ? "#fff" : "rgba(255,255,255,0.82)",
                            borderRadius: isMe
                              ? (prevSame ? "18px 6px 6px 18px" : "18px 18px 6px 18px")
                              : (prevSame ? "6px 18px 18px 6px" : "6px 18px 18px 18px"),
                            boxShadow: isMe
                              ? "0 4px 16px rgba(109,40,217,0.35), 0 1px 0 rgba(255,255,255,0.1) inset"
                              : "0 2px 8px rgba(0,0,0,0.2)",
                          }}>
                          {m.content}
                        </div>
                        {idx === messages.length - 1 && (
                          <p className={`text-[9.5px] mt-1.5 px-1 ${isMe ? "text-right" : "text-left"}`}
                            style={{ color: "rgba(255,255,255,0.16)" }}>
                            {timeAgo(m.created_at)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Quick suggestions */}
          {messages.length === 0 && (
            <div className="px-8 pb-3 flex gap-2 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
              {QUICK_SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.40)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.10)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.2)";
                    (e.currentTarget as HTMLElement).style.color = "#C4B5FD";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.40)";
                  }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="px-6 py-4 flex-shrink-0"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.04)",
              background: "rgba(7,5,14,0.70)",
              backdropFilter: "blur(24px)",
            }}>
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-[16px]"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06) inset",
              }}>
              <button className="transition-colors flex-shrink-0" style={{ color: "rgba(255,255,255,0.20)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.48)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.20)"; }}>
                <Smile className="w-5 h-5" />
              </button>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Écrire un message…"
                className="flex-1 bg-transparent text-[14px] text-white outline-none"
                style={{ caretColor: "#8B5CF6" }} />
              <button className="transition-colors flex-shrink-0" style={{ color: "rgba(255,255,255,0.20)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.48)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.20)"; }}>
                <ImageIcon className="w-5 h-5" />
              </button>
              <button onClick={() => send()} disabled={!input.trim()}
                className="w-9 h-9 rounded-[11px] flex items-center justify-center transition-all disabled:opacity-20 flex-shrink-0"
                style={{
                  background: input.trim()
                    ? "linear-gradient(135deg, #8B5CF6, #7C3AED)"
                    : "rgba(255,255,255,0.07)",
                  boxShadow: input.trim() ? "0 4px 14px rgba(139,92,246,0.45), 0 1px 0 rgba(255,255,255,0.12) inset" : "none",
                }}
                onMouseEnter={e => { if (input.trim()) (e.currentTarget as HTMLElement).style.transform = "scale(1.07)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Encryption note */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <Lock style={{ width: 9, height: 9, color: "rgba(255,255,255,0.12)" }} />
              <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.12)" }}>Messages chiffrés de bout en bout</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex"><NoConvSelected /></div>
      )}

      {/* ── Right panel ── */}
      {selected && other && (
        <div className="relative z-10 flex-shrink-0 overflow-y-auto" style={{ width: 300, scrollbarWidth: "none" }}>
          {/* Glass panel */}
          <div className="absolute inset-0"
            style={{
              background: "rgba(6,5,12,0.80)",
              backdropFilter: "blur(32px) saturate(190%)",
              WebkitBackdropFilter: "blur(32px) saturate(190%)",
              borderLeft: "1px solid rgba(255,255,255,0.05)",
            }} />

          <div className="relative z-10">
            {/* User card */}
            <div className="p-6 flex flex-col items-center text-center relative overflow-hidden"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {/* Mini banner glow */}
              <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, rgba(109,40,217,0.10), transparent)" }} />

              <div className="relative mt-2 mb-4">
                <Avatar user={other} size={72} online />
              </div>
              <p className="text-[15.5px] font-black text-white mb-0.5 tracking-tight"
                style={{ letterSpacing: "-0.02em" }}>
                {other.username || other.full_name}
              </p>
              {other.username && (
                <p className="text-[11.5px] mb-3" style={{ color: "rgba(167,139,250,0.45)" }}>@{other.username}</p>
              )}
              <div className="flex items-center gap-1.5 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                  style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }} />
                <span className="text-[11px] font-semibold" style={{ color: "rgba(52,211,153,0.65)" }}>En ligne</span>
              </div>
              <Link href={`/profile/${other.id}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-[12px] font-bold text-[#A78BFA] w-full justify-center transition-all"
                style={{
                  border: "1px solid rgba(139,92,246,0.20)",
                  background: "rgba(139,92,246,0.07)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.14)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.32)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(139,92,246,0.18), 0 1px 0 rgba(255,255,255,0.06) inset";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.07)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.20)";
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 0 rgba(255,255,255,0.05) inset";
                }}>
                Voir le profil <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Seller stats */}
            <div className="p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-4"
                style={{ color: "rgba(255,255,255,0.15)" }}>Informations</p>
              <div className="flex flex-col gap-0.5">
                {[
                  { icon: Star,        label: "Note",     value: "4.8 ★", color: "#F59E0B" },
                  { icon: ShoppingBag, label: "Ventes",   value: "24",    color: "#10B981" },
                  { icon: Package,     label: "Annonces", value: "12",    color: "#8B5CF6" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center justify-between px-3 py-2.5 rounded-[11px] transition-all"
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-[8px] flex items-center justify-center"
                        style={{ background: `${color}14` }}>
                        <Icon className="w-3 h-3" style={{ color: `${color}bb` }} />
                      </div>
                      <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.30)" }}>{label}</span>
                    </div>
                    <span className="text-[12px] font-bold" style={{ color: "rgba(255,255,255,0.58)" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product card */}
            {selected.product && (
              <div className="p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-3.5"
                  style={{ color: "rgba(255,255,255,0.15)" }}>Article concerné</p>
                <Link href={`/products/${selected.product.id}`}
                  className="block rounded-[18px] overflow-hidden transition-all"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.02)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.55), 0 0 20px rgba(139,92,246,0.07)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.18)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.3)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }}>
                  {selected.product.images?.[0] && (
                    <div className="relative aspect-square">
                      <Image src={selected.product.images[0]} alt={selected.product.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="px-4 py-3"
                    style={{
                      background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}>
                    <p className="text-[12.5px] font-semibold text-white truncate mb-1">{selected.product.title}</p>
                    {selected.product.price && (
                      <p className="text-[14px] font-black" style={{ color: "#A78BFA" }}>
                        {selected.product.price} €
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
