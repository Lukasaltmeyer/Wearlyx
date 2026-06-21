"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sun, EyeOff, Eye, CheckCircle } from "lucide-react";

export function VacationModeClient({ isDesktop }: { isDesktop?: boolean }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);

  if (isDesktop) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Hero row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "36px 44px", borderRadius: 24,
          background: enabled
            ? "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(245,158,11,0.04) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
          border: enabled ? "1px solid rgba(249,115,22,0.18)" : "1px solid rgba(255,255,255,0.06)",
          transition: "all 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 68, height: 68, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: enabled ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.05)" }}>
              <Sun style={{ width: 32, height: 32, color: enabled ? "#F97316" : "rgba(255,255,255,0.2)", transition: "color 0.3s" }} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
                  {enabled ? "Mode vacances activé" : "Mode vacances désactivé"}
                </p>
                {enabled && <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 800, color: "#FED7AA", background: "rgba(249,115,22,0.18)", letterSpacing: "0.08em" }}>ACTIF</span>}
              </div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", margin: 0 }}>
                {enabled ? "Tes annonces sont masquées des acheteurs." : "Tes annonces sont visibles par tous les acheteurs."}
              </p>
            </div>
          </div>
          <button onClick={() => setEnabled(!enabled)} style={{
            padding: "16px 40px", borderRadius: 14, fontWeight: 700, fontSize: 15, color: "white",
            border: "none", cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
            background: enabled ? "rgba(239,68,68,0.75)" : "linear-gradient(135deg, #F59E0B, #F97316)",
            boxShadow: enabled ? "none" : "0 8px 28px rgba(249,115,22,0.32)",
          }}>
            {enabled ? "Désactiver le mode vacances" : "Activer le mode vacances 🌴"}
          </button>
        </div>

        {/* Features — full width grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { icon: EyeOff, title: "Masquage automatique", desc: "Toutes tes annonces actives sont cachées des acheteurs dès l'activation", color: "#F97316" },
            { icon: Eye, title: "Retour en 1 clic", desc: "Tes annonces redeviennent visibles instantanément à la désactivation", color: "#3B82F6" },
            { icon: CheckCircle, title: "Zéro pénalité", desc: "Aucun impact sur ton référencement ou ton compte Wearlyx", color: "#10B981" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} style={{ padding: "28px 24px", borderRadius: 18, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, background: `${color}15` }}>
                <Icon style={{ width: 20, height: 20, color }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.88)", margin: "0 0 8px" }}>{title}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
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
