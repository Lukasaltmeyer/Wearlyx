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
    return (
      <main className="min-h-[100dvh] px-10 py-10">
        <div className="max-w-[640px] mx-auto">
          <h1 className="text-[28px] font-black tracking-tight text-white/90 mb-8">Modifier le profil</h1>
          <ProfileEditClient profile={profile} userId={user.id} />
        </div>
      </main>
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
