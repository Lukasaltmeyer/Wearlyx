"use client";

import { useState } from "react";
import { SettingsPageShell } from "./SettingsPageShell";
import { CheckCircle } from "lucide-react";

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷", desc: "Langue par défaut" },
  { code: "en", label: "English", flag: "🇬🇧", desc: "English (UK)" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", desc: "German" },
  { code: "es", label: "Español", flag: "🇪🇸", desc: "Spanish" },
  { code: "it", label: "Italiano", flag: "🇮🇹", desc: "Italian" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱", desc: "Dutch" },
];

const CURRENCIES = [
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "Livre sterling", symbol: "£" },
  { code: "USD", label: "Dollar américain", symbol: "$" },
  { code: "CHF", label: "Franc suisse", symbol: "CHF" },
];

const DATEFORMATS = [
  { id: "dmy", label: "JJ/MM/AAAA (31/12/2024)" },
  { id: "mdy", label: "MM/DD/YYYY (12/31/2024)" },
  { id: "ymd", label: "AAAA-MM-JJ (2024-12-31)" },
];

export function LanguageSettingsClient() {
  const [lang, setLang] = useState("fr");
  const [currency, setCurrency] = useState("EUR");
  const [dateFormat, setDateFormat] = useState("dmy");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SettingsPageShell title="Langue & région" description="Personnalise la langue, la devise et le format de date.">

      {/* Languages */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: "0 0 14px" }}>Langue de l'interface</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {LANGUAGES.map(({ code, label, flag, desc }) => {
            const active = lang === code;
            return (
              <button key={code} onClick={() => setLang(code)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                borderRadius: 10, cursor: "pointer", textAlign: "left",
                background: active ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.03)",
                border: active ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.07)",
                transition: "all 0.12s",
              }}>
                <span style={{ fontSize: 22 }}>{flag}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: active ? "#C4B5FD" : "rgba(255,255,255,0.7)", margin: "0 0 1px" }}>{label}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: 0 }}>{desc}</p>
                </div>
                {active && <CheckCircle style={{ width: 16, height: 16, color: "#8B5CF6", flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Currency */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: "0 0 14px" }}>Devise d'affichage</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {CURRENCIES.map(({ code, label, symbol }) => {
            const active = currency === code;
            return (
              <button key={code} onClick={() => setCurrency(code)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px",
                borderRadius: 10, cursor: "pointer",
                background: active ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)",
                border: active ? "1px solid rgba(139,92,246,0.25)" : "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.12s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: active ? "#A78BFA" : "rgba(255,255,255,0.35)", width: 28 }}>{symbol}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: active ? "#C4B5FD" : "rgba(255,255,255,0.6)" }}>{label} ({code})</span>
                </div>
                {active && <CheckCircle style={{ width: 15, height: 15, color: "#8B5CF6" }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date format */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: "0 0 14px" }}>Format de date</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {DATEFORMATS.map(({ id, label }) => {
            const active = dateFormat === id;
            return (
              <button key={id} onClick={() => setDateFormat(id)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px",
                borderRadius: 10, cursor: "pointer",
                background: active ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)",
                border: active ? "1px solid rgba(139,92,246,0.25)" : "1px solid rgba(255,255,255,0.06)",
              }}>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: active ? "#C4B5FD" : "rgba(255,255,255,0.6)" }}>{label}</span>
                {active && <CheckCircle style={{ width: 15, height: 15, color: "#8B5CF6" }} />}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSave} style={{
          padding: "10px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700,
          background: saved ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg,#8B5CF6,#7C3AED)",
          border: saved ? "1px solid rgba(16,185,129,0.3)" : "none",
          color: saved ? "#10B981" : "white", cursor: "pointer",
          boxShadow: saved ? "none" : "0 4px 16px rgba(139,92,246,0.3)",
          display: "flex", alignItems: "center", gap: 7,
        }}>
          {saved ? <><CheckCircle style={{ width: 15, height: 15 }} /> Sauvegardé</> : "Appliquer"}
        </button>
      </div>
    </SettingsPageShell>
  );
}
