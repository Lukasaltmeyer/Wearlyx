"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell, Heart, MessageCircle, ShoppingBag, Star, Zap, CheckCheck,
  Package, Tag, UserPlus, Award, ArrowRight, TrendingUp, Flame, Users,
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
  like:    { icon: Heart,         color: "#EF4444", bg: "rgba(239,68,68,0.12)",   label: "Favori"   },
  message: { icon: MessageCircle, color: "#8B5CF6", bg: "rgba(139,92,246,0.12)",  label: "Message"  },
  sale:    { icon: ShoppingBag,   color: "#10B981", bg: "rgba(16,185,129,0.12)",  label: "Vente"    },
  review:  { icon: Star,          color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  label: "Avis"     },
  boost:   { icon: Zap,           color: "#A78BFA", bg: "rgba(167,139,250,0.12)", label: "Boost"    },
  order:   { icon: Package,       color: "#6366F1", bg: "rgba(99,102,241,0.12)",  label: "Commande" },
  follow:  { icon: UserPlus,      color: "#EC4899", bg: "rgba(236,72,153,0.12)",  label: "Abonné"   },
  promo:   { icon: Tag,           color: "#F97316", bg: "rgba(249,115,22,0.12)",  label: "Promo"    },
  badge:   { icon: Award,         color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  label: "Badge"    },
  default: { icon: Bell,          color: "#A78BFA", bg: "rgba(167,139,250,0.12)", label: "Info"     },
};

const FILTER_TABS = [
  { key: "Tout",    label: "Tout"       },
  { key: "Favori",  label: "♡ Favoris"  },
  { key: "Message", label: "💬 Messages" },
  { key: "Vente",   label: "🛍 Ventes"   },
  { key: "Avis",    label: "⭐ Avis"     },
];

const LIVE_SALES = [
  { user: "sophie_m",  item: "Nike Air Force 1", price: "65€",  color: "#10B981" },
  { user: "king_v",    item: "Veste Carhartt",   price: "42€",  color: "#8B5CF6" },
  { user: "luxmode",   item: "Sac Jacquemus",    price: "145€", color: "#F59E0B" },
  { user: "lea.style", item: "Jordan 4 Retro",   price: "210€", color: "#EF4444" },
];

const TRENDING_NOW = ["Nike Air Force 1", "Jacquemus", "Zara 2024", "Jordan 4", "Vintage Levi's"];

/* Resolve where a notification click should go */
function getNotifHref(notif: Notification): string {
  const d = notif.data ?? {};
  switch (notif.type) {
    case "message":
      if (d.conversation_id) return `/messages?conv=${d.conversation_id}`;
      if (d.actor_id) return `/messages?user=${d.actor_id}`;
      return "/messages";
    case "like":
      if (d.product_id) return `/products/${d.product_id}`;
      return "/";
    case "sale":
    case "order":
      if (d.order_id) return `/orders/${d.order_id}`;
      if (d.product_id) return `/products/${d.product_id}`;
      return "/sales";
    case "review":
      return "/profile/settings";
    case "follow":
      if (d.actor_id) return `/profile/${d.actor_id}`;
      return "/";
    default:
      return "/";
  }
}

function NotifCard({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const cfg = TYPE_CONFIG[notif.type ?? "default"] ?? TYPE_CONFIG.default;
  const Icon = cfg.icon;
  const d = notif.data ?? {};
  const href = getNotifHref(notif);

  const inner = (
    <div
      className="flex items-center gap-4 px-5 py-4 transition-all cursor-pointer relative group"
      style={{
        background: !notif.read ? `${cfg.color}08` : "transparent",
        borderBottom: "1px solid rgba(255,255,255,0.045)",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.035)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = !notif.read ? `${cfg.color}08` : "transparent"; }}
      onClick={() => !notif.read && onRead(notif.id)}
    >
      {/* Unread bar */}
      {!notif.read && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-9 rounded-r-full"
          style={{ background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}80)` }} />
      )}

      {/* Icon / Avatar */}
      <div className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0 relative"
        style={{ background: cfg.bg, border: `1px solid ${cfg.color}25` }}>
        {d.actor_avatar ? (
          <Image src={d.actor_avatar} alt="" width={44} height={44} className="rounded-[13px] object-cover w-full h-full" />
        ) : d.actor_name ? (
          <span className="text-[15px] font-black" style={{ color: cfg.color }}>
            {String(d.actor_name)[0]?.toUpperCase()}
          </span>
        ) : (
          <Icon className="w-4.5 h-4.5" style={{ color: cfg.color, width: 18, height: 18 }} />
        )}
        {/* Type badge */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "#0D0B14", border: `1.5px solid ${cfg.color}40` }}>
          <Icon style={{ color: cfg.color, width: 10, height: 10 }} />
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-0.5">
          <p className="text-[13.5px] font-semibold truncate"
            style={{ color: notif.read ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.88)" }}>
            {notif.title || "Notification"}
          </p>
          <span className="text-[10.5px] flex-shrink-0 font-medium" style={{ color: "rgba(255,255,255,0.18)" }}>
            {timeAgo(notif.created_at)}
          </span>
        </div>
        {notif.body && (
          <p className="text-[12px] truncate" style={{ color: "rgba(255,255,255,0.28)" }}>{notif.body}</p>
        )}
        {/* CTA hint */}
        <p className="text-[11px] mt-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: cfg.color }}>
          {notif.type === "message" ? "Voir la conversation →" : "Voir →"}
        </p>
      </div>

      {/* Product thumbnail */}
      {d.product_image && (
        <div className="w-11 h-11 rounded-[10px] overflow-hidden flex-shrink-0"
          style={{ border: "1px solid rgba(255,255,255,0.09)" }}>
          <Image src={d.product_image} alt="" width={44} height={44} className="object-cover w-full h-full" />
        </div>
      )}

      {/* Unread dot */}
      {!notif.read && (
        <div className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
      )}
    </div>
  );

  return (
    <Link href={href} className="block">
      {inner}
    </Link>
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
  const today = new Date(now); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate()-1);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate()-7);

  const groups = filtered.reduce<Record<string, Notification[]>>((acc, n) => {
    const d = new Date(n.created_at);
    const label = d >= today ? "Aujourd'hui" : d >= yesterday ? "Hier" : d >= weekAgo ? "Cette semaine" : "Plus tôt";
    if (!acc[label]) acc[label] = [];
    acc[label].push(n);
    return acc;
  }, {});
  const groupOrder = ["Aujourd'hui", "Hier", "Cette semaine", "Plus tôt"];

  return (
    <div className="flex w-full h-[100dvh] overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.07) 0%, transparent 50%), #07070A" }}>

      {/* ══ MAIN ══ */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-[700px] px-10 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-[28px] font-black text-white" style={{ letterSpacing: "-0.03em" }}>
                  Notifications
                </h1>
                {unread > 0 && (
                  <span className="px-3 py-0.5 rounded-full text-[12px] font-black text-white"
                    style={{ background: "linear-gradient(135deg,#8B5CF6,#7C3AED)", boxShadow: "0 4px 12px rgba(139,92,246,0.4)" }}>
                    {unread}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-white/25">
                {notifs.length} notification{notifs.length !== 1 ? "s" : ""} · {unread} non lue{unread !== 1 ? "s" : ""}
              </p>
            </div>
            {unread > 0 && (
              <button onClick={markAllRead}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-medium transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.40)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.40)"; }}>
                <CheckCheck className="w-4 h-4" /> Tout marquer lu
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {FILTER_TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)}
                className="px-4 py-2 rounded-[9px] text-[12.5px] font-semibold transition-all"
                style={{
                  background: filter === key ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)",
                  border: filter === key ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  color: filter === key ? "#C4B5FD" : "rgba(255,255,255,0.35)",
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Empty */}
          {notifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="w-20 h-20 rounded-[22px] flex items-center justify-center mb-6"
                style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.18)" }}>
                <Bell className="w-9 h-9 text-purple-400/50" strokeWidth={1.5} />
              </div>
              <p className="text-[20px] font-black text-white/25 mb-2">Tout est calme</p>
              <p className="text-[13px] text-white/18 mb-10 max-w-[240px] leading-relaxed">
                Tu seras notifié ici dès qu&apos;il se passe quelque chose.
              </p>
              <Link href="/search"
                className="flex items-center gap-2 px-6 py-3 rounded-[10px] text-[13px] font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#8B5CF6,#7C3AED)", boxShadow: "0 6px 22px rgba(139,92,246,0.35)" }}>
                Explorer les articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-[13px] text-white/20 text-center py-20">
              Aucune notification dans cette catégorie
            </p>
          ) : (
            <div className="flex flex-col gap-8">
              {groupOrder.filter(l => groups[l]?.length).map(label => (
                <div key={label}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-white/22">{label}</span>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
                    <span className="text-[10.5px] text-white/16">{groups[label].length}</span>
                  </div>
                  <div className="rounded-[18px] overflow-hidden"
                    style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                    {groups[label].map(n => <NotifCard key={n.id} notif={n} onRead={markRead} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div className="flex-shrink-0 h-full overflow-y-auto flex flex-col"
        style={{ width: 288, borderLeft: "1px solid rgba(255,255,255,0.06)", scrollbarWidth: "none" }}>

        <div className="flex items-center px-6 flex-shrink-0"
          style={{ height: 58, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-white/22">Activité</span>
        </div>

        {/* Live sales */}
        <div className="px-5 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
              style={{ boxShadow: "0 0 7px rgba(52,211,153,0.7)" }} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">Ventes en direct</p>
          </div>
          <div className="flex flex-col gap-3.5">
            {LIVE_SALES.map(s => (
              <div key={s.user} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black text-white"
                  style={{ background: `linear-gradient(135deg,${s.color}50,${s.color}25)` }}>
                  {s.user[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium truncate text-white/55">{s.item}</p>
                  <p className="text-[10.5px] text-white/22">@{s.user}</p>
                </div>
                <span className="text-[12px] font-bold flex-shrink-0" style={{ color: s.color }}>{s.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/22 mb-4">Live · Wearlyx</p>
          {[
            { label: "Membres actifs",     value: "50 K+",  icon: Users },
            { label: "Ventes aujourd'hui", value: "1 247",  icon: ShoppingBag },
            { label: "Articles en ligne",  value: "32 K",   icon: Package },
            { label: "Note moyenne",       value: "4.8 ★",  icon: Star },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2.5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-[12px] text-white/30">{label}</span>
              <span className="text-[12.5px] font-semibold text-white/70">{value}</span>
            </div>
          ))}
        </div>

        {/* Trending */}
        <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/22">Tendances</p>
          </div>
          {TRENDING_NOW.map((t, i) => (
            <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
              className="flex items-center gap-3 py-2.5 px-2 rounded-[8px] transition-all group"
              style={{ color: "rgba(255,255,255,0.38)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}>
              <span className="text-[10px] font-bold w-4 flex-shrink-0 text-white/15">{i+1}</span>
              <span className="text-[12.5px] font-medium flex-1 truncate">{t}</span>
              <TrendingUp className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400 flex-shrink-0" />
            </Link>
          ))}
        </div>

        {/* Boost CTA */}
        <div className="px-5 py-5 mt-auto">
          <Link href="/promotion-tools"
            className="flex items-center gap-3 p-4 rounded-[12px] transition-all"
            style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.3)"; (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.13)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.15)"; (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.08)"; }}>
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.22)" }}>
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-[12.5px] font-semibold text-white/72">Booster mes annonces</p>
              <p className="text-[11px] text-white/28">+300% de visibilité</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
