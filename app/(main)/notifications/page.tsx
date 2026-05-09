export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { DesktopNotifications } from "@/components/desktop/DesktopNotifications";
import { Bell, Package, Heart, MessageCircle, Star, Zap } from "lucide-react";

function getNotifIcon(type: string) {
  const icons: Record<string, { icon: any; color: string; bg: string }> = {
    message:  { icon: MessageCircle, color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
    like:     { icon: Heart,         color: "#EF4444", bg: "rgba(239,68,68,0.10)"  },
    sale:     { icon: Package,       color: "#10B981", bg: "rgba(16,185,129,0.10)" },
    review:   { icon: Star,          color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
    boost:    { icon: Zap,           color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  };
  return icons[type] ?? { icon: Bell, color: "#8B5CF6", bg: "rgba(139,92,246,0.10)" };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const device = await getDeviceType();
  if (device === "desktop") {
    return <DesktopNotifications notifications={notifications ?? []} userId={user.id} />;
  }

  const notifs = notifications ?? [];
  const unread = notifs.filter((n: any) => !n.read).length;

  return (
    <div
      className="min-h-[100dvh] pb-24"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 45%), #07070A",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-black text-white">Notifications</h1>
          {unread > 0 && (
            <span
              className="text-[11px] font-black px-2.5 py-1 rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 12px rgba(139,92,246,0.4)" }}
            >
              {unread} nouvelle{unread > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {notifs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: "rgba(139,92,246,0.07)",
              border: "1px solid rgba(139,92,246,0.12)",
              boxShadow: "0 0 32px rgba(139,92,246,0.08)",
            }}
          >
            <Bell className="w-9 h-9 text-[#8B5CF6]/40" />
          </div>
          <p className="text-[16px] font-black text-white/40">Aucune notification</p>
          <p className="text-[13px] text-white/20 mt-1.5 max-w-[200px]">
            Tes activités et alertes apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="px-3 flex flex-col gap-2">
          {notifs.map((n: any) => {
            const conf = getNotifIcon(n.type);
            const IconComp = conf.icon;
            return (
              <div
                key={n.id}
                className="flex items-start gap-3.5 px-4 py-4 rounded-2xl transition-all relative overflow-hidden"
                style={{
                  background: n.read
                    ? "rgba(255,255,255,0.025)"
                    : "rgba(139,92,246,0.06)",
                  border: `1px solid ${n.read ? "rgba(255,255,255,0.06)" : "rgba(139,92,246,0.18)"}`,
                  boxShadow: n.read ? "none" : "0 4px 16px rgba(139,92,246,0.06)",
                }}
              >
                {!n.read && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                    style={{ background: "linear-gradient(180deg, #8B5CF6, #7C3AED)" }}
                  />
                )}

                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: conf.bg, border: `1px solid ${conf.color}22` }}
                >
                  <IconComp className="w-4 h-4" style={{ color: conf.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-[13.5px] leading-snug ${n.read ? "text-white/55" : "text-white font-semibold"}`}>
                    {n.title || n.body || "Notification"}
                  </p>
                  {n.body && n.title && (
                    <p className="text-[12px] text-white/30 mt-0.5 leading-snug">{n.body}</p>
                  )}
                  <p className="text-[11px] text-white/25 mt-1.5">{formatDate(n.created_at)}</p>
                </div>

                {!n.read && (
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: "#8B5CF6", boxShadow: "0 0 8px rgba(139,92,246,0.7)" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
