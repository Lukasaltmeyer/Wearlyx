"use client";

import { useState } from "react";
import { Send, Users, Mail, Megaphone } from "lucide-react";

type EmailType = "marketing_newsletter" | "marketing_promo";
type Filter = "all" | "active" | "new_7d";

export function AdminEmailPanel() {
  const [type, setType] = useState<EmailType>("marketing_newsletter");
  const [filter, setFilter] = useState<Filter>("all");
  const [subject, setSubject] = useState("");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [promoLabel, setPromoLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ sent?: number; error?: string } | null>(null);

  const handleSend = async () => {
    if (!subject || !body) return;
    setLoading(true);
    setResult(null);

    const data: Record<string, string> = { subject, body };
    if (type === "marketing_newsletter") data.headline = headline;
    if (type === "marketing_promo") data.promo_label = promoLabel;

    const res = await fetch("/api/emails/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, filter, data }),
    });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  };

  const input = "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white text-[13px] placeholder:text-white/20 focus:outline-none focus:border-[#8B5CF6]/60";

  return (
    <div className="bg-[#0E0E16] rounded-2xl border border-white/8 p-5 space-y-4">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#8B5CF6" }}>
          <Megaphone className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h3 className="text-[15px] font-black text-white">Campagne Email</h3>
          <p className="text-[11px] text-white/35">Envoi aux utilisateurs consentants uniquement</p>
        </div>
      </div>

      {/* Type */}
      <div className="flex gap-2">
        {(["marketing_newsletter", "marketing_promo"] as EmailType[]).map((t) => (
          <button key={t} onClick={() => setType(t)}
            className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all ${
              type === t
                ? "text-white border border-[#8B5CF6]/60 bg-[#8B5CF6]/15"
                : "text-white/40 border border-white/8 bg-transparent"
            }`}>
            {t === "marketing_newsletter" ? "📰 Newsletter" : "🎁 Promo"}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div>
        <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider block mb-2">Destinataires</label>
        <div className="flex gap-2">
          {[
            { value: "all", label: "Tous", icon: "👥" },
            { value: "new_7d", label: "Nouveaux (7j)", icon: "✨" },
          ].map(({ value, label, icon }) => (
            <button key={value} onClick={() => setFilter(value as Filter)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                filter === value
                  ? "bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 text-white"
                  : "bg-white/5 border border-white/8 text-white/40"
              }`}>
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-2.5">
        <input placeholder="Objet de l'email *" value={subject} onChange={(e) => setSubject(e.target.value)} className={input} />
        {type === "marketing_newsletter" && (
          <input placeholder="Titre principal (optionnel)" value={headline} onChange={(e) => setHeadline(e.target.value)} className={input} />
        )}
        {type === "marketing_promo" && (
          <input placeholder="Label promo (ex: -20% cette semaine)" value={promoLabel} onChange={(e) => setPromoLabel(e.target.value)} className={input} />
        )}
        <textarea
          placeholder="Corps de l'email *"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className={input + " resize-none"}
        />
      </div>

      {/* Preview note */}
      <div className="rounded-xl bg-amber-500/8 border border-amber-500/20 p-3">
        <p className="text-[11px] text-amber-400/80">
          ⚠️ Envoi uniquement aux utilisateurs avec <strong>marketing_consent = true</strong> et <strong>email_notifications_enabled = true</strong>.
          Chaque email contient un lien de désinscription conforme RGPD.
        </p>
      </div>

      <button
        onClick={handleSend}
        disabled={loading || !subject || !body}
        className="w-full h-11 rounded-xl text-white text-[13px] font-black flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <><Send className="w-4 h-4" /> Envoyer la campagne</>
        )}
      </button>

      {result && (
        <div className={`rounded-xl p-3 text-[13px] font-semibold ${
          result.error ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
        }`}>
          {result.error ? `Erreur : ${result.error}` : `✓ ${result.sent} email${(result.sent ?? 0) > 1 ? "s" : ""} envoyé${(result.sent ?? 0) > 1 ? "s" : ""}`}
        </div>
      )}
    </div>
  );
}