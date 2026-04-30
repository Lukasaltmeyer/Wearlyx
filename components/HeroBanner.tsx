import Link from "next/link";
import { Zap, Crown, ArrowUpRight } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="px-4 pt-4 pb-2 flex gap-3">

      {/* ── Vendre avec l'IA ───────────────────────────────────────────── */}
      <Link href="/sell/ai" className="flex-[3] block active:scale-[0.975] transition-transform duration-150">
        <div
          className="relative rounded-2xl overflow-hidden p-4 flex flex-col justify-between"
          style={{
            height: 130,
            background: "linear-gradient(135deg, #4C1D95, #6D28D9)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top right, rgba(167,139,250,0.15) 0%, transparent 65%)" }} />

          {/* Top row */}
          <div className="flex items-start justify-between relative z-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <Zap className="w-4 h-4 fill-white text-white" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/30 mt-0.5" />
          </div>

          {/* Bottom text + tag */}
          <div className="relative z-10">
            <p className="text-[15px] font-black text-white leading-tight mb-0.5">Vendre avec l'IA</p>
            <p className="text-[11px] text-white/45">Photo → annonce en 30s</p>
            <div className="mt-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "#7C3AED", color: "#fff" }}>
                Vendre maintenant
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* ── Premium ──────────────────────────────────────────────────────── */}
      <Link href="/premium" className="flex-[2] block active:scale-[0.975] transition-transform duration-150">
        <div
          className="relative rounded-2xl overflow-hidden p-4 flex flex-col justify-between"
          style={{
            height: 130,
            background: "#111827",
            border: "1px solid rgba(251,191,36,0.2)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.45), 0 0 20px rgba(251,191,36,0.06)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top right, rgba(251,191,36,0.08) 0%, transparent 60%)" }} />

          {/* Top row */}
          <div className="flex items-start justify-between relative z-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.22)" }}>
              <Crown className="w-4 h-4" style={{ color: "#FCD34D" }} />
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10">
            <p className="text-[15px] font-black text-white leading-tight mb-0.5">Premium</p>
            <p className="text-[11px] text-white/35">IA & Boosts illimités</p>
            <div className="mt-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "#F59E0B", color: "#fff" }}>
                Voir l'offre
              </span>
            </div>
          </div>
        </div>
      </Link>

    </div>
  );
}
