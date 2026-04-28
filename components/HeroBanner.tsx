import Link from "next/link";
import { Zap, Crown, ArrowRight, Sparkles } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="px-4 pt-4 pb-2 space-y-3">

      {/* ── Vendre avec l'IA ───────────────────────────────────────────────── */}
      <Link href="/sell/ai" className="block active:scale-[0.975] transition-transform duration-150">
        <div
          className="relative rounded-3xl overflow-hidden p-5"
          style={{
            background: "linear-gradient(135deg, #0F0A1E 0%, #2E1065 50%, #4C1D95 100%)",
            border: "1px solid rgba(139,92,246,0.35)",
            boxShadow: "0 8px 32px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 65%)" }} />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 65%)" }} />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3"
              style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-pulse" />
              <span className="text-[10px] font-black text-[#A78BFA] tracking-widest uppercase">IA Active</span>
            </div>

            <h2 className="text-[26px] font-black text-white leading-tight mb-1">
              Vends avec l'IA
            </h2>
            <p className="text-[13px] text-white/50 mb-4">
              Photo → annonce complète en 30 secondes
            </p>

            <div
              className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
                boxShadow: "0 4px 20px rgba(139,92,246,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white fill-white" />
                <span className="text-[15px] font-black text-white">Vendre maintenant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-white/70">Gratuit</span>
                <ArrowRight className="w-4 h-4 text-white/80" />
              </div>
            </div>

            <p className="text-[11px] text-white/30 text-center mt-2.5">
              1 clic · annonce prête · 0 effort
            </p>
          </div>
        </div>
      </Link>

      {/* ── Premium ────────────────────────────────────────────────────────── */}
      <Link href="/premium" className="block active:scale-[0.975] transition-transform duration-150">
        <div
          className="relative rounded-3xl overflow-hidden p-5"
          style={{
            background: "linear-gradient(135deg, #1C1400 0%, #2D1F00 60%, #1C1400 100%)",
            border: "1px solid rgba(245,158,11,0.3)",
            boxShadow: "0 8px 32px rgba(245,158,11,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 65%)" }} />

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2"
                style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
                <Crown className="w-3 h-3" style={{ color: "#FCD34D" }} />
                <span className="text-[10px] font-black text-[#FCD34D] tracking-widest uppercase">Premium</span>
              </div>
              <h3 className="text-[20px] font-black text-white leading-tight mb-0.5">
                IA & Boosts illimités
              </h3>
              <p className="text-[12px] text-white/40">Vends 3× plus vite</p>
            </div>

            <div className="flex-shrink-0">
              <div
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #F59E0B, #D97706)",
                  boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
                }}
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-[12px] font-black text-white whitespace-nowrap">Voir l'offre</span>
                <span className="text-[10px] font-bold text-white/70">10€/mois</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

    </div>
  );
}
