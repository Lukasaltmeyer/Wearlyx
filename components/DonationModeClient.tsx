"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Gift, Heart } from "lucide-react";

export function DonationModeClient() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);

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
        <h1 className="text-[17px] font-bold text-white">Mode don</h1>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {/* Status card */}
        <div className="p-6 rounded-2xl border border-white/8 bg-white/3 flex flex-col items-center justify-center text-center">
          <Gift className="w-8 h-8 text-white/30 mb-3" />
          <p className="text-[17px] font-bold text-white/60">{enabled ? "Mode don activé" : "Mode don désactivé"}</p>
          <p className="text-[13px] text-white/30 mt-1">
            {enabled ? "Tes articles sont proposés gratuitement." : "Active ce mode pour offrir tes articles à 0 €."}
          </p>
        </div>

        {/* Feature */}
        <div className="rounded-2xl border border-white/8 bg-white/3">
          <div className="flex items-start gap-3 px-4 py-3.5">
            <Heart className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-white">Propose à 0 €</p>
              <p className="text-[12px] text-white/35 mt-0.5">Seuls les frais de port peuvent s'appliquer</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setEnabled(!enabled)}
          className="w-full py-4 rounded-2xl font-bold text-[15px] text-white transition-all active:scale-[0.98] mt-1"
          style={{
            background: enabled
              ? "rgba(239,68,68,0.8)"
              : "linear-gradient(135deg, #EC4899, #F43F5E)",
            boxShadow: enabled ? "none" : "0 4px 20px rgba(236,72,153,0.4)",
          }}
        >
          {enabled ? "Désactiver le mode don" : "Activer le mode don 🎁"}
        </button>
      </div>
    </div>
  );
}
