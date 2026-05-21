"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sun, EyeOff, Eye, CheckCircle } from "lucide-react";

export function VacationModeClient({ isDesktop }: { isDesktop?: boolean }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);

  if (isDesktop) {
    return (
      <div className="flex gap-10">
        <div className="flex-1 flex flex-col gap-5">
          {/* Status hero */}
          <div className="relative overflow-hidden rounded-[20px] p-8"
            style={{
              background: enabled
                ? "linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(245,158,11,0.05) 100%)"
                : "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              border: enabled ? "1px solid rgba(249,115,22,0.2)" : "1px solid rgba(255,255,255,0.07)",
              transition: "all 0.4s ease",
            }}>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[14px] flex items-center justify-center flex-shrink-0"
                style={{ background: enabled ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.05)" }}>
                <Sun className="w-7 h-7" style={{ color: enabled ? "#F97316" : "rgba(255,255,255,0.25)", transition: "color 0.3s" }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[20px] font-black text-white/90">{enabled ? "Mode vacances activé" : "Mode vacances désactivé"}</p>
                  {enabled && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-orange-300" style={{ background: "rgba(249,115,22,0.15)" }}>ACTIF</span>}
                </div>
                <p className="text-[13px] text-white/35">
                  {enabled ? "Tes annonces sont masquées des acheteurs." : "Tes annonces sont visibles par tous les acheteurs."}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="rounded-[16px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { icon: EyeOff, title: "Masquage automatique", desc: "Toutes tes annonces actives sont cachées des acheteurs dès l'activation" },
              { icon: Eye,    title: "Retour en 1 clic",      desc: "Tes annonces redeviennent visibles instantanément à la désactivation" },
              { icon: CheckCircle, title: "Zéro pénalité",   desc: "Le mode vacances ne nuit pas à ton référencement ou ton compte" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="flex items-start gap-4 px-5 py-4"
                style={{ background: "rgba(255,255,255,0.02)", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  <Icon className="w-4 h-4 text-white/35" />
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold text-white/80">{title}</p>
                  <p className="text-[12px] text-white/30 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setEnabled(!enabled)}
            className="py-3.5 px-7 rounded-[14px] font-bold text-[14px] text-white transition-all self-start hover:scale-[1.02]"
            style={{
              background: enabled ? "rgba(239,68,68,0.75)" : "linear-gradient(135deg, #F59E0B, #F97316)",
              boxShadow: enabled ? "none" : "0 6px 24px rgba(249,115,22,0.3)",
            }}>
            {enabled ? "Désactiver le mode vacances" : "Activer le mode vacances 🌴"}
          </button>
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
            {enabled ? "Tes annonces sont masquées." : "Tes annonces sont visibles."}
          </p>
        </div>
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
