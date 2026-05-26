"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, Send, MoreHorizontal, Image as ImageIcon, Smile, ShoppingBag,
  Lock, ArrowRight, Plus,
  Star, MapPin, Calendar, Package, MessageCircle, ExternalLink,
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

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio?: string | null;
  city?: string | null;
  created_at?: string | null;
  rating?: number | null;
  total_sales?: number | null;
}

interface Product {
  id: string;
  title: string;
  price: number;
  images?: string[];
}

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  reviewer?: { username: string | null; full_name: string | null; avatar_url: string | null } | null;
}

const QUICK_REPLIES = ["Toujours disponible ?", "C'est votre dernier prix ?", "Livraison possible ?", "Échange possible ?", "Je prends !"];

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
        <div className="rounded-full flex items-center justify-center font-bold text-white"
          style={{ width: size, height: size, background: "linear-gradient(145deg,#9B6FF8,#7C3AED)", fontSize: size * 0.38 }}>
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

/* ─── Empty state when no conversation selected ─── */
function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.18)" }}>
        <MessageCircle className="w-9 h-9 text-purple-400" />
      </div>
      <div className="text-center">
        <p className="text-[18px] font-bold text-white mb-2">Tes messages</p>
        <p className="text-[13px] text-white/30 leading-relaxed max-w-[260px]">
          Sélectionne une conversation ou contacte un vendeur depuis une annonce.
        </p>
      </div>
      <Link href="/search"
        className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white transition-all"
        style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow: "0 4px 18px rgba(124,58,237,0.3)" }}>
        <ShoppingBag className="w-4 h-4" />
        Explorer les articles
      </Link>
    </div>
  );
}

/* ─── Right panel with tabs ─── */
type Tab = "profil" | "annonces" | "avis" | "a-propos";

function RightPanel({ other, product }: {
  other: { id: string; username: string | null; full_name: string | null; avatar_url: string | null };
  product?: { id: string; title: string; images?: string[]; price?: number } | null;
}) {
  const [tab, setTab] = useState<Tab>("profil");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const supabase = createClient();

  useEffect(() => {
    setTab("profil");
    setProfile(null); setProducts([]); setReviews([]);
    supabase.from("profiles").select("*").eq("id", other.id).single()
      .then(({ data }) => { if (data) setProfile(data); });
  }, [other.id]);

  useEffect(() => {
    if (tab === "annonces" && products.length === 0) {
      supabase.from("products").select("id,title,price,images").eq("seller_id", other.id).eq("status", "active").limit(12)
        .then(({ data }) => { if (data) setProducts(data); });
    }
    if (tab === "avis" && reviews.length === 0) {
      supabase.from("reviews").select("id,rating,comment,created_at,reviewer:profiles!reviewer_id(username,full_name,avatar_url)")
        .eq("reviewed_id", other.id).order("created_at", { ascending: false }).limit(20)
        .then(({ data }) => {
          if (data) setReviews(data.map((r: any) => ({ ...r, reviewer: Array.isArray(r.reviewer) ? r.reviewer[0] ?? null : r.reviewer })) as Review[]);
        });
    }
  }, [tab, other.id]);

  const displayName = other.username || other.full_name || "Utilisateur";
  const avgRating = profile?.rating ?? (reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null);

  const TABS: { key: Tab; label: string }[] = [
    { key: "profil",    label: "Profil" },
    { key: "annonces",  label: "Annonces" },
    { key: "avis",      label: "Avis" },
    { key: "a-propos",  label: "À propos" },
  ];

  return (
    <div className="flex-shrink-0 flex flex-col h-full overflow-hidden"
      style={{ width: 300, borderLeft: "1px solid rgba(255,255,255,0.06)" }}>

      {/* Tab bar */}
      <div className="flex flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingTop: 14, paddingLeft: 12, paddingRight: 12 }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-1 text-[12px] font-semibold pb-3 transition-all"
            style={{
              color: tab === key ? "#A78BFA" : "rgba(255,255,255,0.25)",
              borderBottom: tab === key ? "2px solid #8B5CF6" : "2px solid transparent",
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

        {/* ── PROFIL ── */}
        {tab === "profil" && (
          <div className="px-5 py-6 flex flex-col gap-5">
            {/* Avatar + name */}
            <div className="flex flex-col items-center text-center gap-3">
              <Avatar user={other} size={72} online />
              <div>
                <p className="text-[16px] font-bold text-white">{displayName}</p>
                {other.username && <p className="text-[12px] text-purple-400/60 mt-0.5">@{other.username}</p>}
                <div className="flex items-center justify-center gap-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-emerald-400/60">En ligne</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Note", value: avgRating ? `${avgRating.toFixed(1)}★` : "—", color: "#F59E0B" },
                { label: "Ventes", value: String(profile?.total_sales ?? "—"), color: "#10B981" },
                { label: "Annonces", value: String(products.length || "—"), color: "#8B5CF6" },
              ].map(({ label, value, color }) => (
                <div key={label} className="px-2 py-3 rounded-[10px] text-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-[14px] font-bold mb-0.5" style={{ color }}>{value}</p>
                  <p className="text-[10px] text-white/25">{label}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Link href={`/profile/${other.id}`}
                className="flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all"
                style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "white", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>
                Voir le profil complet <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link href={`/profile/${other.id}#annonces`}
                className="flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[13px] font-medium transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.45)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.3)"; (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}>
                <Package className="w-3.5 h-3.5" /> Voir ses annonces
              </Link>
            </div>

            {/* Product in conversation */}
            {product && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20 mb-3">Article de la conversation</p>
                <Link href={`/products/${product.id}`}
                  className="block rounded-[12px] overflow-hidden transition-all"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                  {product.images?.[0] && (
                    <div className="relative" style={{ aspectRatio: "16/9" }}>
                      <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex items-center justify-between px-3 py-2.5"
                    style={{ background: "rgba(255,255,255,0.03)" }}>
                    <p className="text-[12px] font-medium truncate flex-1 mr-2 text-white/60">{product.title}</p>
                    {product.price && <p className="text-[13px] font-bold text-purple-400 flex-shrink-0">{product.price}€</p>}
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── ANNONCES ── */}
        {tab === "annonces" && (
          <div className="px-4 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20 mb-4">
              Annonces de {displayName}
            </p>
            {products.length === 0 ? (
              <p className="text-[13px] text-white/25 text-center py-10">Aucune annonce active</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {products.map(p => (
                  <Link key={p.id} href={`/products/${p.id}`}
                    className="block rounded-[10px] overflow-hidden transition-all"
                    style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.3)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}>
                    <div className="aspect-square bg-white/5 relative overflow-hidden">
                      {p.images?.[0]
                        ? <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-white/15" /></div>
                      }
                    </div>
                    <div className="px-2 py-2" style={{ background: "rgba(0,0,0,0.3)" }}>
                      <p className="text-[11px] text-white/55 truncate">{p.title}</p>
                      <p className="text-[12px] font-bold text-purple-400">{p.price}€</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── AVIS ── */}
        {tab === "avis" && (
          <div className="px-4 py-5">
            {/* Average */}
            {reviews.length > 0 && avgRating && (
              <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-[12px]"
                style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.15)" }}>
                <p className="text-[32px] font-black text-amber-400 leading-none">{avgRating.toFixed(1)}</p>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-3.5 h-3.5" style={{ color: s <= Math.round(avgRating) ? "#F59E0B" : "rgba(255,255,255,0.12)", fill: s <= Math.round(avgRating) ? "#F59E0B" : "none" }} />
                    ))}
                  </div>
                  <p className="text-[11px] text-white/30">{reviews.length} avis</p>
                </div>
              </div>
            )}
            {reviews.length === 0 ? (
              <p className="text-[13px] text-white/25 text-center py-10">Pas encore d&apos;avis</p>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews.map(r => (
                  <div key={r.id} className="px-4 py-3.5 rounded-[12px]"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar user={r.reviewer} size={24} />
                        <span className="text-[12px] font-medium text-white/60">
                          {r.reviewer?.username || r.reviewer?.full_name || "Anonyme"}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className="w-3 h-3" style={{ color: s <= r.rating ? "#F59E0B" : "rgba(255,255,255,0.12)", fill: s <= r.rating ? "#F59E0B" : "none" }} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-[12.5px] text-white/50 leading-relaxed">{r.comment}</p>}
                    <p className="text-[10px] text-white/20 mt-2">{timeAgo(r.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── À PROPOS ── */}
        {tab === "a-propos" && (
          <div className="px-5 py-6 flex flex-col gap-4">
            <div className="flex flex-col items-center text-center mb-2">
              <Avatar user={other} size={56} />
              <p className="text-[15px] font-bold text-white mt-3">{displayName}</p>
            </div>

            {profile?.bio && (
              <div className="px-4 py-3.5 rounded-[12px]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20 mb-2">Bio</p>
                <p className="text-[13px] text-white/55 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              {profile?.city && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-purple-400/50 flex-shrink-0" />
                  <span className="text-[13px] text-white/50">{profile.city}</span>
                </div>
              )}
              {profile?.created_at && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-purple-400/50 flex-shrink-0" />
                  <span className="text-[13px] text-white/50">
                    Membre depuis {new Date(profile.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                  </span>
                </div>
              )}
              {(profile?.total_sales ?? 0) > 0 && (
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-purple-400/50 flex-shrink-0" />
                  <span className="text-[13px] text-white/50">{profile?.total_sales} ventes réalisées</span>
                </div>
              )}
            </div>

            <Link href={`/profile/${other.id}`}
              className="flex items-center justify-center gap-2 mt-2 py-2.5 rounded-[10px] text-[13px] font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>
              Voir le profil complet <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  conversations: Conversation[];
  currentUserId: string;
  initialConvId?: string;
}

export function DesktopMessages({ conversations, currentUserId, initialConvId }: Props) {
  const [selected, setSelected] = useState<Conversation | null>(
    (initialConvId ? conversations.find(c => c.id === initialConvId) : null) ?? conversations[0] ?? null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const supabase = createClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const getOther = (c: Conversation) => c.buyer?.id === currentUserId ? c.seller : c.buyer;

  const filtered = conversations.filter(c => {
    const o = getOther(c);
    const name = o?.username || o?.full_name || "";
    return name.toLowerCase().includes(search.toLowerCase()) ||
      (c.product?.title ?? "").toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    if (!selected) return;
    supabase.from("messages").select("*").eq("conversation_id", selected.id)
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
    <div className="flex w-full h-[100dvh] overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 45% 0%, #0d0820 0%, #070510 50%, #040309 100%)" }}>

      {/* ══ LEFT — conversation list ══ */}
      <div className="flex flex-col flex-shrink-0 h-full"
        style={{ width: 320, borderRight: "1px solid rgba(255,255,255,0.07)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 flex-shrink-0"
          style={{ height: 60, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="text-[16px] font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Messages</span>
          <div className="flex items-center gap-2">
            {conversations.length > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-purple-400"
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                {conversations.length}
              </span>
            )}
            <button className="w-7 h-7 rounded-[7px] flex items-center justify-center transition-all"
              style={{ color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.12)"; (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)"; }}>
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px]"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Search className="w-3.5 h-3.5 flex-shrink-0 text-white/25" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/20"
              style={{ caretColor: "#8B5CF6" }} />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col px-6 py-8 gap-3">
              <p className="text-[14px] font-semibold text-white/40">Aucune conversation</p>
              <p className="text-[12px] text-white/20 leading-relaxed">
                Contacte un vendeur depuis une annonce pour démarrer.
              </p>
              <Link href="/search" className="text-[13px] font-semibold mt-1 w-fit" style={{ color: "#A78BFA" }}>
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
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all"
                    style={{
                      background: isSelected ? "rgba(139,92,246,0.1)" : "transparent",
                      borderLeft: `2px solid ${isSelected ? "#8B5CF6" : "transparent"}`,
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <Avatar user={o} size={42} online={isSelected} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[14px] truncate font-semibold"
                          style={{ color: hasUnread ? "white" : "rgba(255,255,255,0.7)" }}>
                          {o?.username || o?.full_name || "Utilisateur"}
                        </span>
                        <span className="text-[10.5px] flex-shrink-0 text-white/20">
                          {c.last_message_at ? timeAgo(c.last_message_at) : ""}
                        </span>
                      </div>
                      {c.product && (
                        <p className="text-[11px] truncate font-medium text-purple-400/40 mb-0.5">{c.product.title}</p>
                      )}
                      <p className="text-[12.5px] truncate text-white/25">
                        {c.last_message || "Nouvelle conversation"}
                      </p>
                    </div>
                    {hasUnread && (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
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

      {/* ══ CENTER — chat ══ */}
      {selected && other ? (
        <div className="flex-1 flex flex-col min-w-0 h-full">

          {/* Chat header */}
          <div className="flex items-center justify-between px-6 flex-shrink-0"
            style={{ height: 60, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-3">
              <Avatar user={other} size={32} online />
              <div>
                <p className="text-[15px] font-semibold text-white/90" style={{ letterSpacing: "-0.015em" }}>
                  {other.username || other.full_name}
                </p>
                {selected.product && (
                  <p className="text-[11.5px] text-purple-400/50">· {selected.product.title}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link href={`/profile/${other.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all"
                style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.1)"; (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}>
                <ExternalLink className="w-3.5 h-3.5" /> Profil
              </Link>
              <button className="w-8 h-8 rounded-[8px] flex items-center justify-center transition-all"
                style={{ color: "rgba(255,255,255,0.22)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-1" style={{ scrollbarWidth: "none" }}>
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-start max-w-xl">
                <Avatar user={other} size={60} online />
                <h2 className="text-[20px] font-bold mt-5 mb-1 text-white">{other.username || other.full_name}</h2>
                {other.username && <p className="text-[12px] text-purple-400/50 mb-1">@{other.username}</p>}
                {selected.product && (
                  <div className="flex items-center gap-2.5 mt-2 mb-5 px-3.5 py-2 rounded-[10px]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {selected.product.images?.[0] && (
                      <div className="w-8 h-8 rounded-[6px] overflow-hidden flex-shrink-0">
                        <Image src={selected.product.images[0]} alt="" width={32} height={32} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <span className="text-[13px] font-medium text-white/55">{selected.product.title}</span>
                    {selected.product.price && (
                      <span className="text-[13px] font-bold text-purple-400 ml-1">{selected.product.price}€</span>
                    )}
                  </div>
                )}
                <p className="text-[13px] text-white/25 mb-5">Début de la conversation — envoie un premier message.</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="px-3.5 py-2 rounded-[8px] text-[12.5px] transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.40)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.25)"; (e.currentTarget as HTMLElement).style.color = "#C4B5FD"; }}
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
                      {!isMe && !prevSame && <div className="mr-2.5 mt-0.5 flex-shrink-0"><Avatar user={other} size={28} /></div>}
                      {!isMe && prevSame && <div style={{ width: 40 }} />}
                      <div style={{ maxWidth: "60%" }}>
                        <div className="px-4 py-3 text-[14px] leading-relaxed"
                          style={{
                            background: isMe ? "linear-gradient(135deg,#7C3AED,#6D28D9)" : "rgba(255,255,255,0.07)",
                            color: isMe ? "#fff" : "rgba(255,255,255,0.82)",
                            borderRadius: isMe ? (prevSame ? "16px 5px 5px 16px" : "16px 16px 5px 16px") : (prevSame ? "5px 16px 16px 5px" : "5px 16px 16px 16px"),
                            boxShadow: isMe ? "0 4px 18px rgba(109,40,217,0.25)" : "none",
                            border: isMe ? "none" : "1px solid rgba(255,255,255,0.06)",
                          }}>
                          {m.content}
                        </div>
                        {idx === messages.length - 1 && (
                          <p className={`text-[10px] mt-1.5 px-1 text-white/15 ${isMe ? "text-right" : ""}`}>
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
          <div className="px-6 pb-5 pt-3 flex-shrink-0">
            <div className="flex items-center gap-3 px-4 py-3 rounded-[12px]"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <button className="flex-shrink-0 text-white/20 hover:text-white/50 transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder={`Message à ${other.username || other.full_name}…`}
                className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/20"
                style={{ caretColor: "#8B5CF6" }} />
              <button className="flex-shrink-0 text-white/20 hover:text-white/50 transition-colors">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button onClick={() => send()} disabled={!input.trim()}
                className="w-9 h-9 rounded-[9px] flex items-center justify-center transition-all disabled:opacity-20 flex-shrink-0"
                style={{ background: input.trim() ? "linear-gradient(135deg,#8B5CF6,#7C3AED)" : "rgba(255,255,255,0.06)", boxShadow: input.trim() ? "0 2px 12px rgba(139,92,246,0.4)" : "none" }}>
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <Lock className="w-2.5 h-2.5 text-white/10" />
              <span className="text-[10px] text-white/10">Chiffré de bout en bout</span>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}

      {/* ══ RIGHT — tabbed profile panel ══ */}
      {selected && other && (
        <RightPanel
          other={other as { id: string; username: string | null; full_name: string | null; avatar_url: string | null }}
          product={selected.product}
        />
      )}
    </div>
  );
}
