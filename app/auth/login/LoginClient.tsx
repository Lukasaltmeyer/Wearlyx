"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  signInWithProvider,
  signInWithEmail,
  sendPasswordReset,
  signInWithPhone,
  verifyPhoneOtp,
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
import { useRef } from "react";

type Step = "main" | "email" | "phone" | "phone-otp" | "forgot" | "forgot-sent";

export default function LoginClient() {
  const idx = useCarousel();
  const [visible, setVisible] = useState(false);
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("main");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [phone, setPhone] = useState("");
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
    const err = searchParams?.get("error");
    if (err === "already_exists") {
      setError("Ce compte Google existe déjà. Connecte-toi ici.");
    }
  }, [searchParams]);

  const handleGoogle = async () => {
    setGoogleLoading(true); setError("");
    try { await signInWithProvider("google", "login"); }
    catch (e: any) { setError(e.message ?? "Erreur Google."); setGoogleLoading(false); }
  };

  const handleEmailLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true); setError("");
    try {
      await signInWithEmail(email.trim(), password);
      sessionStorage.setItem("wlx_just_authed", "1");
      window.location.replace("/");
    } catch (e: any) {
      const m = e.message ?? "";
      if (m.includes("Invalid login") || m.includes("invalid_credentials") || m.includes("Invalid email or password")) {
        setError("Email ou mot de passe incorrect.");
      } else if (m.includes("Email not confirmed")) {
        setError("Email non vérifié. Vérifie ta boîte mail.");
      } else {
        setError(m || "Erreur de connexion.");
      }
    } finally { setLoading(false); }
  };

  const handleSendPhoneOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true); setError("");
    try {
      await signInWithPhone(phone.trim());
      setStep("phone-otp");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (e: any) {
      setError("Impossible d'envoyer le code. Vérifie le numéro.");
    } finally { setLoading(false); }
  };

  const handleOtpChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[i] = digit;
    setOtpDigits(next);
    if (digit && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleVerifyPhoneOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) return;
    setLoading(true); setError("");
    try {
      await verifyPhoneOtp(phone.trim(), code);
      sessionStorage.setItem("wlx_just_authed", "1");
      window.location.replace("/");
    } catch (e: any) {
      setError("Code incorrect ou expiré.");
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } finally { setLoading(false); }
  };

  const handleForgot = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setLoading(true); setError("");
    try {
      await sendPasswordReset(forgotEmail.trim());
      setStep("forgot-sent");
    } catch {
      setError("Impossible d'envoyer l'email. Vérifie l'adresse.");
    } finally { setLoading(false); }
  };

  const goBack = () => { setStep("main"); setError(""); };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-black"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}>
      <AuthBackground idx={idx} />

      <div className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-5">
        <TaglineBlock idx={idx} />

        <AuthCard>
          {step !== "main" && <BackBtn onClick={goBack} />}
          {error && <div className="mb-3"><ErrorBanner message={error} onDismiss={() => setError("")} /></div>}

          {/* ── MAIN ──────────────────────────────────────────────────────────── */}
          {step === "main" && (
            <div className="flex flex-col gap-3 animate-fadeIn">
              <p className="text-[20px] font-black text-white mb-0.5">Se connecter</p>

              <GoogleBtn onClick={handleGoogle} loading={googleLoading} label="Se connecter avec Google" />
              <Divider />

              <button type="button" onClick={() => setStep("email")}
                className="w-full flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-[13px] font-semibold text-white/70 transition-all hover:bg-white/8 active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white/35" />
                  <span>Se connecter avec l'email</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/25" />
              </button>

              <button type="button" onClick={() => setStep("phone")}
                className="w-full flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-[13px] font-semibold text-white/70 transition-all hover:bg-white/8 active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white/35" />
                  <span>Se connecter avec le téléphone</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/25" />
              </button>

              <div className="pt-1 border-t border-white/6 text-center">
                <p className="text-[13px] text-white/35 mt-3">
                  Pas encore de compte ?{" "}
                  <Link href="/auth/signup" className="text-[#A78BFA] font-bold underline underline-offset-2">
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* ── EMAIL ─────────────────────────────────────────────────────────── */}
          {step === "email" && (
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-3 animate-fadeIn">
              <p className="text-[18px] font-black text-white mb-0.5">Connexion par email</p>

              <DarkInput type="email" placeholder="Adresse email" value={email} onChange={setEmail}
                leftIcon={<Mail className="w-4 h-4" />} autoComplete="email" />

              <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 px-4 py-4 transition-all focus-within:border-[#8B5CF6]/50 focus-within:bg-white/10">
                <Lock className="w-4 h-4 text-white/35 flex-shrink-0 group-focus-within:text-[#A78BFA] transition-colors" />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="flex-1 bg-transparent text-[15px] text-white placeholder-white/30 outline-none"
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button type="button" onClick={() => { setStep("forgot"); setForgotEmail(email); }}
                className="text-right text-[12px] text-[#A78BFA] hover:text-[#C4B5FD] transition-colors -mt-1">
                Mot de passe oublié ?
              </button>

              <PrimaryBtn loading={loading} disabled={!email.trim() || !password}>
                Se connecter <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </form>
          )}

          {/* ── PHONE ─────────────────────────────────────────────────────────── */}
          {step === "phone" && (
            <form onSubmit={handleSendPhoneOtp} className="flex flex-col gap-3 animate-fadeIn">
              <p className="text-[18px] font-black text-white mb-0.5">Connexion par téléphone</p>
              <p className="text-[12px] text-white/35 -mt-1">On t'envoie un code par SMS</p>

              <DarkInput type="tel" placeholder="Numéro de téléphone (+33 6…)" value={phone} onChange={setPhone}
                leftIcon={<Phone className="w-4 h-4" />} autoComplete="tel" />

              <PrimaryBtn loading={loading} disabled={!phone.trim()}>
                Envoyer le code <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </form>
          )}

          {/* ── PHONE OTP ─────────────────────────────────────────────────────── */}
          {step === "phone-otp" && (
            <form onSubmit={handleVerifyPhoneOtp} className="flex flex-col gap-4 animate-fadeIn">
              <div>
                <p className="text-[18px] font-black text-white mb-0.5">Code de vérification</p>
                <p className="text-[12px] text-white/35">
                  Code envoyé au <span className="text-white/60 font-semibold">{phone}</span>
                </p>
              </div>

              <OtpGrid digits={otpDigits} refs={otpRefs} onChange={handleOtpChange} />

              <PrimaryBtn loading={loading} disabled={otpDigits.join("").length < 6}>
                Confirmer <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>

              <button type="button" onClick={() => { setStep("phone"); setOtpDigits(["", "", "", "", "", ""]); }}
                className="text-center text-[12px] text-[#A78BFA] hover:text-[#C4B5FD] transition-colors">
                Renvoyer le code
              </button>
            </form>
          )}

          {/* ── MOT DE PASSE OUBLIÉ ───────────────────────────────────────────── */}
          {step === "forgot" && (
            <form onSubmit={handleForgot} className="flex flex-col gap-3 animate-fadeIn">
              <div>
                <p className="text-[16px] font-bold text-white mb-0.5">Mot de passe oublié</p>
                <p className="text-[12px] text-white/35">On t'envoie un lien de réinitialisation</p>
              </div>
              <DarkInput type="email" placeholder="ton@email.com" value={forgotEmail} onChange={setForgotEmail}
                leftIcon={<Mail className="w-4 h-4" />} autoComplete="email" />
              <PrimaryBtn loading={loading} disabled={!forgotEmail.trim()}>
                Envoyer le lien <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </form>
          )}

          {/* ── EMAIL ENVOYÉ ─────────────────────────────────────────────────── */}
          {step === "forgot-sent" && (
            <div className="flex flex-col items-center gap-3 py-2 animate-fadeIn text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <Mail className="w-6 h-6 text-[#A78BFA]" />
              </div>
              <p className="text-[16px] font-bold text-white">Email envoyé !</p>
              <p className="text-[13px] text-white/40 leading-relaxed">
                Vérifie ta boîte mail à <span className="text-white/70 font-semibold">{forgotEmail}</span> et clique sur le lien pour réinitialiser ton mot de passe.
              </p>
              <button onClick={() => setStep("main")}
                className="mt-2 text-[13px] text-[#A78BFA] font-semibold">
                Retour à la connexion
              </button>
            </div>
          )}
        </AuthCard>
      </div>
    </div>
  );
}
