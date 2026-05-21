"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sun, EyeOff, Eye } from "lucide-react";

export function VacationModeClient({ isDesktop }: { isDesktop?: boolean }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);

  const features = (
    <div className="rounded-[14px] border border-white/8 bg-white/[0.025] overflow-hidden divide-y divide-white/6">
      <div className="flex items-start gap-3 px-5 py-4">
        <EyeOff className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[14px] font-semibold text-white">Masquage automatique</p>
          <p className="text-[12px] text-white/35 mt-0.5">Toutes tes annonces actives sont cachées des acheteurs</p>
        </div>
      </div>
      <div className="flex items-start gap-3 px-5 py-4">
        <Eye className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[14px] font-semibold text-white">Retour en 1 clic</p>
          <p className="text-[12px] text-white/35 mt-0.5">Tes annonces redeviennent visibles instantanément</p>
        </div>
      </div>
    </div>
  );

  const cta = (
    <button onClick={() => setEnabled(!enabled)}
      className="py-3.5 px-6 rounded-[14px] font-bold text-[14px] text-white transition-all self-start"
      style={{
        background: enabled ? "rgba(239,68,68,0.8)" : "linear-gradient(135deg, #F59E0B, #F97316)",
        boxShadow: enabled ? "none" : "0 4px 20px rgba(249,115,22,0.3)",
      }}>
      {enabled ? "Désactiver le mode vacances" : "Activer le mode vacances 🌴"}
    </button>
  );

  if (isDesktop) {
    return (
      <div className="flex gap-8">
        <div className="flex-1 flex flex-col gap-4">
          <div className="p-6 rounded-[16px] border border-white/8 bg-white/[0.025] flex items-center gap-5">
            <div className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0"
              style={{ background: enabled ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.05)" }}>
              <Sun className="w-6 h-6" style={{ color: enabled ? "#F97316" : "rgba(255,255,255,0.3)" }} />
            </div>
            <div>
              <p className="text-[16px] font-bold text-white/80">{enabled ? "En vacances" : "Disponible"}</p>
              <p className="text-[13px] text-white/35 mt-0.5">
                {enabled ? "Tes annonces sont masquées des acheteurs." : "Tes annonces sont visibles par tous les acheteurs."}
              </p>
            </div>
          </div>
          {features}
          {cta}
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
        <h1 className="text-[17px] font-bold text-white">Mode vacances</h1>
      </div>
      <div className="px-4 flex flex-col gap-3">
        <div className="p-6 rounded-2xl border border-white/8 bg-white/3 flex flex-col items-center justify-center text-center">
          <Sun className="w-8 h-8 text-white/30 mb-3" />
          <p className="text-[17px] font-bold text-white/60">{enabled ? "En vacances" : "Disponible"}</p>
          <p className="text-[13px] text-white/30 mt-1">
            {enabled ? "Tes annonces sont masquées des acheteurs." : "Tes annonces sont visibles par tous les acheteurs."}
          </p>
        </div>
        {features}
        <button onClick={() => setEnabled(!enabled)}
          className="w-full py-4 rounded-2xl font-bold text-[15px] text-white transition-all active:scale-[0.98] mt-1"
          style={{
            background: enabled ? "rgba(239,68,68,0.8)" : "linear-gradient(135deg, #F59E0B, #F97316)",
            boxShadow: enabled ? "none" : "0 4px 20px rgba(249,115,22,0.35)",
          }}>
          {enabled ? "Désactiver le mode vacances" : "Activer le mode vacances 🌴"}
        </button>
      </div>
    </div>
  );
}
