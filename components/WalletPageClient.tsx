"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowDownToLine, Plus, Heart, TrendingUp, ShoppingBag } from "lucide-react";

interface Props {
  userId: string;
}

export function WalletPageClient({ userId }: Props) {
  const router = useRouter();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-5">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-bold text-white">Mon portefeuille</h1>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {/* Montant en attente */}
        <div className="p-4 rounded-2xl border border-white/8 bg-white/3">
          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">Montant en attente</p>
          <div className="flex items-center justify-between">
            <p className="text-[26px] font-black text-white">0.00 €</p>
            <button className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/40">
              <span className="text-[12px] font-bold">ℹ</span>
            </button>
          </div>
        </div>

        {/* Solde disponible */}
        <div className="p-4 rounded-2xl border border-white/8 bg-white/3">
          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">Solde disponible</p>
          <p className="text-[36px] font-black text-white leading-none">0.00 <span className="text-[22px]">€</span></p>
          <p className="text-[12px] text-white/30 mt-1 mb-4">0 ventes réalisées</p>
          {/* Action buttons */}
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

        {/* Mes ventes */}
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

        {/* Mes achats */}
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
