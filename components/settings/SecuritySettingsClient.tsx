"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SettingsPageShell } from "./SettingsPageShell";
import { createClient } from "@/lib/supabase/client";
import { Shield, KeyRound, Smartphone, LogOut, CheckCircle, AlertTriangle, Eye, EyeOff } from "lucide-react";

function SettingCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: "0 0 14px" }}>{title}</p>
      {children}
    </div>
  );
}

interface Props { email: string; createdAt: string; }

export function SecuritySettingsClient({ email, createdAt }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);

  const changePassword = async () => {
    if (newPassword !== confirmPassword) { setPwdError("Les mots de passe ne correspondent pas"); return; }
    if (newPassword.length < 8) { setPwdError("Minimum 8 caractères"); return; }
    setPwdError(""); setPwdLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setPwdError(error.message); } else { setPwdSuccess(true); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setTimeout(() => setPwdSuccess(false), 4000); }
    setPwdLoading(false);
  };

  const logout = async () => {
    setLogoutLoading(true);
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const logoutAll = async () => {
    setLogoutLoading(true);
    await supabase.auth.signOut({ scope: "global" });
    router.push("/auth");
  };

  const passwordInput = (label: string, value: string, onChange: (v: string) => void) => (
    <div style={{ marginBottom: 12 }}>
      <p style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.35)", margin: "0 0 6px" }}>{label}</p>
      <div style={{ position: "relative" }}>
        <input
          type={showPwd ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "10px 40px 10px 14px", fontSize: 14, color: "white",
            outline: "none", caretColor: "#8B5CF6",
          }}
        />
        <button onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0 }}>
          {showPwd ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
        </button>
      </div>
    </div>
  );

  return (
    <SettingsPageShell title="Sécurité" description="Gérez votre mot de passe et les accès à votre compte.">

      {/* Email */}
      <SettingCard title="Identifiant">
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Shield style={{ width: 16, height: 16, color: "#8B5CF6", flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.8)", margin: "0 0 2px" }}>{email}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", margin: 0 }}>Compte créé le {new Date(createdAt).toLocaleDateString("fr-FR")}</p>
          </div>
        </div>
      </SettingCard>

      {/* Password */}
      <SettingCard title="Changer le mot de passe">
        {passwordInput("Nouveau mot de passe", newPassword, setNewPassword)}
        {passwordInput("Confirmer le mot de passe", confirmPassword, setConfirmPassword)}
        {pwdError && (
          <div style={{ display: "flex", gap: 7, padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 12 }}>
            <AlertTriangle style={{ width: 14, height: 14, color: "#EF4444", flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#EF4444", margin: 0 }}>{pwdError}</p>
          </div>
        )}
        {pwdSuccess && (
          <div style={{ display: "flex", gap: 7, padding: "8px 12px", borderRadius: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: 12 }}>
            <CheckCircle style={{ width: 14, height: 14, color: "#10B981", flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#10B981", margin: 0 }}>Mot de passe modifié avec succès</p>
          </div>
        )}
        <button onClick={changePassword} disabled={pwdLoading || !newPassword || !confirmPassword} style={{
          padding: "9px 20px", borderRadius: 9, fontSize: 13.5, fontWeight: 700,
          background: "linear-gradient(135deg,#8B5CF6,#7C3AED)", border: "none",
          color: "white", cursor: "pointer",
          opacity: (pwdLoading || !newPassword) ? 0.5 : 1,
          boxShadow: "0 4px 14px rgba(139,92,246,0.25)",
        }}>
          {pwdLoading ? "Enregistrement…" : "Modifier le mot de passe"}
        </button>
      </SettingCard>

      {/* 2FA */}
      <SettingCard title="Authentification à deux facteurs">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <Smartphone style={{ width: 16, height: 16, color: "#F59E0B" }} />
            </div>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: "0 0 2px" }}>Application d'authentification</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>Google Authenticator, Authy…</p>
            </div>
          </div>
          <button style={{
            padding: "7px 16px", borderRadius: 8, fontSize: 12.5, fontWeight: 600,
            background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
            color: "#F59E0B", cursor: "pointer",
          }}>
            Activer
          </button>
        </div>
      </SettingCard>

      {/* Sessions */}
      <SettingCard title="Sessions actives">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: "0 0 2px" }}>Session actuelle</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", margin: 0 }}>Navigateur web · Maintenant</p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: "#10B981" }}>Active</span>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button onClick={logout} disabled={logoutLoading} style={{
              flex: 1, padding: "9px", borderRadius: 9, fontSize: 13, fontWeight: 600,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <LogOut style={{ width: 14, height: 14 }} /> Déconnexion
            </button>
            <button onClick={logoutAll} disabled={logoutLoading} style={{
              flex: 1, padding: "9px", borderRadius: 9, fontSize: 13, fontWeight: 600,
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <LogOut style={{ width: 14, height: 14 }} /> Déconnecter partout
            </button>
          </div>
        </div>
      </SettingCard>
    </SettingsPageShell>
  );
}
