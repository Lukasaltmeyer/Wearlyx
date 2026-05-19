"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell, Heart, MessageCircle, ShoppingBag, Star, Zap, CheckCheck,
  Package, Tag, UserPlus, Award, ArrowRight, TrendingUp, Flame, Users
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/utils";

interface Notification {
  id: string;
  type?: string;
  title?: string;
  body?: string;
  read?: boolean;
  created_at: string;
  data?: any;
}

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  like:    { icon: Heart,         color: "#EF4444", bg: "rgba(239,68,68,0.10)",   label: "Favori"   },
  message: { icon: MessageCircle, color: "#3B82F6", bg: "rgba(59,130,246,0.10)",  label: "Message"  },
  sale:    { icon: ShoppingBag,   color: "#10B981", bg: "rgba(16,185,129,0.10)",  label: "Vente"    },
  review:  { icon: Star,          color: "#F59E0B", bg: "rgba(245,158,11,0.10)",  label: "Avis"     },
  boost:   { icon: Zap,           color: "#8B5CF6", bg: "rgba(139,92,246,0.10)",  label: "Boost"    },
  order:   { icon: Package,       color: "#6366F1", bg: "rgba(99,102,241,0.10)",  label: "Commande" },
  follow:  { icon: UserPlus,      color: "#EC4899", bg: "rgba(236,72,153,0.10)",  label: "Abonné"   },
  promo:   { icon: Tag,           color: "#F97316", bg: "rgba(249,115,22,0.10)",  label: "Promo"    },
  badge:   { icon: Award,         color: "#F59E0B", bg: "rgba(245,158,11,0.10)",  label: "Badge"    },
  default: { icon: Bell,          color: "#A78BFA", bg: "rgba(167,139,250,0.10)", label: "Info"     },
};

const FILTER_TABS = [
  { key: "Tout",     label: "Tout"      },
  { key: "Favori",   label: "♡  Favoris"  },
  { key: "Message",  label: "💬  Messages" },
  { key: "Vente",    label: "🛍  Ventes"   },
  { key: "Avis",     label: "⭐  Avis"     },
];

const LIVE_SALES = [
  { user: "sophie_m",  item: "Nike Air Force 1", price: "65 €",  color: "#10B981" },
  { user: "king_v",    item: "Veste Carhartt",   price: "42 €",  color: "#8B5CF6" },
  { user: "luxmode",   item: "Sac Jacquemus",    price: "145 €", color: "#F59E0B" },
  { user: "lea.style", item: "Jordan 4 Retro",   price: "210 €", color: "#EF4444" },
];

const TRENDING_NOW = ["Nike Air Force 1", "Jacquemus", "Zara 2024", "Jordan 4", "Vintage Levi's"];

function NotifCard({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const cfg = TYPE_CONFIG[notif.type ?? "default"] ?? TYPE_CONFIG.default;
  const Icon = cfg.icon;
  const d = notif.data ?? {};

  return (
    <div
      className="flex items-center gap-4 px-5 py-4 transition-all cursor-pointer relative"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: !notif.read ? `${cfg.color}06` : "transparent",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = !notif.read ? `${cfg.color}06` : "transparent"; }}
      onClick={() => !notif.read && onRead(notif.id)}
    >
      {!notif.read && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full"
          style={{ background: cfg.color }} />
      )}

      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
        style={{ background: cfg.bg }}>
        {d.actor_name ? (
          <span className="text-[13px] font-black" style={{ color: cfg.color }}>
            {(d.actor_name ?? "?")[0]?.toUpperCase()}
          </span>
        ) : (
          <Icon style={{ color: cfg.color, width: 16, height: 16 }} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13.5px] font-semibold truncate"
            style={{ color: notif.read ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.85)" }}>
            {notif.title || "Notification"}
          </p>
          <span className="text-[10.5px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.18)" }}>
            {timeAgo(notif.created_at)}
          </span>
        </div>
        {notif.body && (
          <p className="text-[12px] truncate mt-0.5" style={{ color: "rgba(255,255,255,0.26)" }}>{notif.body}</p>
        )}
      </div>

      {d.product_image && (
        <div className="w-10 h-10 rounded-[10px] overflow-hidden flex-shrink-0"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <Image src={d.product_image} alt="" width={40} height={40} className="object-cover w-full h-full" />
        </div>
      )}
    </div>
  );
}

export function DesktopNotifications({ notifications: initial, userId }: { notifications: Notification[]; userId: string }) {
  const [notifs, setNotifs] = useState(initial);
  const [filter, setFilter] = useState("Tout");
  const supabase = createClient();
  const unread = notifs.filter(n => !n.read).length;

  const filtered = notifs.filter(n => {
    if (filter === "Tout") return true;
    const cfg = TYPE_CONFIG[n.type ?? "default"] ?? TYPE_CONFIG.default;
    return cfg.label === filter;
  });

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const markAllRead = async () => {
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const now = new Date();
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);

  const groups = filtered.reduce<Record<string, Notification[]>>((acc, n) => {
    const d = new Date(n.created_at);
    const label = d >= today ? "Aujourd'hui" : d >= yesterday ? "Hier" : d >= weekAgo ? "Cette semaine" : "Plus tôt";
    if (!acc[label]) acc[label] = [];
    acc[label].push(n);
    return acc;
  }, {});
  const groupOrder = ["Aujourd'hui", "Hier", "Cette semaine", "Plus tôt"];

  return (
    /* Full-height two-pane layout */
    <div className="flex h-[100dvh] overflow-hidden">

      {/* ── Main scrollable column ── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-[740px] px-10 py-10">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-[28px] font-black text-white" style={{ letterSpacing: "-0.03em" }}>
                  Notifications
                </h1>
                {unread > 0 && (
                  <span className="px-3 py-0.5 rounded-full text-[13px] font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                      boxShadow: "0 3px 10px rgba(139,92,246,0.35)",
                    }}>
                    {unread}
                  </span>
                )}
              </div>
              <p className="text-[13.5px]" style={{ color: "rgba(255,255,255,0.24)" }}>
                {notifs.length} notification{notifs.length !== 1 ? "s" : ""} · {unread} non lue{unread !== 1 ? "s" : ""}
              </p>
            </div>
            {unread > 0 && (
              <button onClick={markAllRead}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[9px] text-[13px] font-medium transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.38)", background: "rgba(255,255,255,0.03)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.72)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}>
                <CheckCheck className="w-4 h-4" /> Tout lire
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-8">
            {FILTER_TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)}
                className="px-4 py-2 rounded-[8px] text-[12.5px] font-medium transition-all flex-shrink-0"
                style={{
                  background: filter === key ? "rgba(139,92,246,0.14)" : "rgba(255,255,255,0.04)",
                  border: filter === key ? "1px solid rgba(139,92,246,0.32)" : "1px solid rgba(255,255,255,0.06)",
                  color: filter === key ? "#C4B5FD" : "rgba(255,255,255,0.32)",
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          {notifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="relative mb-7">
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)", filter: "blur(24px)", transform: "scale(1.8)" }} />
                <div className="relative w-20 h-20 rounded-[24px] flex items-center justify-center"
                  style={{
                    background: "linear-gradient(145deg, rgba(139,92,246,0.12), rgba(109,40,217,0.06))",
                    border: "1px solid rgba(139,92,246,0.18)",
                    boxShadow: "0 8px 32px rgba(139,92,246,0.12), 0 1px 0 rgba(255,255,255,0.07) inset",
                  }}>
                  <Bell className="w-9 h-9" style={{ color: "rgba(139,92,246,0.45)" }} strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-[20px] font-black text-white/25 mb-2.5" style={{ letterSpacing: "-0.02em" }}>
                Tout est calme
              </p>
              <p className="text-[13.5px] mb-10 max-w-[260px] leading-relaxed" style={{ color: "rgba(255,255,255,0.16)" }}>
                Tu seras notifié ici dès qu'il se passe quelque chose.
              </p>
              <Link href="/search"
                className="flex items-center gap-2 px-6 py-3 rounded-[10px] text-[13.5px] font-semibold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                  boxShadow: "0 6px 22px rgba(139,92,246,0.35), 0 1px 0 rgba(255,255,255,0.12) inset",
                }}>
                Explorer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20">
              <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.18)" }}>
                Aucune notification dans cette catégorie
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {groupOrder.filter(l => groups[l]?.length).map(label => (
                <div key={label}>
                  {/* Group header */}
                  <div className="flex items-center gap-4 mb-4">
                    <p className="text-[10.5px] font-semibold uppercase tracking-widest flex-shrink-0"
                      style={{ color: "rgba(255,255,255,0.22)" }}>{label}</p>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
                    <span className="text-[10.5px] font-medium flex-shrink-0"
                      style={{ color: "rgba(255,255,255,0.16)" }}>
                      {groups[label].length}
                    </span>
                  </div>
                  {/* Notification list */}
                  <div className="rounded-[16px] overflow-hidden"
                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                    {groups[label].map(n => <NotifCard key={n.id} notif={n} onRead={markRead} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right panel — sticky ── */}
      <div className="flex-shrink-0 overflow-y-auto h-full flex flex-col"
        style={{ width: 300, borderLeft: "1px solid rgba(255,255,255,0.055)", scrollbarWidth: "none" }}>

        {/* Panel header */}
        <div className="flex-shrink-0 flex items-center px-6"
          style={{ height: 56, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span className="text-[10.5px] font-semibold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.20)" }}>Activité</span>
        </div>

        <div className="flex flex-col gap-0 flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

          {/* Live sales */}
          <div className="px-6 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                style={{ boxShadow: "0 0 7px rgba(52,211,153,0.65)" }} />
              <p className="text-[10.5px] font-semibold uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.28)" }}>Ventes en direct</p>
            </div>
            <div className="flex flex-col gap-4">
              {LIVE_SALES.map(s => (
                <div key={s.user} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black text-white"
                    style={{ background: `linear-gradient(135deg, ${s.color}50, ${s.color}25)` }}>
                    {s.user[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium truncate" style={{ color: "rgba(255,255,255,0.55)" }}>{s.item}</p>
                    <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.20)" }}>@{s.user}</p>
                  </div>
                  <span className="text-[12px] font-bold flex-shrink-0" style={{ color: s.color }}>{s.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform stats */}
          <div className="px-6 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-[10.5px] font-semibold uppercase tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,0.20)" }}>Live · Wearlyx</p>
            {[
              { label: "Membres actifs",     value: "50 K+",  icon: Users },
              { label: "Ventes aujourd'hui", value: "1 247",  icon: ShoppingBag },
              { label: "Articles en ligne",  value: "32 K",   icon: Package },
              { label: "Note moyenne",       value: "4.8 ★",  icon: Star },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.28)" }}>{label}</span>
                <span className="text-[12.5px] font-semibold" style={{ color: "rgba(255,255,255,0.72)" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Trending */}
          <div className="px-6 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <p className="text-[10.5px] font-semibold uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.20)" }}>Tendances</p>
            </div>
            {TRENDING_NOW.map((t, i) => (
              <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
                className="flex items-center gap-3 py-2.5 rounded-[8px] px-2 transition-all group"
                style={{ color: "rgba(255,255,255,0.38)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.68)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}>
                <span className="text-[10px] font-bold w-4 flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.14)" }}>{i + 1}</span>
                <span className="text-[12.5px] font-medium flex-1 truncate transition-colors">{t}</span>
                <TrendingUp className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "#8B5CF6", flexShrink: 0 }} />
              </Link>
            ))}
          </div>

          {/* Boost CTA */}
          <div className="px-6 py-6 mt-auto">
            <Link href="/promotion-tools"
              className="flex items-center gap-3.5 p-4 rounded-[12px] transition-all"
              style={{
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(139,92,246,0.14)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.28)"; (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.14)"; (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.08)"; }}>
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.22)" }}>
                <Zap className="w-4 h-4 text-[#A78BFA]" />
              </div>
              <div>
                <p className="text-[12.5px] font-semibold text-white/72">Booster mes annonces</p>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.26)" }}>+300% de visibilité</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
