"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Megaphone, ShieldCheck, Package, MessageCircle, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  initialEmailEnabled: boolean;
  initialMarketingConsent: boolean;
  isDesktop?: boolean;
}

function Toggle({ enabled, onToggle, loading }: { enabled: boolean; onToggle: () => void; loading?: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      className={cn(
        "relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0",
        enabled ? "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]" : "bg-white/10"
      )}
    >
      <span className={cn(
        "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
        enabled ? "left-7" : "left-1"
      )} />
    </button>
  );
}

export function NotificationsSettingsClient({ initialEmailEnabled, initialMarketingConsent, isDesktop }: Props) {
  const router = useRouter();
  const [emailEnabled, setEmailEnabled] = useState(initialEmailEnabled);
  const [marketingConsent, setMarketingConsent] = useState(initialMarketingConsent);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const patch = async (update: Record<string, boolean>) => {
    setLoading(true);
    await fetch("/api/emails/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleEmail = () => {
    const next = !emailEnabled;
    setEmailEnabled(next);
    patch({ email_notifications_enabled: next });
  };

  const toggleMarketing = () => {
    const next = !marketingConsent;
    setMarketingConsent(next);
    patch({ marketing_consent: next });
  };

  if (isDesktop) {
    const transactional = [
      { icon: Package, label: "Confirmation de commande", color: "#10B981" },
      { icon: Tag, label: "Offres reçues / acceptées", color: "#F59E0B" },
      { icon: MessageCircle, label: "Messages importants", color: "#3B82F6" },
      { icon: ShieldCheck, label: "Sécurité du compte", color: "#EF4444" },
    ];
    return (
      <div className="flex gap-10">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-[20px] px-7 py-6"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(167,139,250,0.04) 100%)", border: "1px solid rgba(139,92,246,0.14)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(167,139,250,0.5)" }}>Notifications</p>
            <p className="text-[20px] font-black text-white tracking-tight mb-1">Emails & préférences</p>
            <p className="text-[12.5px] text-white/35 leading-relaxed">Contrôle les emails que Wearlyx peut t'envoyer.</p>
            {saved && <span className="absolute top-5 right-6 text-[12px] text-emerald-400 font-semibold">Sauvegardé ✓</span>}
          </div>

          {/* Master switch */}
          <div className="rounded-[16px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="px-5 pt-4 pb-4" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>Activation globale</p>
              <div className="flex items-center gap-3 p-4 rounded-[12px]" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#8B5CF6" }}>
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-white">Emails activés</p>
                  <p className="text-[12px] text-white/40 mt-0.5">Recevoir des emails de Wearlyx</p>
                </div>
                <Toggle enabled={emailEnabled} onToggle={toggleEmail} loading={loading} />
              </div>
            </div>
          </div>

          {/* Transactional */}
          <div className="rounded-[16px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="px-5 pt-4 pb-4" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: "rgba(255,255,255,0.22)" }}>Emails transactionnels</p>
              <p className="text-[11px] text-white/25 mb-3">Toujours envoyés — liés à ton activité sur la plateforme</p>
              <div className="flex flex-col gap-0 rounded-[12px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                {transactional.map(({ icon: Icon, label, color }, i, arr) => (
                  <div key={label} className={cn("flex items-center gap-3 px-4 py-3.5", i < arr.length - 1 && "border-b")}
                    style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + "22" }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="flex-1 text-[13px] text-white/70">{label}</span>
                    <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.2)" }}>Toujours actif</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-[260px] flex-shrink-0 flex flex-col gap-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.22)" }}>Marketing</p>

          {/* Marketing toggle */}
          <div className="rounded-[14px] p-4 flex flex-col gap-3" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)" }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#8B5CF6" }}>
                <Megaphone className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-white">Promotions & nouveautés</p>
                <p className="text-[11px] text-white/40 mt-0.5 leading-relaxed">
                  {marketingConsent ? "Actif · désactiver via le lien en bas des emails." : "Offres spéciales, nouvelles fonctionnalités."}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "rgba(139,92,246,0.15)" }}>
              <span className="text-[12px] text-white/50">{marketingConsent ? "Activé" : "Désactivé"}</span>
              <Toggle enabled={marketingConsent} onToggle={toggleMarketing} loading={loading} />
            </div>
          </div>

          {/* RGPD */}
          <div className="rounded-[14px] p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>RGPD</p>
            <p className="text-[11px] text-white/25 leading-relaxed">
              Conformément au RGPD, tes données sont traitées uniquement pour les communications auxquelles tu as consenti.
              Tu peux modifier tes préférences ou supprimer ton compte à tout moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-5">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-bold text-white">Notifications email</h1>
        {saved && <span className="ml-auto text-[12px] text-emerald-400 font-semibold">Sauvegardé ✓</span>}
      </div>

      <div className="px-4 space-y-4">
        {/* Master switch */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#8B5CF6" }}>
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-white">Emails activés</p>
              <p className="text-[12px] text-white/40 mt-0.5">Recevoir des emails de Wearlyx</p>
            </div>
            <Toggle enabled={emailEnabled} onToggle={toggleEmail} loading={loading} />
          </div>
        </div>

        {/* Transactional */}
        <div>
          <p className="text-[11px] font-bold text-white/30 uppercase tracking-wider px-1 mb-2">Emails transactionnels</p>
          <p className="text-[11px] text-white/25 px-1 mb-3">Toujours envoyés — liés à ton activité sur la plateforme</p>
          <div className="rounded-2xl border border-white/6 bg-white/[0.02] overflow-hidden">
            {[
              { icon: Package, label: "Confirmation de commande", color: "#10B981" },
              { icon: Tag, label: "Offres reçues / acceptées", color: "#F59E0B" },
              { icon: MessageCircle, label: "Messages importants", color: "#3B82F6" },
              { icon: ShieldCheck, label: "Sécurité du compte", color: "#EF4444" },
            ].map(({ icon: Icon, label, color }, i, arr) => (
              <div key={label} className={cn(
                "flex items-center gap-3 px-4 py-3.5",
                i < arr.length - 1 && "border-b border-white/4"
              )}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + "22" }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="flex-1 text-[13px] text-white/70">{label}</span>
                <span className="text-[11px] text-white/20 font-semibold">Toujours actif</span>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing */}
        <div>
          <p className="text-[11px] font-bold text-white/30 uppercase tracking-wider px-1 mb-2">Emails marketing</p>
          <p className="text-[11px] text-white/25 px-1 mb-3">Optionnels — tu peux changer d'avis à tout moment</p>
          <div className="rounded-2xl border border-white/6 bg-white/[0.025] p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#8B5CF6" }}>
                <Megaphone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-white">Promotions & nouveautés</p>
                <p className="text-[12px] text-white/40 mt-0.5">
                  Offres spéciales, nouvelles fonctionnalités, sélections de la semaine.
                  {marketingConsent
                    ? " Tu peux te désinscrire via le lien en bas de chaque email."
                    : " En activant, tu acceptes de recevoir nos communications marketing."}
                </p>
              </div>
              <Toggle enabled={marketingConsent} onToggle={toggleMarketing} loading={loading} />
            </div>
          </div>
        </div>

        {/* RGPD info */}
        <div className="rounded-xl border border-white/4 bg-white/[0.01] p-3.5">
          <p className="text-[11px] text-white/25 leading-relaxed">
            Conformément au RGPD, tes données sont traitées uniquement pour t'envoyer les communications auxquelles tu as consenti.
            Tu peux modifier tes préférences ou supprimer ton compte à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}