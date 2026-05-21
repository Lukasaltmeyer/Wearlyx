export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { Navbar } from "@/components/layout/Navbar";
import { DonationModeClient } from "@/components/DonationModeClient";

export default async function DonationModePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const device = await getDeviceType();

  if (device === "desktop") {
    return (
      <main className="min-h-[100dvh] px-10 py-10">
        <div className="max-w-[640px] mx-auto">
          <h1 className="text-[28px] font-black tracking-tight text-white/90 mb-8">Mode donation</h1>
          <DonationModeClient isDesktop />
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24 animate-fadeIn">
        <DonationModeClient />
      </main>
    </>
  );
}
