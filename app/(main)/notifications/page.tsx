export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { DesktopNotifications } from "@/components/desktop/DesktopNotifications";

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

  // Mobile fallback
  return (
    <div className="px-4 pt-5 pb-24">
      <h1 className="text-[20px] font-black text-white mb-4">Notifications</h1>
      {(notifications ?? []).length === 0 ? (
        <p className="text-[14px] text-white/30 text-center py-20">Aucune notification</p>
      ) : (
        <div className="flex flex-col gap-2">
          {(notifications ?? []).map((n: any) => (
            <div key={n.id} className="px-4 py-3 rounded-2xl"
              style={{ background: n.read ? "rgba(255,255,255,0.02)" : "rgba(139,92,246,0.08)", border: `1px solid ${n.read ? "rgba(255,255,255,0.06)" : "rgba(139,92,246,0.2)"}` }}>
              <p className="text-[13px] text-white">{n.title || n.body || "Notification"}</p>
              <p className="text-[11px] text-white/30 mt-1">{n.created_at}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
