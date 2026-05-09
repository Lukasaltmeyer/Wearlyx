"use client";

import { useState } from "react";
import { Bell, Heart, MessageCircle, ShoppingBag, Star, Zap, Check, CheckCheck, Package } from "lucide-react";
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
  like:     { icon: Heart,          color: "#EF4444", bg: "rgba(239,68,68,0.1)",    label: "Favori" },
  message:  { icon: MessageCircle,  color: "#3B82F6", bg: "rgba(59,130,246,0.1)",   label: "Message" },
  sale:     { icon: ShoppingBag,    color: "#10B981", bg: "rgba(16,185,129,0.1)",   label: "Vente" },
  review:   { icon: Star,           color: "#F59E0B", bg: "rgba(245,158,11,0.1)",   label: "Évaluation" },
  boost:    { icon: Zap,            color: "#8B5CF6", bg: "rgba(139,92,246,0.1)",   label: "Boost" },
  order:    { icon: Package,        color: "#6366F1", bg: "rgba(99,102,241,0.1)",   label: "Commande" },
  default:  { icon: Bell,           color: "#A78BFA", bg: "rgba(167,139,250,0.1)",  label: "Info" },
};

const FILTERS = ["Tout", "Favori", "Message", "Vente", "Évaluation"];

function NotifCard({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const cfg = TYPE_CONFIG[notif.type ?? "default"] ?? TYPE_CONFIG.default;
  const Icon = cfg.icon;

  return (
    <div
      className="flex items-start gap-4 px-5 py-4 rounded-2xl transition-all cursor-pointer group hover:bg-white/3"
      style={{
        background: notif.read ? "transparent" : "rgba(139,92,246,0.05)",
        border: `1px solid ${notif.read ? "rgba(255,255,255,0.04)" : "rgba(139,92,246,0.12)"}`,
      }}
      onClick={() => !notif.read && onRead(notif.id)}>

      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: cfg.bg }}>
        <Icon className="w-4.5 h-4.5" style={{ color: cfg.color, width: 18, height: 18 }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[13.5px] font-semibold text-white leading-snug">
              {notif.title || "Notification"}
            </p>
            {notif.body && (
              <p className="text-[12px] text-white/45 mt-0.5 leading-relaxed">{notif.body}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] text-white/25">{timeAgo(notif.created_at)}</span>
            {!notif.read && <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />}
          </div>
        </div>
        <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
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

  // Group by date
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

  const groups = filtered.reduce<Record<string, Notification[]>>((acc, n) => {
    const d = new Date(n.created_at);
    const label = d >= today ? "Aujourd'hui" : d >= yesterday ? "Hier" : "Plus tôt";
    if (!acc[label]) acc[label] = [];
    acc[label].push(n);
    return acc;
  }, {});

  return (
    <div className="min-h-[100dvh] px-8 py-7" style={{ background: "#07070A" }}>
      <div className="max-w-[720px]">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[28px] font-black text-white flex items-center gap-3">
              Notifications
              {unread > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[13px] font-bold text-white"
                  style={{ background: "#8B5CF6" }}>{unread}</span>
              )}
            </h1>
            <p className="text-[13px] text-white/30 mt-0.5">{notifs.length} notifications</p>
          </div>
          {unread > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white/50 hover:text-white transition-all hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <CheckCheck className="w-4 h-4" /> Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-[12.5px] font-semibold transition-all"
              style={{
                background: filter === f ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
                border: filter === f ? "1px solid rgba(139,92,246,0.35)" : "1px solid transparent",
                color: filter === f ? "#A78BFA" : "rgba(255,255,255,0.4)",
              }}>
              {f}
            </button>
          ))}
        </div>

        {notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
              <Bell className="w-7 h-7 text-[#8B5CF6]/40" />
            </div>
            <p className="text-[15px] font-bold text-white/25">Aucune notification</p>
            <p className="text-[13px] text-white/15 mt-1">Tu seras notifié ici de toute activité</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(groups).map(([label, items]) => (
              <div key={label}>
                <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-3">{label}</p>
                <div className="flex flex-col gap-2">
                  {items.map(n => (
                    <NotifCard key={n.id} notif={n} onRead={markRead} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
