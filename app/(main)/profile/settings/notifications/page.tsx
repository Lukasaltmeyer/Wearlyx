export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { Navbar } from "@/components/layout/Navbar";
import { NotificationsSettingsClient } from "@/components/NotificationsSettingsClient";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const [{ data: profile }, device] = await Promise.all([
    supabase.from("profiles").select("email_notifications_enabled, marketing_consent").eq("id", user.id).single(),
    getDeviceType(),
  ]);

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24 animate-fadeIn">
        <NotificationsSettingsClient
          initialEmailEnabled={profile?.email_notifications_enabled ?? true}
          initialMarketingConsent={profile?.marketing_consent ?? false}
          isDesktop={device === "desktop"}
        />
      </main>
    </>
  );
}