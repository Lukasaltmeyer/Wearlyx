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
    return (
      <main className="min-h-[100dvh] px-8 py-8">
        <h1 className="text-[28px] font-black tracking-tight text-white/90 mb-8">Parrainage</h1>
        <ReferralClient referralCode={referralCode} isDesktop />
      </main>
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
