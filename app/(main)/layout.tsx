export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserModeration } from "@/lib/moderation";
import { BottomNav } from "@/components/layout/BottomNav";
import { ModerationBanner } from "@/components/ModerationBanner";
import { PushNotificationSetup } from "@/components/PushNotificationSetup";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const mod = await getUserModeration(user.id);
    if (mod.status === "banned") redirect("/banned");

    if (mod.status === "warned" || mod.status === "suspended") {
      return (
        <>
          <ModerationBanner
            status={mod.status}
            reason={mod.reason}
            expiresAt={mod.expiresAt}
          />
          {mod.status === "warned" && (
            <div className="pt-[60px]">
              {children}
              <BottomNav />
            </div>
          )}
        </>
      );
    }
  }

  return (
    <>
      {children}
      <BottomNav />
      <PushNotificationSetup />
    </>
  );
}
