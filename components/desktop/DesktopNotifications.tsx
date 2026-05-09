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

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string; labelColor: string }> = {
  like:    { icon: Heart,         color: "#EF4444", bg: "rgba(239,68,68,0.10)",   label: "Favori",   labelColor: "#FCA5A5" },
  message: { icon: MessageCircle, color: "#3B82F6", bg: "rgba(59,130,246,0.10)",  label: "Message",  labelColor: "#93C5FD" },
  sale:    { icon: ShoppingBag,   color: "#10B981", bg: "rgba(16,185,129,0.10)",  label: "Vente",    labelColor: "#6EE7B7" },
  review:  { icon: Star,          color: "#F59E0B", bg: "rgba(245,158,11,0.10)",  label: "Avis",     labelColor: "#FCD34D" },
  boost:   { icon: Zap,           color: "#8B5CF6", bg: "rgba(139,92,246,0.10)",  label: "Boost",    labelColor: "#C4B5FD" },
  order:   { icon: Package,       color: "#6366F1", bg: "rgba(99,102,241,0.10)",  label: "Commande", labelColor: "#A5B4FC" },
  follow:  { icon: UserPlus,      color: "#EC4899", bg: "rgba(236,72,153,0.10)",  label: "Abonné",   labelColor: "#F9A8D4" },
  promo:   { icon: Tag,           color: "#F97316", bg: "rgba(249,115,22,0.10)",  label: "Promo",    labelColor: "#FDBA74" },
  badge:   { icon: Award,         color: "#F59E0B", bg: "rgba(245,158,11,0.10)",  label: "Badge",    labelColor: "#FCD34D" },
  default: { icon: Bell,          color: "#A78BFA", bg: "rgba(167,139,250,0.10)", label: "Info",     labelColor: "#C4B5FD" },
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
      className="flex items-start gap-4 px-5 py-4 rounded-2xl transition-all cursor-pointer relative overflow-hidden"
      style={{
        background: notif.read
          ? "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)"
          : `linear-gradient(145deg, ${cfg.color}09 0%, ${cfg.color}04 100%)`,
        border: `1px solid ${notif.read ? "rgba(255,255,255,0.06)" : `${cfg.color}22`}`,
        boxShadow: notif.read ? "none" : `0 4px 20px ${cfg.color}08`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = notif.read
          ? "rgba(255,255,255,0.04)"
          : `${cfg.color}12`;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = notif.read
          ? "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)"
          : `linear-gradient(145deg, ${cfg.color}09 0%, ${cfg.color}04 100%)`;
        (e.currentTarget as HTMLElement).style.transform = "";
      }}
      onClick={() => !notif.read && onRead(notif.id)}
    >
      {/* Unread left accent */}
      {!notif.read && (
        <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full"
          style={{ background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}55)` }} />
      )}

      {/* Icon / Avatar */}
      <div className="relative flex-shrink-0 mt-0.5">
        {d.actor_avatar || d.actor_name ? (
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-[13px]"
            style={{
              background: `linear-gradient(135deg, ${cfg.color}50, ${cfg.color}28)`,
              border: `1px solid ${cfg.color}35`,
            }}>
            {(d.actor_name ?? "?")[0]?.toUpperCase()}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: cfg.bg, border: `1px solid ${cfg.color}20` }}>
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <p className="text-[13.5px] font-semibold text-white leading-snug">{notif.title || "Notification"}</p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10.5px] text-white/22 whitespace-nowrap">{timeAgo(notif.created_at)}</span>
            {!notif.read && (
              <span className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}80` }} />
            )}
          </div>
        </div>
        {notif.body && (
          <p className="text-[12px] text-white/35 leading-relaxed mb-2">{notif.body}</p>
        )}
        {d.product_image && (
          <div className="flex items-center gap-2.5 mt-2 p-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}>
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={d.product_image} alt="" width={40} height={40} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] font-semibold text-white/65 truncate">{d.product_title}</p>
              {d.product_price && (
                <p className="text-[10.5px] font-black" style={{ color: cfg.color }}>{d.product_price}</p>
              )}
            </div>
          </div>
        )}
        <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: cfg.bg, color: cfg.labelColor, border: `1px solid ${cfg.color}20` }}>
          <Icon style={{ width: 9, height: 9 }} />{cfg.label}
        </span>
      </div>
    </div>
  );
}

const PanelCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl p-5 ${className}`}
    style={{
      background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.018) 100%)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.07) inset",
    }}
  >
    {children}
  </div>
);

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
    <div className="min-h-[100dvh] relative overflow-hidden" style={{ background: "#07070A" }}>
      {/* Ambient orbs */}
      <div className="absolute pointer-events-none"
        style={{ top: -200, left: "20%", width: 700, height: 700,
          background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)", filter: "blur(80px)" }} />
      <div className="absolute pointer-events-none"
        style={{ bottom: -100, right: "10%", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(109,40,217,0.05) 0%, transparent 70%)", filter: "blur(100px)" }} />

      <div className="relative z-10 px-8 py-7">
        <div className="flex gap-7">

          {/* ── MAIN ── */}
          <div className="flex-1 min-w-0">

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-[28px] font-black text-white flex items-center gap-3 mb-1 tracking-tight"
                  style={{ letterSpacing: "-0.02em" }}>
                  Notifications
                  {unread > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-[13px] font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                        boxShadow: "0 4px 12px rgba(139,92,246,0.4)" }}>
                      {unread}
                    </span>
                  )}
                </h1>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {notifs.length} notification{notifs.length !== 1 ? "s" : ""} · {unread} non lue{unread !== 1 ? "s" : ""}
                </p>
              </div>
              {unread > 0 && (
                <button onClick={markAllRead}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-all"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                  }}>
                  <CheckCheck className="w-4 h-4" /> Tout lire
                </button>
              )}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-6">
              {FILTER_TABS.map(({ key, label }) => (
                <button key={key} onClick={() => setFilter(key)}
                  className="px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all flex-shrink-0"
                  style={{
                    background: filter === key
                      ? "linear-gradient(135deg, rgba(139,92,246,0.22), rgba(109,40,217,0.14))"
                      : "rgba(255,255,255,0.04)",
                    border: filter === key ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.06)",
                    color: filter === key ? "#C4B5FD" : "rgba(255,255,255,0.35)",
                    boxShadow: filter === key ? "0 0 16px rgba(139,92,246,0.12)" : "none",
                  }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            {notifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)", filter: "blur(20px)", transform: "scale(1.5)" }} />
                  <div className="relative w-20 h-20 rounded-3xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, rgba(139,92,246,0.12), rgba(109,40,217,0.06))",
                      border: "1px solid rgba(139,92,246,0.18)",
                      boxShadow: "0 8px 32px rgba(139,92,246,0.12), 0 1px 0 rgba(255,255,255,0.08) inset",
                    }}>
                    <Bell className="w-9 h-9" style={{ color: "rgba(139,92,246,0.45)" }} />
                  </div>
                </div>
                <p className="text-[18px] font-black text-white/25 mb-2" style={{ letterSpacing: "-0.01em" }}>
                  Tout est calme
                </p>
                <p className="text-[13px] mb-8 max-w-[240px] leading-relaxed" style={{ color: "rgba(255,255,255,0.16)" }}>
                  Tu seras notifié ici dès qu'il se passe quelque chose.
                </p>
                <Link href="/search"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                    boxShadow: "0 6px 20px rgba(139,92,246,0.38), 0 1px 0 rgba(255,255,255,0.12) inset",
                  }}>
                  Explorer <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Aucune notification dans cette catégorie
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {groupOrder.filter(l => groups[l]?.length).map(label => (
                  <div key={label}>
                    <div className="flex items-center gap-3 mb-3">
                      <p className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: "rgba(255,255,255,0.2)" }}>{label}</p>
                      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
                      <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.16)" }}>
                        {groups[label].length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {groups[label].map(n => <NotifCard key={n.id} notif={n} onRead={markRead} />)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="w-[280px] flex-shrink-0 flex flex-col gap-4">

            {/* Live sales */}
            <PanelCard>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400"
                  style={{ boxShadow: "0 0 8px rgba(52,211,153,0.7)" }} />
                <p className="text-[11px] font-black uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.35)" }}>Ventes en direct</p>
              </div>
              <div className="flex flex-col gap-3">
                {LIVE_SALES.map(s => (
                  <div key={s.user} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black text-white"
                      style={{ background: `linear-gradient(135deg, ${s.color}55, ${s.color}28)`,
                        boxShadow: `0 2px 8px ${s.color}25` }}>
                      {s.user[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-white/55 truncate">{s.item}</p>
                      <p className="text-[9.5px]" style={{ color: "rgba(255,255,255,0.22)" }}>@{s.user}</p>
                    </div>
                    <span className="text-[11px] font-black flex-shrink-0" style={{ color: s.color }}>{s.price}</span>
                  </div>
                ))}
              </div>
            </PanelCard>

            {/* Platform stats */}
            <PanelCard>
              <p className="text-[11px] font-black uppercase tracking-widest mb-4"
                style={{ color: "rgba(255,255,255,0.3)" }}>Live · Wearlyx</p>
              {[
                { label: "Membres actifs",    value: "50 K+",  icon: Users },
                { label: "Ventes aujourd'hui", value: "1 247", icon: ShoppingBag },
                { label: "Articles en ligne",  value: "32 K",  icon: Package },
                { label: "Note moyenne",       value: "4.8 ★", icon: Star },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}>{label}</span>
                  <span className="text-[12px] font-black text-white">{value}</span>
                </div>
              ))}
            </PanelCard>

            {/* Trending */}
            <PanelCard>
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <p className="text-[11px] font-black uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.3)" }}>Tendances</p>
              </div>
              {TRENDING_NOW.map((t, i) => (
                <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-xl transition-all group"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <span className="text-[10px] font-black w-3.5" style={{ color: "rgba(255,255,255,0.14)" }}>{i + 1}</span>
                  <span className="text-[11.5px] font-medium flex-1 truncate transition-colors"
                    style={{ color: "rgba(255,255,255,0.42)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.72)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.42)"; }}>
                    {t}
                  </span>
                  <TrendingUp className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "#8B5CF6" }} />
                </Link>
              ))}
            </PanelCard>

            {/* Boost CTA */}
            <Link href="/promotion-tools"
              className="flex items-center gap-3 p-4 rounded-2xl transition-all group"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(109,40,217,0.06))",
                border: "1px solid rgba(139,92,246,0.18)",
                boxShadow: "0 4px 20px rgba(139,92,246,0.06)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.32)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(139,92,246,0.14)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.18)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(139,92,246,0.06)";
              }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.25)" }}>
                <Zap className="w-4 h-4 text-[#A78BFA]" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-white">Booster mes annonces</p>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.28)" }}>+300% de visibilité</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
