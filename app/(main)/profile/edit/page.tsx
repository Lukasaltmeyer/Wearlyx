export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { Navbar } from "@/components/layout/Navbar";
import { ProfileEditClient } from "@/components/ProfileEditClient";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const device = await getDeviceType();

  if (device === "desktop") {
    const { DesktopPageShell } = await import("@/components/desktop/DesktopPageShell");
    return (
      <DesktopPageShell title="Modifier le profil" subtitle="Mets à jour tes informations" backHref="/profile/menu">
        <ProfileEditClient profile={profile} userId={user.id} isDesktop />
      </DesktopPageShell>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24 animate-fadeIn">
        <ProfileEditClient profile={profile} userId={user.id} />
      </main>
    </>
  );
}
