export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Zap, PenLine, Shield } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default async function SellPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24">
        <div className="px-4 pt-6 pb-5">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-5">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[13px]">Retour</span>
          </Link>
          <h1 className="text-[26px] font-black text-white leading-tight">Vendre un article</h1>
          <p className="text-[14px] text-white/40 mt-1">Choisis comment créer ton annonce</p>
        </div>

        <div className="px-4 space-y-3">
          {/* IA — recommandé */}
          <Link href="/sell/ai" className="block active:scale-[0.98] transition-transform">
            <div className="relative rounded-3xl overflow-hidden p-5"
              style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)" }}>
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/8" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/6" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white fill-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/20 text-[11px] font-black text-white">
                    ⚡ RECOMMANDÉ
                  </span>
                </div>
                <p className="text-white font-black text-[20px] leading-tight mb-1">Vendre avec l'IA</p>
                <p className="text-white/70 text-[13px] mb-4">Photo → annonce complète en 30 secondes</p>
                <div className="flex flex-wrap gap-2">
                  {["✨ Photos améliorées", "🤖 Titre & description", "💰 Prix conseillé"].map(f => (
                    <span key={f} className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-semibold">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>

          {/* Manuel */}
          <Link href="/sell/manual" className="block active:scale-[0.98] transition-transform">
            <div className="rounded-3xl border border-white/8 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <PenLine className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <p className="text-white font-bold text-[17px]">Créer manuellement</p>
                  <p className="text-white/40 text-[13px] mt-0.5">Remplis toi-même tous les champs</p>
                  <div className="flex gap-2 mt-3">
                    {["Contrôle total", "Personnalisé"].map(f => (
                      <span key={f} className="px-2.5 py-1 rounded-full bg-white/6 border border-white/8 text-white/50 text-[11px] font-medium">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Sécurité */}
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500/6 border border-emerald-500/12">
            <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <p className="text-[12px] text-emerald-300/60">Protection acheteur incluse · Paiement sécurisé</p>
          </div>
        </div>
      </main>
    </>
  );
}