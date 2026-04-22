"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { DisputeReason } from "@/types/database";

const REASONS: { id: DisputeReason; label: string; desc: string }[] = [
  { id: "not_received",     label: "Article non reçu",         desc: "Commande jamais arrivée" },
  { id: "not_as_described", label: "Non conforme",              desc: "Ne correspond pas à l'annonce" },
  { id: "wrong_item",       label: "Mauvais article",           desc: "Article différent reçu" },
  { id: "damaged",          label: "Article endommagé",         desc: "Reçu abîmé ou cassé" },
  { id: "seller_inactive",  label: "Vendeur inactif",           desc: "Pas de réponse du vendeur" },
  { id: "delivery_issue",   label: "Problème de livraison",     desc: "Perdu ou retourné" },
  { id: "other",            label: "Autre motif",               desc: "Autre problème" },
];

interface Props {
  orderId: string;
  currentUserId: string;
  onClose?: () => void;
}

export function DisputeForm({ orderId, currentUserId, onClose }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [reason, setReason] = useState<DisputeReason | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = reason && description.trim().length >= 20;

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");

    const { error: err } = await supabase.from("disputes").insert({
      order_id: orderId,
      opened_by: currentUserId,
      reason,
      description: description.trim(),
    });

    if (err) { setError("Erreur lors de l'ouverture du litige."); setLoading(false); return; }

    // Update order status to dispute
    await supabase.from("orders").update({ status: "dispute" }).eq("id", orderId);

    setSuccess(true);
    setLoading(false);
    setTimeout(() => { onClose?.(); router.refresh(); }, 2000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center py-10 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-orange-400" />
        </div>
        <div>
          <p className="text-white font-black text-[18px]">Litige ouvert</p>
          <p className="text-white/40 text-[13px] mt-1">Notre équipe va examiner ta demande sous 48h</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Reason */}
      <div>
        <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-3">Motif du litige</p>
        <div className="grid grid-cols-1 gap-2">
          {REASONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setReason(r.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all",
                reason === r.id ? "border-orange-500/50 bg-orange-500/10" : "border-white/8 bg-white/3 hover:border-white/20"
              )}
            >
              <div className="flex-1">
                <p className={cn("text-[13px] font-bold", reason === r.id ? "text-orange-300" : "text-white/70")}>{r.label}</p>
                <p className="text-[11px] text-white/30">{r.desc}</p>
              </div>
              {reason === r.id && <span className="text-orange-400 text-[12px] font-bold flex-shrink-0">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2">Description <span className="normal-case">(min. 20 car.)</span></p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décris précisément ton problème..."
          rows={4}
          className="w-full px-4 py-3 rounded-2xl bg-white/6 border border-white/10 text-[14px] text-white placeholder-white/20 outline-none resize-none focus:border-orange-500/40"
        />
        <p className="text-[11px] text-white/25 mt-1">{description.length} caractères</p>
      </div>

      {error && <p className="text-[12px] text-red-400">{error}</p>}

      <button
        onClick={submit}
        disabled={!canSubmit || loading}
        className={cn(
          "w-full py-4 rounded-2xl text-[15px] font-bold text-white transition-all",
          canSubmit && !loading
            ? "bg-orange-500 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
            : "bg-white/10 opacity-50 cursor-not-allowed"
        )}
      >
        {loading ? "Envoi..." : "Ouvrir le litige"}
      </button>
    </div>
  );
}
