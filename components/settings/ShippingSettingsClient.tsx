"use client";

import { useState } from "react";
import { SettingsPageShell } from "./SettingsPageShell";
import { MapPin, Package, CheckCircle } from "lucide-react";

function InputField({ label, placeholder, value, onChange }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.35)", margin: "0 0 6px" }}>{label}</p>
      <input
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

function SettingCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: "0 0 14px" }}>{title}</p>
      {children}
    </div>
  );
}

const CARRIERS = [
  { id: "colissimo", label: "Colissimo", desc: "La Poste · 2-4 jours", logo: "📦" },
  { id: "mondialrelay", label: "Mondial Relay", desc: "Points relais · 3-5 jours", logo: "🏪" },
  { id: "chronopost", label: "Chronopost", desc: "Express · J+1", logo: "⚡" },
  { id: "ups", label: "UPS", desc: "International · 3-7 jours", logo: "🟤" },
];

interface Props { userId: string; fullName: string; location: string; }

export function ShippingSettingsClient({ fullName, location }: Props) {
  const [name, setName] = useState(fullName);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(location);
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("France");
  const [carriers, setCarriers] = useState<string[]>(["colissimo", "mondialrelay"]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCarrier = (id: string) => {
    setCarriers(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SettingsPageShell title="Envoi & livraison" description="Configure ton adresse d'expédition et tes transporteurs préférés.">

      <SettingCard title="Adresse d'expédition">
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)", marginBottom: 14 }}>
          <MapPin style={{ width: 14, height: 14, color: "#A78BFA", flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: "rgba(167,139,250,0.6)", margin: 0 }}>Cette adresse sera utilisée comme point de départ pour les envois.</p>
        </div>
        <InputField label="Nom complet" placeholder="Prénom Nom" value={name} onChange={setName} />
        <InputField label="Adresse" placeholder="10 rue de la Paix" value={address} onChange={setAddress} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <InputField label="Code postal" placeholder="75001" value={zip} onChange={setZip} />
          <InputField label="Ville" placeholder="Paris" value={city} onChange={setCity} />
        </div>
        <InputField label="Pays" placeholder="France" value={country} onChange={setCountry} />
      </SettingCard>

      <SettingCard title="Transporteurs acceptés">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CARRIERS.map(({ id, label, desc, logo }) => {
            const active = carriers.includes(id);
            return (
              <button key={id} onClick={() => toggleCarrier(id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                borderRadius: 10, cursor: "pointer", textAlign: "left",
                background: active ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.03)",
                border: active ? "1px solid rgba(139,92,246,0.25)" : "1px solid rgba(255,255,255,0.07)",
                transition: "all 0.12s",
              }}>
                <span style={{ fontSize: 22 }}>{logo}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: active ? "#C4B5FD" : "rgba(255,255,255,0.7)", margin: "0 0 2px" }}>{label}</p>
                  <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.28)", margin: 0 }}>{desc}</p>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  background: active ? "#8B5CF6" : "rgba(255,255,255,0.06)",
                  border: active ? "none" : "1px solid rgba(255,255,255,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {active && <CheckCircle style={{ width: 13, height: 13, color: "white" }} />}
                </div>
              </button>
            );
          })}
        </div>
      </SettingCard>

      <SettingCard title="Préférences d'emballage">
        {[
          { label: "Utiliser des emballages recyclés", key: "recycled" },
          { label: "Proposer l'emballage cadeau", key: "gift" },
          { label: "Inclure un mot personnalisé", key: "note" },
        ].map(({ label, key }) => {
          const [on, setOn] = useState(false);
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)" }}>{label}</span>
              <button onClick={() => setOn(!on)} style={{
                width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", flexShrink: 0,
                background: on ? "#8B5CF6" : "rgba(255,255,255,0.12)", position: "relative", transition: "background 0.2s",
              }}>
                <span style={{
                  position: "absolute", top: 3, left: on ? 23 : 3, width: 18, height: 18,
                  borderRadius: "50%", background: "white", transition: "left 0.2s",
                }} />
              </button>
            </div>
          );
        })}
      </SettingCard>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSave} disabled={loading} style={{
          padding: "10px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700,
          background: saved ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg,#8B5CF6,#7C3AED)",
          border: saved ? "1px solid rgba(16,185,129,0.3)" : "none",
          color: saved ? "#10B981" : "white", cursor: "pointer",
          boxShadow: saved ? "none" : "0 4px 16px rgba(139,92,246,0.3)",
          opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", gap: 7,
        }}>
          {saved ? <><CheckCircle style={{ width: 15, height: 15 }} /> Sauvegardé</> : loading ? "Enregistrement…" : "Sauvegarder"}
        </button>
      </div>
    </SettingsPageShell>
  );
}
