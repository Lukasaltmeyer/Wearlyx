"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowDownToLine, Plus, Heart, TrendingUp, ShoppingBag } from "lucide-react";

interface Props {
  userId: string;
  isDesktop?: boolean;
}

export function WalletPageClient({ isDesktop }: Props) {
  const router = useRouter();

  if (isDesktop) {
    return (
      <div className="flex flex-col gap-8">
        {/* Balance row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-[16px] border border-white/8 bg-white/[0.025]">
            <p className="text-[11px] font-semibold text-white/35 uppercase tracking-widest mb-3">Montant en attente</p>
            <div className="flex items-end justify-between">
              <p className="text-[40px] font-black text-white leading-none">0.00 <span className="text-[22px] text-white/50">€</span></p>
              <button className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/40">
                <span className="text-[12px] font-bold">ℹ</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-[16px] border border-white/8 bg-white/[0.025]">
            <p className="text-[11px] font-semibold text-white/35 uppercase tracking-widest mb-3">Solde disponible</p>
            <p className="text-[40px] font-black text-white leading-none mb-1">0.00 <span className="text-[22px] text-white/50">€</span></p>
            <p className="text-[12px] text-white/30">0 ventes réalisées</p>
          </div>
        </div>

        {/* Actions */}
        <div>
          <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-3">Actions</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: ArrowDownToLine, label: "Transférer", desc: "Virer sur ton compte bancaire", color: "#4CAF50" },
              { icon: Plus, label: "Ajouter des fonds", desc: "Recharger le portefeuille", color: "rgba(255,255,255,0.7)" },
              { icon: Heart, label: "Faire un don", desc: "Reverser à une association", color: "#EF4444" },
            ].map(({ icon: Icon, label, desc, color }) => (
              <button key={label}
                className="flex flex-col items-start gap-3 p-4 rounded-[14px] border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all text-left">
                <div className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0"
                  style={{ background: color + "18", border: `1px solid ${color}28` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white/80">{label}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* History side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-[#4CAF50]" />
              <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Mes ventes</p>
            </div>
            <div className="p-8 rounded-[14px] border border-white/5 bg-white/[0.015] flex flex-col items-center justify-center text-center">
              <p className="text-[13px] text-white/25">Aucune vente pour l'instant</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <ShoppingBag className="w-3.5 h-3.5 text-[#3B82F6]" />
              <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Mes achats</p>
            </div>
            <div className="p-8 rounded-[14px] border border-white/5 bg-white/[0.015] flex flex-col items-center justify-center text-center">
              <p className="text-[13px] text-white/25">Aucun achat pour l'instant</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 px-4 pt-5 pb-5">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-bold text-white">Mon portefeuille</h1>
      </div>

      <div className="px-4 flex flex-col gap-3">
        <div className="p-4 rounded-2xl border border-white/8 bg-white/3">
          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">Montant en attente</p>
          <div className="flex items-center justify-between">
            <p className="text-[26px] font-black text-white">0.00 €</p>
            <button className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/40">
              <span className="text-[12px] font-bold">ℹ</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-white/8 bg-white/3">
          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">Solde disponible</p>
          <p className="text-[36px] font-black text-white leading-none">0.00 <span className="text-[22px]">€</span></p>
          <p className="text-[12px] text-white/30 mt-1 mb-4">0 ventes réalisées</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: ArrowDownToLine, label: "Transférer", color: "#4CAF50" },
              { icon: Plus, label: "Ajouter", color: "white" },
              { icon: Heart, label: "Donner", color: "#EF4444" },
            ].map(({ icon: Icon, label, color }) => (
              <button key={label}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/8 bg-white/4 hover:bg-white/6 transition-all active:scale-[0.97]">
                <Icon className="w-4.5 h-4.5" style={{ color }} />
                <p className="text-[12px] font-semibold text-white">{label}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#4CAF50]" />
            <p className="text-[12px] font-black text-white/40 uppercase tracking-wider">Mes ventes</p>
          </div>
          <div className="p-6 rounded-2xl border border-white/6 bg-white/2 flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">📦</span>
            <p className="text-[13px] text-white/30">Aucune vente pour l'instant</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-[#3B82F6]" />
            <p className="text-[12px] font-black text-white/40 uppercase tracking-wider">Mes achats</p>
          </div>
          <div className="p-6 rounded-2xl border border-white/6 bg-white/2 flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">🛍️</span>
            <p className="text-[13px] text-white/30">Aucun achat pour l'instant</p>
          </div>
        </div>
      </div>
    </div>
  );
}
