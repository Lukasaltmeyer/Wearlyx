export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { Navbar } from "@/components/layout/Navbar";
import { WalletPageClient } from "@/components/WalletPageClient";

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const device = await getDeviceType();

  if (device === "desktop") {
    const { DesktopPageShell } = await import("@/components/desktop/DesktopPageShell");
    return (
      <DesktopPageShell title="Portefeuille" subtitle="Tes gains et transactions" backHref="/profile/menu">
        <WalletPageClient userId={user.id} isDesktop />
      </DesktopPageShell>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24 animate-fadeIn">
        <WalletPageClient userId={user.id} />
      </main>
    </>
  );
}
