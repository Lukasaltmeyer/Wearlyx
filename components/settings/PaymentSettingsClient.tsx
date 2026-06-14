"use client";

import { useState } from "react";
import { SettingsPageShell } from "./SettingsPageShell";
import { CreditCard, Building2, Shield, CheckCircle, Info } from "lucide-react";

function SettingCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: "18px 20px", marginBottom: 14,
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: "0 0 14px" }}>{title}</p>
      {children}
    </div>
  );
}

function InputField({ label, placeholder, value, onChange, type = "text" }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.35)", margin: "0 0 6px" }}>{label}</p>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", boxSizing: "border-box",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, padding: "10px 14px", fontSize: 14, color: "white",
          outline: "none", caretColor: "#8B5CF6",
        }}
      />
    </div>
  );
}

interface Props { userId: string; email: string; fullName: string; }

export function PaymentSettingsClient({ fullName }: Props) {
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [holder, setHolder] = useState(fullName);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SettingsPageShell title="Paiement" description="Configure ton compte bancaire pour recevoir tes gains de ventes.">

      {/* Info banner */}
      <div style={{
        display: "flex", gap: 10, padding: "12px 16px", borderRadius: 12, marginBottom: 20,
        background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.18)",
      }}>
        <Info style={{ width: 16, height: 16, color: "#60A5FA", flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12.5, color: "rgba(147,197,253,0.7)", margin: 0, lineHeight: 1.5 }}>
          Tes gains sont disponibles dès la confirmation de livraison. Les virements sont traités sous 3-5 jours ouvrés.
        </p>
      </div>

      <SettingCard title="Compte bancaire (SEPA)">
        <InputField label="Titulaire du compte" placeholder="Prénom Nom" value={holder} onChange={setHolder} />
        <InputField label="IBAN" placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" value={iban} onChange={v => setIban(v.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/(.{4})/g, "$1 ").trim())} />
        <InputField label="BIC / SWIFT" placeholder="BNPAFRPP" value={bic} onChange={v => setBic(v.toUpperCase())} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
          <Shield style={{ width: 12, height: 12, color: "#10B981" }} />
          <p style={{ fontSize: 11, color: "rgba(16,185,129,0.6)", margin: 0 }}>Données chiffrées · Jamais partagées</p>
        </div>
      </SettingCard>

      <SettingCard title="Carte bancaire (paiements)">
        <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 10 }}>
          <CreditCard style={{ width: 20, height: 20, color: "rgba(255,255,255,0.2)" }} />
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>Aucune carte enregistrée</p>
        </div>
        <button style={{
          padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.55)", cursor: "pointer",
        }}>
          + Ajouter une carte
        </button>
      </SettingCard>

      <SettingCard title="Résumé des gains">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "En attente", value: "0,00 €", color: "#F59E0B" },
            { label: "Disponible", value: "0,00 €", color: "#10B981" },
            { label: "Total encaissé", value: "0,00 €", color: "#8B5CF6" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: "center", padding: "12px 8px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: 18, fontWeight: 800, color, margin: "0 0 3px" }}>{value}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </SettingCard>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={handleSave} disabled={loading} style={{
          padding: "10px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700,
          background: saved ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg,#8B5CF6,#7C3AED)",
          border: saved ? "1px solid rgba(16,185,129,0.3)" : "none",
          color: saved ? "#10B981" : "white", cursor: "pointer",
          boxShadow: saved ? "none" : "0 4px 16px rgba(139,92,246,0.3)",
          opacity: loading ? 0.7 : 1,
          display: "flex", alignItems: "center", gap: 7,
        }}>
          {saved ? <><CheckCircle style={{ width: 15, height: 15 }} /> Sauvegardé</> : loading ? "Enregistrement…" : "Sauvegarder"}
        </button>
      </div>
    </SettingsPageShell>
  );
}
