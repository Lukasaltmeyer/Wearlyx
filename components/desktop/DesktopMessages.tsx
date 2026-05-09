"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, Send, MoreHorizontal, Phone, Video, Info,
  Image as ImageIcon, Smile, MessageSquare, Sparkles,
  ShoppingBag, ArrowRight, Star, Package, Users, Lock
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
            boxShadow: "0 4px 12px rgba(139,92,246,0.35)",
          }}>
          {name[0]?.toUpperCase()}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2"
          style={{ borderColor: "#07070A", boxShadow: "0 0 6px rgba(52,211,153,0.6)" }} />
      )}
    </div>
  );
}

function EmptyConversations() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-5 text-center py-12">
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", filter: "blur(16px)", transform: "scale(1.4)" }} />
        <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(145deg, rgba(139,92,246,0.14), rgba(109,40,217,0.07))",
            border: "1px solid rgba(139,92,246,0.22)",
          }}>
          <MessageSquare className="w-6 h-6" style={{ color: "rgba(139,92,246,0.55)" }} />
        </div>
      </div>
      <p className="text-[13px] font-bold mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Aucune conversation</p>
      <p className="text-[11px] leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.18)" }}>
        Contacte un vendeur depuis une annonce pour démarrer
      </p>
      <Link href="/search"
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all hover:-translate-y-0.5"
        style={{
          background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
          boxShadow: "0 4px 14px rgba(139,92,246,0.4)",
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
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
      <Avatar user={other} size={64} />
      <p className="text-[19px] font-black text-white mt-4 mb-1 tracking-tight"
        style={{ letterSpacing: "-0.02em" }}>
        {other?.username || other?.full_name || "Utilisateur"}
      </p>
      {other?.username && (
        <p className="text-[12px] mb-6" style={{ color: "rgba(167,139,250,0.5)" }}>@{other.username}</p>
      )}

      {product && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-6 max-w-[280px]"
          style={{
            background: "linear-gradient(145deg, rgba(139,92,246,0.1), rgba(109,40,217,0.05))",
            border: "1px solid rgba(139,92,246,0.2)",
            boxShadow: "0 4px 16px rgba(139,92,246,0.08)",
          }}>
          {product.images?.[0] && (
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={product.images[0]} alt={product.title} width={48} height={48} className="object-cover w-full h-full" />
            </div>
          )}
          <div className="text-left">
            <p className="text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>À propos de</p>
            <p className="text-[12px] font-semibold text-white truncate max-w-[160px]">{product.title}</p>
          </div>
        </div>
      )}

      <p className="text-[13px] mb-5" style={{ color: "rgba(255,255,255,0.22)" }}>Démarre la conversation !</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {QUICK_SUGGESTIONS.map(s => (
          <button key={s}
            className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.1)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.2)";
              (e.currentTarget as HTMLElement).style.color = "#C4B5FD";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
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
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute pointer-events-none"
        style={{ top: "20%", left: "50%", transform: "translateX(-50%)", width: 400, height: 400,
          background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)", filter: "blur(60px)" }} />

      <div className="relative mb-7">
        <div className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", filter: "blur(24px)", transform: "scale(1.6)" }} />
        <div className="relative w-[84px] h-[84px] rounded-3xl flex items-center justify-center"
          style={{
            background: "linear-gradient(145deg, rgba(139,92,246,0.14), rgba(109,40,217,0.07))",
            border: "1px solid rgba(139,92,246,0.2)",
            boxShadow: "0 8px 36px rgba(139,92,246,0.12), 0 1px 0 rgba(255,255,255,0.08) inset",
          }}>
          <MessageSquare className="w-9 h-9" style={{ color: "rgba(139,92,246,0.55)" }} />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>

      <h2 className="text-[22px] font-black text-white mb-2 tracking-tight relative z-10"
        style={{ letterSpacing: "-0.02em" }}>Tes messages</h2>
      <p className="text-[13px] mb-8 max-w-[300px] leading-relaxed relative z-10"
        style={{ color: "rgba(255,255,255,0.27)" }}>
        Sélectionne une conversation à gauche, ou contacte un vendeur depuis une annonce.
      </p>

      <div className="relative z-10 flex flex-col gap-2.5 w-full max-w-[280px]">
        {[
          { icon: ShoppingBag, label: "Trouver des articles", href: "/search",   color: "#8B5CF6" },
          { icon: Package,     label: "Mes annonces",         href: "/listings", color: "#10B981" },
          { icon: Users,       label: "Vendeurs populaires",  href: "/search",   color: "#F59E0B" },
        ].map(({ icon: Icon, label, href, color }) => (
          <Link key={label} href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-semibold transition-all group"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.5)",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = `${color}30`;
              el.style.background = `${color}08`;
              el.style.color = "rgba(255,255,255,0.8)";
              el.style.transform = "translateX(2px)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.07)";
              el.style.background = "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))";
              el.style.color = "rgba(255,255,255,0.5)";
              el.style.transform = "";
            }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}15`, border: `1px solid ${color}20` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            {label}
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-30 group-hover:opacity-60 transition-all" />
          </Link>
        ))}
      </div>

      <div className="relative z-10 flex items-center gap-1.5 mt-6">
        <Lock style={{ width: 10, height: 10, color: "rgba(255,255,255,0.15)" }} />
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>Tous les messages sont chiffrés</p>
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
    <div className="flex h-[100dvh] relative overflow-hidden" style={{ background: "#07070A" }}>
      {/* Ambient bg orb */}
      <div className="absolute pointer-events-none"
        style={{ top: -150, left: "40%", transform: "translateX(-50%)", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)", filter: "blur(80px)" }} />

      {/* ── Left sidebar ── */}
      <div className="relative z-10 w-[340px] flex-shrink-0 flex flex-col"
        style={{
          background: "rgba(7,7,12,0.85)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}>

        {/* Header */}
        <div className="px-4 pt-6 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[18px] font-black text-white tracking-tight" style={{ letterSpacing: "-0.01em" }}>
              Messages
            </h1>
            {conversations.length > 0 && (
              <span className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>
                {conversations.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}>
            <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.28)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="flex-1 bg-transparent text-[12.5px] text-white outline-none"
              style={{ caretColor: "#8B5CF6" }}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filtered.length === 0 ? (
            <EmptyConversations />
          ) : (
            filtered.map(c => {
              const o = getOther(c);
              const isSelected = selected?.id === c.id;
              const hasUnread = (c.unread_count ?? 0) > 0;
              return (
                <button key={c.id} onClick={() => setSelected(c)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all relative"
                  style={{
                    background: isSelected
                      ? "linear-gradient(90deg, rgba(139,92,246,0.12), rgba(139,92,246,0.04))"
                      : "transparent",
                    borderLeft: isSelected ? "2px solid #8B5CF6" : "2px solid transparent",
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}>
                  <Avatar user={o} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-[13px] truncate ${hasUnread ? "font-bold text-white" : "font-semibold"}`}
                        style={!hasUnread ? { color: "rgba(255,255,255,0.65)" } : {}}>
                        {o?.username || o?.full_name || "Utilisateur"}
                      </p>
                      <span className="text-[9.5px] flex-shrink-0 ml-1"
                        style={{ color: hasUnread ? "#A78BFA" : "rgba(255,255,255,0.2)" }}>
                        {c.last_message_at ? timeAgo(c.last_message_at) : ""}
                      </span>
                    </div>
                    {c.product && (
                      <p className="text-[10px] truncate mb-0.5" style={{ color: "rgba(139,92,246,0.55)" }}>
                        {c.product.title}
                      </p>
                    )}
                    <p className={`text-[11px] truncate ${hasUnread ? "font-semibold" : ""}`}
                      style={{ color: hasUnread ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)" }}>
                      {c.last_message || "Démarrer la conversation"}
                    </p>
                  </div>
                  {hasUnread && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                        boxShadow: "0 2px 8px rgba(139,92,246,0.5)" }}>
                      {c.unread_count}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Center ── */}
      {selected ? (
        <div className="relative z-10 flex-1 flex flex-col min-w-0">

          {/* Chat header */}
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{
              background: "rgba(7,7,12,0.88)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
            <div className="flex items-center gap-3">
              <Avatar user={other} size={36} online />
              <div>
                <p className="text-[14.5px] font-bold text-white leading-none mb-0.5">
                  {other?.username || other?.full_name}
                </p>
                {selected.product && (
                  <p className="text-[10.5px]" style={{ color: "rgba(167,139,250,0.65)" }}>
                    Re : {selected.product.title}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[Phone, Video, Info, MoreHorizontal].map((Icon, i) => (
                <button key={i}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                  style={{ color: "rgba(255,255,255,0.22)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)";
                  }}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-1.5" style={{ scrollbarWidth: "none" }}>
            {messages.length === 0 ? (
              <EmptyChat other={other} product={selected.product} />
            ) : (
              <>
                {selected.product && (
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                      style={{
                        background: "linear-gradient(145deg, rgba(139,92,246,0.08), rgba(109,40,217,0.04))",
                        border: "1px solid rgba(139,92,246,0.16)",
                      }}>
                      {selected.product.images?.[0] && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={selected.product.images[0]} alt={selected.product.title} width={40} height={40} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                          Conversation à propos de
                        </p>
                        <p className="text-[12px] font-semibold text-white">{selected.product.title}</p>
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((m, idx) => {
                  const isMe = m.sender_id === currentUserId;
                  const prevSame = idx > 0 && messages[idx - 1].sender_id === m.sender_id;
                  return (
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"} ${prevSame ? "mt-0.5" : "mt-3"}`}>
                      {!isMe && !prevSame && (
                        <div className="mr-2 mt-0.5 flex-shrink-0"><Avatar user={other} size={28} /></div>
                      )}
                      {!isMe && prevSame && <div style={{ width: 36 }} />}
                      <div className="max-w-[62%]">
                        <div className="px-4 py-2.5 text-[13.5px] leading-relaxed"
                          style={{
                            background: isMe
                              ? "linear-gradient(135deg, #8B5CF6, #7C3AED)"
                              : "rgba(255,255,255,0.07)",
                            color: isMe ? "#fff" : "rgba(255,255,255,0.85)",
                            borderRadius: isMe
                              ? (prevSame ? "18px 6px 6px 18px" : "18px 18px 6px 18px")
                              : (prevSame ? "6px 18px 18px 6px" : "6px 18px 18px 18px"),
                            boxShadow: isMe ? "0 4px 12px rgba(139,92,246,0.3)" : "none",
                          }}>
                          {m.content}
                        </div>
                        {idx === messages.length - 1 && (
                          <p className={`text-[9.5px] mt-1 px-1 ${isMe ? "text-right" : "text-left"}`}
                            style={{ color: "rgba(255,255,255,0.18)" }}>
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
            <div className="px-6 pb-2 flex gap-2 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
              {QUICK_SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.42)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "#C4B5FD";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.42)";
                  }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="px-5 py-4 flex-shrink-0"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(7,7,12,0.75)",
              backdropFilter: "blur(20px)",
            }}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.06) inset",
              }}>
              <button className="transition-colors flex-shrink-0" style={{ color: "rgba(255,255,255,0.22)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
                <Smile className="w-5 h-5" />
              </button>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Écrire un message…"
                className="flex-1 bg-transparent text-[14px] text-white outline-none"
                style={{ caretColor: "#8B5CF6" }} />
              <button className="transition-colors flex-shrink-0" style={{ color: "rgba(255,255,255,0.22)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
                <ImageIcon className="w-5 h-5" />
              </button>
              <button onClick={() => send()} disabled={!input.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-25"
                style={{
                  background: input.trim() ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : "rgba(255,255,255,0.08)",
                  boxShadow: input.trim() ? "0 4px 12px rgba(139,92,246,0.4)" : "none",
                }}
                onMouseEnter={e => { if (input.trim()) (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex-1"><NoConvSelected /></div>
      )}

      {/* ── Right panel ── */}
      {selected && other && (
        <div className="relative z-10 w-[300px] flex-shrink-0 overflow-y-auto"
          style={{
            background: "rgba(7,7,12,0.85)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            scrollbarWidth: "none",
          }}>

          {/* User card */}
          <div className="p-6 flex flex-col items-center text-center"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Avatar user={other} size={68} online />
            <p className="text-[15px] font-bold text-white mt-4 mb-0.5">
              {other.username || other.full_name}
            </p>
            {other.username && (
              <p className="text-[11.5px] mb-3" style={{ color: "rgba(167,139,250,0.5)" }}>@{other.username}</p>
            )}
            <div className="flex items-center gap-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }} />
              <span className="text-[11px] font-semibold" style={{ color: "rgba(52,211,153,0.7)" }}>En ligne</span>
            </div>
            <Link href={`/profile/${other.id}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-semibold text-[#A78BFA] w-full justify-center transition-all"
              style={{ border: "1px solid rgba(139,92,246,0.22)", background: "rgba(139,92,246,0.06)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.14)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.35)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.06)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.22)";
              }}>
              Voir le profil <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Seller stats */}
          <div className="p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-3"
              style={{ color: "rgba(255,255,255,0.18)" }}>Informations</p>
            {[
              { icon: Star,        label: "Note",    value: "4.8 ★" },
              { icon: ShoppingBag, label: "Ventes",  value: "24" },
              { icon: Package,     label: "Annonces", value: "12" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.32)" }}>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[12px]">{label}</span>
                </div>
                <span className="text-[12px] font-bold" style={{ color: "rgba(255,255,255,0.6)" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Product card */}
          {selected.product && (
            <div className="p-5">
              <p className="text-[10px] font-black uppercase tracking-widest mb-3"
                style={{ color: "rgba(255,255,255,0.18)" }}>Article concerné</p>
              <Link href={`/products/${selected.product.id}`}
                className="block rounded-2xl overflow-hidden transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 28px rgba(0,0,0,0.5), 0 0 16px rgba(139,92,246,0.06)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}>
                {selected.product.images?.[0] && (
                  <div className="relative aspect-square">
                    <Image src={selected.product.images[0]} alt={selected.product.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-3"
                  style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))" }}>
                  <p className="text-[12px] font-semibold text-white truncate mb-0.5">{selected.product.title}</p>
                  {selected.product.price && (
                    <p className="text-[13px] font-black" style={{ color: "#A78BFA" }}>
                      {selected.product.price} €
                    </p>
                  )}
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
