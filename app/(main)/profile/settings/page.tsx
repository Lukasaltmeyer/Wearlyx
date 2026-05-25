export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { Navbar } from "@/components/layout/Navbar";
import { SettingsClient } from "@/components/SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const device = await getDeviceType();

  if (device === "desktop") {
    return (
      <main className="min-h-[100dvh] pb-16">
        {/* Hero */}
        <div className="relative overflow-hidden px-8 pt-10 pb-8 mb-8"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.07) 0%, rgba(109,40,217,0.03) 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.08) 0%, transparent 60%)" }} />
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2 relative" style={{ color: "rgba(167,139,250,0.5)" }}>Compte</p>
          <h1 className="text-[32px] font-black tracking-tight text-white relative" style={{ letterSpacing: "-0.02em" }}>Paramètres</h1>
          <p className="text-[14px] text-white/30 mt-1 relative">Gère ton profil, ta sécurité et tes préférences.</p>
        </div>
        <div className="px-8">
          <SettingsClient isDesktop />
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24 animate-fadeIn">
        <SettingsClient />
      </main>
    </>
  );
}
