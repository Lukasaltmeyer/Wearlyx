"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, Send, MoreHorizontal, Phone, Video,
  Image as ImageIcon, Smile, ShoppingBag,
  Lock, ArrowRight, Plus, Zap, MessageSquare
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

const QUICK_REPLIES = ["Toujours disponible ?", "C'est votre dernier prix ?", "Livraison possible ?", "Vous faites les échanges ?"];

function Avatar({ user, size = 36, ring = false }: {
  user: { username?: string | null; full_name?: string | null; avatar_url?: string | null } | null | undefined;
  size?: number; ring?: boolean;
}) {
  const name = user?.username || user?.full_name || "?";
  return user?.avatar_url ? (
    <img src={user.avatar_url} alt={name} className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size, boxShadow: ring ? "0 0 0 2px rgba(139,92,246,0.4)" : "none" }} />
  ) : (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size, height: size,
        background: "linear-gradient(145deg, #9B6FF8, #7C3AED)",
        fontSize: size * 0.36,
        boxShadow: ring ? "0 0 0 2px rgba(139,92,246,0.4), 0 4px 12px rgba(124,58,237,0.3)" : "none",
      }}>
      {name[0]?.toUpperCase()}
    </div>
  );
}

/* ─── Welcome center (no conversation selected) ─── */
function WelcomeCenter() {
  const FEATURED = [
    { title: "Nike Air Force 1", price: "85 €", seller: "@style_lea", color: "#8B5CF6" },
    { title: "Veste Carhartt WIP", price: "120 €", seller: "@king_v", color: "#10B981" },
    { title: "Sac Jacquemus", price: "180 €", seller: "@luxmode", color: "#F59E0B" },
    { title: "Jordan 1 Retro High", price: "210 €", seller: "@sneaker_fr", color: "#EF4444" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Header zone */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
              Messagerie
            </h2>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.32)" }}>
              Contacte un vendeur depuis une annonce pour démarrer
            </p>
          </div>
          <Link href="/search"
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-[12.5px] font-medium text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #5b21b6)",
              boxShadow: "0 2px 12px rgba(124,58,237,0.28), inset 0 1px 0 rgba(255,255,255,0.10)",
            }}>
            <ShoppingBag style={{ width: 13, height: 13 }} />
            Explorer les articles
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mx-8 mb-7 grid grid-cols-3 gap-4">
        {[
          { label: "Membres actifs",      value: "50K+",  color: "#8B5CF6" },
          { label: "Transactions/jour",   value: "1 247", color: "#10B981" },
          { label: "Articles en ligne",   value: "32K",   color: "#F59E0B" },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-4 py-3 rounded-[10px]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[18px] font-bold mb-0.5" style={{ color }}>{value}</p>
            <p className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.30)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Featured articles to contact */}
      <div className="px-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.22)" }}>
            Articles populaires — contacte un vendeur
          </p>
          <Link href="/search" className="text-[11.5px] font-medium transition-colors"
            style={{ color: "rgba(139,92,246,0.55)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(139,92,246,0.55)"; }}>
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FEATURED.map(({ title, price, seller, color }) => (
            <Link key={title} href="/search"
              className="flex items-center gap-3.5 p-4 rounded-[10px] transition-all group"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.055)"; (e.currentTarget as HTMLElement).style.borderColor = `${color}28`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}>
              <div className="w-10 h-10 rounded-[8px] flex-shrink-0 flex items-center justify-center"
                style={{ background: `${color}14` }}>
                <ShoppingBag style={{ width: 16, height: 16, color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium truncate mb-0.5" style={{ color: "rgba(255,255,255,0.72)" }}>{title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}>{seller}</span>
                  <span className="text-[12.5px] font-semibold" style={{ color }}>{price}</span>
                </div>
              </div>
              <MessageSquare style={{ width: 13, height: 13, color: "rgba(255,255,255,0.18)", flexShrink: 0 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="mx-8 mt-6 mb-8 flex items-center gap-3 px-4 py-3 rounded-[8px]"
        style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)" }}>
        <Zap style={{ width: 13, height: 13, color: "#A78BFA", flexShrink: 0 }} />
        <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          Tous les messages sont chiffrés de bout en bout. Vos conversations sont privées.
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

      {/* ── Conversations panel (400px) ── */}
      <div className="flex flex-col flex-shrink-0 h-full" style={{ width: 400, borderRight: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[52px] flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-[14px] font-semibold" style={{ color: "rgba(255,255,255,0.72)", letterSpacing: "-0.01em" }}>
            Messages
          </span>
          <div className="flex items-center gap-2">
            {conversations.length > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-[5px] font-medium"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.30)" }}>
                {conversations.length}
              </span>
            )}
            <button className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-colors"
              style={{ color: "rgba(255,255,255,0.28)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.28)"; }}>
              <Plus style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-[7px]"
            style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Search style={{ width: 13, height: 13, flexShrink: 0, color: "rgba(255,255,255,0.28)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une conversation…"
              className="flex-1 bg-transparent text-[12.5px] text-white outline-none placeholder:text-white/22"
              style={{ caretColor: "#8B5CF6" }} />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <div className="w-12 h-12 rounded-[12px] flex items-center justify-center"
                style={{ background: "rgba(139,92,246,0.10)", border: "1px solid rgba(139,92,246,0.16)" }}>
                <MessageSquare style={{ width: 20, height: 20, color: "rgba(167,139,250,0.45)" }} />
              </div>
              <div>
                <p className="text-[13px] font-medium mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Aucune conversation
                </p>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.18)" }}>
                  Contacte un vendeur depuis une annonce
                </p>
              </div>
              <Link href="/search"
                className="flex items-center gap-1.5 px-4 py-2 rounded-[7px] text-[12px] font-medium transition-all"
                style={{
                  background: "rgba(139,92,246,0.12)",
                  border: "1px solid rgba(139,92,246,0.20)",
                  color: "#C4B5FD",
                }}>
                <ShoppingBag style={{ width: 12, height: 12 }} />
                Explorer les articles
              </Link>
            </div>
          ) : (
            <div className="py-1.5">
              {filtered.map(c => {
                const o = getOther(c);
                const isSelected = selected?.id === c.id;
                const hasUnread = (c.unread_count ?? 0) > 0;
                return (
                  <button key={c.id} onClick={() => setSelected(c)}
                    className="w-full flex items-start gap-3.5 px-4 py-3 text-left transition-all relative"
                    style={{
                      background: isSelected ? "rgba(139,92,246,0.10)" : "transparent",
                      borderLeft: isSelected ? "2px solid rgba(139,92,246,0.75)" : "2px solid transparent",
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>

                    <Avatar user={o} size={38} ring={isSelected} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[13px] truncate"
                          style={{ color: hasUnread ? "rgba(255,255,255,0.92)" : isSelected ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.52)", fontWeight: hasUnread ? 600 : 400 }}>
                          {o?.username || o?.full_name || "Utilisateur"}
                        </span>
                        <span className="text-[10px] flex-shrink-0" style={{ color: hasUnread ? "rgba(167,139,250,0.65)" : "rgba(255,255,255,0.18)" }}>
                          {c.last_message_at ? timeAgo(c.last_message_at) : ""}
                        </span>
                      </div>
                      {c.product && (
                        <p className="text-[11px] truncate mb-0.5" style={{ color: "rgba(167,139,250,0.42)" }}>
                          {c.product.title}
                        </p>
                      )}
                      <p className="text-[12px] truncate"
                        style={{ color: hasUnread ? "rgba(255,255,255,0.48)" : "rgba(255,255,255,0.22)" }}>
                        {c.last_message || "Nouvelle conversation"}
                      </p>
                    </div>

                    {hasUnread && (
                      <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[8.5px] font-bold text-white flex-shrink-0 mt-1"
                        style={{ background: "#7C3AED", boxShadow: "0 2px 8px rgba(124,58,237,0.5)" }}>
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

      {/* ── Center — chat or welcome ── */}
      {selected && other ? (
        <div className="flex-1 flex flex-col min-w-0 h-full">

          {/* Chat header */}
          <div className="flex items-center justify-between px-6 h-[52px] flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3">
              <Avatar user={other} size={28} />
              <div className="flex items-center gap-2.5">
                <span className="text-[14px] font-semibold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "-0.01em" }}>
                  {other.username || other.full_name}
                </span>
                {selected.product && (
                  <>
                    <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span>
                    <span className="text-[12px] truncate max-w-[220px]" style={{ color: "rgba(167,139,250,0.50)" }}>
                      {selected.product.title}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {[Phone, Video, MoreHorizontal].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.60)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)"; }}>
                  <Icon style={{ width: 15, height: 15 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-1" style={{ scrollbarWidth: "none" }}>
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center py-16">
                <Avatar user={other} size={56} ring />
                <p className="text-[17px] font-semibold mt-4 mb-1" style={{ color: "rgba(255,255,255,0.72)", letterSpacing: "-0.02em" }}>
                  {other.username || other.full_name}
                </p>
                {other.username && (
                  <p className="text-[12.5px] mb-2" style={{ color: "rgba(167,139,250,0.40)" }}>@{other.username}</p>
                )}
                {selected.product && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-[8px] mb-5 mt-2"
                    style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.14)" }}>
                    {selected.product.images?.[0] && (
                      <div className="w-8 h-8 rounded-[6px] overflow-hidden flex-shrink-0">
                        <Image src={selected.product.images[0]} alt="" width={32} height={32} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {selected.product.title}
                    </span>
                    {selected.product.price && (
                      <span className="text-[12.5px] font-semibold ml-1" style={{ color: "#A78BFA" }}>
                        {selected.product.price} €
                      </span>
                    )}
                  </div>
                )}
                <p className="text-[12.5px] mb-4" style={{ color: "rgba(255,255,255,0.22)" }}>
                  Commence la conversation
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                  {QUICK_REPLIES.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="px-3.5 py-1.5 rounded-[7px] text-[12px] transition-all"
                      style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.40)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.10)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.22)"; (e.currentTarget as HTMLElement).style.color = "#C4B5FD"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.045)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.40)"; }}>
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
                      {!isMe && !prevSame && <div className="mr-2.5 mt-0.5"><Avatar user={other} size={24} /></div>}
                      {!isMe && prevSame && <div style={{ width: 34 }} />}
                      <div style={{ maxWidth: "58%" }}>
                        <div className="px-4 py-2.5 text-[13.5px] leading-relaxed"
                          style={{
                            background: isMe ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "rgba(255,255,255,0.07)",
                            border: isMe ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,255,255,0.06)",
                            color: isMe ? "#fff" : "rgba(255,255,255,0.82)",
                            borderRadius: isMe
                              ? (prevSame ? "16px 5px 5px 16px" : "16px 16px 5px 16px")
                              : (prevSame ? "5px 16px 16px 5px" : "5px 16px 16px 16px"),
                            boxShadow: isMe ? "0 4px 14px rgba(109,40,217,0.32)" : "none",
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

          {/* Input bar */}
          <div className="px-5 pb-5 pt-3 flex-shrink-0">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-[10px]"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}>
              <button className="flex-shrink-0 transition-colors" style={{ color: "rgba(255,255,255,0.22)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
                <Smile style={{ width: 18, height: 18 }} />
              </button>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Envoyer un message…"
                className="flex-1 bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/20"
                style={{ caretColor: "#8B5CF6" }} />
              <button className="flex-shrink-0 transition-colors" style={{ color: "rgba(255,255,255,0.22)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
                <ImageIcon style={{ width: 18, height: 18 }} />
              </button>
              <button onClick={() => send()} disabled={!input.trim()}
                className="w-8 h-8 rounded-[7px] flex items-center justify-center transition-all disabled:opacity-20 flex-shrink-0"
                style={{
                  background: input.trim() ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : "rgba(255,255,255,0.07)",
                  boxShadow: input.trim() ? "0 3px 10px rgba(139,92,246,0.42)" : "none",
                }}>
                <Send style={{ width: 13, height: 13, color: "white" }} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <Lock style={{ width: 9, height: 9, color: "rgba(255,255,255,0.10)" }} />
              <span className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.10)" }}>Messages chiffrés de bout en bout</span>
            </div>
          </div>
        </div>
      ) : (
        <WelcomeCenter />
      )}

      {/* ── Right panel — conversation details ── */}
      {selected && other && (
        <div className="flex-shrink-0 flex flex-col overflow-y-auto h-full"
          style={{ width: 280, borderLeft: "1px solid rgba(255,255,255,0.06)", scrollbarWidth: "none" }}>

          {/* Header */}
          <div className="flex items-center h-[52px] px-5 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-[11.5px] font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.22)" }}>
              Détails
            </span>
          </div>

          {/* User */}
          <div className="p-5 flex flex-col items-center text-center"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Avatar user={other} size={52} ring />
            <p className="text-[14.5px] font-semibold mt-3.5 mb-0.5" style={{ color: "rgba(255,255,255,0.82)", letterSpacing: "-0.015em" }}>
              {other.username || other.full_name}
            </p>
            {other.username && (
              <p className="text-[12px] mb-4" style={{ color: "rgba(167,139,250,0.38)" }}>@{other.username}</p>
            )}
            <div className="flex items-center gap-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11.5px]" style={{ color: "rgba(52,211,153,0.60)" }}>En ligne</span>
            </div>
            <Link href={`/profile/${other.id}`}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-[7px] text-[12.5px] font-medium transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.42)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.25)"; (e.currentTarget as HTMLElement).style.color = "#A78BFA"; (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.07)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.42)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              Voir le profil <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>

          {/* Stats */}
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.18)" }}>Vendeur</p>
            {[
              { label: "Note moyenne", value: "4.8 ★", color: "#F59E0B" },
              { label: "Ventes totales", value: "24",    color: "#10B981" },
              { label: "Annonces actives", value: "12", color: "#8B5CF6" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}>
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.32)" }}>{label}</span>
                <span className="text-[12px] font-semibold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Product */}
          {selected.product && (
            <div className="px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.18)" }}>Article</p>
              <Link href={`/products/${selected.product.id}`}
                className="block rounded-[10px] overflow-hidden transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.22)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                {selected.product.images?.[0] && (
                  <div className="relative" style={{ aspectRatio: "16/9" }}>
                    <Image src={selected.product.images[0]} alt={selected.product.title} fill className="object-cover" />
                  </div>
                )}
                <div className="px-3 py-2.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-[12.5px] font-medium text-white/65 truncate mb-0.5">{selected.product.title}</p>
                  {selected.product.price && (
                    <p className="text-[13.5px] font-semibold" style={{ color: "#A78BFA" }}>{selected.product.price} €</p>
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
