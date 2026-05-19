"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, Send, MoreHorizontal, Phone, Video,
  Image as ImageIcon, Smile, ShoppingBag,
  Lock, ArrowRight, Plus, MessageSquare, ChevronRight
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

const QUICK_REPLIES = ["Toujours disponible ?", "C'est votre dernier prix ?", "Livraison possible ?", "Échange possible ?"];

const SUGGESTED_SELLERS = [
  { name: "Léa Martin",   username: "stylebylea",    items: 42, rating: "4.9", status: "En ligne",    color: "#8B5CF6" },
  { name: "Kevin V.",     username: "vintageking",   items: 28, rating: "4.8", status: "Il y a 1h",   color: "#10B981" },
  { name: "Lux Mode",     username: "luxmode_paris", items: 35, rating: "4.7", status: "Il y a 3h",   color: "#F59E0B" },
  { name: "Sneaker FR",   username: "sneaker_fr",    items: 19, rating: "4.6", status: "Il y a 1j",   color: "#EF4444" },
];

function Avatar({ user, size = 36, online = false }: {
  user: { username?: string | null; full_name?: string | null; avatar_url?: string | null } | null | undefined;
  size?: number; online?: boolean;
}) {
  const name = user?.username || user?.full_name || "?";
  return (
    <div className="relative flex-shrink-0">
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt={name} className="rounded-full object-cover" style={{ width: size, height: size }} />
      ) : (
        <div className="rounded-full flex items-center justify-center font-semibold text-white"
          style={{ width: size, height: size, background: "linear-gradient(145deg, #9B6FF8, #7C3AED)", fontSize: size * 0.36 }}>
          {name[0]?.toUpperCase()}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
          style={{ background: "#34D399", borderColor: "#07070A" }} />
      )}
    </div>
  );
}

/* ─── Welcome screen (no conversation selected) ─── */
function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>

      {/* Top section */}
      <div className="flex items-start justify-between px-10 pt-10 pb-8">
        <div>
          <h1 className="text-[24px] font-bold text-white mb-2" style={{ letterSpacing: "-0.025em" }}>
            Messagerie
          </h1>
          <p className="text-[13.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            Retrouve toutes tes conversations avec les vendeurs
          </p>
        </div>
        <Link href="/search"
          className="flex items-center gap-2 px-4 py-2 rounded-[7px] text-[13px] font-medium text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #5b21b6)",
            boxShadow: "0 2px 12px rgba(124,58,237,0.25), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}>
          <ShoppingBag style={{ width: 14, height: 14 }} />
          Trouver des articles
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-10 mb-8" style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

      {/* Suggested sellers — table layout */}
      <div className="px-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.28)" }}>
            Vendeurs actifs
          </p>
          <Link href="/search"
            className="text-[12px] transition-colors flex items-center gap-1"
            style={{ color: "rgba(139,92,246,0.55)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(139,92,246,0.55)"; }}>
            Voir tout <ChevronRight style={{ width: 12, height: 12 }} />
          </Link>
        </div>

        {/* Table header */}
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr auto auto auto" }}>
          <div className="text-[10.5px] font-semibold uppercase tracking-widest px-1 pb-2 col-span-1"
            style={{ color: "rgba(255,255,255,0.18)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            Vendeur
          </div>
          <div className="text-[10.5px] font-semibold uppercase tracking-widest pb-2 text-right"
            style={{ color: "rgba(255,255,255,0.18)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            Articles
          </div>
          <div className="text-[10.5px] font-semibold uppercase tracking-widest pb-2 text-right"
            style={{ color: "rgba(255,255,255,0.18)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            Note
          </div>
          <div className="text-[10.5px] font-semibold uppercase tracking-widest pb-2 text-right"
            style={{ color: "rgba(255,255,255,0.18)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            Statut
          </div>

          {SUGGESTED_SELLERS.map(({ name, username, items, rating, status, color }) => (
            <div key={username} className="contents">
              {/* Seller column */}
              <div className="flex items-center gap-3 py-3 cursor-pointer group"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white text-[12px] flex-shrink-0"
                  style={{ background: `linear-gradient(145deg, ${color}60, ${color}30)` }}>
                  {name[0]}
                </div>
                <div>
                  <p className="text-[13.5px] font-medium group-hover:text-white/90 transition-colors"
                    style={{ color: "rgba(255,255,255,0.72)" }}>{name}</p>
                  <p className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.28)" }}>@{username}</p>
                </div>
              </div>
              {/* Items */}
              <div className="flex items-center justify-end py-3 text-[13px] font-medium"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.045)", color: "rgba(255,255,255,0.45)" }}>
                {items}
              </div>
              {/* Rating */}
              <div className="flex items-center justify-end py-3 text-[13px] font-medium"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.045)", color: "#F59E0B" }}>
                {rating} ★
              </div>
              {/* Status */}
              <div className="flex items-center justify-end gap-2 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: status === "En ligne" ? "#34D399" : "rgba(255,255,255,0.20)" }} />
                <span className="text-[12px]" style={{ color: status === "En ligne" ? "rgba(52,211,153,0.75)" : "rgba(255,255,255,0.28)" }}>
                  {status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <div className="px-10 mt-auto pt-8 pb-8 flex items-center gap-2">
        <Lock style={{ width: 11, height: 11, color: "rgba(255,255,255,0.14)" }} />
        <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.18)" }}>
          Tous les messages Wearlyx sont chiffrés de bout en bout.
        </p>
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
    <div className="flex h-[100dvh] overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 45% 0%, #0d0820 0%, #070510 45%, #040309 100%)" }}>

      {/* ── Conversations panel ── */}
      <div className="flex flex-col flex-shrink-0 h-full"
        style={{ width: 320, borderRight: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 flex-shrink-0" style={{ height: 52, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-[14px] font-semibold" style={{ color: "rgba(255,255,255,0.70)", letterSpacing: "-0.01em" }}>
            Messages
          </span>
          <div className="flex items-center gap-2">
            {conversations.length > 0 && (
              <span className="text-[10.5px] px-1.5 py-0.5 rounded-[4px]"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.28)" }}>
                {conversations.length}
              </span>
            )}
            <button className="w-6 h-6 rounded-[5px] flex items-center justify-center transition-colors"
              style={{ color: "rgba(255,255,255,0.25)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)"; }}>
              <Plus style={{ width: 13, height: 13 }} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px]"
            style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Search style={{ width: 12, height: 12, flexShrink: 0, color: "rgba(255,255,255,0.25)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="flex-1 bg-transparent text-[12.5px] text-white outline-none placeholder:text-white/22"
              style={{ caretColor: "#8B5CF6" }} />
          </div>
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <MessageSquare style={{ width: 24, height: 24, color: "rgba(139,92,246,0.30)" }} strokeWidth={1.5} />
              <div>
                <p className="text-[13px] font-medium mb-1" style={{ color: "rgba(255,255,255,0.30)" }}>
                  Aucune conversation
                </p>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.16)" }}>
                  Contacte un vendeur depuis une annonce
                </p>
              </div>
              <Link href="/search"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[6px] text-[12px] font-medium transition-all"
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.20)", color: "#C4B5FD" }}>
                Explorer →
              </Link>
            </div>
          ) : (
            <div className="py-1">
              {filtered.map(c => {
                const o = getOther(c);
                const isSelected = selected?.id === c.id;
                const hasUnread = (c.unread_count ?? 0) > 0;
                return (
                  <button key={c.id} onClick={() => setSelected(c)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors relative"
                    style={{
                      background: isSelected ? "rgba(139,92,246,0.10)" : "transparent",
                      borderLeft: `2px solid ${isSelected ? "rgba(139,92,246,0.70)" : "transparent"}`,
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <Avatar user={o} size={36} online={isSelected} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[13.5px] truncate"
                          style={{ color: hasUnread ? "rgba(255,255,255,0.90)" : isSelected ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.52)", fontWeight: hasUnread ? 600 : 400 }}>
                          {o?.username || o?.full_name || "Utilisateur"}
                        </span>
                        <span className="text-[10px] flex-shrink-0" style={{ color: hasUnread ? "rgba(167,139,250,0.60)" : "rgba(255,255,255,0.18)" }}>
                          {c.last_message_at ? timeAgo(c.last_message_at) : ""}
                        </span>
                      </div>
                      <p className="text-[12px] truncate"
                        style={{ color: hasUnread ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.20)" }}>
                        {c.last_message || c.product?.title || "Nouvelle conversation"}
                      </p>
                    </div>
                    {hasUnread && (
                      <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[8.5px] font-bold text-white flex-shrink-0"
                        style={{ background: "#7C3AED" }}>
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

      {/* ── Center chat or welcome ── */}
      {selected && other ? (
        <div className="flex-1 flex flex-col min-w-0 h-full">

          {/* Header */}
          <div className="flex items-center justify-between px-6 flex-shrink-0"
            style={{ height: 52, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3">
              <Avatar user={other} size={28} online />
              <div>
                <span className="text-[14px] font-semibold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "-0.01em" }}>
                  {other.username || other.full_name}
                </span>
                {selected.product && (
                  <span className="ml-2.5 text-[12px]" style={{ color: "rgba(167,139,250,0.48)" }}>
                    · {selected.product.title}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {[Phone, Video, MoreHorizontal].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors"
                  style={{ color: "rgba(255,255,255,0.22)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.60)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
                  <Icon style={{ width: 15, height: 15 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-1" style={{ scrollbarWidth: "none" }}>
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-start px-4 max-w-xl">
                <Avatar user={other} size={60} online />
                <h2 className="text-[20px] font-bold mt-5 mb-1 text-white" style={{ letterSpacing: "-0.02em" }}>
                  {other.username || other.full_name}
                </h2>
                {other.username && (
                  <p className="text-[13px] mb-1" style={{ color: "rgba(167,139,250,0.45)" }}>@{other.username}</p>
                )}
                {selected.product && (
                  <div className="flex items-center gap-2 mt-2 mb-5">
                    {selected.product.images?.[0] && (
                      <div className="w-7 h-7 rounded-[5px] overflow-hidden flex-shrink-0">
                        <Image src={selected.product.images[0]} alt="" width={28} height={28} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <span className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.38)" }}>
                      {selected.product.title}
                    </span>
                    {selected.product.price && (
                      <span className="text-[12.5px] font-semibold" style={{ color: "#A78BFA" }}>
                        · {selected.product.price} €
                      </span>
                    )}
                  </div>
                )}
                <p className="text-[13px] mt-2 mb-5" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Début de la conversation — envoie un premier message
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="px-3.5 py-1.5 rounded-[6px] text-[12.5px] transition-all"
                      style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.42)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.10)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.22)"; (e.currentTarget as HTMLElement).style.color = "#C4B5FD"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.045)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.42)"; }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((m, idx) => {
                  const isMe = m.sender_id === currentUserId;
                  const prevSame = idx > 0 && messages[idx - 1].sender_id === m.sender_id;
                  return (
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"} ${prevSame ? "mt-0.5" : "mt-4"}`}>
                      {!isMe && !prevSame && <div className="mr-3 mt-0.5 flex-shrink-0"><Avatar user={other} size={26} /></div>}
                      {!isMe && prevSame && <div style={{ width: 38 }} />}
                      <div style={{ maxWidth: "62%" }}>
                        <div className="px-4 py-2.5 text-[13.5px] leading-relaxed"
                          style={{
                            background: isMe ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "rgba(255,255,255,0.075)",
                            border: isMe ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,255,255,0.07)",
                            color: isMe ? "#fff" : "rgba(255,255,255,0.82)",
                            borderRadius: isMe
                              ? (prevSame ? "16px 5px 5px 16px" : "16px 16px 5px 16px")
                              : (prevSame ? "5px 16px 16px 5px" : "5px 16px 16px 16px"),
                            boxShadow: isMe ? "0 4px 16px rgba(109,40,217,0.30)" : "none",
                          }}>
                          {m.content}
                        </div>
                        {idx === messages.length - 1 && (
                          <p className={`text-[9.5px] mt-1.5 px-1 ${isMe ? "text-right" : ""}`}
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

          {/* Input */}
          <div className="px-6 pb-5 pt-2 flex-shrink-0">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-[9px]"
              style={{ background: "rgba(255,255,255,0.065)", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <button className="flex-shrink-0 transition-colors" style={{ color: "rgba(255,255,255,0.22)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
                <Smile style={{ width: 17, height: 17 }} />
              </button>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder={`Message à ${other.username || other.full_name}…`}
                className="flex-1 bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/22"
                style={{ caretColor: "#8B5CF6" }} />
              <button className="flex-shrink-0 transition-colors" style={{ color: "rgba(255,255,255,0.22)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
                <ImageIcon style={{ width: 17, height: 17 }} />
              </button>
              <button onClick={() => send()} disabled={!input.trim()}
                className="w-8 h-8 rounded-[7px] flex items-center justify-center transition-all disabled:opacity-20 flex-shrink-0"
                style={{ background: input.trim() ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : "rgba(255,255,255,0.07)", boxShadow: input.trim() ? "0 2px 10px rgba(139,92,246,0.40)" : "none" }}>
                <Send style={{ width: 13, height: 13, color: "white" }} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <Lock style={{ width: 9, height: 9, color: "rgba(255,255,255,0.10)" }} />
              <span className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.10)" }}>Chiffré de bout en bout</span>
            </div>
          </div>
        </div>
      ) : (
        <WelcomeScreen />
      )}

      {/* ── Right panel — only when conversation active ── */}
      {selected && other && (
        <div className="flex-shrink-0 flex flex-col overflow-y-auto h-full"
          style={{ width: 280, borderLeft: "1px solid rgba(255,255,255,0.06)", scrollbarWidth: "none" }}>

          {/* Header */}
          <div className="flex items-center px-5 flex-shrink-0"
            style={{ height: 52, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.22)" }}>
              Informations
            </span>
          </div>

          {/* Seller profile */}
          <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-start gap-3.5 mb-5">
              <Avatar user={other} size={44} online />
              <div className="flex-1 min-w-0">
                <p className="text-[14.5px] font-semibold truncate" style={{ color: "rgba(255,255,255,0.82)", letterSpacing: "-0.01em" }}>
                  {other.username || other.full_name}
                </p>
                {other.username && (
                  <p className="text-[12px]" style={{ color: "rgba(167,139,250,0.40)" }}>@{other.username}</p>
                )}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11.5px]" style={{ color: "rgba(52,211,153,0.60)" }}>En ligne</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Note", value: "4.8★", color: "#F59E0B" },
                { label: "Ventes", value: "24", color: "#10B981" },
                { label: "Annonces", value: "12", color: "#8B5CF6" },
              ].map(({ label, value, color }) => (
                <div key={label} className="px-2 py-2.5 rounded-[7px] text-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[13.5px] font-semibold mb-0.5" style={{ color }}>{value}</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.28)" }}>{label}</p>
                </div>
              ))}
            </div>

            <Link href={`/profile/${other.id}`}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-[7px] text-[12.5px] font-medium transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.40)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.25)"; (e.currentTarget as HTMLElement).style.color = "#A78BFA"; (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.07)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.40)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              Voir le profil <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>

          {/* Article */}
          {selected.product && (
            <div className="px-5 pt-5 pb-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.20)" }}>
                Article concerné
              </p>
              <Link href={`/products/${selected.product.id}`}
                className="block rounded-[9px] overflow-hidden transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.09)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.28)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)"; }}>
                {selected.product.images?.[0] && (
                  <div className="relative" style={{ aspectRatio: "16/9" }}>
                    <Image src={selected.product.images[0]} alt={selected.product.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between px-3 py-2.5"
                  style={{ background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[12.5px] font-medium truncate flex-1 mr-2" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {selected.product.title}
                  </p>
                  {selected.product.price && (
                    <p className="text-[13.5px] font-semibold flex-shrink-0" style={{ color: "#A78BFA" }}>
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
