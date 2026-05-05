"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, Phone, ArrowRight, MapPin, Hash, User } from "lucide-react";
import Link from "next/link";
import {
  signInWithProvider,
  signInWithEmailOtp,
  verifyEmailOtp,
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

type Method = "email" | "phone";
type Step = "main" | "contact" | "otp" | "profile";

export default function SignupClient() {
  const idx = useCarousel();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>("main");
  const [method, setMethod] = useState<Method>("email");
  const [contact, setContact] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Profile fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

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
    try { await signInWithProvider("google"); }
    catch (e: any) { setError(e.message ?? "Erreur Google."); setGoogleLoading(false); }
  };

  const handleSendOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setLoading(true); setError("");
    try {
      if (method === "email") await signInWithEmailOtp(contact.trim());
      else await signInWithPhone(contact.trim());
      setStep("otp");
    } catch (e: any) {
      const m = e.message ?? "";
      if (m.includes("rate") || m.includes("limit")) setError("Trop de tentatives. Attends quelques secondes.");
      else setError(method === "email" ? "Email invalide." : "Numéro invalide. Utilise le format +33 6…");
    } finally { setLoading(false); }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits]; next[i] = val; setOtpDigits(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleVerifyOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (otpDigits.join("").length < 6) return;
    setLoading(true); setError("");
    try {
      let user;
      if (method === "email") user = await verifyEmailOtp(contact.trim(), otpDigits.join(""));
      else user = await verifyPhoneOtp(contact.trim(), otpDigits.join(""));
      if (user) { setUserId(user.id); setStep("profile"); }
    } catch {
      setError("Code incorrect ou expiré.");
      setOtpDigits(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const handleProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !username.trim() || !city.trim() || !postalCode.trim()) {
      setError("Tous les champs obligatoires (*) doivent être remplis."); return;
    }
    if (username.length < 3) { setError("Le pseudo doit faire au moins 3 caractères."); return; }
    if (method === "email" && !phone.trim()) { setError("Le téléphone est obligatoire."); return; }
    if (!userId) return;
    setLoading(true); setError("");
    try {
      await updateProfile(userId, {
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        username: username.trim().toLowerCase(),
        city: city.trim(),
        postal_code: postalCode.trim(),
        phone: method === "email" ? phone.trim() : contact.trim(),
      });
      window.location.replace("/");
    } catch (e: any) {
      const m = e.message ?? "";
      if (m.includes("unique") || m.includes("duplicate")) setError("Ce pseudo est déjà pris.");
      else setError("Erreur lors de la sauvegarde. Réessaie.");
    } finally { setLoading(false); }
  };

  const goBack = () => {
    setError("");
    if (step === "otp") { setStep("contact"); setOtpDigits(["","","","","",""]); }
    else if (step === "profile") setStep("otp");
    else setStep("main");
  };

  const profileValid = firstName.trim() && username.trim() && city.trim() && postalCode.trim() &&
    (method === "phone" || phone.trim());

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
              <p className="text-[18px] font-black text-white mb-1">Créer un compte</p>

              <GoogleBtn onClick={handleGoogle} loading={googleLoading} label="S'inscrire avec Google" />
              <Divider />

              <button type="button"
                onClick={() => { setMethod("email"); setContact(""); setStep("contact"); }}
                className="w-full flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-[13px] text-white/70 transition-all hover:bg-white/8 active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white/35" />
                  <span>S'inscrire avec l'email</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/25" />
              </button>

              <button type="button"
                onClick={() => { setMethod("phone"); setContact(""); setStep("contact"); }}
                className="w-full flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-[13px] text-white/70 transition-all hover:bg-white/8 active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white/35" />
                  <span>S'inscrire avec le téléphone</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/25" />
              </button>

              <p className="text-center text-[12px] text-white/30 pt-1">
                Déjà un compte ?{" "}
                <Link href="/auth/login" className="text-[#A78BFA] font-semibold underline underline-offset-2">
                  Se connecter
                </Link>
              </p>

              <p className="text-center text-[11px] text-white/20 leading-relaxed">
                En t'inscrivant tu acceptes nos{" "}
                <span className="text-white/40 underline underline-offset-2 cursor-pointer">CGU</span>{" "}
                et notre{" "}
                <span className="text-white/40 underline underline-offset-2 cursor-pointer">Politique de confidentialité</span>
              </p>
            </div>
          )}

          {/* ── CONTACT ──────────────────────────────────────────────────────── */}
          {step === "contact" && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-3 animate-fadeIn">
              <div>
                <p className="text-[16px] font-bold text-white mb-0.5">
                  {method === "email" ? "Ton adresse email" : "Ton numéro de téléphone"}
                </p>
                <p className="text-[12px] text-white/35">
                  {method === "email" ? "On t'envoie un code de vérification" : "Format international (+33 6…)"}
                </p>
              </div>
              <DarkInput
                type={method === "email" ? "email" : "tel"}
                placeholder={method === "email" ? "ton@email.com" : "+33 6 12 34 56 78"}
                value={contact} onChange={setContact}
                leftIcon={method === "email" ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                autoComplete={method === "email" ? "email" : "tel"}
                inputMode={method === "email" ? "email" : "tel"}
              />
              <PrimaryBtn loading={loading} disabled={!contact.trim()}>
                Recevoir le code <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </form>
          )}

          {/* ── OTP ──────────────────────────────────────────────────────────── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 animate-fadeIn">
              <div>
                <p className="text-[16px] font-bold text-white mb-0.5">Entre le code</p>
                <p className="text-[12px] text-white/35">
                  Code envoyé à <span className="text-white/60 font-semibold">{contact}</span>
                </p>
              </div>
              <OtpGrid digits={otpDigits} refs={otpRefs} onChange={handleOtpChange} />
              <PrimaryBtn loading={loading} disabled={otpDigits.join("").length < 6}>
                Vérifier <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
              <button type="button"
                onClick={() => { setStep("contact"); setOtpDigits(["","","","","",""]); }}
                className="text-center text-[12px] text-white/30 hover:text-white/55 transition-colors">
                Renvoyer le code
              </button>
            </form>
          )}

          {/* ── PROFILE ──────────────────────────────────────────────────────── */}
          {step === "profile" && (
            <form onSubmit={handleProfile} className="flex flex-col gap-3 animate-fadeIn">
              <div>
                <p className="text-[16px] font-bold text-white mb-0.5">Complète ton profil</p>
                <p className="text-[12px] text-white/35">Tous les champs * sont obligatoires</p>
              </div>

              <div className="flex gap-2">
                <DarkInput placeholder="Prénom *" value={firstName} onChange={setFirstName}
                  leftIcon={<User className="w-4 h-4" />} autoComplete="given-name" />
                <DarkInput placeholder="Nom" value={lastName} onChange={setLastName}
                  leftIcon={<User className="w-4 h-4" />} autoComplete="family-name" />
              </div>

              <DarkInput placeholder="@pseudo *" value={username}
                onChange={(v) => setUsername(v.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
                leftIcon={<span className="text-sm font-bold text-white/35">@</span>} />

              <DarkInput placeholder="Ville *" value={city} onChange={setCity}
                leftIcon={<MapPin className="w-4 h-4" />} autoComplete="address-level2" />

              <DarkInput placeholder="Code postal *" value={postalCode} onChange={setPostalCode}
                leftIcon={<Hash className="w-4 h-4" />} inputMode="numeric" maxLength={5}
                autoComplete="postal-code" />

              {method === "email" && (
                <DarkInput placeholder="Téléphone (+33 6…) *" value={phone} onChange={setPhone}
                  type="tel" leftIcon={<Phone className="w-4 h-4" />} inputMode="tel" autoComplete="tel" />
              )}

              <PrimaryBtn loading={loading} disabled={!profileValid}>
                Créer mon compte <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </form>
          )}
        </AuthCard>
      </div>
    </div>
  );
}
