export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { SellForm } from "@/components/SellForm";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SellManualPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const device = await getDeviceType();

  if (device === "desktop") {
    return (
      <main className="min-h-[100dvh] px-8 py-8">
        <div className="relative overflow-hidden rounded-[20px] px-7 py-6 mb-8"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(167,139,250,0.04) 100%)", border: "1px solid rgba(139,92,246,0.14)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(167,139,250,0.5)" }}>Vendre</p>
          <p className="text-[22px] font-black text-white tracking-tight mb-1">Nouvelle annonce</p>
          <p className="text-[12.5px] text-white/35 leading-relaxed">Remplis les informations de l&apos;article pour publier ton annonce.</p>
        </div>
        <SellForm userId={user.id} />
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24 animate-fadeIn">
        <div className="px-4 pt-5 pb-4 flex items-center gap-3">
          <Link href="/sell"
            className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-[20px] font-black text-white">Nouvelle annonce</h1>
            <p className="text-[12px] text-white/35">Remplis les informations de l&apos;article</p>
          </div>
        </div>
        <SellForm userId={user.id} />
      </main>
    </>
  );
}
