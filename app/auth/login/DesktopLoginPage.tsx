"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Mail, Lock, Eye, EyeOff, Phone, ArrowRight, Zap, Check,
} from "lucide-react";
import { signInWithProvider, signInWithEmail, sendPasswordReset, signInWithPhone, verifyPhoneOtp } from "@/lib/auth";
import { GoogleIcon } from "../_components/AuthUI";

type Step = "main" | "email" | "phone" | "phone-otp" | "forgot" | "forgot-sent";

export function DesktopLoginPage() {
  const [step, setStep] = useState<Step>("main");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState(["","","","","",""]);
  const otpRefs = useRef<(HTMLInputElement|null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setGoogleLoading(true); setError("");
    try { await signInWithProvider("google"); }
    catch (e:any) { setError(e?.message??"Erreur"); setGoogleLoading(false); }
  };
  const handleEmail = async (e:React.SyntheticEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await signInWithEmail(email, password); }
    catch (e:any) { setError(e?.message??"Erreur"); setLoading(false); }
  };
  const handleForgot = async (e:React.SyntheticEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await sendPasswordReset(forgotEmail); setStep("forgot-sent"); }
    catch (e:any) { setError(e?.message??"Erreur"); }
    finally { setLoading(false); }
  };
  const handlePhone = async (e:React.SyntheticEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await signInWithPhone(phone); setStep("phone-otp"); }
    catch (e:any) { setError(e?.message??"Erreur"); }
    finally { setLoading(false); }
  };
  const handleOtp = async (e:React.SyntheticEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await verifyPhoneOtp(phone, otpDigits.join("")); }
    catch (e:any) { setError(e?.message??"Erreur"); setLoading(false); }
  };
  const handleOtpChange = (i:number, v:string) => {
    if (!/^\d*$/.test(v)) return;
    const d=[...otpDigits]; d[i]=v.slice(-1); setOtpDigits(d);
    if (v && i<5) otpRefs.current[i+1]?.focus();
  };

  return (
    <>
      <style>{`
        @keyframes orb-float-a {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(24px,-18px) scale(1.06); }
          66%      { transform: translate(-14px,20px) scale(0.95); }
        }
        @keyframes orb-float-b {
          0%,100% { transform: translate(0,0) scale(1); }
          40%      { transform: translate(-20px,12px) scale(1.04); }
          75%      { transform: translate(16px,-10px) scale(0.97); }
        }
        @keyframes orb-float-c {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(8px,-14px); }
        }
        @keyframes shimmer-sweep {
          0%   { background-position: -220% 0; }
          100% { background-position: 220% 0; }
        }
        @keyframes grain-drift {
          0%,100% { transform: translate(0,0); }
          25%      { transform: translate(-1%,-1%); }
          50%      { transform: translate(1%,0); }
          75%      { transform: translate(0,1%); }
        }
        .login-orb-a { animation: orb-float-a 48s ease-in-out infinite; }
        .login-orb-b { animation: orb-float-b 60s ease-in-out infinite; }
        .login-orb-c { animation: orb-float-c 34s ease-in-out infinite; }
        .shimmer-heading {
          background: linear-gradient(100deg, #c4b5fd 0%, #ffffff 30%, #a78bfa 60%, #c4b5fd 100%);
          background-size: 220% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-sweep 5s linear infinite;
        }
        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 14px;
          color: white;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.22); }
        .login-input:hover {
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.055);
        }
        .login-input:focus {
          border-color: rgba(139,92,246,0.6);
          background: rgba(139,92,246,0.06);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.12), 0 1px 0 rgba(255,255,255,0.06) inset;
        }
        .login-method-btn {
          transition: background 0.18s, border-color 0.18s, box-shadow 0.18s, transform 0.15s;
        }
        .login-method-btn:hover {
          background: rgba(255,255,255,0.065) !important;
          border-color: rgba(255,255,255,0.14) !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        }
        .login-method-btn:active { transform: scale(0.98); }
      `}</style>

      <div
        className="min-h-[100dvh] w-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 50% 0%, #0d0520 0%, #07030f 40%, #030008 100%)" }}
      >
        {/* ── Layered cinematic atmosphere ── */}

        {/* Core violet halo behind hero */}
        <div className="absolute pointer-events-none login-orb-a"
          style={{
            top: "0%", left: "50%", transform: "translateX(-50%)",
            width: "90vw", height: "75vh",
            background: "radial-gradient(ellipse at 50% 30%, rgba(100,40,240,0.18) 0%, rgba(72,20,180,0.08) 38%, transparent 65%)",
            filter: "blur(70px)",
          }} />

        {/* Right-side light source */}
        <div className="absolute pointer-events-none login-orb-b"
          style={{
            top: "-10%", right: "-8%",
            width: "42vw", height: "75vh",
            background: "radial-gradient(circle, rgba(109,40,217,0.14) 0%, rgba(76,29,149,0.06) 45%, transparent 65%)",
            filter: "blur(90px)",
          }} />

        {/* Bottom-left fill light */}
        <div className="absolute pointer-events-none login-orb-c"
          style={{
            bottom: "-5%", left: "-6%",
            width: "36vw", height: "60vh",
            background: "radial-gradient(circle, rgba(67,20,149,0.10) 0%, transparent 65%)",
            filter: "blur(80px)",
          }} />

        {/* Rim light — very subtle top edge */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.18) 30%, rgba(167,139,250,0.28) 50%, rgba(139,92,246,0.18) 70%, transparent 100%)",
          }} />

        {/* Subtle grid — masked to centre */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(124,58,237,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.028) 1px, transparent 1px)",
            backgroundSize: "88px 88px",
            maskImage: "radial-gradient(ellipse 70% 55% at 50% 30%, black 20%, transparent 75%)",
          }} />

        {/* Film grain layer */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.028, mixBlendMode: "overlay" }}>
          <svg width="100%" height="100%">
            <filter id="grain-lg">
              <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain-lg)" />
          </svg>
        </div>

        {/* ── Content — centred column ── */}
        <div className="relative z-10 flex flex-col items-center text-center w-full px-8"
          style={{ maxWidth: 560 }}>

          {/* Logo — text only, no icon */}
          <div className="mb-8">
            <span className="text-[24px] font-black tracking-tight select-none" style={{ letterSpacing: "-0.03em" }}>
              <span className="text-white">Wear</span>
              <span style={{
                background: "linear-gradient(135deg, #C4B5FD 0%, #A78BFA 50%, #7C3AED 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>lyx</span>
            </span>
          </div>

          {/* Badge */}
          <div className="mb-7 flex items-center gap-2 px-3.5 py-1.5 rounded-full"
            style={{
              background: "rgba(124,58,237,0.09)",
              border: "1px solid rgba(124,58,237,0.22)",
              boxShadow: "0 0 20px rgba(124,58,237,0.08) inset",
            }}>
            <Zap className="w-3 h-3 text-[#A78BFA]" strokeWidth={2.5} />
            <span className="text-[10.5px] font-black text-[#C4B5FD] tracking-[0.16em] uppercase">Marketplace Mode · France</span>
          </div>

          {/* Hero title */}
          <h1 className="font-black text-white leading-[1.08] mb-4"
            style={{ fontSize: "clamp(40px,5.2vw,66px)", letterSpacing: "-0.03em" }}>
            Le futur de<br />
            <span className="shimmer-heading">la seconde main.</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-10 leading-relaxed"
            style={{
              fontSize: "clamp(14px,1.15vw,15.5px)",
              color: "rgba(255,255,255,0.40)",
              maxWidth: 360,
              letterSpacing: "0.01em",
            }}>
            Achète et vends des pièces de mode en quelques secondes grâce à l'intelligence artificielle.
          </p>

          {/* ── Login card ── */}
          <div className="w-full rounded-[24px] overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.11)",
              backdropFilter: "blur(48px) saturate(200%)",
              WebkitBackdropFilter: "blur(48px) saturate(200%)",
              boxShadow: [
                "0 32px 80px rgba(0,0,0,0.65)",
                "0 1px 0 rgba(255,255,255,0.08) inset",
                "0 -1px 0 rgba(0,0,0,0.2) inset",
                "0 0 0 1px rgba(139,92,246,0.06) inset",
              ].join(", "),
              padding: "28px 28px 24px",
            }}>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-[14px] text-[13px] text-red-300 text-center"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.16)" }}>
                {error}
              </div>
            )}

            {/* ── MAIN step ── */}
            {step === "main" && (
              <div className="flex flex-col gap-3">

                {/* Google */}
                <button onClick={handleGoogle} disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-[14px] text-[14px] font-bold text-white transition-all active:scale-[.98] disabled:opacity-60"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.13)",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.11)";
                    el.style.borderColor = "rgba(255,255,255,0.18)";
                    el.style.boxShadow = "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 24px rgba(0,0,0,0.3)";
                    el.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.07)";
                    el.style.borderColor = "rgba(255,255,255,0.13)";
                    el.style.boxShadow = "0 1px 0 rgba(255,255,255,0.06) inset";
                    el.style.transform = "";
                  }}>
                  {googleLoading
                    ? <span className="w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    : <><GoogleIcon /><span>Continuer avec Google</span></>}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3.5 my-0.5">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <span className="text-[11px] font-semibold tracking-widest" style={{ color: "rgba(255,255,255,0.18)" }}>OU</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                </div>

                {/* Email method */}
                <button onClick={() => { setStep("email"); setError(""); }}
                  className="login-method-btn w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[14px]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>
                  <div className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <Mail className="w-[16px] h-[16px]" style={{ color: "rgba(255,255,255,0.55)" }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-bold text-white">Email</p>
                    <p className="text-[11.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.32)" }}>Connexion par mot de passe</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.22)" }} />
                </button>

                {/* Phone method */}
                <button onClick={() => { setStep("phone"); setError(""); }}
                  className="login-method-btn w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[14px]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>
                  <div className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <Phone className="w-[16px] h-[16px]" style={{ color: "rgba(255,255,255,0.55)" }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-bold text-white">Téléphone</p>
                    <p className="text-[11.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.32)" }}>Connexion par SMS</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.22)" }} />
                </button>

                {/* Create account */}
                <p className="text-center text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.28)" }}>
                  Pas encore de compte ?{" "}
                  <Link href="/auth/register"
                    className="font-bold transition-colors"
                    style={{ color: "#A78BFA" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#C4B5FD"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}>
                    Créer un compte
                  </Link>
                </p>
              </div>
            )}

            {/* ── EMAIL step ── */}
            {step === "email" && (
              <form onSubmit={handleEmail} className="flex flex-col gap-3">
                <button type="button" onClick={() => { setStep("main"); setError(""); }}
                  className="text-left text-[12px] mb-1 transition-colors"
                  style={{ color: "rgba(255,255,255,0.32)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.32)"; }}>
                  ← Retour
                </button>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,0.28)" }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="Email"
                    className="login-input"
                    style={{ paddingLeft: 44 }} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,0.28)" }} />
                  <input type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Mot de passe"
                    className="login-input"
                    style={{ paddingLeft: 44, paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "rgba(255,255,255,0.28)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.28)"; }}>
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button type="button" onClick={() => { setStep("forgot"); setForgotEmail(email); setError(""); }}
                  className="text-right text-[12px] font-semibold transition-colors -mt-1"
                  style={{ color: "#A78BFA" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#C4B5FD"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}>
                  Mot de passe oublié ?
                </button>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-[14px] text-[14px] font-black text-white transition-all active:scale-[.98] disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
                    boxShadow: "0 8px 28px rgba(124,58,237,0.35), 0 1px 0 rgba(255,255,255,0.12) inset",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(124,58,237,0.5), 0 1px 0 rgba(255,255,255,0.14) inset"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(124,58,237,0.35), 0 1px 0 rgba(255,255,255,0.12) inset"; (e.currentTarget as HTMLElement).style.transform = ""; }}>
                  {loading ? <span className="inline-block w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Se connecter →"}
                </button>
              </form>
            )}

            {/* ── FORGOT step ── */}
            {step === "forgot" && (
              <form onSubmit={handleForgot} className="flex flex-col gap-3">
                <button type="button" onClick={() => { setStep("email"); setError(""); }}
                  className="text-left text-[12px] mb-1 transition-colors"
                  style={{ color: "rgba(255,255,255,0.32)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.32)"; }}>
                  ← Retour
                </button>
                <p className="text-[13.5px] text-center mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Entrez votre email pour réinitialiser votre mot de passe.
                </p>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,0.28)" }} />
                  <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required
                    placeholder="Email"
                    className="login-input"
                    style={{ paddingLeft: 44 }} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-[14px] text-[14px] font-black text-white transition-all active:scale-[.98] disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow: "0 8px 28px rgba(124,58,237,0.35), 0 1px 0 rgba(255,255,255,0.12) inset" }}>
                  {loading ? <span className="inline-block w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Envoyer le lien →"}
                </button>
              </form>
            )}

            {/* ── FORGOT SENT step ── */}
            {step === "forgot-sent" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-14 h-14 rounded-[18px] flex items-center justify-center"
                  style={{
                    background: "rgba(16,185,129,0.10)",
                    border: "1px solid rgba(16,185,129,0.22)",
                    boxShadow: "0 0 28px rgba(16,185,129,0.10) inset",
                  }}>
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-[16px] font-black text-white">Email envoyé !</p>
                <p className="text-[13px] text-center leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                  Vérifie ta boîte mail pour réinitialiser ton mot de passe.
                </p>
                <button onClick={() => setStep("main")}
                  className="text-[13px] font-semibold transition-colors"
                  style={{ color: "#A78BFA" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#C4B5FD"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}>
                  Retour à la connexion
                </button>
              </div>
            )}

            {/* ── PHONE step ── */}
            {step === "phone" && (
              <form onSubmit={handlePhone} className="flex flex-col gap-3">
                <button type="button" onClick={() => { setStep("main"); setError(""); }}
                  className="text-left text-[12px] mb-1 transition-colors"
                  style={{ color: "rgba(255,255,255,0.32)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.32)"; }}>
                  ← Retour
                </button>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,0.28)" }} />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                    placeholder="+33 6 12 34 56 78"
                    className="login-input"
                    style={{ paddingLeft: 44 }} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-[14px] text-[14px] font-black text-white transition-all active:scale-[.98] disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow: "0 8px 28px rgba(124,58,237,0.35), 0 1px 0 rgba(255,255,255,0.12) inset" }}>
                  {loading ? <span className="inline-block w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Envoyer le SMS →"}
                </button>
              </form>
            )}

            {/* ── PHONE OTP step ── */}
            {step === "phone-otp" && (
              <form onSubmit={handleOtp} className="flex flex-col gap-4">
                <button type="button" onClick={() => { setStep("phone"); setError(""); }}
                  className="text-left text-[12px] transition-colors"
                  style={{ color: "rgba(255,255,255,0.32)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.32)"; }}>
                  ← Retour
                </button>
                <p className="text-[13.5px] text-center" style={{ color: "rgba(255,255,255,0.50)" }}>
                  Code envoyé au {phone}
                </p>
                <div className="flex gap-2.5 justify-center">
                  {otpDigits.map((d, i) => (
                    <input key={i} type="text" inputMode="numeric" maxLength={1} value={d}
                      ref={el => { otpRefs.current[i] = el; }}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => { if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i-1]?.focus(); }}
                      className="login-input text-center text-[20px] font-black caret-transparent"
                      style={{ width: 44, height: 52, padding: 0, textAlign: "center" }} />
                  ))}
                </div>
                <button type="submit" disabled={loading || otpDigits.join("").length < 6}
                  className="w-full py-3.5 rounded-[14px] text-[14px] font-black text-white transition-all active:scale-[.98] disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow: "0 8px 28px rgba(124,58,237,0.35), 0 1px 0 rgba(255,255,255,0.12) inset" }}>
                  {loading ? <span className="inline-block w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Vérifier →"}
                </button>
              </form>
            )}
          </div>

          {/* ── Stats strip ── */}
          <div className="flex items-center justify-center gap-0 mt-8 flex-wrap">
            {[
              { value: "50 000+", label: "membres" },
              { value: "1 200",   label: "ventes / jour" },
              { value: "4.8 ★",   label: "satisfaction" },
              { value: "32 000+", label: "articles" },
            ].map(({ value, label }, i) => (
              <span key={label} className="flex items-center whitespace-nowrap">
                {i > 0 && (
                  <span className="mx-4" style={{ color: "rgba(255,255,255,0.12)", fontSize: 13 }}>|</span>
                )}
                <span style={{ fontSize: 12.5, fontWeight: 800, color: "rgba(255,255,255,0.55)" }}>{value}</span>
                <span className="ml-1" style={{ fontSize: 12, color: "rgba(255,255,255,0.22)" }}>{label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
