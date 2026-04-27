"use client";

import { Zap, Wallet, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { UsageData } from "@/lib/usage";

interface Props {
  usage: UsageData | null;
  balance?: number; // euros in wallet
}

export function WalletCard({ usage, balance = 0 }: Props) {
  const planLabel =
    !usage || usage.plan === "free"   ? "Gratuit" :
    usage.plan === "starter"          ? "Starter" :
    usage.plan === "pro"              ? "Vendeur Pro" : "Premium";

  const planColor =
    !usage || usage.plan === "free"   ? "#22C55E" :
    usage.plan === "starter"          ? "#3B82F6" :
    usage.plan === "pro"              ? "#22C55E" : "#F59E0B";

  const pct = usage?.pct ?? 0;

  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(14,14,22,0.95)" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${planColor}22` }}>
            <Wallet className="w-3.5 h-3.5" style={{ color: planColor }} />
          </div>
          <span className="text-[13px] font-bold text-white">Mon Wallet</span>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
          style={{ color: planColor, borderColor: `${planColor}40`, background: `${planColor}15` }}>
          {planLabel}
        </span>
      </div>

      <div className="px-4 pb-4 grid grid-cols-2 gap-2.5">
        {/* Solde */}
        <div className="rounded-xl p-3 border border-white/6" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingUp className="w-3 h-3 text-[#10B981]" />
            <span className="text-[10px] text-white/40 font-medium">Solde</span>
          </div>
          <p className="text-[20px] font-black text-white leading-none">{balance.toFixed(2)}€</p>
          <p className="text-[10px] text-white/30 mt-1">Disponible</p>
        </div>

        {/* Crédits IA */}
        <div className="rounded-xl p-3 border border-white/6" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Zap className="w-3 h-3 text-[#22C55E]" />
            <span className="text-[10px] text-white/40 font-medium">Crédits IA</span>
          </div>
          {usage?.limit === null ? (
            <p className="text-[20px] font-black text-white leading-none">∞</p>
          ) : (
            <p className="text-[20px] font-black text-white leading-none">
              {usage?.remaining ?? 0}<span className="text-[12px] text-white/30 font-medium">/{usage?.limit ?? 5}</span>
            </p>
          )}
          {usage?.limit !== null && (
            <div className="mt-2 h-1 rounded-full bg-white/8 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(0, 100 - pct)}%`, background: planColor }} />
            </div>
          )}
        </div>
      </div>

      {/* Upgrade CTA if free */}
      {(!usage || usage.plan === "free") && (
        <Link href="/premium"
          className="mx-4 mb-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #22C55E, #A855F7)" }}>
          <Zap className="w-3.5 h-3.5 fill-white" />
          Passer Premium → plus de crédits
        </Link>
      )}
    </div>
  );
}
