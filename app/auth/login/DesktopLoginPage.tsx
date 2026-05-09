"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Mail, Lock, Eye, EyeOff, Phone, ArrowRight,
  Star, Zap, Check,
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
        @keyframes orb1{0%,100%{transform:translate(0,0) scale(1);}45%{transform:translate(28px,-20px) scale(1.07);}75%{transform:translate(-16px,22px) scale(.94);}}
        @keyframes orb2{0%,100%{transform:translate(0,0) scale(1);}38%{transform:translate(-22px,14px) scale(1.05);}72%{transform:translate(18px,-12px) scale(.96);}}
        @keyframes orb3{0%,100%{transform:translate(0,0);}50%{transform:translate(10px,-16px);}}
        @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
        .aorb1{animation:orb1 44s ease-in-out infinite;}
        .aorb2{animation:orb2 56s ease-in-out infinite;}
        .aorb3{animation:orb3 32s ease-in-out infinite;}
        .shimmer-text{background:linear-gradient(90deg,#c4b5fd,#fff,#a78bfa,#c4b5fd);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite;}
        input::placeholder{color:rgba(255,255,255,.20);}
      `}</style>

      <div
        className="min-h-[100dvh] w-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "#020007" }}
      >
        {/* Atmosphere orbs — sized for full desktop screen */}
        <div className="absolute pointer-events-none aorb1"
          style={{ top:"5%", left:"50%", transform:"translateX(-50%)", width:"80vw", height:"70vh",
            background:"radial-gradient(ellipse at 50% 35%, rgba(88,28,220,.15) 0%, rgba(67,20,180,.05) 42%, transparent 68%)",
            filter:"blur(80px)" }} />
        <div className="absolute pointer-events-none aorb2"
          style={{ top:"-15%", right:"-5%", width:"40vw", height:"70vh",
            background:"radial-gradient(circle, rgba(109,40,217,.12) 0%, transparent 60%)",
            filter:"blur(100px)" }} />
        <div className="absolute pointer-events-none aorb3"
          style={{ bottom:"0%", left:"-5%", width:"35vw", height:"60vh",
            background:"radial-gradient(circle, rgba(76,29,149,.10) 0%, transparent 65%)",
            filter:"blur(80px)" }} />

        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:"linear-gradient(rgba(124,58,237,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.025) 1px,transparent 1px)", backgroundSize:"80px 80px", maskImage:"radial-gradient(ellipse at 50% 30%, black 30%, transparent 70%)" }} />

        {/* Content — centered column, comfortably sized for desktop */}
        <div className="relative z-10 flex flex-col items-center text-center w-full px-8"
          style={{ maxWidth: 580 }}>

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow:"0 0 20px rgba(124,58,237,.45)" }}>
              <Star className="w-4.5 h-4.5 text-white fill-white" />
            </div>
            <span className="text-[22px] font-black text-white tracking-tight">
              Wear<span style={{ color:"#A78BFA" }}>lyx</span>
            </span>
          </div>

          {/* Badge */}
          <div className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background:"rgba(124,58,237,.10)", border:"1px solid rgba(124,58,237,.22)" }}>
            <Zap className="w-3 h-3 text-[#A78BFA]" />
            <span className="text-[11px] font-black text-[#A78BFA] tracking-widest uppercase">Marketplace Mode · France</span>
          </div>

          {/* Title */}
          <h1 className="font-black text-white leading-tight mb-3"
            style={{ fontSize:"clamp(38px,5vw,62px)", letterSpacing:"-0.02em" }}>
            Le futur de<br />
            <span className="shimmer-text">la seconde main.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/45 mb-8 leading-relaxed"
            style={{ fontSize:"clamp(14px,1.2vw,16px)", maxWidth:380 }}>
            Achète et vends des pièces de mode en quelques<br />secondes grâce à l'intelligence artificielle.
          </p>

          {/* Login block */}
          <div className="w-full rounded-2xl overflow-hidden"
            style={{
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.10)",
              backdropFilter:"blur(32px) saturate(160%)",
              boxShadow:"0 20px 60px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.07)",
              padding:"28px",
            }}>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl text-[13px] text-red-300 text-center"
                style={{ background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.18)" }}>
                {error}
              </div>
            )}

            {/* MAIN step */}
            {step === "main" && (
              <div className="flex flex-col gap-3">
                {/* Google */}
                <button onClick={handleGoogle} disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[14px] font-bold text-white transition-all active:scale-[.98] disabled:opacity-60"
                  style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.12)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.08)";}}>
                  {googleLoading
                    ? <span className="w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    : <><GoogleIcon /> Continuer avec Google</>}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,.08)" }} />
                  <span className="text-[12px] text-white/20 font-medium">ou</span>
                  <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,.08)" }} />
                </div>

                {/* Email method */}
                <button onClick={() => { setStep("email"); setError(""); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.07)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.04)";}}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background:"rgba(255,255,255,0.07)" }}>
                    <Mail className="w-4 h-4 text-white/60" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-bold text-white">Email</p>
                    <p className="text-[12px] text-white/35">Connexion par mot de passe</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/25" />
                </button>

                {/* Phone method */}
                <button onClick={() => { setStep("phone"); setError(""); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.07)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.04)";}}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background:"rgba(255,255,255,0.07)" }}>
                    <Phone className="w-4 h-4 text-white/60" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-bold text-white">Téléphone</p>
                    <p className="text-[12px] text-white/35">Connexion par SMS</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/25" />
                </button>

                {/* Create account */}
                <p className="text-center text-[13px] text-white/30 mt-1">
                  Pas encore de compte ?{" "}
                  <Link href="/auth/register" className="font-bold transition-colors" style={{ color:"#A78BFA" }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#C4B5FD";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="#A78BFA";}}>
                    Créer un compte
                  </Link>
                </p>
              </div>
            )}

            {/* EMAIL step */}
            {step === "email" && (
              <form onSubmit={handleEmail} className="flex flex-col gap-3">
                <button type="button" onClick={() => { setStep("main"); setError(""); }}
                  className="text-left text-[12px] text-white/35 hover:text-white/60 transition-colors mb-1">
                  ← Retour
                </button>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-[14px] text-white outline-none focus:border-[#8B5CF6]/50 transition-colors" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type={showPwd?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required
                    placeholder="Mot de passe"
                    className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-white/5 border border-white/10 text-[14px] text-white outline-none focus:border-[#8B5CF6]/50 transition-colors" />
                  <button type="button" onClick={()=>setShowPwd(v=>!v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button type="button" onClick={() => { setStep("forgot"); setForgotEmail(email); setError(""); }}
                  className="text-right text-[12px] transition-colors -mt-1" style={{ color:"#A78BFA" }}>
                  Mot de passe oublié ?
                </button>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl text-[14px] font-black text-white transition-all active:scale-[.98] disabled:opacity-60"
                  style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow:"0 6px 20px rgba(124,58,237,.30)" }}>
                  {loading ? <span className="inline-block w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Se connecter →"}
                </button>
              </form>
            )}

            {/* FORGOT step */}
            {step === "forgot" && (
              <form onSubmit={handleForgot} className="flex flex-col gap-3">
                <button type="button" onClick={() => { setStep("email"); setError(""); }}
                  className="text-left text-[12px] text-white/35 hover:text-white/60 transition-colors mb-1">
                  ← Retour
                </button>
                <p className="text-[14px] text-white/60 text-center mb-2">Entrez votre email pour réinitialiser votre mot de passe.</p>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="email" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} required
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-[14px] text-white outline-none focus:border-[#8B5CF6]/50 transition-colors" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl text-[14px] font-black text-white transition-all active:scale-[.98] disabled:opacity-60"
                  style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow:"0 6px 20px rgba(124,58,237,.30)" }}>
                  {loading ? <span className="inline-block w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Envoyer le lien →"}
                </button>
              </form>
            )}

            {/* FORGOT SENT step */}
            {step === "forgot-sent" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background:"rgba(16,185,129,.12)", border:"1px solid rgba(16,185,129,.2)" }}>
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-[15px] font-bold text-white">Email envoyé !</p>
                <p className="text-[13px] text-white/40 text-center">Vérifie ta boîte mail pour réinitialiser ton mot de passe.</p>
                <button onClick={() => setStep("main")} className="text-[13px] font-semibold transition-colors" style={{ color:"#A78BFA" }}>
                  Retour à la connexion
                </button>
              </div>
            )}

            {/* PHONE step */}
            {step === "phone" && (
              <form onSubmit={handlePhone} className="flex flex-col gap-3">
                <button type="button" onClick={() => { setStep("main"); setError(""); }}
                  className="text-left text-[12px] text-white/35 hover:text-white/60 transition-colors mb-1">
                  ← Retour
                </button>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} required
                    placeholder="+33 6 12 34 56 78"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-[14px] text-white outline-none focus:border-[#8B5CF6]/50 transition-colors" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl text-[14px] font-black text-white transition-all active:scale-[.98] disabled:opacity-60"
                  style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow:"0 6px 20px rgba(124,58,237,.30)" }}>
                  {loading ? <span className="inline-block w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Envoyer le SMS →"}
                </button>
              </form>
            )}

            {/* PHONE OTP step */}
            {step === "phone-otp" && (
              <form onSubmit={handleOtp} className="flex flex-col gap-4">
                <button type="button" onClick={() => { setStep("phone"); setError(""); }}
                  className="text-left text-[12px] text-white/35 hover:text-white/60 transition-colors">
                  ← Retour
                </button>
                <p className="text-[14px] text-white/60 text-center">Code envoyé au {phone}</p>
                <div className="flex gap-2 justify-center">
                  {otpDigits.map((d, i) => (
                    <input key={i} type="text" inputMode="numeric" maxLength={1} value={d}
                      ref={el => { otpRefs.current[i] = el; }}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => { if (e.key==="Backspace" && !d && i>0) otpRefs.current[i-1]?.focus(); }}
                      className="w-11 h-13 text-center text-[20px] font-black text-white rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#8B5CF6]/50 transition-colors"
                      style={{ height:52 }} />
                  ))}
                </div>
                <button type="submit" disabled={loading || otpDigits.join("").length < 6}
                  className="w-full py-3.5 rounded-xl text-[14px] font-black text-white transition-all active:scale-[.98] disabled:opacity-60"
                  style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow:"0 6px 20px rgba(124,58,237,.30)" }}>
                  {loading ? <span className="inline-block w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Vérifier →"}
                </button>
              </form>
            )}
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-0 mt-8 flex-wrap justify-center"
            style={{ color:"rgba(255,255,255,.25)", fontSize:13 }}>
            {[
              { value:"50 000+", label:"membres" },
              { value:"1 200",   label:"ventes / jour" },
              { value:"4.8 ★",   label:"satisfaction" },
              { value:"32 000+", label:"articles" },
            ].map(({ value, label }, i) => (
              <span key={label} className="flex items-center gap-0 whitespace-nowrap">
                {i > 0 && <span className="mx-4 opacity-30">|</span>}
                <span className="font-black text-white/60">{value}</span>
                <span className="ml-1 text-white/25">{label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
