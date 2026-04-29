import Link from "next/link";
import { Zap, Crown, ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="px-4 pt-4 pb-2 flex gap-3">

      {/* ── Vendre avec l'IA ───────────────────────────────────────────── */}
      <Link href="/sell/ai" className="flex-[3] block active:scale-[0.975] transition-transform duration-150">
        <div
          className="relative rounded-3xl overflow-hidden p-4 flex flex-col justify-between"
          style={{
            minHeight: 180,
            background: "linear-gradient(135deg, #4C1D95, #6D28D9)",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          {/* Subtle inner glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top right, rgba(139,92,246,0.15) 0%, transparent 60%)" }} />

          {/* Top */}
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Zap className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">IA</span>
            </div>
            <p className="text-[17px] font-black text-white leading-tight mb-1">Vendre avec l'IA</p>
            <p className="text-[11px] text-white/40 leading-snug">1 clic → annonce prête</p>
          </div>

          {/* CTA Button */}
          <div className="relative z-10 mt-4">
            <div
              className="w-full flex items-center justify-center gap-2 rounded-xl"
              style={{
                background: "#7C3AED",
                padding: "12px 16px",
                borderRadius: "12px",
              }}
            >
              <Zap className="w-3.5 h-3.5 text-white fill-white" />
              <span className="text-[13px] font-semibold text-white">Vendre maintenant</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/60" />
            </div>
            <p className="text-[10px] text-white/25 text-center mt-1.5">En 30 secondes · Gratuit</p>
          </div>
        </div>
      </Link>

      {/* ── Premium ──────────────────────────────────────────────────────── */}
      <Link href="/premium" className="flex-[2] block active:scale-[0.975] transition-transform duration-150">
        <div
          className="relative rounded-3xl overflow-hidden p-4 flex flex-col justify-between"
          style={{
            minHeight: 180,
            background: "#111827",
            border: "1px solid rgba(251,191,36,0.2)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(251,191,36,0.08)",
          }}
        >
          {/* Subtle top glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top right, rgba(251,191,36,0.08) 0%, transparent 60%)" }} />

          {/* Top */}
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
                <Crown className="w-3.5 h-3.5" style={{ color: "#FCD34D" }} />
              </div>
              <span className="text-[10px] font-semibold text-amber-400/40 uppercase tracking-widest">Pro</span>
            </div>
            <p className="text-[17px] font-black text-white leading-tight mb-1">Plan Premium</p>
            <p className="text-[11px] text-white/35 leading-snug">Boosts, IA illimitée</p>
          </div>

          {/* CTA Button */}
          <div className="relative z-10 mt-4">
            <div
              className="w-full flex items-center justify-center gap-1.5"
              style={{
                background: "#F59E0B",
                padding: "12px 16px",
                borderRadius: "12px",
              }}
            >
              <Crown className="w-3.5 h-3.5 text-white" />
              <span className="text-[13px] font-semibold text-white">Voir l'offre</span>
            </div>
            <p className="text-[10px] text-white/25 text-center mt-1.5">Dès 10€/mois</p>
          </div>
        </div>
      </Link>

    </div>
  );
}
