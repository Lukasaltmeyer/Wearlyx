"use client";

import { useState, useEffect } from "react";
import { ArrowRight, User, MapPin, Hash, Phone, AlertCircle, X } from "lucide-react";
import { getSession, updateProfile } from "@/lib/auth";

function DarkInput({ placeholder, value, onChange, leftIcon, autoComplete, inputMode, maxLength, type = "text" }: {
  placeholder: string; value: string; onChange: (v: string) => void;
  leftIcon: React.ReactNode; autoComplete?: string; type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; maxLength?: number;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 px-4 py-4 transition-all focus-within:border-[#8B5CF6]/50 focus-within:bg-white/10">
      <span className="text-white/35 flex-shrink-0 transition-colors group-focus-within:text-[#A78BFA]">{leftIcon}</span>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete} inputMode={inputMode} maxLength={maxLength}
        className="flex-1 bg-transparent text-[15px] text-white placeholder-white/30 outline-none" />
    </div>
  );
}

export function CompleteProfileClient() {
  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Retry up to 5 times with 600ms delay — session cookie may not be readable immediately after OAuth redirect
    let attempts = 0;
    const tryGetSession = async () => {
      attempts++;
      console.log(`[complete-profile] getSession attempt ${attempts}`);
      const user = await getSession();
      if (user) {
        console.log("[complete-profile] session found:", user.id);
        setUserId(user.id);
        // Pre-fill name from Google metadata
        const meta = (user as any).user_metadata ?? {};
        const name = meta.full_name ?? meta.name ?? "";
        if (name) {
          const parts = name.trim().split(" ");
          setFirstName(parts[0] ?? "");
          setLastName(parts.slice(1).join(" ") ?? "");
        }
        if (meta.phone) setPhone(meta.phone);
        setChecking(false);
      } else if (attempts < 6) {
        setTimeout(tryGetSession, 600);
      } else {
        console.log("[complete-profile] no session after 6 attempts → login");
        window.location.replace("/auth/login");
      }
    };
    tryGetSession();
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!username.trim() || !city.trim() || !postalCode.trim() || !phone.trim()) {
      setError("Tous les champs obligatoires (*) doivent être remplis."); return;
    }
    if (username.length < 3) { setError("Le pseudo doit faire au moins 3 caractères."); return; }
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      await updateProfile(userId, {
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim() || undefined,
        username: username.trim().toLowerCase(),
        city: city.trim(),
        postal_code: postalCode.trim(),
        phone: phone.trim(),
      });
      console.log("[complete-profile] profile saved → /");
      sessionStorage.setItem("wlx_just_authed", "1");
      window.location.replace("/");
    } catch (e: any) {
      const m = e.message ?? "";
      console.log("[complete-profile] save error:", m);
      if (m.includes("unique") || m.includes("duplicate")) setError("Ce pseudo est déjà pris.");
      else setError("Erreur lors de la sauvegarde. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center" style={{ background: "#0A0A0A" }}>
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#8B5CF6]" />
      </div>
    );
  }

  const canSubmit = username.trim() && city.trim() && postalCode.trim() && phone.trim();

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8" style={{ background: "#0A0A0A" }}>
      <div className="w-full max-w-[420px]">
        <p className="text-center text-[22px] font-black text-white mb-8 tracking-tight">Wearlyx</p>

        <div className="rounded-[24px] border border-white/8 p-6"
          style={{ background: "rgba(14,14,20,0.95)" }}>
          <p className="text-[18px] font-black text-white mb-1">Complète ton profil</p>
          <p className="text-[13px] text-white/40 mb-5">Les champs * sont obligatoires</p>

          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 px-3.5 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="flex-1 text-[13px] text-red-300">{error}</p>
              <button onClick={() => setError("")}><X className="w-3.5 h-3.5 text-red-400/50" /></button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <DarkInput placeholder="Prénom" value={firstName} onChange={setFirstName}
                  leftIcon={<User className="w-4 h-4" />} autoComplete="given-name" />
              </div>
              <div className="flex-1">
                <DarkInput placeholder="Nom" value={lastName} onChange={setLastName}
                  leftIcon={<User className="w-4 h-4" />} autoComplete="family-name" />
              </div>
            </div>

            <DarkInput placeholder="@pseudo * (unique)" value={username}
              onChange={(v) => setUsername(v.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
              leftIcon={<span className="text-sm font-bold text-white/35">@</span>} />

            <DarkInput placeholder="Téléphone * (+33 6…)" value={phone} onChange={setPhone}
              type="tel" leftIcon={<Phone className="w-4 h-4" />}
              inputMode="tel" autoComplete="tel" />

            <DarkInput placeholder="Ville *" value={city} onChange={setCity}
              leftIcon={<MapPin className="w-4 h-4" />} autoComplete="address-level2" />

            <DarkInput placeholder="Code postal *" value={postalCode} onChange={setPostalCode}
              leftIcon={<Hash className="w-4 h-4" />} autoComplete="postal-code"
              inputMode="numeric" maxLength={5} />

            <button type="submit" disabled={loading || !canSubmit}
              className="mt-1 w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-[0.97] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.35)" }}>
              {loading
                ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : <><span>Créer mon compte</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
