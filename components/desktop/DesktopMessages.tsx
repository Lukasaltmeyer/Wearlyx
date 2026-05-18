"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, Send, MoreHorizontal, Phone, Video,
  Image as ImageIcon, Smile, ShoppingBag, Package,
  Star, Lock, ArrowRight, Plus
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

function Avatar({ user, size = 28 }: {
  user: { username?: string | null; full_name?: string | null; avatar_url?: string | null } | null | undefined;
  size?: number;
}) {
  const name = user?.username || user?.full_name || "?";
  return user?.avatar_url ? (
    <img src={user.avatar_url} alt={name} className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size }} />
  ) : (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size, height: size,
        background: "linear-gradient(145deg, #9B6FF8, #7C3AED)",
        fontSize: size * 0.38,
      }}>
      {name[0]?.toUpperCase()}
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
      style={{ background: "radial-gradient(ellipse at 40% 0%, #0b0618 0%, #06040e 50%, #040309 100%)" }}>

      {/* ── Left panel — conversation list ── */}
      <div className="flex flex-col flex-shrink-0 h-full" style={{ width: 260, borderRight: "1px solid rgba(255,255,255,0.045)" }}>

        {/* Panel header */}
        <div className="flex items-center justify-between px-3 h-11 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}>
          <span className="text-[12.5px] font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>Messages</span>
          <div className="flex items-center gap-1">
            {conversations.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] font-medium"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }}>
                {conversations.length}
              </span>
            )}
            <button className="w-6 h-6 rounded-[5px] flex items-center justify-center transition-colors"
              style={{ color: "rgba(255,255,255,0.22)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
              <Plus style={{ width: 12, height: 12 }} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-2 py-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px]"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Search style={{ width: 11, height: 11, flexShrink: 0, color: "rgba(255,255,255,0.22)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="flex-1 bg-transparent text-[11.5px] text-white outline-none placeholder:text-white/20"
              style={{ caretColor: "#8B5CF6" }} />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 px-4">
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.20)" }}>Aucune conversation</p>
              <Link href="/search" className="text-[11px] font-medium transition-colors"
                style={{ color: "rgba(139,92,246,0.6)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(139,92,246,0.6)"; }}>
                Explorer les articles →
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
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors relative"
                    style={{
                      background: isSelected ? "rgba(139,92,246,0.10)" : "transparent",
                      borderLeft: isSelected ? "2px solid #8B5CF6" : "2px solid transparent",
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>

                    <Avatar user={o} size={30} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[12.5px] truncate"
                          style={{ color: hasUnread ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.55)", fontWeight: hasUnread ? 600 : 400 }}>
                          {o?.username || o?.full_name || "Utilisateur"}
                        </span>
                        <span className="text-[9.5px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.20)" }}>
                          {c.last_message_at ? timeAgo(c.last_message_at) : ""}
                        </span>
                      </div>
                      <p className="text-[11px] truncate"
                        style={{ color: hasUnread ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.20)" }}>
                        {c.last_message || (c.product?.title ?? "Nouvelle conversation")}
                      </p>
                    </div>

                    {hasUnread && (
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
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

      {/* ── Center — chat area ── */}
      {selected && other ? (
        <div className="flex-1 flex flex-col min-w-0 h-full">

          {/* Chat header */}
          <div className="flex items-center justify-between px-5 h-11 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}>
            <div className="flex items-center gap-2.5">
              <Avatar user={other} size={24} />
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "-0.01em" }}>
                  {other.username || other.full_name}
                </span>
                {selected.product && (
                  <>
                    <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>·</span>
                    <span className="text-[11.5px] truncate max-w-[200px]" style={{ color: "rgba(167,139,250,0.55)" }}>
                      {selected.product.title}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {[Phone, Video, MoreHorizontal].map((Icon, i) => (
                <button key={i} className="w-7 h-7 rounded-[5px] flex items-center justify-center transition-colors"
                  style={{ color: "rgba(255,255,255,0.22)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
                  <Icon style={{ width: 14, height: 14 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1" style={{ scrollbarWidth: "none" }}>
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <Avatar user={other} size={48} />
                <p className="text-[14px] font-semibold mt-3 mb-1" style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "-0.01em" }}>
                  {other.username || other.full_name}
                </p>
                {selected.product && (
                  <p className="text-[12px] mb-4" style={{ color: "rgba(167,139,250,0.45)" }}>
                    À propos de : {selected.product.title}
                  </p>
                )}
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.20)" }}>
                  Commence la conversation ci-dessous
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center mt-5">
                  {["Toujours disponible ?", "C'est votre dernier prix ?", "Livraison possible ?"].map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="px-3 py-1.5 rounded-[6px] text-[11.5px] transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.38)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.09)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.20)"; (e.currentTarget as HTMLElement).style.color = "#C4B5FD"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}>
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
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"} ${prevSame ? "mt-0.5" : "mt-3"}`}>
                      {!isMe && !prevSame && <div className="mr-2 mt-0.5 flex-shrink-0"><Avatar user={other} size={22} /></div>}
                      {!isMe && prevSame && <div style={{ width: 30 }} />}
                      <div style={{ maxWidth: "60%" }}>
                        <div className="px-3.5 py-2 text-[13px] leading-relaxed"
                          style={{
                            background: isMe ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "rgba(255,255,255,0.07)",
                            border: isMe ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,255,255,0.06)",
                            color: isMe ? "#fff" : "rgba(255,255,255,0.80)",
                            borderRadius: isMe
                              ? (prevSame ? "14px 4px 4px 14px" : "14px 14px 4px 14px")
                              : (prevSame ? "4px 14px 14px 4px" : "4px 14px 14px 14px"),
                            boxShadow: isMe ? "0 2px 10px rgba(109,40,217,0.28)" : "none",
                          }}>
                          {m.content}
                        </div>
                        {idx === messages.length - 1 && (
                          <p className={`text-[9px] mt-1 px-1 ${isMe ? "text-right" : "text-left"}`}
                            style={{ color: "rgba(255,255,255,0.14)" }}>
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
          <div className="px-4 pb-4 pt-2 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-[8px]"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}>
              <button className="flex-shrink-0 transition-colors" style={{ color: "rgba(255,255,255,0.22)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
                <Smile style={{ width: 16, height: 16 }} />
              </button>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Message…"
                className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/20"
                style={{ caretColor: "#8B5CF6" }} />
              <button className="flex-shrink-0 transition-colors" style={{ color: "rgba(255,255,255,0.22)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
                <ImageIcon style={{ width: 16, height: 16 }} />
              </button>
              <button onClick={() => send()} disabled={!input.trim()}
                className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-all disabled:opacity-20 flex-shrink-0"
                style={{
                  background: input.trim() ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : "rgba(255,255,255,0.07)",
                  boxShadow: input.trim() ? "0 2px 8px rgba(139,92,246,0.40)" : "none",
                }}>
                <Send style={{ width: 12, height: 12, color: "white" }} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1 mt-1.5">
              <Lock style={{ width: 8, height: 8, color: "rgba(255,255,255,0.10)" }} />
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.10)" }}>Chiffré de bout en bout</span>
            </div>
          </div>
        </div>
      ) : (
        /* ── No conversation selected ── */
        <div className="flex-1 flex flex-col items-center justify-center h-full">
          <p className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.18)", letterSpacing: "-0.01em" }}>
            Sélectionne une conversation
          </p>
          <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.10)" }}>
            ou contacte un vendeur depuis une annonce
          </p>
        </div>
      )}

      {/* ── Right panel — only when conversation selected ── */}
      {selected && other && (
        <div className="flex-shrink-0 flex flex-col overflow-y-auto h-full" style={{ width: 220, borderLeft: "1px solid rgba(255,255,255,0.045)", scrollbarWidth: "none" }}>

          {/* Header */}
          <div className="flex items-center h-11 px-4 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}>
            <span className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.22)" }}>
              Détails
            </span>
          </div>

          {/* User info */}
          <div className="p-4 flex flex-col items-center text-center"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}>
            <Avatar user={other} size={44} />
            <p className="text-[13px] font-semibold mt-3 mb-0.5" style={{ color: "rgba(255,255,255,0.80)", letterSpacing: "-0.01em" }}>
              {other.username || other.full_name}
            </p>
            {other.username && (
              <p className="text-[11px] mb-3" style={{ color: "rgba(167,139,250,0.40)" }}>@{other.username}</p>
            )}
            <Link href={`/profile/${other.id}`}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-[6px] text-[11.5px] font-medium transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.38)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.22)"; (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}>
              Voir le profil <ArrowRight style={{ width: 11, height: 11 }} />
            </Link>
          </div>

          {/* Stats */}
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}>
            <p className="text-[9.5px] font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.18)" }}>
              Informations
            </p>
            {[
              { icon: Star,        label: "Note",     value: "4.8 ★", color: "#F59E0B" },
              { icon: ShoppingBag, label: "Ventes",   value: "24",    color: "#10B981" },
              { icon: Package,     label: "Annonces", value: "12",    color: "#8B5CF6" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-[5px]"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.30)" }}>{label}</span>
                <span className="text-[11.5px] font-semibold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Product */}
          {selected.product && (
            <div className="px-4 py-3">
              <p className="text-[9.5px] font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.18)" }}>
                Article
              </p>
              <Link href={`/products/${selected.product.id}`}
                className="flex items-center gap-2.5 p-2.5 rounded-[8px] transition-colors"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.18)"; (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}>
                {selected.product.images?.[0] && (
                  <div className="w-10 h-10 rounded-[6px] overflow-hidden flex-shrink-0">
                    <Image src={selected.product.images[0]} alt={selected.product.title} width={40} height={40} className="object-cover w-full h-full" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[11.5px] font-medium text-white/65 truncate">{selected.product.title}</p>
                  {selected.product.price && (
                    <p className="text-[12px] font-semibold" style={{ color: "#A78BFA" }}>{selected.product.price} €</p>
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
