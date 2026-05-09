"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, Send, MoreHorizontal, Phone, Video, Info,
  Image as ImageIcon, Smile, MessageSquare, Sparkles,
  ShoppingBag, ArrowRight, Star, Package, Users
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
        <img src={user.avatar_url} alt={name}
          className="rounded-full object-cover"
          style={{ width: size, height: size }} />
      ) : (
        <div className="rounded-full flex items-center justify-center font-black text-white"
          style={{ width: size, height: size, background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", fontSize: size * 0.38 }}>
          {name[0]?.toUpperCase()}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2"
          style={{ borderColor: "#08080e" }} />
      )}
    </div>
  );
}

function EmptyConversations() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-5 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
        <MessageSquare className="w-6 h-6 text-[#8B5CF6]/50" />
      </div>
      <p className="text-[13px] font-bold text-white/30 mb-1">Aucune conversation</p>
      <p className="text-[11px] text-white/20 leading-relaxed mb-5">
        Contacte un vendeur depuis une annonce pour démarrer
      </p>
      <Link href="/search"
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white"
        style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
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
      <p className="text-[18px] font-black text-white mt-4 mb-1">
        {other?.username || other?.full_name || "Utilisateur"}
      </p>
      {other?.username && <p className="text-[12px] text-white/30 mb-6">@{other.username}</p>}

      {product && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-6 max-w-[280px]"
          style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.18)" }}>
          {product.images?.[0] && (
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={product.images[0]} alt={product.title} width={48} height={48} className="object-cover w-full h-full" />
            </div>
          )}
          <div className="text-left">
            <p className="text-[10px] text-white/35 mb-0.5">À propos de</p>
            <p className="text-[12px] font-semibold text-white truncate max-w-[160px]">{product.title}</p>
          </div>
        </div>
      )}

      <p className="text-[13px] text-white/25 mb-5">Démarre la conversation !</p>

      <div className="flex flex-wrap gap-2 justify-center">
        {QUICK_SUGGESTIONS.map(s => (
          <button key={s}
            className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-white/50 transition-all hover:text-white/80 hover:bg-white/8"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function NoConvSelected() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12"
      style={{ background: "rgba(255,255,255,0.005)" }}>
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(109,40,217,0.06))", border: "1px solid rgba(139,92,246,0.18)", boxShadow: "0 0 40px rgba(139,92,246,0.1)" }}>
          <MessageSquare className="w-9 h-9 text-[#8B5CF6]/50" />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>

      <h2 className="text-[20px] font-black text-white mb-2">Tes messages</h2>
      <p className="text-[13px] text-white/30 mb-8 max-w-[300px] leading-relaxed">
        Sélectionne une conversation à gauche, ou contacte un vendeur depuis une annonce.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-[280px]">
        {[
          { icon: ShoppingBag, label: "Trouver des articles", href: "/search",   color: "#8B5CF6" },
          { icon: Package,     label: "Mes annonces",         href: "/listings", color: "#10B981" },
          { icon: Users,       label: "Vendeurs populaires",  href: "/search",   color: "#F59E0B" },
        ].map(({ icon: Icon, label, href, color }) => (
          <Link key={label} href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-semibold text-white/50 transition-all hover:text-white/80 group"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}30`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}15` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            {label}
            <ArrowRight className="w-3.5 h-3.5 ml-auto text-white/20 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
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
    <div className="flex h-[100dvh]" style={{ background: "#07070A" }}>

      {/* ── Left: Conversation list ── */}
      <div className="w-[300px] flex-shrink-0 flex flex-col"
        style={{ background: "#08080e", borderRight: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Header */}
        <div className="px-4 pt-5 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-[17px] font-black text-white">Messages</h1>
            {conversations.length > 0 && (
              <span className="text-[11px] font-bold text-white/30">{conversations.length}</span>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Search className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="flex-1 bg-transparent text-[12.5px] text-white placeholder-white/25 outline-none" />
          </div>
        </div>

        {/* Conversation list */}
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
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all relative"
                  style={{
                    background: isSelected ? "rgba(139,92,246,0.1)" : "transparent",
                    borderLeft: isSelected ? "2px solid #8B5CF6" : "2px solid transparent",
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <Avatar user={o} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-[13px] truncate ${hasUnread ? "font-bold text-white" : "font-semibold text-white/70"}`}>
                        {o?.username || o?.full_name || "Utilisateur"}
                      </p>
                      <span className="text-[9.5px] text-white/25 flex-shrink-0 ml-1">
                        {c.last_message_at ? timeAgo(c.last_message_at) : ""}
                      </span>
                    </div>
                    {c.product && (
                      <p className="text-[10px] text-[#8B5CF6]/60 truncate mb-0.5">{c.product.title}</p>
                    )}
                    <p className={`text-[11px] truncate ${hasUnread ? "text-white/60 font-semibold" : "text-white/25"}`}>
                      {c.last_message || "Démarrer la conversation"}
                    </p>
                  </div>
                  {hasUnread && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                      style={{ background: "#8B5CF6" }}>{c.unread_count}</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Center: Chat ── */}
      {selected ? (
        <div className="flex-1 flex flex-col min-w-0">

          {/* Chat header */}
          <div className="flex items-center justify-between px-6 py-3.5 flex-shrink-0"
            style={{ background: "rgba(8,8,14,0.9)", borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center gap-3">
              <Avatar user={other} size={36} online />
              <div>
                <p className="text-[14.5px] font-bold text-white leading-none mb-0.5">
                  {other?.username || other?.full_name}
                </p>
                {selected.product && (
                  <p className="text-[10.5px] text-[#A78BFA]/70">Re : {selected.product.title}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[Phone, Video, Info, MoreHorizontal].map((Icon, i) => (
                <button key={i}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/5 transition-all">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-1.5" style={{ scrollbarWidth: "none" }}>
            {messages.length === 0 ? (
              <EmptyChat other={other} product={selected.product} />
            ) : (
              <>
                {/* Product context card */}
                {selected.product && (
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                      style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.15)" }}>
                      {selected.product.images?.[0] && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={selected.product.images[0]} alt={selected.product.title} width={40} height={40} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] text-white/35 mb-0.5">Conversation à propos de</p>
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
                        <div className="mr-2 mt-0.5 flex-shrink-0">
                          <Avatar user={other} size={28} />
                        </div>
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
                          }}>
                          {m.content}
                        </div>
                        {idx === messages.length - 1 && (
                          <p className={`text-[9.5px] text-white/20 mt-1 ${isMe ? "text-right" : "text-left"} px-1`}>
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

          {/* Quick suggestions (only when no messages) */}
          {messages.length === 0 && (
            <div className="px-6 pb-2 flex gap-2 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
              {QUICK_SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold text-white/45 hover:text-white/75 transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="px-5 py-4 flex-shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(8,8,14,0.6)" }}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <button className="text-white/25 hover:text-white/50 transition-colors flex-shrink-0">
                <Smile className="w-5 h-5" />
              </button>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Écrire un message…"
                className="flex-1 bg-transparent text-[14px] text-white placeholder-white/25 outline-none" />
              <button className="text-white/25 hover:text-white/50 transition-colors flex-shrink-0">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button onClick={() => send()} disabled={!input.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-25 hover:scale-105"
                style={{ background: input.trim() ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : "rgba(255,255,255,0.08)" }}>
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <NoConvSelected />
      )}

      {/* ── Right: User + product info ── */}
      {selected && other && (
        <div className="w-[260px] flex-shrink-0 overflow-y-auto"
          style={{ background: "#08080e", borderLeft: "1px solid rgba(255,255,255,0.05)", scrollbarWidth: "none" }}>

          {/* User card */}
          <div className="p-5 flex flex-col items-center text-center"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <Avatar user={other} size={64} online />
            <p className="text-[15px] font-bold text-white mt-3 mb-0.5">
              {other.username || other.full_name}
            </p>
            {other.username && <p className="text-[11.5px] text-white/30 mb-3">@{other.username}</p>}
            <div className="flex items-center gap-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-emerald-400/70 font-semibold">En ligne</span>
            </div>
            <Link href={`/profile/${other.id}`}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-[12px] font-semibold text-[#A78BFA] transition-all hover:bg-[#8B5CF6]/12 w-full justify-center"
              style={{ border: "1px solid rgba(139,92,246,0.2)" }}>
              Voir le profil <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Seller stats */}
          <div className="p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3">Informations</p>
            {[
              { icon: Star,      label: "Note",   value: "4.8 ★" },
              { icon: ShoppingBag, label: "Ventes", value: "24" },
              { icon: Package,   label: "Annonces", value: "12" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2 text-white/35">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[12px]">{label}</span>
                </div>
                <span className="text-[12px] font-bold text-white/60">{value}</span>
              </div>
            ))}
          </div>

          {/* Product card */}
          {selected.product && (
            <div className="p-4">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3">Article concerné</p>
              <Link href={`/products/${selected.product.id}`}
                className="block rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                {selected.product.images?.[0] && (
                  <div className="relative aspect-square">
                    <Image src={selected.product.images[0]} alt={selected.product.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-[12px] font-semibold text-white truncate mb-0.5">{selected.product.title}</p>
                  {selected.product.price && (
                    <p className="text-[13px] font-black text-[#A78BFA]">{selected.product.price} €</p>
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
