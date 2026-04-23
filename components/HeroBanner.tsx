import Link from "next/link";
import { Zap, Crown, ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="px-3 pt-3.5 pb-1 flex gap-2.5">

      {/* Vendre avec l'IA */}
      <Link href="/sell/ai" className="block active:scale-[0.97] transition-transform duration-150" style={{ flex: "3" }}>
        <div
          className="relative rounded-2xl overflow-hidden p-4 min-h-[108px] flex flex-col justify-between"
          style={{ background: "linear-gradient(140deg, #4C1D95 0%, #7C3AED 45%, #C026D3 100%)" }}
        >
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/[0.06]" />
          <div className="absolute -bottom-5 -left-3 w-20 h-20 rounded-full bg-white/[0.04]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />

          <div className="relative z-10">
            <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-2.5">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <p className="text-white font-black text-[15px] leading-tight">Vendre avec l&apos;IA</p>
            <p className="text-white/55 text-[11px] mt-0.5 leading-snug">Photo → annonce en 30s</p>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white/90">
              Gratuit
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-white/40" />
          </div>
        </div>
      </Link>

      {/* Plan Premium */}
      <Link href="/premium" className="block active:scale-[0.97] transition-transform duration-150" style={{ flex: "2" }}>
        <div
          className="relative rounded-2xl overflow-hidden p-4 min-h-[108px] flex flex-col justify-between"
          style={{ background: "linear-gradient(140deg, #78350F 0%, #D97706 55%, #FBBF24 100%)" }}
        >
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/[0.06]" />
          <div className="absolute -bottom-5 -left-3 w-20 h-20 rounded-full bg-white/[0.04]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />

          <div className="relative z-10">
            <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-2.5">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <p className="text-white font-black text-[15px] leading-tight">Plan Premium</p>
            <p className="text-white/55 text-[11px] mt-0.5 leading-snug">IA illimitée & Boosts</p>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white/90">
              Dès 10€/mois
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-white/40" />
          </div>
        </div>
      </Link>

    </div>
  );
}
