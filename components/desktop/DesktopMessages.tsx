"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, Send, MoreHorizontal, Smile, ShoppingBag,
  Lock, Plus, Star, MapPin, Calendar, Package,
  MessageCircle, ExternalLink, CheckCheck,
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

const QUICK = ["Toujours disponible ?", "Dernier prix ?", "Livraison possible ?", "Je prends !"];

function Av({ user, size = 36, online = false, ring = false }: {
  user: { username?: string | null; full_name?: string | null; avatar_url?: string | null } | null | undefined;
  size?: number; online?: boolean; ring?: boolean;
}) {
  const name = user?.username || user?.full_name || "?";
  return (
    <div className="relative flex-shrink-0">
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt={name} className="rounded-full object-cover"
          style={{ width: size, height: size, boxShadow: ring ? "0 0 0 2px #8B5CF6" : "none" }} />
      ) : (
        <div className="rounded-full flex items-center justify-center font-bold text-white"
          style={{
            width: size, height: size,
            background: "linear-gradient(145deg,#9B6FF8,#6D28D9)",
            fontSize: size * 0.4,
            boxShadow: ring ? "0 0 0 2px #8B5CF6" : "none",
          }}>
          {name[0]?.toUpperCase()}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 rounded-full border-2 border-[#080612]"
          style={{ width: size * 0.3, height: size * 0.3, background: "#22C55E" }} />
      )}
    </div>
  );
}

type Tab = "profil" | "annonces" | "avis" | "a-propos";

function InfoPanel({ other, product }: {
  other: { id: string; username: string | null; full_name: string | null; avatar_url: string | null };
  product?: { id: string; title: string; images?: string[]; price?: number } | null;
}) {
  const [tab, setTab] = useState<Tab>("profil");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const supabase = createClient();

  useEffect(() => {
    setTab("profil"); setProfile(null); setProducts([]); setReviews([]);
    supabase.from("profiles").select("*").eq("id", other.id).single()
      .then(({ data }) => { if (data) setProfile(data); });
  }, [other.id]);

  useEffect(() => {
    if (tab === "annonces" && !products.length)
      supabase.from("products").select("id,title,price,images").eq("seller_id", other.id).eq("status", "active").limit(12)
        .then(({ data }) => { if (data) setProducts(data); });
    if (tab === "avis" && !reviews.length)
      supabase.from("reviews")
        .select("id,rating,comment,created_at,reviewer:profiles!reviewer_id(username,full_name,avatar_url)")
        .eq("reviewed_id", other.id).order("created_at", { ascending: false }).limit(20)
        .then(({ data }) => {
          if (data) setReviews(data.map((r: any) => ({ ...r, reviewer: Array.isArray(r.reviewer) ? r.reviewer[0] ?? null : r.reviewer })));
        });
  }, [tab, other.id]);

  const name = other.username || other.full_name || "Utilisateur";
  const avg = profile?.rating ?? (reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null);
  const TABS: { key: Tab; label: string }[] = [
    { key: "profil", label: "Profil" },
    { key: "annonces", label: "Annonces" },
    { key: "avis", label: "Avis" },
    { key: "a-propos", label: "À propos" },
  ];

  return (
    <div className="flex-shrink-0 flex flex-col h-full" style={{ width: 300, borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Header */}
      <div className="flex-shrink-0 flex flex-col items-center pt-6 pb-4 px-5 gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Av user={other} size={56} online ring />
        <div className="text-center">
          <p className="text-[15px] font-bold text-white leading-tight">{name}</p>
          {other.username && <p className="text-[12px] mt-0.5" style={{ color: "rgba(167,139,250,0.5)" }}>@{other.username}</p>}
          {avg && (
            <div className="flex items-center justify-center gap-1 mt-1.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[12px] font-semibold text-amber-400">{avg.toFixed(1)}</span>
              <span className="text-[11px] text-white/20">· {reviews.length} avis</span>
            </div>
          )}
        </div>
        <Link href={`/profile/${other.id}`}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-[8px] text-[12px] font-semibold text-white transition-all"
          style={{ background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.25)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.28)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.18)"; }}>
          Voir le profil <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-shrink-0 px-3 pt-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-1 py-2.5 text-[11.5px] font-semibold transition-all"
            style={{
              color: tab === key ? "#A78BFA" : "rgba(255,255,255,0.22)",
              borderBottom: `2px solid ${tab === key ? "#8B5CF6" : "transparent"}`,
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

        {tab === "profil" && (
          <div className="p-4 flex flex-col gap-3">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: "Note", value: avg ? `${avg.toFixed(1)}★` : "—", c: "#F59E0B" },
                { label: "Ventes", value: profile?.total_sales ?? "—", c: "#22C55E" },
                { label: "Annonces", value: products.length || "—", c: "#8B5CF6" },
              ].map(({ label, value, c }) => (
                <div key={label} className="py-3 rounded-[10px] text-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[15px] font-black leading-tight" style={{ color: c }}>{String(value)}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.22)" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Product in conv */}
            {product && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.18)" }}>
                  Article concerné
                </p>
                <Link href={`/products/${product.id}`}
                  className="flex gap-3 p-2.5 rounded-[10px] transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}>
                  {product.images?.[0] ? (
                    <div className="w-12 h-12 rounded-[7px] overflow-hidden flex-shrink-0">
                      <Image src={product.images[0]} alt="" width={48} height={48} className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-[7px] flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(139,92,246,0.1)" }}>
                      <Package className="w-5 h-5 text-purple-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-[12px] font-medium truncate text-white/60">{product.title}</p>
                    {product.price && <p className="text-[14px] font-bold text-purple-400">{product.price}€</p>}
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}

        {tab === "annonces" && (
          <div className="p-3">
            {products.length === 0 ? (
              <p className="text-[13px] text-white/20 text-center py-12">Aucune annonce active</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {products.map(p => (
                  <Link key={p.id} href={`/products/${p.id}`}
                    className="block rounded-[10px] overflow-hidden transition-all"
                    style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.3)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}>
                    <div className="aspect-square relative overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                      {p.images?.[0]
                        ? <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-white/10" /></div>
                      }
                    </div>
                    <div className="px-2 py-2" style={{ background: "rgba(0,0,0,0.25)" }}>
                      <p className="text-[11px] text-white/45 truncate">{p.title}</p>
                      <p className="text-[12px] font-bold text-purple-400">{p.price}€</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "avis" && (
          <div className="p-4 flex flex-col gap-3">
            {avg && (
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-[12px]"
                style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.14)" }}>
                <p className="text-[36px] font-black text-amber-400 leading-none">{avg.toFixed(1)}</p>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-3.5 h-3.5"
                        style={{ color: s <= Math.round(avg) ? "#F59E0B" : "rgba(255,255,255,0.1)", fill: s <= Math.round(avg) ? "#F59E0B" : "none" }} />
                    ))}
                  </div>
                  <p className="text-[11px] text-white/25">{reviews.length} avis</p>
                </div>
              </div>
            )}
            {reviews.length === 0 ? (
              <p className="text-[13px] text-white/20 text-center py-10">Pas encore d&apos;avis</p>
            ) : reviews.map(r => (
              <div key={r.id} className="p-3.5 rounded-[11px]"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Av user={r.reviewer} size={22} />
                    <span className="text-[12px] font-medium text-white/55">
                      {r.reviewer?.username || r.reviewer?.full_name || "Anonyme"}
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-2.5 h-2.5"
                        style={{ color: s <= r.rating ? "#F59E0B" : "rgba(255,255,255,0.1)", fill: s <= r.rating ? "#F59E0B" : "none" }} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-[12px] text-white/45 leading-relaxed">{r.comment}</p>}
                <p className="text-[10px] text-white/18 mt-2">{timeAgo(r.created_at)}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "a-propos" && (
          <div className="p-4 flex flex-col gap-4">
            {profile?.bio && (
              <div className="p-3.5 rounded-[11px]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/18 mb-2">Bio</p>
                <p className="text-[13px] text-white/50 leading-relaxed">{profile.bio}</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {profile?.city && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(139,92,246,0.1)" }}>
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span className="text-[13px] text-white/45">{profile.city}</span>
                </div>
              )}
              {profile?.created_at && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(139,92,246,0.1)" }}>
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span className="text-[13px] text-white/45">
                    Membre depuis {new Date(profile.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                  </span>
                </div>
              )}
              {(profile?.total_sales ?? 0) > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(139,92,246,0.1)" }}>
                    <Package className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span className="text-[13px] text-white/45">{profile?.total_sales} ventes</span>
                </div>
              )}
            </div>
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

  const other = (c: Conversation) => c.buyer?.id === currentUserId ? c.seller : c.buyer;
  const selectedOther = selected ? other(selected) : null;

  const filtered = conversations.filter(c => {
    const o = other(c);
    const n = o?.username || o?.full_name || "";
    return n.toLowerCase().includes(search.toLowerCase()) ||
      (c.product?.title ?? "").toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    if (!selected) return;
    supabase.from("messages").select("*").eq("conversation_id", selected.id)
      .order("created_at", { ascending: true }).then(({ data }) => setMessages(data ?? []));
  }, [selected?.id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (txt?: string) => {
    const text = txt ?? input.trim();
    if (!text || !selected) return;
    setInput("");
    const { data } = await supabase.from("messages")
      .insert({ conversation_id: selected.id, sender_id: currentUserId, content: text })
      .select().single();
    if (data) setMessages(p => [...p, data]);
  };

  return (
    <div style={{
      display: "flex",
      width: "100%",
      height: "100dvh",
      overflow: "hidden",
      background: "#07060F",
    }}>

      {/* ══ SIDEBAR — conversations ══ */}
      <div style={{
        width: 300,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "rgba(255,255,255,0.01)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 18px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          flexShrink: 0,
        }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: "white", letterSpacing: "-0.03em", margin: 0 }}>Messages</h1>
            {conversations.length > 0 && (
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: "2px 0 0" }}>
                {conversations.length} conversation{conversations.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button style={{
            width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)", cursor: "pointer",
            color: "#A78BFA",
          }}>
            <Plus style={{ width: 15, height: 15 }} strokeWidth={2.5} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "12px 14px", flexShrink: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 13px", borderRadius: 10,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)",
          }}>
            <Search style={{ width: 13, height: 13, color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontSize: 13, color: "white", caretColor: "#8B5CF6",
              }}
            />
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <MessageCircle style={{ width: 32, height: 32, color: "rgba(139,92,246,0.25)", margin: "0 auto 12px" }} />
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>Aucune conversation</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.14)", lineHeight: 1.5, marginBottom: 16 }}>
                Contacte un vendeur depuis une annonce.
              </p>
              <Link href="/search" style={{ fontSize: 12, fontWeight: 600, color: "#A78BFA", textDecoration: "none" }}>
                Explorer les articles →
              </Link>
            </div>
          ) : filtered.map(c => {
            const o = other(c);
            const active = selected?.id === c.id;
            const unread = (c.unread_count ?? 0) > 0;
            return (
              <button key={c.id} onClick={() => setSelected(c)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 11,
                  padding: "10px 14px 10px 12px", textAlign: "left", cursor: "pointer",
                  background: active ? "rgba(139,92,246,0.1)" : "transparent",
                  borderLeft: `3px solid ${active ? "#8B5CF6" : "transparent"}`,
                  borderTop: "none", borderRight: "none", borderBottom: "none",
                  transition: "background 0.12s",
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>

                {/* Avatar + product thumb stacked */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <Av user={o} size={44} online={active} />
                  {c.product?.images?.[0] && (
                    <div style={{
                      position: "absolute", bottom: -3, right: -3,
                      width: 18, height: 18, borderRadius: 5, overflow: "hidden",
                      border: "1.5px solid #080612",
                    }}>
                      <img src={c.product.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 13.5, fontWeight: unread ? 700 : 500, color: unread ? "white" : "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {o?.username || o?.full_name || "Utilisateur"}
                    </span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", flexShrink: 0 }}>
                      {c.last_message_at ? timeAgo(c.last_message_at) : ""}
                    </span>
                  </div>
                  {c.product?.title && (
                    <p style={{ fontSize: 10.5, color: "rgba(167,139,250,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 1 }}>
                      {c.product.title}
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.last_message || "Nouvelle conversation"}
                  </p>
                </div>
                {unread && (
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    background: "#7C3AED", color: "white", fontSize: 9.5, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {c.unread_count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ CENTER — chat ══ */}
      {selected && selectedOther ? (
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>

          {/* Chat header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 24px", height: 64, flexShrink: 0,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.01)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Av user={selectedOther} size={38} online ring />
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "white", letterSpacing: "-0.02em", margin: 0 }}>
                  {selectedOther.username || selectedOther.full_name}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.30)" }}>En ligne</span>
                  {selected.product && (
                    <>
                      <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 11 }}>·</span>
                      <span style={{ fontSize: 11, color: "rgba(167,139,250,0.5)" }}>{selected.product.title}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button style={{
                width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.22)",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
                <MoreHorizontal style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 2, scrollbarWidth: "none" }}>
            {messages.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", flex: 1, paddingBottom: 8 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
                  <Av user={selectedOther} size={56} />
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 800, color: "white", letterSpacing: "-0.03em", margin: "0 0 4px" }}>
                      {selectedOther.username || selectedOther.full_name}
                    </p>
                    {selectedOther.username && (
                      <p style={{ fontSize: 12, color: "rgba(167,139,250,0.45)", margin: 0 }}>@{selectedOther.username}</p>
                    )}
                  </div>
                  {selected.product && (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 10,
                      padding: "10px 14px", borderRadius: 12,
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    }}>
                      {selected.product.images?.[0] && (
                        <div style={{ width: 36, height: 36, borderRadius: 7, overflow: "hidden", flexShrink: 0 }}>
                          <Image src={selected.product.images[0]} alt="" width={36} height={36} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <div>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 2px" }}>{selected.product.title}</p>
                        {selected.product.price && (
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#A78BFA", margin: 0 }}>{selected.product.price}€</p>
                        )}
                      </div>
                    </div>
                  )}
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.22)", margin: 0 }}>
                    Début de la conversation · Envoie un message pour démarrer.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {QUICK.map(s => (
                      <button key={s} onClick={() => send(s)}
                        style={{
                          padding: "8px 14px", borderRadius: 20, fontSize: 12.5, cursor: "pointer",
                          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
                          color: "rgba(255,255,255,0.45)", transition: "all 0.12s",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.3)"; (e.currentTarget as HTMLElement).style.color = "#C4B5FD"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((m, idx) => {
                  const isMe = m.sender_id === currentUserId;
                  const prevSame = idx > 0 && messages[idx - 1].sender_id === m.sender_id;
                  const nextSame = idx < messages.length - 1 && messages[idx + 1].sender_id === m.sender_id;
                  const showTime = idx === messages.length - 1 || !nextSame;
                  return (
                    <div key={m.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginTop: prevSame ? 2 : 16 }}>
                      {!isMe && (
                        <div style={{ width: 32, marginRight: 8, display: "flex", alignItems: "flex-end", flexShrink: 0 }}>
                          {!nextSame && <Av user={selectedOther} size={28} />}
                        </div>
                      )}
                      <div style={{ maxWidth: "62%", display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                        <div style={{
                          padding: "10px 14px",
                          fontSize: 14,
                          lineHeight: 1.5,
                          color: isMe ? "white" : "rgba(255,255,255,0.85)",
                          background: isMe
                            ? "linear-gradient(135deg, #7C3AED, #6D28D9)"
                            : "rgba(255,255,255,0.08)",
                          borderRadius: isMe
                            ? (prevSame ? "18px 5px 5px 18px" : "18px 18px 5px 18px")
                            : (prevSame ? "5px 18px 18px 5px" : "5px 18px 18px 18px"),
                          boxShadow: isMe ? "0 4px 20px rgba(109,40,217,0.3)" : "none",
                          border: isMe ? "none" : "1px solid rgba(255,255,255,0.07)",
                          wordBreak: "break-word",
                        }}>
                          {m.content}
                        </div>
                        {showTime && (
                          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.16)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                            {timeAgo(m.created_at)}
                            {isMe && <CheckCheck style={{ width: 12, height: 12, color: "rgba(139,92,246,0.5)" }} />}
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
          <div style={{ padding: "12px 20px 16px", flexShrink: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 14,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}>
              <button style={{ color: "rgba(255,255,255,0.18)", background: "none", border: "none", cursor: "pointer", display: "flex", flexShrink: 0 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.18)"; }}>
                <Smile style={{ width: 20, height: 20 }} />
              </button>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder={`Message à ${selectedOther.username || selectedOther.full_name}…`}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontSize: 14, color: "white", caretColor: "#8B5CF6",
                }}
              />
              <button onClick={() => send()} disabled={!input.trim()}
                style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: input.trim() ? "linear-gradient(135deg,#8B5CF6,#7C3AED)" : "rgba(255,255,255,0.06)",
                  border: "none", cursor: input.trim() ? "pointer" : "default",
                  boxShadow: input.trim() ? "0 2px 14px rgba(139,92,246,0.4)" : "none",
                  transition: "all 0.15s", opacity: input.trim() ? 1 : 0.35,
                }}>
                <Send style={{ width: 15, height: 15, color: "white" }} />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 6 }}>
              <Lock style={{ width: 9, height: 9, color: "rgba(255,255,255,0.1)" }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.1)" }}>Chiffré de bout en bout</span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.18)",
          }}>
            <MessageCircle style={{ width: 32, height: 32, color: "#8B5CF6" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: "white", letterSpacing: "-0.03em", margin: "0 0 8px" }}>Tes messages</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.28)", lineHeight: 1.6, margin: "0 0 20px", maxWidth: 280 }}>
              Sélectionne une conversation ou contacte un vendeur depuis une annonce pour démarrer.
            </p>
            <Link href="/search" style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px",
              borderRadius: 10, fontSize: 13, fontWeight: 600, color: "white", textDecoration: "none",
              background: "linear-gradient(135deg,#7C3AED,#5B21B6)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
            }}>
              <ShoppingBag style={{ width: 15, height: 15 }} />
              Explorer les articles
            </Link>
          </div>
        </div>
      )}

      {/* ══ RIGHT — info panel ══ */}
      {selected && selectedOther && (
        <InfoPanel
          other={selectedOther as { id: string; username: string | null; full_name: string | null; avatar_url: string | null }}
          product={selected.product}
        />
      )}
    </div>
  );
}
