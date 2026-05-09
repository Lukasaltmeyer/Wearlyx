"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell, Heart, MessageCircle, ShoppingBag, Star, Zap, CheckCheck,
  Package, Tag, UserPlus, Award, ArrowRight, TrendingUp,
  Flame, Users
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

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string; labelColor: string }> = {
  like:    { icon: Heart,         color: "#EF4444", bg: "rgba(239,68,68,0.12)",   label: "Favori",   labelColor: "#FCA5A5" },
  message: { icon: MessageCircle, color: "#3B82F6", bg: "rgba(59,130,246,0.12)",  label: "Message",  labelColor: "#93C5FD" },
  sale:    { icon: ShoppingBag,   color: "#10B981", bg: "rgba(16,185,129,0.12)",  label: "Vente",    labelColor: "#6EE7B7" },
  review:  { icon: Star,          color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  label: "Avis",     labelColor: "#FCD34D" },
  boost:   { icon: Zap,           color: "#8B5CF6", bg: "rgba(139,92,246,0.12)",  label: "Boost",    labelColor: "#C4B5FD" },
  order:   { icon: Package,       color: "#6366F1", bg: "rgba(99,102,241,0.12)",  label: "Commande", labelColor: "#A5B4FC" },
  follow:  { icon: UserPlus,      color: "#EC4899", bg: "rgba(236,72,153,0.12)",  label: "Abonné",   labelColor: "#F9A8D4" },
  promo:   { icon: Tag,           color: "#F97316", bg: "rgba(249,115,22,0.12)",  label: "Promo",    labelColor: "#FDBA74" },
  badge:   { icon: Award,         color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  label: "Badge",    labelColor: "#FCD34D" },
  default: { icon: Bell,          color: "#A78BFA", bg: "rgba(167,139,250,0.12)", label: "Info",     labelColor: "#C4B5FD" },
};

const FILTER_TABS = [
  { key: "Tout",    label: "Tout" },
  { key: "Favori",  label: "♡  Favoris" },
  { key: "Message", label: "💬  Messages" },
  { key: "Vente",   label: "🛍  Ventes" },
  { key: "Avis",    label: "⭐  Avis" },
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
      className="flex items-start gap-4 px-5 py-4 rounded-2xl transition-all cursor-pointer group relative"
      style={{
        background: notif.read ? "rgba(255,255,255,0.02)" : `${cfg.color}07`,
        border: `1px solid ${notif.read ? "rgba(255,255,255,0.05)" : `${cfg.color}20`}`,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = notif.read ? "rgba(255,255,255,0.04)" : `${cfg.color}10`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = notif.read ? "rgba(255,255,255,0.02)" : `${cfg.color}07`; }}
      onClick={() => !notif.read && onRead(notif.id)}>

      {!notif.read && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full" style={{ background: cfg.color }} />
      )}

      <div className="relative flex-shrink-0 mt-0.5">
        {d.actor_avatar || d.actor_name ? (
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-[13px]"
            style={{ background: `linear-gradient(135deg, ${cfg.color}50, ${cfg.color}28)`, border: `1px solid ${cfg.color}35` }}>
            {(d.actor_name ?? "?")[0]?.toUpperCase()}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cfg.bg }}>
            <Icon style={{ color: cfg.color, width: 18, height: 18 }} />
          </div>
        )}
        {(d.actor_avatar || d.actor_name) && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: cfg.bg, border: "1.5px solid #07070A" }}>
            <Icon style={{ color: cfg.color, width: 10, height: 10 }} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <p className="text-[13.5px] font-semibold text-white leading-snug">{notif.title || "Notification"}</p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10.5px] text-white/25 whitespace-nowrap">{timeAgo(notif.created_at)}</span>
            {!notif.read && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />}
          </div>
        </div>
        {notif.body && <p className="text-[12px] text-white/38 leading-relaxed mb-2">{notif.body}</p>}
        {d.product_image && (
          <div className="flex items-center gap-2.5 mt-2 p-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={d.product_image} alt="" width={40} height={40} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] font-semibold text-white/65 truncate">{d.product_title}</p>
              {d.product_price && <p className="text-[10.5px] font-black" style={{ color: cfg.color }}>{d.product_price}</p>}
            </div>
          </div>
        )}
        <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: cfg.bg, color: cfg.labelColor }}>
          <Icon style={{ width: 9, height: 9 }} />{cfg.label}
        </span>
      </div>
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
    <div className="min-h-[100dvh] px-8 py-7" style={{ background: "#07070A" }}>
      <div className="flex gap-7">

        {/* ════ MAIN — Notifications list ════ */}
        <div className="flex-1 min-w-0">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[26px] font-black text-white flex items-center gap-3 mb-1">
                Notifications
                {unread > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[13px] font-bold text-white"
                    style={{ background: "#8B5CF6" }}>{unread}</span>
                )}
              </h1>
              <p className="text-[13px] text-white/28">
                {notifs.length} notification{notifs.length !== 1 ? "s" : ""} · {unread} non lue{unread !== 1 ? "s" : ""}
              </p>
            </div>
            {unread > 0 && (
              <button onClick={markAllRead}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12.5px] font-semibold text-white/40 hover:text-white transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <CheckCheck className="w-4 h-4" /> Tout lire
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6">
            {FILTER_TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)}
                className="px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all flex-shrink-0"
                style={{
                  background: filter === key ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
                  border: filter === key ? "1px solid rgba(139,92,246,0.4)" : "1px solid transparent",
                  color: filter === key ? "#C4B5FD" : "rgba(255,255,255,0.38)",
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          {notifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-18 h-18 rounded-3xl flex items-center justify-center mb-5"
                style={{ width: 72, height: 72, background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.14)" }}>
                <Bell className="w-8 h-8 text-[#8B5CF6]/35" />
              </div>
              <p className="text-[16px] font-black text-white/25 mb-2">Tout est calme</p>
              <p className="text-[13px] text-white/18 mb-6 max-w-[240px] leading-relaxed">
                Tu seras notifié ici dès qu'il se passe quelque chose.
              </p>
              <Link href="/search"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 16px rgba(139,92,246,0.3)" }}>
                Explorer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20">
              <p className="text-[14px] text-white/22">Aucune notification dans cette catégorie</p>
            </div>
          ) : (
            <div className="flex flex-col gap-7">
              {groupOrder.filter(l => groups[l]?.length).map(label => (
                <div key={label}>
                  <div className="flex items-center gap-3 mb-3">
                    <p className="text-[10px] font-black text-white/22 uppercase tracking-widest">{label}</p>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
                    <span className="text-[10px] text-white/18 font-semibold">{groups[label].length}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {groups[label].map(n => <NotifCard key={n.id} notif={n} onRead={markRead} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div className="w-[280px] flex-shrink-0">

          {/* Live sales */}
          <div className="rounded-2xl p-5 mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">Ventes en direct</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {LIVE_SALES.map(s => (
                <div key={s.user} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black text-white"
                    style={{ background: `linear-gradient(135deg, ${s.color}50, ${s.color}28)` }}>
                    {s.user[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-white/55 truncate">{s.item}</p>
                    <p className="text-[9.5px] text-white/25">@{s.user}</p>
                  </div>
                  <span className="text-[11px] font-black flex-shrink-0" style={{ color: s.color }}>{s.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform stats */}
          <div className="rounded-2xl p-5 mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-3">Live · Wearlyx</p>
            {[
              { label: "Membres actifs",    value: "50 K+",  icon: Users },
              { label: "Ventes aujourd'hui",value: "1 247",  icon: ShoppingBag },
              { label: "Articles en ligne", value: "32 K",   icon: Package },
              { label: "Note moyenne",      value: "4.8 ★",  icon: Star },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="text-[11px] text-white/30">{label}</span>
                <span className="text-[12px] font-black text-white">{value}</span>
              </div>
            ))}
          </div>

          {/* Trending */}
          <div className="rounded-2xl p-5 mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">Tendances</p>
            </div>
            {TRENDING_NOW.map((t, i) => (
              <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
                className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/4 transition-all group">
                <span className="text-[10px] font-black text-white/15 w-3.5">{i + 1}</span>
                <span className="text-[11.5px] font-medium text-white/45 group-hover:text-white/75 transition-colors flex-1 truncate">{t}</span>
                <TrendingUp className="w-3 h-3 text-white/12 group-hover:text-[#8B5CF6]/50 transition-colors" />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link href="/promotion-tools"
            className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5 group"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(109,40,217,0.05))", border: "1px solid rgba(139,92,246,0.18)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(139,92,246,0.2)" }}>
              <Zap className="w-4 h-4 text-[#A78BFA]" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-white">Booster mes annonces</p>
              <p className="text-[10px] text-white/30">+300% de visibilité</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
