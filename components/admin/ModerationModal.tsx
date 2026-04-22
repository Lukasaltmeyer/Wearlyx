"use client";

import { useState } from "react";
import { X, AlertTriangle, Clock, Ban, ShieldOff, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  user: { id: string; full_name?: string; username?: string; moderation?: { status: string; warn_count?: number; expires_at?: string; last_reason?: string } | null };
  onClose: () => void;
  onAction: () => void;
}

type Action = "warn" | "suspend" | "ban" | "lift";

const SUSPEND_OPTIONS = [
  { days: 1, label: "1 jour" },
  { days: 3, label: "3 jours" },
  { days: 7, label: "7 jours" },
  { days: 14, label: "14 jours" },
  { days: 30, label: "30 jours" },
];

export function ModerationModal({ user, onClose, onAction }: Props) {
  const [action, setAction] = useState<Action | null>(null);
  const [reason, setReason] = useState("");
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState("");

  const modStatus = user.moderation?.status ?? "none";
  const isActive = modStatus === "suspended" || modStatus === "banned";

  const handleSubmit = async () => {
    if (!action) return;
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch("/api/admin/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: user.id,
          action,
          reason: reason || undefined,
          durationDays: action === "suspend" ? days : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setApiError(json.error ?? `Erreur ${res.status}`);
        setLoading(false);
        return;
      }
      setDone(true);
      setTimeout(() => { onAction(); onClose(); }, 1200);
    } catch (e: any) {
      setApiError(e.message ?? "Erreur réseau");
      setLoading(false);
    }
  };

  const displayName = user.full_name || `@${user.username}` || "Utilisateur";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[480px] bg-[#0F0F14] border border-[#1E1E24] rounded-2xl p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-[16px] font-bold text-white">Modération</h2>
            <p className="text-[13px] text-zinc-500 mt-0.5">{displayName}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {/* Current status */}
        {modStatus !== "none" && (
          <div className={cn(
            "flex items-center gap-2 px-3 py-2.5 rounded-xl border mb-4 text-[12px] font-medium",
            modStatus === "banned" ? "bg-red-500/8 border-red-500/20 text-red-400" :
            modStatus === "suspended" ? "bg-amber-500/8 border-amber-500/20 text-amber-400" :
            "bg-zinc-500/8 border-zinc-500/20 text-zinc-400"
          )}>
            {modStatus === "banned" ? <Ban className="w-3.5 h-3.5" /> :
             modStatus === "suspended" ? <Clock className="w-3.5 h-3.5" /> :
             <AlertTriangle className="w-3.5 h-3.5" />}
            <span>
              {modStatus === "banned" ? "Banni définitivement" :
               modStatus === "suspended" ? `Suspendu jusqu'au ${user.moderation?.expires_at ? new Date(user.moderation.expires_at).toLocaleDateString("fr-FR") : "?"}` :
               `Averti ${user.moderation?.warn_count ?? 1} fois`}
            </span>
            {user.moderation?.last_reason && (
              <span className="ml-auto text-[11px] opacity-70 truncate max-w-[140px]">{user.moderation.last_reason}</span>
            )}
          </div>
        )}

        {done ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-[14px] font-semibold text-white">Action appliquée</p>
          </div>
        ) : (
          <>
            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {isActive && (
                <button
                  onClick={() => setAction("lift")}
                  className={cn(
                    "col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-[13px] font-semibold transition-all",
                    action === "lift"
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                      : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30"
                  )}
                >
                  <ShieldOff className="w-4 h-4" />
                  Lever la sanction
                </button>
              )}
              <button
                onClick={() => setAction("warn")}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-[13px] font-semibold transition-all",
                  action === "warn"
                    ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-300"
                    : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-yellow-400 hover:border-yellow-500/30"
                )}
              >
                <AlertTriangle className="w-4 h-4" />
                Avertir
              </button>
              <button
                onClick={() => setAction("suspend")}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-[13px] font-semibold transition-all",
                  action === "suspend"
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                    : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-amber-400 hover:border-amber-500/30"
                )}
              >
                <Clock className="w-4 h-4" />
                Suspendre
              </button>
              <button
                onClick={() => setAction("ban")}
                className={cn(
                  "col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-[13px] font-semibold transition-all",
                  action === "ban"
                    ? "bg-red-500/15 border-red-500/40 text-red-300"
                    : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-red-400 hover:border-red-500/30"
                )}
              >
                <Ban className="w-4 h-4" />
                Bannir définitivement
              </button>
            </div>

            {/* Suspend duration */}
            {action === "suspend" && (
              <div className="flex gap-1.5 flex-wrap mb-4">
                {SUSPEND_OPTIONS.map(opt => (
                  <button
                    key={opt.days}
                    onClick={() => setDays(opt.days)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all",
                      days === opt.days
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                        : "bg-white/[0.03] border-white/[0.06] text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Reason */}
            {action && action !== "lift" && (
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Raison (optionnel — sera envoyée à l'utilisateur)"
                rows={2}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white placeholder-zinc-600 outline-none focus:border-white/20 resize-none mb-4"
              />
            )}

            {/* Ban warning */}
            {apiError && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-2">
                <p className="text-[12px] text-red-400">{apiError}</p>
              </div>
            )}

            {action === "ban" && (
              <div className="flex items-start gap-2 p-3 bg-red-500/8 border border-red-500/15 rounded-xl mb-4">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-red-300/80 leading-relaxed">
                  Le bannissement est définitif. L'utilisateur sera notifié et pourra récupérer son argent. Tout nouveau compte avec le même email sera bloqué.
                </p>
              </div>
            )}

            {action && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={cn(
                  "w-full py-3 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2",
                  action === "ban" ? "bg-red-600 hover:bg-red-500 text-white" :
                  action === "suspend" ? "bg-amber-600 hover:bg-amber-500 text-white" :
                  action === "lift" ? "bg-emerald-600 hover:bg-emerald-500 text-white" :
                  "bg-yellow-600 hover:bg-yellow-500 text-white"
                )}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  action === "warn" ? "Envoyer l'avertissement" :
                  action === "suspend" ? `Suspendre ${days} jours` :
                  action === "ban" ? "Bannir définitivement" :
                  "Lever la sanction"
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
