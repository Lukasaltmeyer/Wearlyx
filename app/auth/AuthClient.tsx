"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Phone,
  ArrowRight,
  ChevronLeft,
  Check,
  X,
  AlertCircle,
  Mail,
  User,
  MapPin,
  Hash,
} from "lucide-react";
import {
  signInWithProvider,
  signInWithEmailOtp,
  verifyEmailOtp,
  signInWithPhone,
  verifyPhoneOtp,
  updateProfile,
  getSession,
  hasCompletedProfile,
} from "@/lib/auth";

// ─── Background carousel ──────────────────────────────────────────────────────
const IMAGES = ["/auth-bg/1.jpg", "/auth-bg/2.jpg", "/auth-bg/3.jpg", "/auth-bg/4.jpg", "/auth-bg/5.jpg", "/auth-bg/6.jpg"];
const GRADIENTS = [
  "linear-gradient(160deg, #1a0533 0%, #3b0764 35%, #1e1b4b 70%, #0a0a14 100%)",
  "linear-gradient(160deg, #0f172a 0%, #1e1b4b 40%, #4c1d95 80%, #0a0a14 100%)",
  "linear-gradient(160deg, #18181b 0%, #2d1b69 45%, #7c3aed 85%, #0a0a14 100%)",
  "linear-gradient(160deg, #0a0a14 0%, #1a0533 50%, #6d28d9 90%, #18181b 100%)",
  "linear-gradient(160deg, #14001f 0%, #4a044e 45%, #8B5CF6 85%, #0a0a14 100%)",
  "linear-gradient(160deg, #0a0a14 0%, #1e1b4b 40%, #5b21b6 75%, #2d1b69 100%)",
];
const INTERVAL = 4500;

function BackgroundCarousel({ onIndexChange }: { onIndexChange: (i: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const cb = useCallback(onIndexChange, [onIndexChange]);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % IMAGES.length;
        setPrev(i);
        cb(next);
        setTimeout(() => setPrev(null), 1200);
        return next;
      });
    }, INTERVAL);
    return () => clearInterval(t);
  }, [cb]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {IMAGES.map((src, i) => (
        <div key={src} className="absolute inset-0 transition-opacity ease-in-out"
          style={{ opacity: i === idx ? 1 : 0, transitionDuration: i === idx ? "1200ms" : "800ms", zIndex: i === idx ? 2 : i === prev ? 1 : 0 }}>
          <div className="absolute inset-0" style={{ background: GRADIENTS[i] }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover object-center" loading={i === 0 ? "eager" : "lazy"} />
        </div>
      ))}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
    </div>
  );
}

function SlideDots({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-full bg-white transition-all duration-500"
          style={{ width: i === active ? 20 : 5, height: 5, opacity: i === active ? 0.9 : 0.3 }} />
      ))}
    </div>
  );
}

function DarkInput({ type = "text", placeholder, value, onChange, leftIcon, autoComplete, inputMode, maxLength }: {
  type?: string; placeholder: string; value: string; onChange: (v: string) => void;
  leftIcon: React.ReactNode; autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; maxLength?: number;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 px-4 py-4 transition-all focus-within:border-[#8B5CF6]/50 focus-within:bg-white/10">
      <span className="text-white/35 flex-shrink-0 transition-colors group-focus-within:text-[#A78BFA]">{leftIcon}</span>
      <input type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete} inputMode={inputMode} maxLength={maxLength}
        className="flex-1 bg-transparent text-[15px] text-white placeholder-white/30 outline-none" />
    </div>
  );
}

function PrimaryBtn({ children, loading, disabled, type = "submit", onClick }: {
  children: React.ReactNode; loading?: boolean; disabled?: boolean;
  type?: "submit" | "button"; onClick?: () => void;
}) {
  return (
    <button type={type} disabled={loading || disabled} onClick={onClick}
      className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-[0.97] disabled:opacity-50"
      style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)", boxShadow: "0 4px 20px rgba(139,92,246,0.35)" }}>
      {loading
        ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        : children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 px-3.5 py-3 animate-fadeIn">
      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-[13px] text-red-300 leading-relaxed">{message}</p>
      <button onClick={onDismiss} className="text-red-400/50 hover:text-red-400 flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// "Stay logged in" toast
function StayLoggedInToast({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slideUp max-w-[500px] mx-auto">
      <div className="rounded-2xl border border-white/10 px-4 py-3.5 flex items-center gap-3"
        style={{ background: "rgba(20,20,30,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(139,92,246,0.15)" }}>
          <Check className="w-4 h-4 text-[#A78BFA]" />
        </div>
        <p className="flex-1 text-[13px] text-white/80 font-medium">
          Rester connecté sur cet appareil ?
        </p>
        <div className="flex gap-2">
          <button onClick={onNo}
            className="px-3 py-1.5 rounded-xl text-[12px] font-semibold text-white/40 border border-white/10 active:scale-95 transition-all">
            Non
          </button>
          <button onClick={onYes}
            className="px-3 py-1.5 rounded-xl text-[12px] font-semibold text-white"
            style={{ background: "#8B5CF6" }}>
            Oui
          </button>
        </div>
      </div>
    </div>
  );
}

type ContactMethod = "email" | "phone";
type Step = "main" | "contact" | "otp" | "profile" | "done";

// ─── Main component ───────────────────────────────────────────────────────────
export default function AuthClient() {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>("main");
  const [method, setMethod] = useState<ContactMethod>("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showStayLoggedIn, setShowStayLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Contact step
  const [contact, setContact] = useState("");

  // OTP step
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Profile step
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    getSession().then((user) => {
      if (user) window.location.replace("/");
      else setTimeout(() => setVisible(true), 80);
    });
  }, []);

  const goHome = () => { window.location.replace("/"); };

  // ── Step: main ────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    try { await signInWithProvider("google"); }
    catch (e: any) { setError(e.message ?? "Erreur Google."); setGoogleLoading(false); }
  };

  // ── Step: contact (send OTP) ───────────────────────────────────────────────
  const handleSendOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setLoading(true);
    setError("");
    try {
      if (method === "email") {
        await signInWithEmailOtp(contact.trim());
      } else {
        await signInWithPhone(contact.trim());
      }
      setStep("otp");
    } catch (e: any) {
      const m = e.message ?? "";
      if (m.includes("rate") || m.includes("limit")) setError("Trop de tentatives. Attends quelques secondes.");
      else setError(method === "email" ? "Impossible d'envoyer le code. Vérifie l'email." : "Impossible d'envoyer le SMS. Vérifie le numéro.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step: OTP (verify) ────────────────────────────────────────────────────
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits];
    next[i] = val;
    setOtpDigits(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleVerifyOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) return;
    setLoading(true);
    setError("");
    try {
      let user;
      if (method === "email") {
        user = await verifyEmailOtp(contact.trim(), code);
      } else {
        user = await verifyPhoneOtp(contact.trim(), code);
      }
      if (user) {
        setUserId(user.id);
        const profileDone = await hasCompletedProfile(user.id);
        if (profileDone) {
          setStep("done");
          setShowStayLoggedIn(true);
        } else {
          setStep("profile");
        }
      }
    } catch {
      setError("Code incorrect ou expiré. Réessaie.");
      setOtpDigits(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ── Step: profile ─────────────────────────────────────────────────────────
  const handleProfileSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !username.trim() || !city.trim() || !postalCode.trim()) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    if (username.length < 3) {
      setError("Le pseudo doit faire au moins 3 caractères.");
      return;
    }
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      await updateProfile(userId, {
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        username: username.trim().toLowerCase(),
        city: city.trim(),
        postal_code: postalCode.trim(),
      });
      setStep("done");
      setShowStayLoggedIn(true);
    } catch (e: any) {
      const m = e.message ?? "";
      if (m.includes("unique") || m.includes("duplicate")) setError("Ce pseudo est déjà pris.");
      else setError("Erreur lors de la sauvegarde. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const handleStayLoggedIn = (stay: boolean) => {
    if (!stay) {
      // Set short-lived session preference (non-blocking)
      try { localStorage.setItem("wlx_persist", "0"); } catch { /* ignore */ }
    }
    setShowStayLoggedIn(false);
    goHome();
  };

  const goBack = () => {
    setError("");
    if (step === "otp") { setStep("contact"); setOtpDigits(["", "", "", "", "", ""]); }
    else if (step === "profile") setStep("otp");
    else setStep("main");
  };

  // ── Done screen ───────────────────────────────────────────────────────────
  if (step === "done" && !showStayLoggedIn) {
    return (
      <div className="relative flex min-h-[100dvh] w-full items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0" style={{ background: GRADIENTS[0] }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
            <Check className="w-9 h-9 text-[#8B5CF6]" />
          </div>
          <p className="text-2xl font-black text-white">Bienvenue !</p>
          <p className="text-white/40 text-sm">Redirection en cours…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-black"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}>

      {/* Stay logged in toast */}
      {showStayLoggedIn && (
        <StayLoggedInToast onYes={() => handleStayLoggedIn(true)} onNo={() => handleStayLoggedIn(false)} />
      )}

      {/* Background */}
      <BackgroundCarousel onIndexChange={setCarouselIdx} />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-5">

        {/* Tagline */}
        <div className="mb-5 px-1">
          <h1 className="text-[42px] font-black leading-[1.02] tracking-tight text-white drop-shadow-lg">
            Vends vite.<br />
            <span style={{ background: "linear-gradient(90deg, #A78BFA, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Achète malin.
            </span>
          </h1>
          <p className="mt-2 text-[14px] text-white/50">La marketplace mode qui cartonne en France.</p>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/8 border border-white/10">
              <span className="text-[11px] font-bold text-white/80">+50 000</span>
              <span className="text-[10px] text-white/35">membres</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/8 border border-white/10">
              <span className="text-yellow-400 text-[11px]">★</span>
              <span className="text-[11px] font-bold text-white/80">4.8</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <span className="text-[10px] text-[#A78BFA]">●</span>
              <span className="text-[11px] font-bold text-[#C4B5FD]">Virements rapides</span>
            </div>
          </div>

          <div className="mt-3.5"><SlideDots count={IMAGES.length} active={carouselIdx} /></div>
        </div>

        {/* ── AUTH CARD ──────────────────────────────────────────────────────── */}
        <div className="rounded-[28px] border border-white/8 p-5"
          style={{ background: "rgba(8,8,14,0.92)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)" }}>

          {/* Back button */}
          {step !== "main" && (
            <button onClick={goBack} className="mb-4 flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
          )}

          {/* Error */}
          {error && <div className="mb-3"><ErrorBanner message={error} onDismiss={() => setError("")} /></div>}

          {/* ── MAIN ──────────────────────────────────────────────────────────── */}
          {step === "main" && (
            <div className="flex flex-col gap-3 animate-fadeIn">
              {/* Google */}
              <button type="button" disabled={googleLoading} onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 rounded-2xl py-4 text-[14px] font-bold text-white border border-white/12 bg-white/8 transition-all active:scale-[0.97] hover:bg-white/12 disabled:opacity-50">
                {googleLoading
                  ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  : <><GoogleIcon /><span>Continuer avec Google</span></>}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[11px] font-semibold text-white/25 tracking-widest">OU</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Email / Phone */}
              <button type="button" onClick={() => { setMethod("email"); setStep("contact"); setContact(""); }}
                className="w-full flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-[13px] text-white/70 transition-all hover:bg-white/8 active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white/35" />
                  <span>Continuer avec l&apos;email</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/25" />
              </button>

              <button type="button" onClick={() => { setMethod("phone"); setStep("contact"); setContact(""); }}
                className="w-full flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-[13px] text-white/70 transition-all hover:bg-white/8 active:scale-[0.98]">
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

          {/* ── CONTACT INPUT ─────────────────────────────────────────────────── */}
          {step === "contact" && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-3 animate-fadeIn">
              <div className="mb-1">
                <p className="text-[16px] font-bold text-white mb-0.5">
                  {method === "email" ? "Ton adresse email" : "Ton numéro de téléphone"}
                </p>
                <p className="text-[12px] text-white/35">
                  {method === "email"
                    ? "On t'envoie un code de connexion"
                    : "Format international (+33 6…)"}
                </p>
              </div>

              <DarkInput
                type={method === "email" ? "email" : "tel"}
                placeholder={method === "email" ? "ton@email.com" : "+33 6 12 34 56 78"}
                value={contact}
                onChange={setContact}
                leftIcon={method === "email" ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                autoComplete={method === "email" ? "email" : "tel"}
                inputMode={method === "email" ? "email" : "tel"}
              />

              <PrimaryBtn loading={loading} disabled={!contact.trim()}>
                Recevoir le code <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </form>
          )}

          {/* ── OTP VERIFY ────────────────────────────────────────────────────── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 animate-fadeIn">
              <div className="mb-1">
                <p className="text-[16px] font-bold text-white mb-0.5">Entre le code</p>
                <p className="text-[12px] text-white/35">
                  Code envoyé à <span className="text-white/60 font-semibold">{contact}</span>
                </p>
              </div>

              <div className="flex gap-2 justify-center">
                {otpDigits.map((d, i) => (
                  <input key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i - 1]?.focus(); }}
                    className="h-[52px] w-11 rounded-2xl border border-white/10 bg-white/7 text-center text-xl font-bold text-white outline-none transition-all focus:border-[#8B5CF6]/60 focus:bg-white/12 caret-transparent"
                  />
                ))}
              </div>

              <PrimaryBtn loading={loading} disabled={otpDigits.join("").length < 6}>
                Vérifier <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>

              <button type="button" onClick={() => { setStep("contact"); setOtpDigits(["", "", "", "", "", ""]); }}
                className="text-center text-[12px] text-white/30 hover:text-white/55 transition-colors">
                Renvoyer le code
              </button>
            </form>
          )}

          {/* ── PROFILE COMPLETION ────────────────────────────────────────────── */}
          {step === "profile" && (
            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-3 animate-fadeIn">
              <div className="mb-1">
                <p className="text-[16px] font-bold text-white mb-0.5">Complète ton profil</p>
                <p className="text-[12px] text-white/35">Quelques infos pour finaliser ton compte</p>
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

              <DarkInput placeholder="@pseudo (unique)" value={username}
                onChange={(v) => setUsername(v.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
                leftIcon={<span className="text-sm font-bold text-white/35">@</span>} />

              <DarkInput placeholder="Ville" value={city} onChange={setCity}
                leftIcon={<MapPin className="w-4 h-4" />} autoComplete="address-level2" />

              <DarkInput placeholder="Code postal" value={postalCode} onChange={setPostalCode}
                leftIcon={<Hash className="w-4 h-4" />} autoComplete="postal-code"
                inputMode="numeric" maxLength={5} />

              <PrimaryBtn loading={loading}
                disabled={!firstName.trim() || !username.trim() || !city.trim() || !postalCode.trim()}>
                Créer mon compte <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
