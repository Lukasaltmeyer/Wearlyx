import Link from "next/link";
import { Zap, Crown, TrendingUp, Sparkles } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="px-3 pt-4 pb-3 space-y-3">

      {/* Main hero — Vendre avec l'IA */}
      <Link href="/sell/ai" className="block active:scale-[0.985] transition-transform duration-150">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #3B0D8C 0%, #5B21B6 50%, #7C3AED 100%)",
            boxShadow: "0 8px 32px rgba(109,40,217,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
            minHeight: 160,
          }}
        >
          {/* Atmospheric glow orbs */}
          <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)" }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(196,181,253,0.1) 0%, transparent 50%)" }} />

          {/* Grid texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />

          <div className="relative z-10 p-5 flex flex-col justify-between" style={{ minHeight: 160 }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
                  <Zap className="w-4 h-4 fill-white text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Intelligence Artificielle</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[9.5px] font-black text-white"
                style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
                ⚡ RECOMMANDÉ
              </span>
            </div>

            <div>
              <p className="text-[22px] font-black text-white leading-tight mb-1">Vendre avec l'IA</p>
              <p className="text-[12.5px] text-white/60 mb-3">Photo → annonce complète en 30 secondes</p>
              <div className="flex flex-wrap gap-1.5">
                {["✨ Photos améliorées", "🤖 Description auto", "💰 Prix conseillé"].map(f => (
                  <span key={f} className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white/80"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Two small cards */}
      <div className="grid grid-cols-2 gap-2.5">

        {/* Premium */}
        <Link href="/premium" className="block active:scale-[0.97] transition-transform duration-150">
          <div
            className="relative rounded-2xl overflow-hidden p-4 flex flex-col justify-between"
            style={{
              background: "linear-gradient(135deg, #78350F 0%, #B45309 60%, #D97706 100%)",
              boxShadow: "0 4px 20px rgba(180,83,9,0.35)",
              minHeight: 110,
            }}
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center mb-3"
                style={{ background: "rgba(255,255,255,0.2)" }}>
                <Crown className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-[14px] font-black text-white leading-tight">Plan Premium</p>
              <p className="text-[10.5px] text-white/60 mt-0.5">Boosts & IA illimitée</p>
              <p className="text-[9.5px] font-bold text-amber-200 mt-2">Dès 10€/mois →</p>
            </div>
          </div>
        </Link>

        {/* Tendances */}
        <Link href="/search?sort=popular" className="block active:scale-[0.97] transition-transform duration-150">
          <div
            className="relative rounded-2xl overflow-hidden p-4 flex flex-col justify-between"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
              minHeight: 110,
            }}
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center mb-3"
                style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.25)" }}>
                <TrendingUp className="w-3.5 h-3.5 text-[#A78BFA]" />
              </div>
              <p className="text-[14px] font-black text-white leading-tight">Tendances</p>
              <p className="text-[10.5px] text-white/40 mt-0.5">Ce qui se vend</p>
              <div className="flex items-center gap-1 mt-2">
                <Sparkles className="w-2.5 h-2.5 text-[#8B5CF6]" />
                <p className="text-[9.5px] font-bold text-[#A78BFA]">Sélection IA</p>
              </div>
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
