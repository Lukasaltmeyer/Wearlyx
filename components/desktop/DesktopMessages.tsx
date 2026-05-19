"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, Send, MoreHorizontal,
  Image as ImageIcon, Smile, ShoppingBag,
  Lock, ArrowRight, Plus, MessageSquare, ChevronRight,
  Sparkles, TrendingUp, Clock
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
  { name: "Léa Martin",   username: "stylebylea",    items: 42, rating: "4.9", status: "En ligne",    color: "#8B5CF6", tag: "Mode" },
  { name: "Kevin V.",     username: "vintageking",   items: 28, rating: "4.8", status: "Il y a 1h",   color: "#10B981", tag: "Vintage" },
  { name: "Lux Mode",     username: "luxmode_paris", items: 35, rating: "4.7", status: "Il y a 3h",   color: "#F59E0B", tag: "Luxe" },
  { name: "Sneaker FR",   username: "sneaker_fr",    items: 19, rating: "4.6", status: "Il y a 1j",   color: "#EF4444", tag: "Sneakers" },
  { name: "Casa Chic",    username: "casachic",      items: 51, rating: "4.9", status: "En ligne",    color: "#EC4899", tag: "Maison" },
];

const TRENDING_SEARCHES = [
  "Nike Air Force 1", "Levi's 501", "Sac Zara", "Jordan 1", "Manteau vintage", "Blazer oversize",
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
          style={{ background: "#34D399", borderColor: "#040309" }} />
      )}
    </div>
  );
}

/* ─── Welcome screen — two-column, full-width design ─── */
function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>

      {/* Hero header */}
      <div className="px-12 pt-12 pb-8 flex items-end justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.055)" }}>
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: "rgba(139,92,246,0.10)", border: "1px solid rgba(139,92,246,0.16)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 5px rgba(52,211,153,0.6)" }} />
              <span className="text-[10.5px] font-semibold" style={{ color: "rgba(167,139,250,0.75)" }}>1 247 ventes aujourd'hui</span>
            </div>
          </div>
          <h1 className="text-[32px] font-black text-white mb-2" style={{ letterSpacing: "-0.035em", lineHeight: 1.1 }}>
            Messagerie Wearlyx
          </h1>
          <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.32)", maxWidth: 420 }}>
            Contacte des vendeurs, négocie et finalise tes achats — tout depuis une seule interface.
          </p>
        </div>

        <Link href="/search"
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-[9px] text-[13.5px] font-semibold text-white transition-all hover:brightness-110 flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #5b21b6)",
            boxShadow: "0 3px 16px rgba(124,58,237,0.28), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}>
          <ShoppingBag style={{ width: 15, height: 15 }} />
          Explorer les articles
        </Link>
      </div>

      {/* Two-column body */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left column — sellers table */}
        <div className="flex-1 px-12 py-8 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

          {/* Section: Active sellers */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles style={{ width: 13, height: 13, color: "#A78BFA" }} />
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.30)" }}>
                Vendeurs actifs
              </span>
            </div>
            <Link href="/search"
              className="flex items-center gap-1 text-[12px] transition-colors"
              style={{ color: "rgba(139,92,246,0.50)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(139,92,246,0.50)"; }}>
              Voir tout <ChevronRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>

          {/* Table */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto", gap: 0 }}>
            {/* Header */}
            {["Vendeur", "Catégorie", "Articles", "Note", "Statut"].map((h, i) => (
              <div key={h}
                className="text-[10px] font-semibold uppercase tracking-widest px-2 pb-2.5"
                style={{
                  color: "rgba(255,255,255,0.18)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  textAlign: i > 1 ? "right" : "left",
                }}>
                {h}
              </div>
            ))}

            {SUGGESTED_SELLERS.map(({ name, username, items, rating, status, color, tag }) => (
              <div key={username} className="contents group cursor-pointer">
                {/* Seller */}
                <div className="flex items-center gap-3.5 px-2 py-3.5 transition-colors"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => { (e.currentTarget.parentElement as HTMLElement | null)?.querySelectorAll(".seller-row-cell").forEach(el => (el as HTMLElement).style.background = "rgba(255,255,255,0.025)"); }}
                  onMouseLeave={e => { (e.currentTarget.parentElement as HTMLElement | null)?.querySelectorAll(".seller-row-cell").forEach(el => (el as HTMLElement).style.background = "transparent"); }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-[13px] flex-shrink-0"
                    style={{ background: `linear-gradient(145deg, ${color}55, ${color}28)`, border: `1px solid ${color}30` }}>
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: "-0.01em" }}>{name}</p>
                    <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>@{username}</p>
                  </div>
                </div>
                {/* Tag */}
                <div className="flex items-center justify-start px-4 py-3.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-[4px]"
                    style={{ background: `${color}14`, color: `${color}bb`, border: `1px solid ${color}22` }}>
                    {tag}
                  </span>
                </div>
                {/* Items */}
                <div className="flex items-center justify-end px-4 py-3.5 text-[13.5px] font-medium"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.40)" }}>
                  {items}
                </div>
                {/* Rating */}
                <div className="flex items-center justify-end px-4 py-3.5 text-[13.5px] font-semibold"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#F59E0B" }}>
                  {rating} ★
                </div>
                {/* Status */}
                <div className="flex items-center justify-end gap-2 px-2 py-3.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: status === "En ligne" ? "#34D399" : "rgba(255,255,255,0.18)" }} />
                  <span className="text-[12.5px]"
                    style={{ color: status === "En ligne" ? "rgba(52,211,153,0.70)" : "rgba(255,255,255,0.25)" }}>
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — contextual info */}
        <div className="flex-shrink-0 flex flex-col py-8 px-8 gap-7 overflow-y-auto"
          style={{ width: 280, borderLeft: "1px solid rgba(255,255,255,0.05)", scrollbarWidth: "none" }}>

          {/* How it works */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock style={{ width: 12, height: 12, color: "#A78BFA" }} />
              <p className="text-[10.5px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.24)" }}>
                Comment ça marche
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { step: "1", label: "Trouve un article", desc: "Explore ou recherche sur Wearlyx" },
                { step: "2", label: "Contacte le vendeur", desc: "Pose tes questions directement" },
                { step: "3", label: "Finalise l'achat", desc: "Paye en toute sécurité via la plateforme" },
              ].map(({ step, label, desc }) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.22)" }}>
                    <span className="text-[9px] font-bold" style={{ color: "#A78BFA" }}>{step}</span>
                  </div>
                  <div>
                    <p className="text-[12.5px] font-medium mb-0.5" style={{ color: "rgba(255,255,255,0.62)" }}>{label}</p>
                    <p className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.25)" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending searches */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp style={{ width: 12, height: 12, color: "#A78BFA" }} />
              <p className="text-[10.5px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.24)" }}>
                Recherches tendance
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map(t => (
                <Link key={t}
                  href={`/search?q=${encodeURIComponent(t)}`}
                  className="text-[11.5px] font-medium px-3 py-1.5 rounded-[6px] transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.38)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.22)"; (e.currentTarget as HTMLElement).style.color = "#C4B5FD"; (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.08)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}>
                  {t}
                </Link>
              ))}
            </div>
          </div>

          {/* Encryption note */}
          <div className="mt-auto flex items-center gap-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <Lock style={{ width: 10, height: 10, color: "rgba(255,255,255,0.14)", flexShrink: 0 }} />
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.16)" }}>
              Messages chiffrés de bout en bout
            </p>
          </div>
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
    <div className="flex h-[100dvh] overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 45% 0%, #0d0820 0%, #070510 45%, #040309 100%)" }}>

      {/* ── Conversations panel ── */}
      <div className="flex flex-col flex-shrink-0 h-full"
        style={{ width: 380, borderRight: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 flex-shrink-0"
          style={{ height: 56, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-[15px] font-semibold" style={{ color: "rgba(255,255,255,0.72)", letterSpacing: "-0.015em" }}>
            Messages
          </span>
          <div className="flex items-center gap-2">
            {conversations.length > 0 && (
              <span className="text-[10.5px] px-2 py-0.5 rounded-[5px]"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.28)" }}>
                {conversations.length}
              </span>
            )}
            <button className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-colors"
              style={{ color: "rgba(255,255,255,0.22)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
              <Plus style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-[8px]"
            style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Search style={{ width: 13, height: 13, flexShrink: 0, color: "rgba(255,255,255,0.22)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une conversation…"
              className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/20"
              style={{ caretColor: "#8B5CF6" }} />
          </div>
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <MessageSquare style={{ width: 28, height: 28, color: "rgba(139,92,246,0.28)" }} strokeWidth={1.4} />
              <div>
                <p className="text-[13.5px] font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.28)" }}>
                  Aucune conversation
                </p>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.14)" }}>
                  Contacte un vendeur depuis une annonce
                </p>
              </div>
              <Link href="/search"
                className="flex items-center gap-1.5 px-4 py-2 rounded-[7px] text-[12.5px] font-medium transition-all"
                style={{ background: "rgba(139,92,246,0.11)", border: "1px solid rgba(139,92,246,0.18)", color: "#C4B5FD" }}>
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
                    className="w-full flex items-center gap-3.5 px-5 py-3.5 text-left transition-colors relative"
                    style={{
                      background: isSelected ? "rgba(139,92,246,0.09)" : "transparent",
                      borderLeft: `2px solid ${isSelected ? "rgba(139,92,246,0.65)" : "transparent"}`,
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.035)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <Avatar user={o} size={40} online={isSelected} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[14px] truncate"
                          style={{ color: hasUnread ? "rgba(255,255,255,0.90)" : isSelected ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.48)", fontWeight: hasUnread ? 600 : 400, letterSpacing: "-0.01em" }}>
                          {o?.username || o?.full_name || "Utilisateur"}
                        </span>
                        <span className="text-[10.5px] flex-shrink-0" style={{ color: hasUnread ? "rgba(167,139,250,0.55)" : "rgba(255,255,255,0.15)" }}>
                          {c.last_message_at ? timeAgo(c.last_message_at) : ""}
                        </span>
                      </div>
                      {c.product && (
                        <p className="text-[11.5px] truncate mb-0.5 font-medium" style={{ color: "rgba(167,139,250,0.40)" }}>
                          {c.product.title}
                        </p>
                      )}
                      <p className="text-[12.5px] truncate"
                        style={{ color: hasUnread ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.18)" }}>
                        {c.last_message || "Nouvelle conversation"}
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
          <div className="flex items-center justify-between px-7 flex-shrink-0"
            style={{ height: 56, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3.5">
              <Avatar user={other} size={30} online />
              <div>
                <span className="text-[15px] font-semibold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "-0.015em" }}>
                  {other.username || other.full_name}
                </span>
                {selected.product && (
                  <span className="ml-3 text-[12.5px]" style={{ color: "rgba(167,139,250,0.45)" }}>
                    · {selected.product.title}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {[MoreHorizontal].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-[7px] flex items-center justify-center transition-colors"
                  style={{ color: "rgba(255,255,255,0.20)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.60)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.20)"; }}>
                  <Icon style={{ width: 16, height: 16 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-9 py-7 flex flex-col gap-1" style={{ scrollbarWidth: "none" }}>
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-start px-4 max-w-2xl">
                <Avatar user={other} size={64} online />
                <h2 className="text-[22px] font-bold mt-6 mb-1 text-white" style={{ letterSpacing: "-0.025em" }}>
                  {other.username || other.full_name}
                </h2>
                {other.username && (
                  <p className="text-[13px] mb-2" style={{ color: "rgba(167,139,250,0.40)" }}>@{other.username}</p>
                )}
                {selected.product && (
                  <div className="flex items-center gap-2.5 mt-1 mb-6 px-3 py-2 rounded-[8px]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {selected.product.images?.[0] && (
                      <div className="w-8 h-8 rounded-[6px] overflow-hidden flex-shrink-0">
                        <Image src={selected.product.images[0]} alt="" width={32} height={32} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {selected.product.title}
                    </span>
                    {selected.product.price && (
                      <span className="text-[13px] font-semibold ml-1" style={{ color: "#A78BFA" }}>
                        · {selected.product.price} €
                      </span>
                    )}
                  </div>
                )}
                <p className="text-[13.5px] mb-6" style={{ color: "rgba(255,255,255,0.22)" }}>
                  Début de ta conversation — envoie un premier message.
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="px-4 py-2 rounded-[7px] text-[13px] transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.40)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.10)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.22)"; (e.currentTarget as HTMLElement).style.color = "#C4B5FD"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.40)"; }}>
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
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"} ${prevSame ? "mt-0.5" : "mt-5"}`}>
                      {!isMe && !prevSame && <div className="mr-3 mt-0.5 flex-shrink-0"><Avatar user={other} size={28} /></div>}
                      {!isMe && prevSame && <div style={{ width: 40 }} />}
                      <div style={{ maxWidth: "58%" }}>
                        <div className="px-4 py-3 text-[14px] leading-relaxed"
                          style={{
                            background: isMe ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            color: isMe ? "#fff" : "rgba(255,255,255,0.80)",
                            borderRadius: isMe
                              ? (prevSame ? "16px 5px 5px 16px" : "16px 16px 5px 16px")
                              : (prevSame ? "5px 16px 16px 5px" : "5px 16px 16px 16px"),
                            boxShadow: isMe ? "0 4px 18px rgba(109,40,217,0.28)" : "none",
                          }}>
                          {m.content}
                        </div>
                        {idx === messages.length - 1 && (
                          <p className={`text-[10px] mt-1.5 px-1 ${isMe ? "text-right" : ""}`}
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
          <div className="px-7 pb-6 pt-3 flex-shrink-0">
            <div className="flex items-center gap-3 px-5 py-3 rounded-[10px]"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <button className="flex-shrink-0 transition-colors" style={{ color: "rgba(255,255,255,0.20)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.52)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.20)"; }}>
                <Smile style={{ width: 18, height: 18 }} />
              </button>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder={`Message à ${other.username || other.full_name}…`}
                className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/20"
                style={{ caretColor: "#8B5CF6" }} />
              <button className="flex-shrink-0 transition-colors" style={{ color: "rgba(255,255,255,0.20)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.52)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.20)"; }}>
                <ImageIcon style={{ width: 18, height: 18 }} />
              </button>
              <button onClick={() => send()} disabled={!input.trim()}
                className="w-9 h-9 rounded-[8px] flex items-center justify-center transition-all disabled:opacity-20 flex-shrink-0"
                style={{ background: input.trim() ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : "rgba(255,255,255,0.06)", boxShadow: input.trim() ? "0 2px 12px rgba(139,92,246,0.38)" : "none" }}>
                <Send style={{ width: 14, height: 14, color: "white" }} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <Lock style={{ width: 9, height: 9, color: "rgba(255,255,255,0.09)" }} />
              <span className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.09)" }}>Chiffré de bout en bout</span>
            </div>
          </div>
        </div>
      ) : (
        <WelcomeScreen />
      )}

      {/* ── Right panel — only when conversation active ── */}
      {selected && other && (
        <div className="flex-shrink-0 flex flex-col overflow-y-auto h-full"
          style={{ width: 300, borderLeft: "1px solid rgba(255,255,255,0.06)", scrollbarWidth: "none" }}>

          {/* Header */}
          <div className="flex items-center px-6 flex-shrink-0"
            style={{ height: 56, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-[10.5px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.20)" }}>
              Informations
            </span>
          </div>

          {/* Seller profile */}
          <div className="px-6 pt-7 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-start gap-4 mb-6">
              <Avatar user={other} size={48} online />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold truncate" style={{ color: "rgba(255,255,255,0.82)", letterSpacing: "-0.015em" }}>
                  {other.username || other.full_name}
                </p>
                {other.username && (
                  <p className="text-[12.5px] mt-0.5" style={{ color: "rgba(167,139,250,0.38)" }}>@{other.username}</p>
                )}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[12px]" style={{ color: "rgba(52,211,153,0.55)" }}>En ligne</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { label: "Note", value: "4.8★", color: "#F59E0B" },
                { label: "Ventes", value: "24", color: "#10B981" },
                { label: "Annonces", value: "12", color: "#8B5CF6" },
              ].map(({ label, value, color }) => (
                <div key={label} className="px-2 py-3 rounded-[8px] text-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[14px] font-semibold mb-0.5" style={{ color }}>{value}</p>
                  <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.26)" }}>{label}</p>
                </div>
              ))}
            </div>

            <Link href={`/profile/${other.id}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[8px] text-[13px] font-medium transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.38)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.24)"; (e.currentTarget as HTMLElement).style.color = "#A78BFA"; (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.07)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              Voir le profil <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>

          {/* Article */}
          {selected.product && (
            <div className="px-6 pt-6 pb-5">
              <p className="text-[10.5px] font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.18)" }}>
                Article concerné
              </p>
              <Link href={`/products/${selected.product.id}`}
                className="block rounded-[10px] overflow-hidden transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.09)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.26)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)"; }}>
                {selected.product.images?.[0] && (
                  <div className="relative" style={{ aspectRatio: "16/9" }}>
                    <Image src={selected.product.images[0]} alt={selected.product.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between px-3.5 py-3"
                  style={{ background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[13px] font-medium truncate flex-1 mr-2" style={{ color: "rgba(255,255,255,0.62)" }}>
                    {selected.product.title}
                  </p>
                  {selected.product.price && (
                    <p className="text-[14px] font-semibold flex-shrink-0" style={{ color: "#A78BFA" }}>
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
