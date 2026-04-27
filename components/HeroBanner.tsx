import Link from "next/link";
import { Zap, Crown, ArrowUpRight } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="px-4 pt-4 pb-2 flex gap-3">

      {/* ── Vendre avec l'IA ───────────────────── */}
      <Link href="/sell/ai" className="flex-[3] block active:scale-[0.975] transition-transform duration-150">
        <div
          className="relative rounded-2xl overflow-hidden p-4 h-[120px] flex flex-col justify-between"
          style={{ background: "#11111A", border: "1px solid rgba(139,92,246,0.2)" }}
        >
          {/* Subtle glow top-left */}
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />

          {/* Top row */}
          <div className="flex items-start justify-between relative z-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}>
              <Zap className="w-4 h-4 fill-[#8B5CF6] text-[#8B5CF6]" />
            </div>
            <ArrowUpRight className="w-4 h-4 mt-0.5" style={{ color: "rgba(139,92,246,0.4)" }} />
          </div>

          {/* Text */}
          <div className="relative z-10">
            <p className="text-[15px] font-black text-white leading-tight mb-0.5">Vendre avec l'IA</p>
            <p className="text-[11px] leading-snug" style={{ color: "rgba(255,255,255,0.4)" }}>
              Photo → annonce en 30s
            </p>
          </div>

          {/* Bottom tag */}
          <div className="absolute bottom-3.5 right-3.5 z-10">
            <span className="text-[9.5px] font-bold px-2 py-1 rounded-full"
              style={{ background: "rgba(139,92,246,0.12)", color: "#A78BFA", border: "1px solid rgba(139,92,246,0.2)" }}>
              Gratuit ✦
            </span>
          </div>
        </div>
      </Link>

      {/* ── Premium ────────────────────────────── */}
      <Link href="/premium" className="flex-[2] block active:scale-[0.975] transition-transform duration-150">
        <div
          className="relative rounded-2xl overflow-hidden p-4 h-[120px] flex flex-col justify-between"
          style={{ background: "#11111A", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Subtle glow */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)" }} />

          {/* Top row */}
          <div className="flex items-start justify-between relative z-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <Crown className="w-4 h-4" style={{ color: "#F59E0B" }} />
            </div>
          </div>

          {/* Text */}
          <div className="relative z-10">
            <p className="text-[15px] font-black text-white leading-tight mb-0.5">Premium</p>
            <p className="text-[11px] leading-snug" style={{ color: "rgba(255,255,255,0.35)" }}>
              IA & Boosts illimités
            </p>
          </div>

          {/* Bottom tag */}
          <div className="absolute bottom-3.5 right-3 z-10">
            <span className="text-[9.5px] font-bold px-2 py-1 rounded-full"
              style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.18)" }}>
              10€/mois
            </span>
          </div>
        </div>
      </Link>

    </div>
  );
}