import Link from "next/link";
import { Zap, Crown } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="px-3 pt-3 pb-2 flex gap-2.5">

      {/* ── Vendre avec l'IA ───────────────────────────────────────────── */}
      <Link href="/sell/ai" className="flex-[3] block active:scale-[0.975] transition-transform duration-150">
        <div
          className="relative rounded-2xl overflow-hidden p-3.5 flex flex-col justify-between"
          style={{
            minHeight: 150,
            background: "linear-gradient(135deg, #4C1D95, #6D28D9)",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top right, rgba(139,92,246,0.12) 0%, transparent 60%)" }} />

          <div className="relative z-10">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center mb-2"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Zap className="w-3.5 h-3.5 fill-white text-white" />
            </div>
            <p className="text-[15px] font-black text-white leading-tight">Vendre avec l'IA</p>
            <p className="text-[10.5px] text-white/40 mt-0.5">1 clic → annonce prête</p>
          </div>

          <div className="relative z-10 mt-3">
            <div
              className="w-full flex items-center justify-center gap-1.5"
              style={{ background: "#7C3AED", padding: "9px 12px", borderRadius: "10px" }}
            >
              <Zap className="w-3 h-3 text-white fill-white" />
              <span className="text-[12px] font-semibold text-white">Vendre maintenant</span>
            </div>
            <p className="text-[9.5px] text-white/20 text-center mt-1">Gratuit · 30 secondes</p>
          </div>
        </div>
      </Link>

      {/* ── Premium ──────────────────────────────────────────────────────── */}
      <Link href="/premium" className="flex-[2] block active:scale-[0.975] transition-transform duration-150">
        <div
          className="relative rounded-2xl overflow-hidden p-3.5 flex flex-col justify-between"
          style={{
            minHeight: 150,
            background: "#111827",
            border: "1px solid rgba(251,191,36,0.2)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(251,191,36,0.06)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top right, rgba(251,191,36,0.07) 0%, transparent 60%)" }} />

          <div className="relative z-10">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center mb-2"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
              <Crown className="w-3.5 h-3.5" style={{ color: "#FCD34D" }} />
            </div>
            <p className="text-[15px] font-black text-white leading-tight">Plan Premium</p>
            <p className="text-[10.5px] text-white/35 mt-0.5">IA illimitée</p>
          </div>

          <div className="relative z-10 mt-3">
            <div
              className="w-full flex items-center justify-center gap-1.5"
              style={{ background: "#F59E0B", padding: "9px 12px", borderRadius: "10px" }}
            >
              <Crown className="w-3 h-3 text-white" />
              <span className="text-[12px] font-semibold text-white">Voir l'offre</span>
            </div>
            <p className="text-[9.5px] text-white/20 text-center mt-1">Dès 10€/mois</p>
          </div>
        </div>
      </Link>

    </div>
  );
}
