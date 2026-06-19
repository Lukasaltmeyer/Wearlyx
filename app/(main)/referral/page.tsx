export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { Navbar } from "@/components/layout/Navbar";
import { ReferralClient } from "@/components/ReferralClient";

export default async function ReferralPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const referralCode = profile?.username ?? user.id.slice(0, 8);

  const device = await getDeviceType();

  if (device === "desktop") {
    const { DesktopPageShell } = await import("@/components/desktop/DesktopPageShell");
    return (
      <DesktopPageShell title="Parrainage" subtitle="Invite tes amis, gagne des crédits" backHref="/profile/menu">
        <ReferralClient referralCode={referralCode} isDesktop />
      </DesktopPageShell>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24 animate-fadeIn">
        <ReferralClient referralCode={referralCode} />
      </main>
    </>
  );
}
