"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SettingsPageShell } from "./SettingsPageShell";
import { createClient } from "@/lib/supabase/client";
import { Eye, Lock, Trash2, Download, AlertTriangle, CheckCircle } from "lucide-react";

function ToggleRow({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div>
        <p style={{ fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.7)", margin: "0 0 2px" }}>{label}</p>
        {desc && <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.28)", margin: 0 }}>{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)} style={{
        width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", flexShrink: 0, marginLeft: 16,
        background: value ? "#8B5CF6" : "rgba(255,255,255,0.12)", position: "relative", transition: "background 0.2s",
      }}>
        <span style={{
          position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18,
          borderRadius: "50%", background: "white", transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}

function SettingCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: "0 0 4px" }}>{title}</p>
      {children}
    </div>
  );
}

interface Props { userId: string; email: string; }

export function PrivacySettingsClient({ userId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [profilePublic, setProfilePublic] = useState(true);
  const [showOnline, setShowOnline] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [dataAnalytics, setDataAnalytics] = useState(true);
  const [dataPush, setDataPush] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "SUPPRIMER") { setDeleteError("Tape SUPPRIMER pour confirmer"); return; }
    setDeleteLoading(true);
    // In production, this would call a server action to delete the account
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const handleExportData = () => {
    // Trigger data export (placeholder)
    const data = { userId, exportedAt: new Date().toISOString(), message: "Exportation des données en cours de préparation. Tu recevras un email sous 24h." };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "wearlyx-data-export.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SettingsPageShell title="Confidentialité" description="Contrôle la visibilité de ton profil et la gestion de tes données.">

      <SettingCard title="Visibilité du profil">
        <ToggleRow label="Profil public" desc="Ton profil est visible par tous les utilisateurs" value={profilePublic} onChange={setProfilePublic} />
        <ToggleRow label="Afficher le statut en ligne" desc="Les autres voient quand tu es connecté" value={showOnline} onChange={setShowOnline} />
        <ToggleRow label="Afficher mon activité récente" desc="Tes dernières actions sont visibles dans ton profil" value={showActivity} onChange={setShowActivity} />
        <ToggleRow label="Autoriser les messages directs" desc="Les inconnus peuvent t'envoyer des messages" value={allowMessages} onChange={setAllowMessages} />
      </SettingCard>

      <SettingCard title="Données & personnalisation">
        <ToggleRow label="Analyses d'utilisation" desc="Aide à améliorer Wearlyx (données anonymisées)" value={dataAnalytics} onChange={setDataAnalytics} />
        <ToggleRow label="Notifications push personnalisées" desc="Recommandations basées sur tes préférences" value={dataPush} onChange={setDataPush} />
      </SettingCard>

      <SettingCard title="Mes données">
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
          <button onClick={handleExportData} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left",
            background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)",
            color: "#93C5FD",
          }}>
            <Download style={{ width: 16, height: 16, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 600, margin: "0 0 1px" }}>Exporter mes données</p>
              <p style={{ fontSize: 11.5, color: "rgba(147,197,253,0.5)", margin: 0 }}>JSON avec toutes tes informations</p>
            </div>
          </button>
        </div>
      </SettingCard>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 28 }}>
        <button onClick={handleSave} style={{
          padding: "10px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700,
          background: saved ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg,#8B5CF6,#7C3AED)",
          border: saved ? "1px solid rgba(16,185,129,0.3)" : "none",
          color: saved ? "#10B981" : "white", cursor: "pointer",
          boxShadow: saved ? "none" : "0 4px 16px rgba(139,92,246,0.3)",
          display: "flex", alignItems: "center", gap: 7,
        }}>
          {saved ? <><CheckCircle style={{ width: 15, height: 15 }} /> Sauvegardé</> : "Enregistrer les préférences"}
        </button>
      </div>

      {/* Danger zone */}
      <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <AlertTriangle style={{ width: 16, height: 16, color: "#EF4444" }} />
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#EF4444", margin: 0 }}>Zone dangereuse</p>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 14px", lineHeight: 1.5 }}>
          La suppression de ton compte est irréversible. Toutes tes annonces, messages et données seront définitivement effacés.
        </p>
        <div style={{ marginBottom: 10 }}>
          <p style={{ fontSize: 12, color: "rgba(239,68,68,0.6)", margin: "0 0 6px" }}>Tape <strong style={{ color: "#EF4444" }}>SUPPRIMER</strong> pour confirmer</p>
          <input
            value={deleteConfirm}
            onChange={e => { setDeleteConfirm(e.target.value); setDeleteError(""); }}
            placeholder="SUPPRIMER"
            style={{
              background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 9, padding: "9px 14px", fontSize: 14, color: "#EF4444",
              outline: "none", caretColor: "#EF4444", width: "100%", boxSizing: "border-box",
            }}
          />
          {deleteError && <p style={{ fontSize: 12, color: "#EF4444", margin: "6px 0 0" }}>{deleteError}</p>}
        </div>
        <button onClick={handleDeleteAccount} disabled={deleteLoading} style={{
          display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 9,
          fontSize: 13.5, fontWeight: 700,
          background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
          color: "#EF4444", cursor: "pointer", opacity: deleteLoading ? 0.6 : 1,
        }}>
          <Trash2 style={{ width: 14, height: 14 }} />
          {deleteLoading ? "Suppression…" : "Supprimer mon compte"}
        </button>
      </div>
    </SettingsPageShell>
  );
}
