import Link from "next/link";
import { Zap, Crown } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="px-4 pt-3 pb-2 grid grid-cols-2 gap-3">

      {/* ── Vendre avec l'IA ── */}
      <Link href="/sell/ai" className="block active:scale-[0.975] transition-transform duration-150">
        <div
          className="relative rounded-2xl p-3.5 h-[112px] flex flex-col justify-between"
          style={{
            background: "linear-gradient(135deg, #4C1D95, #6D28D9)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top right, rgba(167,139,250,0.15) 0%, transparent 60%)" }} />

          <div className="relative z-10 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <Zap className="w-3 h-3 fill-white text-white" />
            </div>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">IA</span>
          </div>

          <div className="relative z-10">
            <p className="text-[14px] font-black text-white leading-tight mb-0.5">Vendre avec l'IA</p>
            <p className="text-[10.5px] text-white/40 mb-2">Photo → annonce en 10s</p>
            <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
              Gratuit ✦
            </span>
          </div>
        </div>
      </Link>

      {/* ── Premium ── */}
      <Link href="/premium" className="block active:scale-[0.975] transition-transform duration-150">
        <div
          className="relative rounded-2xl p-3.5 h-[112px] flex flex-col justify-between"
          style={{
            background: "linear-gradient(135deg, #D97706, #F59E0B)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top right, rgba(251,191,36,0.07) 0%, transparent 60%)" }} />

          <div className="relative z-10 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              <Crown className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-[14px] font-black text-white leading-tight mb-0.5">Plan Premium</p>
            <p className="text-[10.5px] text-white/70 mb-2">Boosts, IA illimitée</p>
            <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
              Dès 10€/mois
            </span>
          </div>
        </div>
      </Link>

    </div>
  );
}
