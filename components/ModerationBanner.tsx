"use client";

import { useState } from "react";
import { AlertTriangle, X, Clock, Ban } from "lucide-react";

interface Props {
  status: "warned" | "suspended";
  reason?: string;
  expiresAt?: string;
}

export function ModerationBanner({ status, reason, expiresAt }: Props) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed && status === "warned") return null;

  const daysLeft = expiresAt
    ? Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000)
    : null;

  if (status === "suspended") {
    return (
      <div className="fixed inset-0 z-50 bg-[#07070A] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
          <Ban className="w-7 h-7 text-amber-400" />
        </div>
        <h1 className="text-[22px] font-black text-white mb-2">Compte suspendu</h1>
        <p className="text-[14px] text-white/40 leading-relaxed max-w-[320px] mb-4">
          Ton compte est suspendu
          {daysLeft !== null && daysLeft > 0 ? ` encore ${daysLeft} jour${daysLeft > 1 ? "s" : ""}` : ""}.
        </p>
        {reason && (
          <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl px-5 py-4 max-w-[320px] mb-6">
            <p className="text-[12px] text-amber-300/60 font-medium mb-1">Raison :</p>
            <p className="text-[13px] text-amber-200">{reason}</p>
          </div>
        )}
        {expiresAt && (
          <div className="flex items-center gap-2 text-[12px] text-white/30 mb-6">
            <Clock className="w-3.5 h-3.5" />
            Levée le {new Date(expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        )}
        <a
          href="/wallet"
          className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[13px] font-semibold text-white/60 hover:text-white transition-colors"
        >
          Accéder à mon porte-monnaie
        </a>
        <p className="mt-6 text-[11px] text-white/15">
          Conteste :{" "}
          <a href="mailto:support@wearlyx.fr" className="underline">support@wearlyx.fr</a>
        </p>
      </div>
    );
  }

  // Warned — dismissible top banner
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-3 flex items-start gap-3">
      <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-yellow-300">Avertissement de Wearlyx</p>
        {reason && <p className="text-[12px] text-yellow-200/60 mt-0.5 leading-relaxed">{reason}</p>}
      </div>
      <button onClick={() => setDismissed(true)} className="text-yellow-400/50 hover:text-yellow-400 flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}