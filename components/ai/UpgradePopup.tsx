"use client";

import { X, Zap } from "lucide-react";
import { PLANS, type Plan } from "@/lib/usage";

interface Props {
  currentPlan: Plan;
  onClose: () => void;
}

export function UpgradePopup({ currentPlan, onClose }: Props) {
  const upgradePlans = PLANS.filter((p) => {
    const order: Plan[] = ["free", "starter", "pro", "premium"];
    return order.indexOf(p.id) > order.indexOf(currentPlan);
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[430px] animate-slideUp">
        <div
          className="rounded-t-3xl border-t border-white/10 px-5 pt-5 pb-10"
          style={{
            background: "rgba(12, 12, 20, 0.97)",
            backdropFilter: "blur(40px)",
          }}
        >
          {/* Handle */}
          <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mb-5" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#8B5CF6]/30">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-black text-white">Limite mensuelle atteinte</h2>
            <p className="text-[13px] text-white/45 mt-1.5 leading-relaxed">
              Tu as utilisé toutes tes améliorations ce mois.<br />
              Passe à un plan supérieur pour continuer.
            </p>
          </div>

          {/* Plans */}
          <div className="flex flex-col gap-2.5">
            {upgradePlans.map((plan) => (
              <button
                key={plan.id}
                className={`w-full flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
                  plan.id === "premium"
                    ? "border-amber-400/30 bg-amber-400/8 hover:bg-amber-400/12"
                    : "border-white/10 bg-white/5 hover:bg-white/8"
                }`}
              >
                <span className="text-2xl flex-shrink-0">{plan.emoji}</span>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-white">{plan.label}</p>
                  <p className="text-[12px] text-white/40 mt-0.5">
                    {plan.aiPhotosLimit === null
                      ? "Améliorations illimitées"
                      : `${plan.aiPhotosLimit} améliorations / mois`}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-[14px] font-black ${plan.id === "premium" ? "text-amber-400" : "text-white"}`}>
                    {plan.price}
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5">par mois</p>
                </div>
              </button>
            ))}
          </div>

          <p className="text-center text-[11px] text-white/20 mt-4">
            Résiliation possible à tout moment
          </p>
        </div>
      </div>
    </>
  );
}