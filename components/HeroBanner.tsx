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
            background: "linear-gradient(145deg, #1A0533 0%, #3B1278 55%, #5B21B6 100%)",
            border: "1px solid rgba(139,92,246,0.4)",
            boxShadow: "0 8px 32px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Glow orb */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 65%)" }} />
          <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)" }} />

          {/* Top */}
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(139,92,246,0.3)", border: "1px solid rgba(139,92,246,0.5)" }}>
                <Zap className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">IA</span>
            </div>
            <p className="text-[17px] font-black text-white leading-tight mb-1">Vendre avec l'IA</p>
            <p className="text-[11px] text-white/45 leading-snug">1 clic → annonce prête</p>
          </div>

          {/* CTA Button */}
          <div className="relative z-10 mt-4">
            <div
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
                boxShadow: "0 4px 16px rgba(139,92,246,0.55), 0 0 0 1px rgba(255,255,255,0.1) inset",
              }}
            >
              <Zap className="w-3.5 h-3.5 text-white fill-white" />
              <span className="text-[13px] font-black text-white">Vendre maintenant</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/70" />
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
            background: "linear-gradient(145deg, #1A1000 0%, #2D1C00 55%, #1A1000 100%)",
            border: "1px solid rgba(245,158,11,0.35)",
            boxShadow: "0 8px 32px rgba(245,158,11,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Glow orb */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 65%)" }} />

          {/* Top */}
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.35)" }}>
                <Crown className="w-3.5 h-3.5" style={{ color: "#FCD34D" }} />
              </div>
              <span className="text-[10px] font-black text-amber-400/50 uppercase tracking-widest">Pro</span>
            </div>
            <p className="text-[17px] font-black text-white leading-tight mb-1">Plan Premium</p>
            <p className="text-[11px] text-white/40 leading-snug">Boosts, IA illimitée</p>
          </div>

          {/* CTA Button */}
          <div className="relative z-10 mt-4">
            <div
              className="w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                boxShadow: "0 4px 16px rgba(245,158,11,0.45), 0 0 0 1px rgba(255,255,255,0.1) inset",
              }}
            >
              <Crown className="w-3.5 h-3.5 text-white fill-white" />
              <span className="text-[13px] font-black text-white">Voir l'offre</span>
            </div>
            <p className="text-[10px] text-white/25 text-center mt-1.5">Dès 10€/mois</p>
          </div>
        </div>
      </Link>

    </div>
  );
}
