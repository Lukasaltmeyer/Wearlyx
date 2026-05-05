"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  signInWithProvider,
  signInWithEmailOtp,
  verifyEmailOtp,
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

type Method = "email" | "phone";
type Step = "main" | "contact" | "otp";

export default function LoginClient() {
  const idx = useCarousel();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>("main");
  const [method, setMethod] = useState<Method>("email");
  const [contact, setContact] = useState("");
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
    try { await signInWithProvider("google"); }
    catch (e: any) { setError(e.message ?? "Erreur Google."); setGoogleLoading(false); }
  };

  const startContact = (m: Method) => {
    setMethod(m);
    setContact("");
    setError("");
    setStep("contact");
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
      else setError(method === "email" ? "Email invalide ou introuvable." : "Numéro invalide. Format : +33 6…");
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
      if (method === "email") await verifyEmailOtp(contact.trim(), otpDigits.join(""));
      else await verifyPhoneOtp(contact.trim(), otpDigits.join(""));
      sessionStorage.setItem("wlx_just_authed", "1");
      window.location.replace("/");
    } catch {
      setError("Code incorrect ou expiré.");
      setOtpDigits(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const goBack = () => {
    setError("");
    if (step === "otp") { setStep("contact"); setOtpDigits(["", "", "", "", "", ""]); }
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
              <p className="text-[20px] font-black text-white mb-0.5">Se connecter</p>

              <GoogleBtn onClick={handleGoogle} loading={googleLoading} label="Se connecter avec Google" />

              <Divider />

              <button type="button" onClick={() => startContact("email")}
                className="w-full flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-[13px] font-semibold text-white/70 transition-all hover:bg-white/8 active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white/35" />
                  <span>Se connecter avec l'email</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/25" />
              </button>

              <button type="button" onClick={() => startContact("phone")}
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
                  <Link href="/auth/signup"
                    className="text-[#A78BFA] font-bold underline underline-offset-2">
                    Créer un compte
                  </Link>
                </p>
              </div>
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
                  {method === "email" ? "On t'envoie un code de connexion" : "Format international (+33 6…)"}
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
                Se connecter <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
              <button type="button" onClick={() => { setStep("contact"); setOtpDigits(["","","","","",""]); }}
                className="text-center text-[12px] text-white/30 hover:text-white/55 transition-colors">
                Renvoyer le code
              </button>
            </form>
          )}
        </AuthCard>
      </div>
    </div>
  );
}
