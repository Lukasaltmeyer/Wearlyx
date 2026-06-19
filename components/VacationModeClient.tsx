"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sun, EyeOff, Eye, CheckCircle } from "lucide-react";

export function VacationModeClient({ isDesktop }: { isDesktop?: boolean }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);

  if (isDesktop) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>
        {/* LEFT — main controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Status hero */}
          <div style={{
            padding: "32px 36px", borderRadius: 20,
            background: enabled
              ? "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(245,158,11,0.04) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            border: enabled ? "1px solid rgba(249,115,22,0.2)" : "1px solid rgba(255,255,255,0.07)",
            transition: "all 0.4s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: enabled ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.06)" }}>
                <Sun style={{ width: 28, height: 28, color: enabled ? "#F97316" : "rgba(255,255,255,0.25)", transition: "color 0.3s" }} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
                    {enabled ? "Mode vacances activé" : "Mode vacances désactivé"}
                  </p>
                  {enabled && <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 800, color: "#FED7AA", background: "rgba(249,115,22,0.18)", letterSpacing: "0.06em" }}>ACTIF</span>}
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", margin: 0 }}>
                  {enabled ? "Tes annonces sont masquées des acheteurs." : "Tes annonces sont visibles par tous les acheteurs."}
                </p>
              </div>
            </div>
            <button onClick={() => setEnabled(!enabled)} style={{
              padding: "14px 32px", borderRadius: 14, fontWeight: 700, fontSize: 15, color: "white",
              border: "none", cursor: "pointer", transition: "all 0.2s",
              background: enabled ? "rgba(239,68,68,0.75)" : "linear-gradient(135deg, #F59E0B, #F97316)",
              boxShadow: enabled ? "none" : "0 8px 28px rgba(249,115,22,0.32)",
            }}>
              {enabled ? "Désactiver le mode vacances" : "Activer le mode vacances 🌴"}
            </button>
          </div>

          {/* Features grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {[
              { icon: EyeOff, title: "Masquage auto", desc: "Toutes tes annonces actives sont cachées instantanément", color: "#F97316" },
              { icon: Eye, title: "Retour en 1 clic", desc: "Tes annonces redeviennent visibles dès la désactivation", color: "#3B82F6" },
              { icon: CheckCircle, title: "Zéro pénalité", desc: "Aucun impact sur ton référencement ou ton compte", color: "#10B981" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} style={{ padding: "22px 20px", borderRadius: 16, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, background: `${color}18` }}>
                  <Icon style={{ width: 18, height: 18, color }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: "0 0 6px" }}>{title}</p>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.32)", margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — info sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "24px", borderRadius: 18, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.22)", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>Comment ça marche ?</p>
            {[
              { step: "1", text: "Active le mode vacances d'un simple clic" },
              { step: "2", text: "Toutes tes annonces actives sont masquées" },
              { step: "3", text: "Désactive quand tu reviens, elles réapparaissent" },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 24, height: 24, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "rgba(249,115,22,0.12)", fontSize: 11, fontWeight: 800, color: "#F97316" }}>{step}</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "20px", borderRadius: 16, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#34D399", margin: "0 0 6px" }}>Aucun impact sur tes ventes</p>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: 1.5 }}>Le mode vacances ne pénalise pas ton compte ni ton référencement sur Wearlyx.</p>
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
