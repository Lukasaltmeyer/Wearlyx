"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Gift, Heart, Zap, Users } from "lucide-react";

export function DonationModeClient({ isDesktop }: { isDesktop?: boolean }) {
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
            ? "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(244,63,94,0.05) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
          border: enabled ? "1px solid rgba(139,92,246,0.2)" : "1px solid rgba(255,255,255,0.06)",
          transition: "all 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 68, height: 68, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: enabled ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.05)" }}>
              <Gift style={{ width: 32, height: 32, color: enabled ? "#A78BFA" : "rgba(255,255,255,0.2)", transition: "color 0.3s" }} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
                  {enabled ? "Mode don activé" : "Mode don désactivé"}
                </p>
                {enabled && <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 800, color: "#DDD6FE", background: "rgba(139,92,246,0.2)", letterSpacing: "0.08em" }}>ACTIF</span>}
              </div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", margin: 0 }}>
                {enabled ? "Tes articles sont proposés gratuitement à la communauté." : "Active ce mode pour offrir tes articles à 0 €."}
              </p>
            </div>
          </div>
          <button onClick={() => setEnabled(!enabled)} style={{
            padding: "16px 40px", borderRadius: 14, fontWeight: 700, fontSize: 15, color: "white",
            border: "none", cursor: "pointer", flexShrink: 0,
            background: enabled ? "rgba(239,68,68,0.75)" : "linear-gradient(135deg, #8B5CF6, #F43F5E)",
            boxShadow: enabled ? "none" : "0 8px 28px rgba(139,92,246,0.32)",
          }}>
            {enabled ? "Désactiver le mode don" : "Activer le mode don 🎁"}
          </button>
        </div>

        {/* Features — full width grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { icon: Heart, title: "Propose à 0 €", desc: "Seuls les frais de port s'appliquent selon le transporteur choisi", color: "#F43F5E" },
            { icon: Users, title: "Impact communauté", desc: "Tes articles profitent directement à d'autres membres Wearlyx", color: "#8B5CF6" },
            { icon: Zap, title: "+50 crédits par don", desc: "Chaque article donné te rapporte des crédits utilisables sur la plateforme", color: "#F59E0B" },
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
        <h1 className="text-[17px] font-bold text-white">Mode don</h1>
      </div>
      <div className="px-4 flex flex-col gap-3">
        <div className="p-6 rounded-2xl border border-white/8 bg-white/3 flex flex-col items-center justify-center text-center">
          <Gift className="w-8 h-8 text-white/30 mb-3" />
          <p className="text-[17px] font-bold text-white/60">{enabled ? "Mode don activé" : "Mode don désactivé"}</p>
          <p className="text-[13px] text-white/30 mt-1">
            {enabled ? "Tes articles sont proposés gratuitement." : "Active ce mode pour offrir tes articles à 0 €."}
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/3">
          <div className="flex items-start gap-3 px-4 py-3.5">
            <Heart className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-white">Propose à 0 €</p>
              <p className="text-[12px] text-white/35 mt-0.5">Seuls les frais de port peuvent s'appliquer</p>
            </div>
          </div>
        </div>
        <button onClick={() => setEnabled(!enabled)}
          className="w-full py-4 rounded-2xl font-bold text-[15px] text-white transition-all active:scale-[0.98] mt-1"
          style={{
            background: enabled ? "rgba(239,68,68,0.8)" : "linear-gradient(135deg, #8B5CF6, #F43F5E)",
            boxShadow: enabled ? "none" : "0 4px 20px rgba(236,72,153,0.4)",
          }}>
          {enabled ? "Désactiver le mode don" : "Activer le mode don 🎁"}
        </button>
      </div>
    </div>
  );
}
