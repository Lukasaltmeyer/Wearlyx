export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { Navbar } from "@/components/layout/Navbar";
import { VacationModeClient } from "@/components/VacationModeClient";

export default async function VacationModePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const device = await getDeviceType();

  if (device === "desktop") {
    const { DesktopPageShell } = await import("@/components/desktop/DesktopPageShell");
    return (
      <DesktopPageShell title="Mode vacances" subtitle="Mets en pause ta boutique" backHref="/profile/menu">
        <VacationModeClient isDesktop />
      </DesktopPageShell>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24 animate-fadeIn">
        <VacationModeClient />
      </main>
    </>
  );
}
