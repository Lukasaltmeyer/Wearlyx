"use client";

import { useState, useEffect, useRef } from "react";

import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ChevronLeft, Check, X, AlertCircle } from "lucide-react";
import {
  signInWithProvider,
  signInWithEmail,
  signUpWithEmail,
  signInWithPhone,
  verifyPhoneOtp,
  getSession,
} from "@/lib/auth";

// ─── Photos mode/fashion (fichiers locaux) ────────────────────────────────────
const IMAGES = [
  "/auth-bg/1.jpg",
  "/auth-bg/2.jpg",
  "/auth-bg/3.jpg",
  "/auth-bg/4.jpg",
  "/auth-bg/5.jpg",
  "/auth-bg/6.jpg",
];
// Fallback gradients si les images ne chargent pas
const GRADIENTS = [
  "linear-gradient(160deg, #1a0533 0%, #3b0764 35%, #1e1b4b 70%, #0a0a14 100%)",
  "linear-gradient(160deg, #0f172a 0%, #1e1b4b 40%, #4c1d95 80%, #0a0a14 100%)",
  "linear-gradient(160deg, #18181b 0%, #2d1b69 45%, #7c3aed 85%, #0a0a14 100%)",
  "linear-gradient(160deg, #0a0a14 0%, #1a0533 50%, #6d28d9 90%, #18181b 100%)",
  "linear-gradient(160deg, #14001f 0%, #4a044e 45%, #8B5CF6 85%, #0a0a14 100%)",
  "linear-gradient(160deg, #0a0a14 0%, #1e1b4b 40%, #5b21b6 75%, #2d1b69 100%)",
];
const INTERVAL = 4500;

const isSupabaseReady =
  typeof window !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase");

// ─── Background carousel ──────────────────────────────────────────────────────
function BackgroundCarousel({ onIndexChange }: { onIndexChange: (i: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % IMAGES.length;
        setPrev(i);
        onIndexChange(next);
        setTimeout(() => setPrev(null), 1200);
        return next;
      });
    }, INTERVAL);
    return () => clearInterval(t);
  }, [onIndexChange]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{
            opacity: i === idx ? 1 : 0,
            transitionDuration: i === idx ? "1200ms" : "800ms",
            zIndex: i === idx ? 2 : i === prev ? 1 : 0,
          }}
        >
            <div className="absolute inset-0" style={{ background: GRADIENTS[i] }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover object-center" loading={i === 0 ? "eager" : "lazy"} />
        </div>
      ))}
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
    </div>
  );
}

// ─── Slide dots ───────────────────────────────────────────────────────────────
function SlideDots({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-full bg-white transition-all duration-500"
          style={{ width: i === active ? 20 : 5, height: 5, opacity: i === active ? 0.9 : 0.3 }}
        />
      ))}
    </div>
  );
}

// ─── Dark input ───────────────────────────────────────────────────────────────
interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  leftIcon: React.ReactNode;
  rightIcon?: React.ReactNode;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}
function DarkInput({ type, placeholder, value, onChange, leftIcon, rightIcon, autoComplete, inputMode }: InputProps) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 px-4 py-4 transition-all focus-within:border-white/30 focus-within:bg-white/10">
      <span className="text-white/35 flex-shrink-0 transition-colors group-focus-within:text-white/70">{leftIcon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required
        className="flex-1 bg-transparent text-[15px] text-white placeholder-white/30 outline-none"
      />
      {rightIcon && (
        <span className="text-white/35 flex-shrink-0 transition-colors group-focus-within:text-white/60">{rightIcon}</span>
      )}
    </div>
  );
}

// ─── Primary button ───────────────────────────────────────────────────────────
function PrimaryBtn({ children, loading, type = "submit", onClick }: {
  children: React.ReactNode; loading?: boolean; type?: "submit" | "button"; onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold text-white shadow-lg shadow-violet-500/30 transition-all active:scale-[0.97] hover:brightness-110 disabled:opacity-60"
      style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 60%, #f97316 100%)" }}
    >
      {loading
        ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        : children}
    </button>
  );
}

// ─── Google icon ──────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}


// ─── Social button ────────────────────────────────────────────────────────────
function SocialBtn({ icon, label, onClick, loading }: {
  icon: React.ReactNode; label: string; onClick: () => void; loading?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2.5 rounded-2xl border border-white/12 bg-white/8 py-3.5 text-[13px] font-semibold text-white/90 transition-all active:scale-[0.97] hover:bg-white/13 disabled:opacity-50"
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" /> : icon}
      <span>{label}</span>
    </button>
  );
}

// ─── OR separator ─────────────────────────────────────────────────────────────
function OrSep() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-[11px] font-semibold text-white/30 tracking-widest">OU</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

type Mode = "login" | "signup";
type Step = "main" | "email" | "signup-details" | "phone-input" | "phone-otp";

// ─── Main component ───────────────────────────────────────────────────────────
export default function AuthClient() {

  const [carouselIdx, setCarouselIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== "undefined" && window.location.search.includes("signup")) return "signup";
    return "login";
  });
  const [step, setStep] = useState<Step>("main");
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState<"google" | null>(null);
  const [success, setSuccess] = useState(false);

  // Email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  // Phone
  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    getSession().then((s) => {
      if (s) window.location.replace("/");
      else setTimeout(() => setVisible(true), 100);
    });
  }, []);

  const goHome = () => { window.location.replace("/"); };
  const clearError = () => setError("");

  const handleSocial = async (provider: "google") => {
    if (!isSupabaseReady) {
      setError("Configure d'abord Supabase dans .env.local pour activer la connexion sociale.");
      return;
    }
    setSocialLoading(provider);
    setError("");
    try { await signInWithProvider(provider); }
    catch (e: any) { setError(e.message ?? "Erreur."); setSocialLoading(null); }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "signup" && step === "email") { setStep("signup-details"); return; }
    setEmailLoading(true);
    try {
      if (mode === "login") { await signInWithEmail(email, password); goHome(); }
      else {
        await signUpWithEmail(email, password, { full_name: fullName, username });
        setSuccess(true);
        // Check if session was created (email confirm disabled) or not
        const user = await getSession();
        if (user) {
          setTimeout(goHome, 800);
        }
        // If email confirm required, success screen stays with instructions
      }
    } catch (e: any) {
      const m = e.message ?? "";
      if (m.includes("Invalid login") || m.includes("invalid_credentials")) setError("Email ou mot de passe incorrect.");
      else if (m.includes("already registered") || m.includes("already exists") || m.includes("User already registered")) setError("Cet email est déjà utilisé.");
      else if (m.includes("Password") || m.includes("password")) setError("Mot de passe trop court (6 caractères minimum).");
      else setError(m || "Erreur. Réessaie.");
    } finally { setEmailLoading(false); }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPhoneLoading(true);
    try { await signInWithPhone(phone); setStep("phone-otp"); }
    catch { setError("Impossible d'envoyer le SMS. Vérifie le numéro."); }
    finally { setPhoneLoading(false); }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits]; next[i] = val; setOtpDigits(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) return;
    setPhoneLoading(true); setError("");
    try { await verifyPhoneOtp(phone, code); setSuccess(true); setTimeout(goHome, 1200); }
    catch { setError("Code incorrect ou expiré."); }
    finally { setPhoneLoading(false); }
  };

  const switchMode = (m: Mode) => {
    setMode(m); setStep("main"); setError("");
    setEmail(""); setPassword(""); setFullName(""); setUsername("");
    setOtpDigits(["", "", "", "", "", ""]);
  };

  const goBack = () => {
    setError("");
    if (step === "signup-details") setStep("email");
    else if (step === "phone-otp") setStep("phone-input");
    else setStep("main");
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="relative flex min-h-[100dvh] w-full items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0" style={{ background: GRADIENTS[0] }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center">
            <Check className="w-9 h-9 text-[#8B5CF6]" />
          </div>
          <p className="text-2xl font-black text-white">Bienvenue !</p>
          <p className="text-white/40 text-sm">Redirection en cours…</p>
        <p className="text-white/25 text-xs text-center px-8">Si rien ne se passe, vérifie ton email pour confirmer ton compte.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-black"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease" }}
    >
      {/* Background */}
      <BackgroundCarousel onIndexChange={setCarouselIdx} />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-4">

        {/* Tagline + dots */}
        <div className="mb-5 px-1">
          <h1 className="text-[42px] font-black leading-[1.02] tracking-tight text-white drop-shadow-lg">
            Vends vite.<br />
            <span className="bg-gradient-to-r from-[#A78BFA] via-[#A78BFA] to-[#fb923c] bg-clip-text text-transparent">
              Achète malin.
            </span>
          </h1>
          <p className="mt-2 text-[14px] text-white/50">
            La marketplace mode qui cartonne en France.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/8 border border-white/10">
              <span className="text-[11px] font-bold text-white/80">+50 000</span>
              <span className="text-[10px] text-white/35">membres</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/8 border border-white/10">
              <span className="text-yellow-400 text-[11px]">★</span>
              <span className="text-[11px] font-bold text-white/80">4.8</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/12 border border-emerald-500/20">
              <span className="text-[10px] text-emerald-400">●</span>
              <span className="text-[11px] font-bold text-emerald-300/90">Virements rapides</span>
            </div>
          </div>

          <div className="mt-3.5">
            <SlideDots count={IMAGES.length} active={carouselIdx} />
          </div>
        </div>

        {/* ── AUTH CARD ──────────────────────────────────────────────────────── */}
        <div
          className="rounded-[28px] border border-white/8 p-5"
          style={{
            background: "rgba(10, 10, 16, 0.88)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}
        >
          {/* Tabs */}
          {step === "main" && (
            <div className="mb-4 flex rounded-2xl bg-white/5 p-1">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                    mode === m ? "bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25" : "text-white/35 hover:text-white/60"
                  }`}
                >
                  {m === "login" ? "Connexion" : "Inscription"}
                </button>
              ))}
            </div>
          )}

          {/* Back */}
          {step !== "main" && (
            <button onClick={goBack} className="mb-4 flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="mb-3 flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 px-3.5 py-3 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="flex-1 text-[13px] text-red-300 leading-relaxed">{error}</p>
              <button onClick={clearError} className="text-red-400/50 hover:text-red-400 flex-shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ── STEP: main ──────────────────────────────────────────────────── */}
          {step === "main" && (
            <div className="flex flex-col gap-2.5 animate-fadeIn">
              <div className="flex gap-2">
                <SocialBtn icon={<GoogleIcon />} label="Google" loading={socialLoading === "google"} onClick={() => handleSocial("google")} />
              </div>

              <OrSep />

              <button
                onClick={() => setStep("email")}
                className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-[13px] text-white/70 transition-all hover:bg-white/8 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white/35" />
                  <span>Continuer avec l&apos;email</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/25" />
              </button>

              <button
                onClick={() => setStep("phone-input")}
                className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-[13px] text-white/70 transition-all hover:bg-white/8 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white/35" />
                  <span>Continuer avec le téléphone</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/25" />
              </button>

              <p className="pt-1 text-center text-[11px] text-white/20 leading-relaxed">
                En continuant tu acceptes nos{" "}
                <span className="text-white/40 underline underline-offset-2 cursor-pointer">CGU</span>{" "}
                et notre{" "}
                <span className="text-white/40 underline underline-offset-2 cursor-pointer">Politique de confidentialité</span>
              </p>
            </div>
          )}

          {/* ── STEP: email ─────────────────────────────────────────────────── */}
          {(step === "email" || step === "signup-details") && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3 animate-fadeIn">
              {step === "email" && (
                <>
                  <DarkInput type="email" placeholder="ton@email.com" value={email} onChange={setEmail}
                    leftIcon={<Mail className="w-4 h-4" />} autoComplete="email" />
                  <DarkInput
                    type={showPwd ? "text" : "password"}
                    placeholder={mode === "login" ? "Mot de passe" : "Mot de passe (6 car. min.)"}
                    value={password} onChange={setPassword}
                    leftIcon={<Lock className="w-4 h-4" />}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    rightIcon={
                      <button type="button" onClick={() => setShowPwd((v) => !v)} className="p-0.5">
                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                </>
              )}
              {step === "signup-details" && (
                <>
                  <DarkInput type="text" placeholder="Prénom Nom" value={fullName} onChange={setFullName}
                    leftIcon={<User className="w-4 h-4" />} autoComplete="name" />
                  <DarkInput type="text" placeholder="@pseudo" value={username}
                    onChange={(v) => setUsername(v.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
                    leftIcon={<span className="text-sm font-bold">@</span>} />
                </>
              )}
              <PrimaryBtn loading={emailLoading}>
                {mode === "login" ? "Se connecter" : step === "email" ? "Continuer" : "Créer mon compte"}
                <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </form>
          )}

          {/* ── STEP: phone ──────────────────────────────────────────────────── */}
          {step === "phone-input" && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-3 animate-fadeIn">
              <p className="text-[12px] text-white/35 mb-0.5">Format international (+33 6…)</p>
              <DarkInput type="tel" placeholder="+33 6 12 34 56 78" value={phone} onChange={setPhone}
                leftIcon={<Phone className="w-4 h-4" />} autoComplete="tel" inputMode="tel" />
              <PrimaryBtn loading={phoneLoading}>
                Recevoir le code SMS <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </form>
          )}

          {/* ── STEP: OTP ────────────────────────────────────────────────────── */}
          {step === "phone-otp" && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 animate-fadeIn">
              <p className="text-[12px] text-white/35 text-center">
                Code envoyé au <span className="text-white/60 font-medium">{phone}</span>
              </p>
              <div className="flex gap-2 justify-center">
                {otpDigits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i-1]?.focus(); }}
                    className="h-[52px] w-11 rounded-2xl border border-white/10 bg-white/7 text-center text-xl font-bold text-white outline-none transition-all focus:border-[#8B5CF6]/60 focus:bg-white/12 caret-transparent"
                  />
                ))}
              </div>
              <PrimaryBtn loading={phoneLoading}>
                Vérifier <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
              <button type="button" onClick={() => { setStep("phone-input"); setOtpDigits(["","","","","",""]); }}
                className="text-center text-[12px] text-white/30 hover:text-white/55 transition-colors">
                Renvoyer le code
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}