"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, MapPin, Hash } from "lucide-react";
import Link from "next/link";
import {
  signInWithProvider,
  signInWithEmailOtp,
  verifyEmailOtp,
  setPassword,
  signInWithPhone,
  verifyPhoneOtp,
  updateProfile,
  getSession,
} from "@/lib/auth";
import {
  AuthBackground,
  AuthCard,
  TaglineBlock,
  DarkInput,
  PrimaryBtn,
  GoogleBtn,
  Divider,
  ErrorBanner,
  BackBtn,
  OtpGrid,
  useCarousel,
} from "../_components/AuthUI";

type Step = "main" | "form-1" | "form-2" | "otp" | "phone-contact" | "phone-otp" | "phone-profile";

export default function SignupClient() {
  const idx = useCarousel();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>("main");

  // Email form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword_] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Phone fields
  const [phoneContact, setPhoneContact] = useState("");

  // Common profile fields
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // OTP
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getSession().then((u) => {
      if (u) window.location.replace("/");
      else setTimeout(() => setVisible(true), 80);
    });
  }, []);

  const handleGoogle = async () => {
    setGoogleLoading(true); setError("");
    try { await signInWithProvider("google", "signup"); }
    catch (e: any) { setError(e.message ?? "Erreur Google."); setGoogleLoading(false); }
  };

  // ── EMAIL FLOW ────────────────────────────────────────────────────────────
  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    if (!firstName.trim()) { setError("Le prénom est obligatoire."); return; }
    if (!email.trim()) { setError("L'email est obligatoire."); return; }
    if (password.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères."); return; }
    if (password !== confirmPassword) { setError("Les mots de passe ne correspondent pas."); return; }
    if (!username.trim() || username.length < 3) { setError("Le pseudo doit faire au moins 3 caractères."); return; }
    if (!phone.trim()) { setError("Le téléphone est obligatoire."); return; }
    if (!city.trim()) { setError("La ville est obligatoire."); return; }
    if (!postalCode.trim()) { setError("Le code postal est obligatoire."); return; }
    setLoading(true);
    try {
      await signInWithEmailOtp(email.trim());
      setStep("otp");
    } catch (e: any) {
      const m = e.message ?? "";
      if (m.includes("rate") || m.includes("limit")) setError("Trop de tentatives. Attends quelques secondes.");
      else setError("Impossible d'envoyer le code. Vérifie l'email.");
    } finally { setLoading(false); }
  };

  const handleVerifyEmailOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) return;
    setLoading(true); setError("");
    try {
      const user = await verifyEmailOtp(email.trim(), code);
      if (!user) throw new Error("Session non créée.");
      await setPassword(password);
      await updateProfile(user.id, {
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        username: username.trim().toLowerCase(),
        city: city.trim(),
        postal_code: postalCode.trim(),
        phone: phone.trim(),
      });
      sessionStorage.setItem("wlx_just_authed", "1");
      window.location.replace("/");
    } catch (e: any) {
      const m = e.message ?? "";
      if (m.includes("unique") || m.includes("duplicate")) setError("Ce pseudo est déjà pris.");
      else if (m.includes("expired") || m.includes("invalid") || m.includes("otp")) {
        setError("Code incorrect ou expiré.");
        setOtpDigits(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      } else setError(m || "Erreur lors de la création du compte.");
    } finally { setLoading(false); }
  };

  // ── PHONE FLOW ────────────────────────────────────────────────────────────
  const handleSendSms = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!phoneContact.trim()) return;
    setLoading(true); setError("");
    try {
      await signInWithPhone(phoneContact.trim());
      setStep("phone-otp");
      setOtpDigits(["", "", "", "", "", ""]);
    } catch (e: any) {
      setError("Impossible d'envoyer le SMS. Vérifie le numéro (+33 6…).");
    } finally { setLoading(false); }
  };

  const handleVerifyPhoneOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) return;
    setLoading(true); setError("");
    try {
      const user = await verifyPhoneOtp(phoneContact.trim(), code);
      if (!user) throw new Error("Session non créée.");
      setUserId(user.id);
      setStep("phone-profile");
    } catch {
      setError("Code incorrect ou expiré.");
      setOtpDigits(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const handlePhoneProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || username.length < 3) { setError("Le pseudo doit faire au moins 3 caractères."); return; }
    if (!city.trim()) { setError("La ville est obligatoire."); return; }
    if (!postalCode.trim()) { setError("Le code postal est obligatoire."); return; }
    if (!userId) return;
    setLoading(true);
    try {
      await updateProfile(userId, {
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim() || undefined,
        username: username.trim().toLowerCase(),
        city: city.trim(),
        postal_code: postalCode.trim(),
        phone: phoneContact.trim(),
      });
      sessionStorage.setItem("wlx_just_authed", "1");
      window.location.replace("/");
    } catch (e: any) {
      const m = e.message ?? "";
      if (m.includes("unique") || m.includes("duplicate")) setError("Ce pseudo est déjà pris.");
      else setError("Erreur lors de la sauvegarde. Réessaie.");
    } finally { setLoading(false); }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits]; next[i] = val; setOtpDigits(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const goBack = () => {
    setError("");
    if (step === "otp") { setStep("form-2"); setOtpDigits(["","","","","",""]); }
    else if (step === "form-2") setStep("form-1");
    else if (step === "phone-otp") { setStep("phone-contact"); setOtpDigits(["","","","","",""]); }
    else if (step === "phone-profile") setStep("phone-otp");
    else setStep("main");
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-black"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}>
      <AuthBackground idx={idx} />

      <div className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-5">
        <TaglineBlock idx={idx} />

        <AuthCard>
          {step !== "main" && <BackBtn onClick={goBack} />}
          {error && <div className="mb-3"><ErrorBanner message={error} onDismiss={() => setError("")} /></div>}

          {/* ── MAIN ─────────────────────────────────────────────────────────── */}
          {step === "main" && (
            <div className="flex flex-col gap-3 animate-fadeIn">
              <p className="text-[20px] font-black text-white mb-0.5">Créer un compte</p>

              <GoogleBtn onClick={handleGoogle} loading={googleLoading} label="S'inscrire avec Google" />
              <Divider />

              <button type="button" onClick={() => setStep("form-1")}
                className="w-full flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-[13px] font-semibold text-white/70 transition-all hover:bg-white/8 active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white/35" />
                  <span>S'inscrire avec l'email</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/25" />
              </button>

              <button type="button" onClick={() => setStep("phone-contact")}
                className="w-full flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-[13px] font-semibold text-white/70 transition-all hover:bg-white/8 active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white/35" />
                  <span>S'inscrire avec le téléphone</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/25" />
              </button>

              <div className="pt-1 border-t border-white/6 text-center">
                <p className="text-[13px] text-white/35 mt-3">
                  Déjà un compte ?{" "}
                  <Link href="/auth/login" className="text-[#A78BFA] font-bold underline underline-offset-2">
                    Se connecter
                  </Link>
                </p>
              </div>

              <p className="text-center text-[11px] text-white/20 leading-relaxed">
                En t'inscrivant tu acceptes nos{" "}
                <span className="text-white/40 underline underline-offset-2 cursor-pointer">CGU</span>{" "}
                et notre{" "}
                <span className="text-white/40 underline underline-offset-2 cursor-pointer">Politique de confidentialité</span>
              </p>
            </div>
          )}

          {/* ── ÉTAPE 1 : Identité + Email + Mot de passe ────────────────────── */}
          {step === "form-1" && (
            <div className="flex flex-col gap-3 animate-fadeIn">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[18px] font-black text-white">Ton identité</p>
                <span className="text-[11px] font-bold text-white/25 bg-white/6 px-2.5 py-1 rounded-full">1 / 2</span>
              </div>

              <div className="flex gap-2">
                <DarkInput placeholder="Prénom *" value={firstName} onChange={setFirstName}
                  leftIcon={<User className="w-4 h-4" />} autoComplete="given-name" />
                <DarkInput placeholder="Nom" value={lastName} onChange={setLastName}
                  leftIcon={<User className="w-4 h-4" />} autoComplete="family-name" />
              </div>

              <DarkInput type="email" placeholder="Adresse email *" value={email} onChange={setEmail}
                leftIcon={<Mail className="w-4 h-4" />} autoComplete="email" />

              <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 px-4 py-4 transition-all focus-within:border-[#8B5CF6]/50 focus-within:bg-white/10">
                <Lock className="w-4 h-4 text-white/35 flex-shrink-0 group-focus-within:text-[#A78BFA] transition-colors" />
                <input type={showPwd ? "text" : "password"} placeholder="Mot de passe (6 car. min.) *"
                  value={password} onChange={(e) => setPassword_(e.target.value)} autoComplete="new-password"
                  className="flex-1 bg-transparent text-[15px] text-white placeholder-white/30 outline-none" />
                <button type="button" onClick={() => setShowPwd(v => !v)} className="text-white/30 hover:text-white/60 flex-shrink-0">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 px-4 py-4 transition-all focus-within:border-[#8B5CF6]/50 focus-within:bg-white/10">
                <Lock className="w-4 h-4 text-white/35 flex-shrink-0 group-focus-within:text-[#A78BFA] transition-colors" />
                <input type={showConfirm ? "text" : "password"} placeholder="Confirmer le mot de passe *"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password"
                  className="flex-1 bg-transparent text-[15px] text-white placeholder-white/30 outline-none" />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="text-white/30 hover:text-white/60 flex-shrink-0">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <PrimaryBtn type="button" onClick={() => {
                setError("");
                if (!firstName.trim()) { setError("Le prénom est obligatoire."); return; }
                if (!email.trim()) { setError("L'email est obligatoire."); return; }
                if (password.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères."); return; }
                if (password !== confirmPassword) { setError("Les mots de passe ne correspondent pas."); return; }
                setStep("form-2");
              }}>
                Continuer <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </div>
          )}

          {/* ── ÉTAPE 2 : Profil ─────────────────────────────────────────────── */}
          {step === "form-2" && (
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 animate-fadeIn">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[18px] font-black text-white">Ton profil</p>
                <span className="text-[11px] font-bold text-white/25 bg-white/6 px-2.5 py-1 rounded-full">2 / 2</span>
              </div>

              <DarkInput placeholder="@pseudo * (unique)" value={username}
                onChange={(v) => setUsername(v.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
                leftIcon={<span className="text-sm font-bold text-white/35">@</span>} />

              <DarkInput type="tel" placeholder="Téléphone * (+33 6…)" value={phone} onChange={setPhone}
                leftIcon={<Phone className="w-4 h-4" />} inputMode="tel" autoComplete="tel" />

              <DarkInput placeholder="Ville *" value={city} onChange={setCity}
                leftIcon={<MapPin className="w-4 h-4" />} autoComplete="address-level2" />

              <DarkInput placeholder="Code postal *" value={postalCode} onChange={setPostalCode}
                leftIcon={<Hash className="w-4 h-4" />} inputMode="numeric" maxLength={5} />

              <PrimaryBtn loading={loading} disabled={!username.trim() || !phone.trim() || !city.trim() || !postalCode.trim()}>
                Recevoir le code de vérification <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </form>
          )}

          {/* ── EMAIL OTP ────────────────────────────────────────────────────── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyEmailOtp} className="flex flex-col gap-4 animate-fadeIn">
              <div>
                <p className="text-[16px] font-bold text-white mb-0.5">Vérifie ton email</p>
                <p className="text-[12px] text-white/35">Code envoyé à <span className="text-white/60 font-semibold">{email}</span></p>
              </div>
              <OtpGrid digits={otpDigits} refs={otpRefs} onChange={handleOtpChange} />
              <PrimaryBtn loading={loading} disabled={otpDigits.join("").length < 6}>
                Créer mon compte <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
              <button type="button" onClick={async () => { await signInWithEmailOtp(email.trim()); setOtpDigits(["","","","","",""]); }}
                className="text-center text-[12px] text-white/30 hover:text-white/55 transition-colors">
                Renvoyer le code
              </button>
            </form>
          )}

          {/* ── PHONE CONTACT ────────────────────────────────────────────────── */}
          {step === "phone-contact" && (
            <form onSubmit={handleSendSms} className="flex flex-col gap-3 animate-fadeIn">
              <div>
                <p className="text-[16px] font-bold text-white mb-0.5">Ton numéro de téléphone</p>
                <p className="text-[12px] text-white/35">On t'envoie un code par SMS</p>
              </div>
              <DarkInput type="tel" placeholder="+33 6 12 34 56 78" value={phoneContact} onChange={setPhoneContact}
                leftIcon={<Phone className="w-4 h-4" />} inputMode="tel" autoComplete="tel" />
              <PrimaryBtn loading={loading} disabled={!phoneContact.trim()}>
                Recevoir le code SMS <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </form>
          )}

          {/* ── PHONE OTP ────────────────────────────────────────────────────── */}
          {step === "phone-otp" && (
            <form onSubmit={handleVerifyPhoneOtp} className="flex flex-col gap-4 animate-fadeIn">
              <div>
                <p className="text-[16px] font-bold text-white mb-0.5">Entre le code SMS</p>
                <p className="text-[12px] text-white/35">Code envoyé au <span className="text-white/60 font-semibold">{phoneContact}</span></p>
              </div>
              <OtpGrid digits={otpDigits} refs={otpRefs} onChange={handleOtpChange} />
              <PrimaryBtn loading={loading} disabled={otpDigits.join("").length < 6}>
                Vérifier <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
              <button type="button" onClick={async () => { await signInWithPhone(phoneContact.trim()); setOtpDigits(["","","","","",""]); }}
                className="text-center text-[12px] text-white/30 hover:text-white/55 transition-colors">
                Renvoyer le code
              </button>
            </form>
          )}

          {/* ── PHONE PROFILE ────────────────────────────────────────────────── */}
          {step === "phone-profile" && (
            <form onSubmit={handlePhoneProfile} className="flex flex-col gap-3 animate-fadeIn">
              <div>
                <p className="text-[16px] font-bold text-white mb-0.5">Complète ton profil</p>
                <p className="text-[12px] text-white/35">Quelques infos pour finaliser</p>
              </div>
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
              <div className="flex gap-2">
                <div className="flex-1">
                  <DarkInput placeholder="Ville *" value={city} onChange={setCity}
                    leftIcon={<MapPin className="w-4 h-4" />} autoComplete="address-level2" />
                </div>
                <div className="flex-1">
                  <DarkInput placeholder="Code postal *" value={postalCode} onChange={setPostalCode}
                    leftIcon={<Hash className="w-4 h-4" />} inputMode="numeric" maxLength={5} />
                </div>
              </div>
              <PrimaryBtn loading={loading} disabled={!username.trim() || !city.trim() || !postalCode.trim()}>
                Créer mon compte <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </form>
          )}
        </AuthCard>
      </div>
    </div>
  );
}
