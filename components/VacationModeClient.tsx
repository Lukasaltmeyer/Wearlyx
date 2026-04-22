"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sun, EyeOff, Eye } from "lucide-react";

export function VacationModeClient() {
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
        <h1 className="text-[17px] font-bold text-white">Mode vacances</h1>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {/* Status card */}
        <div className="p-6 rounded-2xl border border-white/8 bg-white/3 flex flex-col items-center justify-center text-center">
          <Sun className="w-8 h-8 text-white/30 mb-3" />
          <p className="text-[17px] font-bold text-white/60">{enabled ? "En vacances" : "Disponible"}</p>
          <p className="text-[13px] text-white/30 mt-1">
            {enabled ? "Tes annonces sont masquées des acheteurs." : "Tes annonces sont visibles par tous les acheteurs."}
          </p>
        </div>

        {/* Features */}
        <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden divide-y divide-white/6">
          <div className="flex items-start gap-3 px-4 py-3.5">
            <EyeOff className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-white">Masquage automatique</p>
              <p className="text-[12px] text-white/35 mt-0.5">Toutes tes annonces actives sont cachées</p>
            </div>
          </div>
          <div className="flex items-start gap-3 px-4 py-3.5">
            <Eye className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-white">Retour en 1 clic</p>
              <p className="text-[12px] text-white/35 mt-0.5">Tes annonces redeviennent visibles instantanément</p>
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
              : "linear-gradient(135deg, #F59E0B, #F97316)",
            boxShadow: enabled ? "none" : "0 4px 20px rgba(249,115,22,0.35)",
          }}
        >
          {enabled ? "Désactiver le mode vacances" : "Activer le mode vacances 🌴"}
        </button>
      </div>
    </div>
  );
}
