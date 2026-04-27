import Link from "next/link";
import { Zap, Crown, ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="px-3 pt-3.5 pb-1 flex gap-2.5">

      {/* Vendre avec l'IA */}
      <Link href="/sell/ai" className="block active:scale-[0.97] transition-transform duration-150" style={{ flex: "3" }}>
        <div
          className="relative rounded-2xl overflow-hidden p-4 min-h-[116px] flex flex-col justify-between"
          style={{ background: "linear-gradient(140deg, #3b0764 0%, #22C55E 50%, #16A34A 100%)" }}
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/[0.07]" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/[0.04]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />

          <div className="relative z-10">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2.5">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <p className="text-white font-black text-[15px] leading-tight">Vendre avec l&apos;IA</p>
            <p className="text-white/70 text-[11px] mt-0.5 leading-snug">Photo → annonce en 30s</p>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-2">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
              ✦ Gratuit
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-white/60" />
          </div>
        </div>
      </Link>

      {/* Plan Premium */}
      <Link href="/premium" className="block active:scale-[0.97] transition-transform duration-150" style={{ flex: "2" }}>
        <div
          className="relative rounded-2xl overflow-hidden p-4 min-h-[116px] flex flex-col justify-between"
          style={{ background: "linear-gradient(140deg, #451a03 0%, #b45309 50%, #F59E0B 100%)" }}
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/[0.07]" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/[0.04]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />

          <div className="relative z-10">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2.5">
              <Crown className="w-4 h-4 text-white fill-white/30" />
            </div>
            <p className="text-white font-black text-[15px] leading-tight">Premium</p>
            <p className="text-white/70 text-[11px] mt-0.5 leading-snug">IA illimitée & Boosts</p>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-2">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
              10€/mois
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-white/60" />
          </div>
        </div>
      </Link>

    </div>
  );
}
