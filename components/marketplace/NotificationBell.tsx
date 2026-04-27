"use client";

import { useState, useEffect } from "react";
import { Bell, X, Package, Tag, ShieldAlert, MessageCircle, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/types/database";

const ICONS: Record<NotificationType, React.ElementType> = {
  offer_received:   Tag,
  offer_accepted:   CheckCircle,
  offer_refused:    X,
  offer_countered:  Tag,
  order_confirmed:  Package,
  order_shipped:    Package,
  order_delivered:  CheckCircle,
  dispute_opened:   ShieldAlert,
  dispute_resolved: CheckCircle,
  new_message:      MessageCircle,
};

const COLORS: Record<NotificationType, string> = {
  offer_received:   "bg-green-500/20 text-green-400",
  offer_accepted:   "bg-green-500/20 text-green-400",
  offer_refused:    "bg-red-500/20 text-red-400",
  offer_countered:  "bg-yellow-500/20 text-yellow-400",
  order_confirmed:  "bg-blue-500/20 text-blue-400",
  order_shipped:    "bg-indigo-500/20 text-indigo-400",
  order_delivered:  "bg-green-500/20 text-green-400",
  dispute_opened:   "bg-orange-500/20 text-orange-400",
  dispute_resolved: "bg-teal-500/20 text-teal-400",
  new_message:      "bg-[#22C55E]/20 text-[#4ADE80]",
};

interface Props { userId: string; }

export function NotificationBell({ userId }: Props) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(30);
      setNotifs((data as AppNotification[]) ?? []);
    };
    load();

    const channel = supabase
      .channel("notifs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => setNotifs((prev) => [payload.new as AppNotification, ...prev]))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const markAllRead = async () => {
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative w-9 h-9 flex items-center justify-center">
        <Bell className="w-5 h-5 text-white/60" />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-black text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-[600px] bg-[#12121C] rounded-b-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/8">
              <h2 className="text-[16px] font-black text-white">Notifications</h2>
              <div className="flex gap-2">
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-[11px] text-[#22C55E] font-semibold">
                    Tout lire
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-white/60" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {notifs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="w-10 h-10 text-white/15 mb-3" />
                  <p className="text-white/40 font-semibold">Aucune notification</p>
                </div>
              ) : (
                notifs.map((n) => {
                  const Icon = ICONS[n.type] ?? Bell;
                  const color = COLORS[n.type] ?? "bg-white/10 text-white/50";
                  return (
                    <div key={n.id}
                      className={cn("flex gap-3 px-4 py-3.5 border-b border-white/5 transition-colors", !n.read && "bg-white/3")}>
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", color)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-white leading-tight">{n.title}</p>
                        <p className="text-[12px] text-white/40 mt-0.5 leading-tight">{n.body}</p>
                        <p className="text-[10px] text-white/25 mt-1">{timeAgo(n.created_at)}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0 mt-1.5" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
