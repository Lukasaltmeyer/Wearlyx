"use client";

import Link from "next/link";
import { Zap, PenLine, Shield, Check, ArrowRight, Sparkles, Clock, Star, TrendingUp } from "lucide-react";

const AI_FEATURES = [
  "Photos améliorées automatiquement",
  "Titre & description générés par l'IA",
  "Prix conseillé selon le marché",
  "Mise en ligne en 30 secondes",
  "Suppression de fond intelligente",
  "Catégorie détectée automatiquement",
];

const MANUAL_FEATURES = [
  "Contrôle total sur chaque champ",
  "Photos originales non modifiées",
  "Description personnalisée",
  "Prix libre",
];

const STEPS = [
  { n: "01", label: "Photo", sub: "Prends ou importe une photo", icon: "📸" },
  { n: "02", label: "IA analyse", sub: "L'IA détecte marque, état, taille", icon: "🤖" },
  { n: "03", label: "Aperçu", sub: "Titre, prix, description générés", icon: "✨" },
  { n: "04", label: "Publier", sub: "Annonce en ligne en 1 clic", icon: "🚀" },
];

export function DesktopSellPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col relative" style={{ background: "#07070A" }}>
      <div className="fixed pointer-events-none" style={{ top: -100, left: "20%", width: 750, height: 750, background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)", filter: "blur(100px)", zIndex: 0 }} />
      <div className="fixed pointer-events-none" style={{ bottom: -80, right: "10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(91,33,182,0.05) 0%, transparent 70%)", filter: "blur(120px)", zIndex: 0 }} />

      {/* Header */}
      <div className="px-10 pt-10 pb-8 flex-shrink-0 relative z-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,.28)" }}>
          Vendre · Wearlyx
        </p>
        <h1 className="text-[36px] font-black text-white tracking-tight leading-tight mb-2">
          Mettre un article en vente
        </h1>
        <p className="text-[15px]" style={{ color: "rgba(255,255,255,.40)" }}>
          Choisis comment créer ton annonce
        </p>
      </div>

      {/* Main 2-col area */}
      <div className="flex flex-1 gap-6 px-10 pb-10 relative z-10">

        {/* LEFT — IA card (large) */}
        <Link href="/sell/ai" className="flex-1 group block">
          <div className="h-full rounded-3xl overflow-hidden relative transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_32px_64px_rgba(124,58,237,0.25)]"
            style={{
              background: "linear-gradient(145deg, #3d1a8a 0%, #2a0f6b 40%, #1a0840 100%)",
              border: "1px solid rgba(139,92,246,0.35)",
            }}>

            {/* Bg orb */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.20) 0%, transparent 65%)", filter: "blur(40px)" }} />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(91,33,182,0.15) 0%, transparent 65%)", filter: "blur(40px)" }} />

            <div className="relative z-10 p-8 h-full flex flex-col">
              {/* Badge */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.20)" }}>
                  <Zap className="w-7 h-7 text-white fill-white" />
                </div>
                <span className="px-3.5 py-1.5 rounded-full text-[11px] font-black text-white"
                  style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
                  ⚡ RECOMMANDÉ
                </span>
              </div>

              <h2 className="text-[28px] font-black text-white tracking-tight mb-2">Vendre avec l'IA</h2>
              <p className="text-[15px] mb-8" style={{ color: "rgba(255,255,255,.60)" }}>
                Photo → annonce complète en 30 secondes
              </p>

              {/* Features list */}
              <div className="flex flex-col gap-3 mb-8 flex-1">
                {AI_FEATURES.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.18)" }}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,.80)" }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* Steps */}
              <div className="grid grid-cols-4 gap-3 mb-8 p-4 rounded-2xl"
                style={{ background: "rgba(0,0,0,0.20)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {STEPS.map((s, i) => (
                  <div key={s.n} className="flex flex-col items-center text-center gap-1">
                    <span className="text-xl mb-1">{s.icon}</span>
                    <span className="text-[10px] font-black text-white/40">{s.n}</span>
                    <span className="text-[11.5px] font-bold text-white">{s.label}</span>
                    <span className="text-[10px] text-white/40 leading-tight">{s.sub}</span>
                    {i < STEPS.length - 1 && <></>}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between px-6 py-4 rounded-2xl transition-all group-hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.20)" }}>
                <span className="text-[15px] font-black text-white">Commencer avec l'IA</span>
                <ArrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>

        {/* RIGHT — Manual + sidebar */}
        <div className="flex flex-col gap-5" style={{ width: 340 }}>

          {/* Manual card */}
          <Link href="/sell/manual" className="group block">
            <div className="rounded-3xl p-7 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.50)]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
                  <PenLine className="w-5 h-5" style={{ color: "rgba(255,255,255,.55)" }} />
                </div>
                <div>
                  <p className="text-[18px] font-black text-white">Créer manuellement</p>
                  <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,.38)" }}>Remplis toi-même tous les champs</p>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 mb-5">
                {MANUAL_FEATURES.map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,.25)" }} />
                    <span className="text-[12.5px]" style={{ color: "rgba(255,255,255,.50)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl transition-all group-hover:border-white/20"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,.55)" }}>Créer manuellement</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" style={{ color: "rgba(255,255,255,.30)" }} />
              </div>
            </div>
          </Link>

          {/* Stats card */}
          <div className="rounded-3xl p-6" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.14)" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#A78BFA]" />
              <p className="text-[13px] font-bold text-white">Ventes sur Wearlyx</p>
            </div>
            {[
              { icon: <Clock className="w-3.5 h-3.5" />, label: "Temps moyen de vente", value: "3.2 jours" },
              { icon: <Star className="w-3.5 h-3.5" />, label: "Satisfaction acheteur", value: "4.8 / 5" },
              { icon: <Sparkles className="w-3.5 h-3.5" />, label: "Ventes / jour", value: "1 200+" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,.35)" }}>
                  {icon}
                  <span className="text-[12px]">{label}</span>
                </div>
                <span className="text-[13px] font-black" style={{ color: "rgba(255,255,255,.70)" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Security badge */}
          <div className="flex items-start gap-3 px-5 py-4 rounded-2xl"
            style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.14)" }}>
            <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-bold text-emerald-300">Protection acheteur & vendeur</p>
              <p className="text-[11.5px] mt-0.5" style={{ color: "rgba(52,211,153,.50)" }}>
                Paiement sécurisé · Remboursement garanti · Litiges gérés par Wearlyx
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
