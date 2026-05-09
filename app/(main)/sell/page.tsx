export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Zap, PenLine, Shield, Sparkles, TrendingUp, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { getDeviceType } from "@/lib/device";
import { DesktopSellPage } from "@/components/desktop/DesktopSellPage";

export default async function SellPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const device = await getDeviceType();
  if (device === "desktop") {
    return <DesktopSellPage />;
  }

  return (
    <>
      <Navbar />
      <main
        className="min-h-[100dvh] pb-24"
        style={{
          background: "radial-gradient(ellipse at 30% 0%, rgba(139,92,246,0.14) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(109,40,217,0.08) 0%, transparent 40%), #07070A",
        }}
      >
        {/* Header */}
        <div className="px-4 pt-6 pb-5">
          <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-5">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[13px]">Retour</span>
          </Link>
          <h1 className="text-[26px] font-black text-white leading-tight">Vendre un article</h1>
          <p className="text-[13.5px] text-white/35 mt-1">Choisis comment créer ton annonce</p>
        </div>

        {/* Stats bar */}
        <div className="px-4 mb-5">
          <div
            className="flex gap-4 px-4 py-3 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {[
              { icon: TrendingUp, value: "32K+", label: "Articles vendus", color: "#10B981" },
              { icon: Clock,       value: "2min",  label: "Temps moyen",    color: "#8B5CF6" },
              { icon: Sparkles,    value: "98%",   label: "Satisfaction",   color: "#F59E0B" },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                <div>
                  <p className="text-[13px] font-black text-white">{value}</p>
                  <p className="text-[10px] text-white/25 leading-tight">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 space-y-3">
          {/* AI option — main hero card */}
          <Link href="/sell/ai" className="block active:scale-[0.985] transition-transform duration-150">
            <div
              className="relative rounded-3xl overflow-hidden p-5"
              style={{
                background: "linear-gradient(135deg, #3B0D8C 0%, #5B21B6 45%, #7C3AED 100%)",
                boxShadow: "0 8px 32px rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
                minHeight: 180,
              }}
            >
              {/* Atmospheric */}
              <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)" }} />
              <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)" }} />
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
                  >
                    <Zap className="w-6 h-6 text-white fill-white" />
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-black text-white"
                    style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
                  >
                    ⚡ RECOMMANDÉ
                  </span>
                </div>
                <p className="text-white font-black text-[22px] leading-tight mb-1">Vendre avec l'IA</p>
                <p className="text-white/65 text-[13.5px] mb-4">Photo → annonce complète en 30 secondes</p>
                <div className="flex flex-wrap gap-2">
                  {["✨ Photos améliorées", "🤖 Titre & description", "💰 Prix conseillé"].map(f => (
                    <span
                      key={f}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-white/85"
                      style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.18)" }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>

          {/* Manual option */}
          <Link href="/sell/manual" className="block active:scale-[0.985] transition-transform duration-150">
            <div
              className="rounded-3xl p-5"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <PenLine className="w-5 h-5 text-white/50" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-[17px]">Créer manuellement</p>
                  <p className="text-white/35 text-[13px] mt-0.5">Remplis toi-même tous les champs</p>
                  <div className="flex gap-2 mt-3">
                    {["Contrôle total", "Personnalisé"].map(f => (
                      <span
                        key={f}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium text-white/40"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Security badge */}
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl"
            style={{
              background: "rgba(16,185,129,0.05)",
              border: "1px solid rgba(16,185,129,0.1)",
            }}
          >
            <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <p className="text-[12px] text-emerald-300/50">Protection acheteur incluse · Paiement sécurisé · Commission 0%</p>
          </div>
        </div>
      </main>
    </>
  );
}
