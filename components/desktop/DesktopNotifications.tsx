"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell, Heart, MessageCircle, ShoppingBag, Star, Zap, CheckCheck,
  Package, Tag, UserPlus, Award, ArrowRight, Flame,
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
  { key: "Tout",     label: "Tout"      },
  { key: "Message",  label: "Messages"  },
  { key: "Favori",   label: "Favoris"   },
  { key: "Vente",    label: "Ventes"    },
  { key: "Avis",     label: "Avis"      },
  { key: "Abonné",   label: "Abonnés"   },
];

const LIVE_SALES = [
  { user: "sophie_m",  item: "Nike Air Force 1", price: "65€",  color: "#10B981" },
  { user: "king_v",    item: "Veste Carhartt",   price: "42€",  color: "#8B5CF6" },
  { user: "luxmode",   item: "Sac Jacquemus",    price: "145€", color: "#F59E0B" },
  { user: "lea.style", item: "Jordan 4 Retro",   price: "210€", color: "#EF4444" },
];

const TRENDING_NOW = ["Nike Air Force 1", "Jacquemus", "Zara 2024", "Jordan 4", "Vintage Levi's"];

function getNotifHref(notif: Notification): string {
  const d = notif.data ?? {};
  switch (notif.type) {
    case "message":
      if (d.conversation_id) return `/messages?conv=${d.conversation_id}`;
      if (d.actor_id) return `/messages?user=${d.actor_id}`;
      return "/messages";
    case "like":
      return d.product_id ? `/products/${d.product_id}` : "/";
    case "sale":
    case "order":
      if (d.order_id) return `/orders/${d.order_id}`;
      return d.product_id ? `/products/${d.product_id}` : "/sales";
    case "review":
      return "/profile/settings";
    case "follow":
      return d.actor_id ? `/profile/${d.actor_id}` : "/";
    default:
      return "/";
  }
}

function NotifRow({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const cfg = TYPE_CONFIG[notif.type ?? "default"] ?? TYPE_CONFIG.default;
  const Icon = cfg.icon;
  const d = notif.data ?? {};

  return (
    <Link href={getNotifHref(notif)}
      onClick={() => !notif.read && onRead(notif.id)}
      style={{ display: "block", textDecoration: "none" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 20px",
        position: "relative",
        background: !notif.read ? `${cfg.color}06` : "transparent",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        cursor: "pointer",
        transition: "background 0.12s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = !notif.read ? `${cfg.color}06` : "transparent"; }}>

        {/* Unread indicator */}
        {!notif.read && (
          <div style={{
            position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
            width: 3, height: 32, borderRadius: "0 2px 2px 0",
            background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}60)`,
          }} />
        )}

        {/* Avatar / icon */}
        <div style={{
          width: 46, height: 46, borderRadius: 14, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: cfg.bg, border: `1px solid ${cfg.color}20`,
          position: "relative",
        }}>
          {d.actor_avatar ? (
            <Image src={d.actor_avatar} alt="" width={46} height={46}
              style={{ borderRadius: 13, objectFit: "cover", width: "100%", height: "100%" }} />
          ) : d.actor_name ? (
            <span style={{ fontSize: 17, fontWeight: 800, color: cfg.color }}>
              {String(d.actor_name)[0]?.toUpperCase()}
            </span>
          ) : (
            <Icon style={{ width: 19, height: 19, color: cfg.color }} />
          )}
          <div style={{
            position: "absolute", bottom: -5, right: -5,
            width: 20, height: 20, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#0D0B16", border: `2px solid ${cfg.color}35`,
          }}>
            <Icon style={{ width: 10, height: 10, color: cfg.color }} />
          </div>
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
            <p style={{
              fontSize: 13.5, fontWeight: notif.read ? 400 : 600,
              color: notif.read ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.9)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0,
            }}>
              {notif.title || "Notification"}
            </p>
            <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.2)", flexShrink: 0, fontWeight: 500 }}>
              {timeAgo(notif.created_at)}
            </span>
          </div>
          {notif.body && (
            <p style={{
              fontSize: 12.5, color: "rgba(255,255,255,0.3)", margin: 0,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {notif.body}
            </p>
          )}
          <p style={{ fontSize: 11, color: cfg.color, margin: "4px 0 0", fontWeight: 500, opacity: 0.7 }}>
            {cfg.label}
            {notif.type === "message" && " · Voir la conversation →"}
          </p>
        </div>

        {/* Product thumb */}
        {d.product_image && (
          <div style={{
            width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0,
            border: "1px solid rgba(255,255,255,0.09)",
          }}>
            <Image src={d.product_image} alt="" width={44} height={44}
              style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          </div>
        )}

        {/* Unread dot */}
        {!notif.read && (
          <div style={{
            width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
            background: cfg.color, boxShadow: `0 0 8px ${cfg.color}`,
          }} />
        )}
      </div>
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

  const today = new Date(); today.setHours(0, 0, 0, 0);
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
    <div style={{
      display: "flex",
      width: "100%",
      height: "100dvh",
      overflow: "hidden",
      background: "#07060F",
    }}>

      {/* ══ MAIN ══ */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 28px", height: 64, flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "white", letterSpacing: "-0.03em", margin: 0 }}>
                Notifications
              </h1>
            </div>
            {unread > 0 && (
              <span style={{
                padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "white",
                background: "linear-gradient(135deg,#8B5CF6,#7C3AED)",
                boxShadow: "0 3px 12px rgba(139,92,246,0.4)",
              }}>
                {unread} non lue{unread > 1 ? "s" : ""}
              </span>
            )}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 16px", borderRadius: 9, fontSize: 13, fontWeight: 500,
              background: "transparent", border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.38)", cursor: "pointer", transition: "all 0.12s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}>
              <CheckCheck style={{ width: 15, height: 15 }} />
              Tout marquer lu
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "10px 28px", flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          overflowX: "auto", scrollbarWidth: "none",
        }}>
          {FILTER_TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              padding: "6px 16px", borderRadius: 20, fontSize: 12.5, fontWeight: 600,
              background: filter === key ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)",
              border: filter === key ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.07)",
              color: filter === key ? "#C4B5FD" : "rgba(255,255,255,0.32)",
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.12s",
              flexShrink: 0,
            }}>
              {label}
              {key !== "Tout" && (
                <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.6 }}>
                  {notifs.filter(n => (TYPE_CONFIG[n.type ?? "default"] ?? TYPE_CONFIG.default).label === key).length || ""}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
          {notifs.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.18)",
              }}>
                <Bell style={{ width: 32, height: 32, color: "rgba(139,92,246,0.5)" }} strokeWidth={1.5} />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: "-0.03em", margin: "0 0 8px" }}>
                  Tout est calme
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.16)", lineHeight: 1.6, margin: "0 0 24px", maxWidth: 240 }}>
                  Tu seras notifié ici dès qu&apos;il se passe quelque chose.
                </p>
                <Link href="/search" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                  color: "white", textDecoration: "none",
                  background: "linear-gradient(135deg,#8B5CF6,#7C3AED)",
                  boxShadow: "0 6px 22px rgba(139,92,246,0.35)",
                }}>
                  Explorer les articles <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60%" }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>Aucune notification dans cette catégorie</p>
            </div>
          ) : (
            <div style={{ padding: "8px 0 24px" }}>
              {groupOrder.filter(l => groups[l]?.length).map(label => (
                <div key={label}>
                  {/* Group header */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "16px 28px 8px",
                  }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>
                      {label}
                    </span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                    <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.16)" }}>{groups[label].length}</span>
                  </div>
                  {/* Rows */}
                  <div style={{ margin: "0 16px", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
                    {groups[label].map(n => <NotifRow key={n.id} notif={n} onRead={markRead} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
