"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Mail, Lock, Eye, EyeOff, Phone, ArrowRight,
  Sparkles, Shield, Zap, Package, Users, CheckCircle, Star,
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
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setGoogleLoading(true); setError("");
    try { await signInWithProvider("google"); }
    catch (e: any) { setError(e?.message ?? "Erreur"); setGoogleLoading(false); }
  };
  const handleEmail = async (e: React.SyntheticEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await signInWithEmail(email, password); }
    catch (e: any) { setError(e?.message ?? "Erreur"); setLoading(false); }
  };
  const handleForgot = async (e: React.SyntheticEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await sendPasswordReset(forgotEmail); setStep("forgot-sent"); }
    catch (e: any) { setError(e?.message ?? "Erreur"); }
    finally { setLoading(false); }
  };
  const handlePhone = async (e: React.SyntheticEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await signInWithPhone(phone); setStep("phone-otp"); }
    catch (e: any) { setError(e?.message ?? "Erreur"); }
    finally { setLoading(false); }
  };
  const handleOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await verifyPhoneOtp(phone, otpDigits.join("")); }
    catch (e: any) { setError(e?.message ?? "Erreur"); setLoading(false); }
  };
  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const d = [...otpDigits]; d[i] = v.slice(-1);
    setOtpDigits(d);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  return (
    <>
      <style>{`
        @keyframes breathe1 {
          0%,100% { transform:translate(0,0) scale(1);    opacity:.9; }
          40%      { transform:translate(22px,-16px) scale(1.06); opacity:1; }
          70%      { transform:translate(-12px,18px) scale(.95); opacity:.85; }
        }
        @keyframes breathe2 {
          0%,100% { transform:translate(0,0) scale(1);    opacity:.85; }
          35%      { transform:translate(-18px,12px) scale(1.05); opacity:1; }
          70%      { transform:translate(14px,-10px) scale(.96); opacity:.9; }
        }
        @keyframes breathe3 {
          0%,100% { transform:translate(0,0); opacity:.8; }
          50%      { transform:translate(8px,-14px); opacity:1; }
        }
        @keyframes ring-pulse {
          0%,100% { opacity:.07; }
          50%      { opacity:.16; }
        }
        @keyframes title-glow {
          0%,100% { filter:drop-shadow(0 0 0px rgba(139,92,246,0)); }
          50%      { filter:drop-shadow(0 0 22px rgba(139,92,246,.22)); }
        }
        .anim-breathe1 { animation: breathe1 26s ease-in-out infinite; }
        .anim-breathe2 { animation: breathe2 32s ease-in-out infinite; }
        .anim-breathe3 { animation: breathe3 18s ease-in-out infinite; }
        .anim-ring     { animation: ring-pulse 7s ease-in-out infinite; }
        .anim-title-glow { animation: title-glow 6s ease-in-out infinite; }
        .input-field::placeholder { color: rgba(255,255,255,0.20); }
      `}</style>

      {/* ═══ PAGE SHELL — flex column so bottom bar sits under hero+panel ═══ */}
      <div className="min-h-[100dvh] w-full flex flex-col" style={{ background: "#020007" }}>

        {/* ── TOP ROW: hero + login panel ── */}
        <div className="flex flex-1 min-h-0">

          {/* ════════════════════════════════
              LEFT — Immersive brand stage
          ════════════════════════════════ */}
          <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col">

            {/* Atmosphere glows */}
            <div className="absolute pointer-events-none anim-breathe1"
              style={{ top:"40%", left:"46%", transform:"translate(-50%,-50%)",
                width:520, height:520,
                background:"radial-gradient(circle, rgba(88,28,220,.12) 0%, rgba(67,20,180,.04) 42%, transparent 68%)",
                filter:"blur(52px)" }} />
            <div className="absolute pointer-events-none anim-breathe2"
              style={{ top:"-12%", right:"-10%", width:360, height:360,
                background:"radial-gradient(circle, rgba(109,40,217,.13) 0%, transparent 58%)",
                filter:"blur(64px)" }} />
            <div className="absolute pointer-events-none anim-breathe3"
              style={{ bottom:"-10%", left:"-8%", width:300, height:300,
                background:"radial-gradient(circle, rgba(76,29,149,.09) 0%, transparent 62%)",
                filter:"blur(58px)" }} />

            {/* Concentric rings — small, pulsing */}
            <div className="absolute pointer-events-none rounded-full anim-ring"
              style={{ top:"50%", left:"45%", transform:"translate(-50%,-50%)",
                width:300, height:300, border:"1px solid rgba(124,58,237,.9)" }} />
            <div className="absolute pointer-events-none rounded-full"
              style={{ top:"50%", left:"45%", transform:"translate(-50%,-50%)",
                width:188, height:188, border:"1px solid rgba(139,92,246,.08)" }} />
            <div className="absolute pointer-events-none rounded-full"
              style={{ top:"50%", left:"45%", transform:"translate(-50%,-50%)",
                width:100, height:100, border:"1px solid rgba(167,139,250,.11)" }} />

            {/* Floating micro orbs */}
            <div className="absolute pointer-events-none rounded-full anim-breathe2"
              style={{ top:"14%", right:"16%", width:72, height:72,
                background:"radial-gradient(circle at 35% 30%, rgba(124,58,237,.15) 0%, transparent 70%)",
                border:"1px solid rgba(167,139,250,.08)", backdropFilter:"blur(4px)" }} />
            <div className="absolute pointer-events-none rounded-full anim-breathe3"
              style={{ bottom:"20%", left:"18%", width:40, height:40,
                background:"radial-gradient(circle, rgba(109,40,217,.13) 0%, transparent 70%)",
                border:"1px solid rgba(139,92,246,.07)" }} />

            {/* Glowing dots */}
            <div className="absolute pointer-events-none rounded-full"
              style={{ top:"27%", left:"22%", width:5, height:5,
                background:"rgba(167,139,250,.55)",
                boxShadow:"0 0 10px 3px rgba(124,58,237,.30)" }} />
            <div className="absolute pointer-events-none rounded-full"
              style={{ bottom:"32%", right:"22%", width:3, height:3,
                background:"rgba(139,92,246,.6)",
                boxShadow:"0 0 8px 2px rgba(109,40,217,.26)" }} />

            {/* Cinematic horizontal line */}
            <div className="absolute pointer-events-none"
              style={{ top:"53%", left:"5%", right:"5%", height:1,
                background:"linear-gradient(90deg,transparent,rgba(124,58,237,.09) 28%,rgba(167,139,250,.14) 50%,rgba(124,58,237,.09) 72%,transparent)" }} />

            {/* Edge fades */}
            <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
              style={{ background:"linear-gradient(to top,#020007,transparent)" }} />
            <div className="absolute top-0 right-0 bottom-0 w-20 pointer-events-none"
              style={{ background:"linear-gradient(to left,#020007,transparent)" }} />

            {/* Logo */}
            <div className="relative z-10 px-14 pt-11 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow:"0 0 18px rgba(124,58,237,.40)" }}>
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="text-[20px] font-black text-white tracking-tight">
                  Wear<span style={{ color:"#A78BFA" }}>lyx</span>
                </span>
              </div>
            </div>

            {/* Hero — centred, shifted up */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-14 text-center"
              style={{ paddingBottom:"6vh" }}>

              {/* Ambient glow behind hero text */}
              <div className="absolute pointer-events-none"
                style={{ top:"50%", left:"50%", transform:"translate(-50%,-56%)",
                  width:500, height:220,
                  background:"radial-gradient(ellipse, rgba(88,28,220,.09) 0%, transparent 68%)",
                  filter:"blur(32px)" }} />

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-9"
                style={{ background:"rgba(124,58,237,.08)", border:"1px solid rgba(124,58,237,.19)" }}>
                <Sparkles className="w-3 h-3 text-[#A78BFA]" />
                <span className="text-[11px] font-semibold text-[#C4B5FD] tracking-[0.14em] uppercase">
                  Marketplace mode · France
                </span>
              </div>

              {/* Title */}
              <h1 className="font-black text-white tracking-tight leading-[1.04] mb-6"
                style={{ fontSize:"clamp(44px,4.2vw,66px)", maxWidth:620 }}>
                Le futur de<br />
                {/* Glow wrapper around gradient text */}
                <span className="relative inline-block anim-title-glow">
                  <span className="absolute pointer-events-none"
                    style={{ inset:"-16px -24px",
                      background:"radial-gradient(ellipse, rgba(139,92,246,.18) 0%, transparent 68%)",
                      filter:"blur(18px)" }} />
                  <span style={{
                    background:"linear-gradient(95deg,#E4DAFF 0%,#C4B5FD 38%,#A78BFA 68%,#7C3AED 100%)",
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                    position:"relative",
                  }}>
                    la seconde main.
                  </span>
                </span>
              </h1>

              {/* Subtitle — white cassé plus lisible */}
              <p className="leading-relaxed mb-0" style={{
                fontSize:16, maxWidth:420,
                color:"rgba(255,255,255,.52)",
                fontWeight:400,
              }}>
                Achète et vends des pièces de mode en quelques secondes grâce à l'intelligence artificielle.
              </p>
            </div>
          </div>

          {/* ════════════════════════════════
              RIGHT — Auth panel (glassmorphism)
          ════════════════════════════════ */}
          <div className="w-full lg:w-[460px] xl:w-[500px] flex-shrink-0 flex items-center justify-center relative"
            style={{
              background:"rgba(6,2,16,.80)",
              backdropFilter:"blur(40px) saturate(160%)",
              borderLeft:"1px solid rgba(255,255,255,.055)",
              boxShadow:"-40px 0 100px rgba(0,0,0,.55)",
            }}>

            {/* Left ambient bleed */}
            <div className="absolute left-0 top-0 bottom-0 w-36 pointer-events-none"
              style={{ background:"linear-gradient(to right,rgba(88,28,220,.04),transparent)" }} />

            {/* Top + bottom accent lines */}
            <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
              style={{ background:"linear-gradient(90deg,transparent 5%,rgba(124,58,237,.32) 50%,transparent 95%)" }} />
            <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
              style={{ background:"linear-gradient(90deg,transparent 20%,rgba(124,58,237,.10) 50%,transparent 80%)" }} />

            <div className="relative z-10 w-full px-10 py-10 max-w-[400px]">

              {step !== "main" && (
                <button onClick={() => setStep("main")}
                  className="flex items-center gap-1.5 text-[13px] mb-8 transition-colors"
                  style={{ color:"rgba(255,255,255,.28)" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.60)"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.28)"}}>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Retour
                </button>
              )}

              {/* ── MAIN ── */}
              {step === "main" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-[28px] font-black text-white tracking-tight mb-2 leading-tight">Bon retour !</h2>
                    <p className="text-[13.5px] leading-relaxed" style={{ color:"rgba(255,255,255,.38)" }}>
                      Connecte-toi pour accéder à ton compte.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* Google — premium */}
                    <button onClick={handleGoogle} disabled={googleLoading}
                      className="w-full flex items-center justify-center gap-3 rounded-2xl text-[14px] font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
                      style={{
                        padding:"13px 20px",
                        background:"rgba(255,255,255,.065)",
                        border:"1px solid rgba(255,255,255,.10)",
                        color:"rgba(255,255,255,.80)",
                        backdropFilter:"blur(8px)",
                        boxShadow:"0 1px 0 rgba(255,255,255,.06) inset",
                      }}
                      onMouseEnter={e=>{
                        const el=e.currentTarget as HTMLElement;
                        el.style.background="rgba(255,255,255,.095)";
                        el.style.borderColor="rgba(255,255,255,.16)";
                        el.style.transform="translateY(-1px)";
                        el.style.boxShadow="0 10px 28px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.08) inset";
                      }}
                      onMouseLeave={e=>{
                        const el=e.currentTarget as HTMLElement;
                        el.style.background="rgba(255,255,255,.065)";
                        el.style.borderColor="rgba(255,255,255,.10)";
                        el.style.transform="";
                        el.style.boxShadow="0 1px 0 rgba(255,255,255,.06) inset";
                      }}>
                      {googleLoading
                        ? <span className="rounded-full border-2 border-white/30 border-t-white animate-spin" style={{width:18,height:18}} />
                        : <><GoogleIcon /><span>Continuer avec Google</span></>}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3" style={{ margin:"2px 0" }}>
                      <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,.055)" }} />
                      <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color:"rgba(255,255,255,.14)" }}>ou</span>
                      <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,.055)" }} />
                    </div>

                    <MethodBtn icon={<Mail className="w-4 h-4"/>} label="Email" sub="Connexion par mot de passe" onClick={()=>setStep("email")} />
                    <MethodBtn icon={<Phone className="w-4 h-4"/>} label="Téléphone" sub="Connexion par SMS" onClick={()=>setStep("phone")} />
                  </div>

                  {error && <p className="mt-4 text-[13px] text-red-400 text-center">{error}</p>}

                  {/* Benefits micro grid */}
                  <div className="mt-6 grid grid-cols-2 gap-1.5">
                    {[
                      {icon:Zap,    text:"Vends en 10s avec l'IA"},
                      {icon:Shield, text:"Paiements sécurisés"},
                      {icon:Package,text:"32K+ articles"},
                      {icon:Users,  text:"+50K membres"},
                    ].map(({icon:Icon,text})=>(
                      <div key={text} className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                        style={{ background:"rgba(255,255,255,.018)", border:"1px solid rgba(255,255,255,.04)" }}>
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color:"#8B5CF6" }} />
                        <span className="text-[11px] font-medium" style={{ color:"rgba(255,255,255,.28)" }}>{text}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-[12.5px] mt-5" style={{ color:"rgba(255,255,255,.18)" }}>
                    Pas encore de compte ?{" "}
                    <Link href="/auth/signup" className="font-semibold transition-colors" style={{ color:"#A78BFA" }}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#C4B5FD"}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="#A78BFA"}}>
                      Créer un compte
                    </Link>
                  </p>
                </div>
              )}

              {/* ── EMAIL ── */}
              {step === "email" && (
                <div>
                  <StepHead icon={<Mail className="w-5 h-5 text-[#A78BFA]"/>} title="Connexion par email" sub="Entre ton adresse et ton mot de passe." />
                  <form onSubmit={handleEmail} className="flex flex-col gap-3">
                    <Field type="email" placeholder="Adresse email" value={email} onChange={setEmail} icon={<Mail className="w-4 h-4"/>} />
                    <div className="relative">
                      <Field type={showPwd?"text":"password"} placeholder="Mot de passe" value={password} onChange={setPassword} icon={<Lock className="w-4 h-4"/>} />
                      <button type="button" onClick={()=>setShowPwd(v=>!v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color:"rgba(255,255,255,.24)" }}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.55)"}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.24)"}}>
                        {showPwd?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                      </button>
                    </div>
                    {error && <p className="text-[13px] text-red-400">{error}</p>}
                    <Btn loading={loading}>Se connecter</Btn>
                    <button type="button" onClick={()=>setStep("forgot")}
                      className="text-[12px] transition-colors text-center pt-1"
                      style={{ color:"rgba(255,255,255,.20)" }}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#A78BFA"}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.20)"}}>
                      Mot de passe oublié ?
                    </button>
                  </form>
                </div>
              )}

              {/* ── PHONE ── */}
              {step === "phone" && (
                <div>
                  <StepHead icon={<Phone className="w-5 h-5 text-[#A78BFA]"/>} title="Par téléphone" sub="On t'envoie un code par SMS." />
                  <form onSubmit={handlePhone} className="flex flex-col gap-3">
                    <Field type="tel" placeholder="+33 6 00 00 00 00" value={phone} onChange={setPhone} icon={<Phone className="w-4 h-4"/>} />
                    {error && <p className="text-[13px] text-red-400">{error}</p>}
                    <Btn loading={loading}>Envoyer le code</Btn>
                  </form>
                </div>
              )}

              {/* ── OTP ── */}
              {step === "phone-otp" && (
                <div>
                  <StepHead icon={<Sparkles className="w-5 h-5 text-[#A78BFA]"/>} title="Code de vérification" sub={`Code envoyé au ${phone}.`} />
                  <form onSubmit={handleOtp} className="flex flex-col gap-6">
                    <div className="flex gap-2">
                      {otpDigits.map((d,i)=>(
                        <input key={i} ref={el=>{otpRefs.current[i]=el;}}
                          type="text" inputMode="numeric" maxLength={1} value={d}
                          onChange={e=>handleOtpChange(i,e.target.value)}
                          onKeyDown={e=>{if(e.key==="Backspace"&&!d&&i>0)otpRefs.current[i-1]?.focus();}}
                          className="h-14 flex-1 rounded-2xl text-center text-xl font-black text-white outline-none transition-all caret-transparent"
                          style={{
                            background:d?"rgba(124,58,237,.18)":"rgba(255,255,255,.05)",
                            border:d?"1px solid rgba(124,58,237,.50)":"1px solid rgba(255,255,255,.08)",
                          }} />
                      ))}
                    </div>
                    {error && <p className="text-[13px] text-red-400 text-center">{error}</p>}
                    <Btn loading={loading}>Vérifier</Btn>
                  </form>
                </div>
              )}

              {/* ── FORGOT ── */}
              {step === "forgot" && (
                <div>
                  <StepHead icon={<Lock className="w-5 h-5 text-[#A78BFA]"/>} title="Mot de passe oublié" sub="On t'envoie un lien de réinitialisation." />
                  <form onSubmit={handleForgot} className="flex flex-col gap-3">
                    <Field type="email" placeholder="Ton adresse email" value={forgotEmail} onChange={setForgotEmail} icon={<Mail className="w-4 h-4"/>} />
                    {error && <p className="text-[13px] text-red-400">{error}</p>}
                    <Btn loading={loading}>Envoyer le lien</Btn>
                  </form>
                </div>
              )}

              {/* ── FORGOT SENT ── */}
              {step === "forgot-sent" && (
                <div>
                  <div className="rounded-2xl flex items-center justify-center mb-6"
                    style={{ width:52, height:52, background:"rgba(16,185,129,.09)", border:"1px solid rgba(16,185,129,.20)" }}>
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h2 className="text-[26px] font-black text-white tracking-tight mb-2">Email envoyé !</h2>
                  <p className="text-[14px] mb-8 leading-relaxed" style={{ color:"rgba(255,255,255,.32)" }}>
                    Vérifie ta boîte mail et clique sur le lien pour réinitialiser ton mot de passe.
                  </p>
                  <button onClick={()=>setStep("main")}
                    className="flex items-center gap-1.5 text-[13.5px] font-semibold transition-colors"
                    style={{ color:"#A78BFA" }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#C4B5FD"}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="#A78BFA"}}>
                    Retour à la connexion <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            BOTTOM BAR — full width, stats + perks
        ════════════════════════════════════════════════════ */}
        <div className="hidden lg:flex items-center justify-between px-14 py-5 flex-shrink-0"
          style={{
            background:"rgba(255,255,255,.012)",
            borderTop:"1px solid rgba(255,255,255,.05)",
            backdropFilter:"blur(20px)",
          }}>

          {/* Stats */}
          <div className="flex items-center gap-10">
            {[
              { value:"50K+",  label:"membres" },
              { value:"1.2K",  label:"ventes / jour" },
              { value:"4.8 ★", label:"satisfaction" },
            ].map(({value,label})=>(
              <div key={label} className="flex items-baseline gap-2">
                <span className="text-[15px] font-black tracking-tight" style={{ color:"rgba(255,255,255,.60)" }}>
                  {value}
                </span>
                <span className="text-[11px]" style={{ color:"rgba(255,255,255,.20)" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Divider dot */}
          <div className="w-1 h-1 rounded-full" style={{ background:"rgba(255,255,255,.12)" }} />

          {/* Perks */}
          <div className="flex items-center gap-2.5">
            {[
              { icon:Zap,    text:"Vends en 10s avec l'IA" },
              { icon:Shield, text:"Paiements sécurisés" },
              { icon:Users,  text:"+50 000 membres" },
            ].map(({icon:Icon,text})=>(
              <div key={text}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-default"
                style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.055)" }}
                onMouseEnter={e=>{
                  const el=e.currentTarget as HTMLElement;
                  el.style.background="rgba(124,58,237,.07)";
                  el.style.borderColor="rgba(124,58,237,.18)";
                }}
                onMouseLeave={e=>{
                  const el=e.currentTarget as HTMLElement;
                  el.style.background="rgba(255,255,255,.025)";
                  el.style.borderColor="rgba(255,255,255,.055)";
                }}>
                <Icon className="w-3 h-3" style={{ color:"#8B5CF6" }} />
                <span className="text-[11.5px] font-medium" style={{ color:"rgba(255,255,255,.36)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Reusables ── */
function StepHead({icon,title,sub}:{icon:React.ReactNode;title:string;sub:string}) {
  return (
    <div className="mb-8">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5"
        style={{ background:"rgba(124,58,237,.10)", border:"1px solid rgba(124,58,237,.18)" }}>
        {icon}
      </div>
      <h2 className="text-[26px] font-black text-white tracking-tight mb-1.5">{title}</h2>
      <p className="text-[13.5px]" style={{ color:"rgba(255,255,255,.32)" }}>{sub}</p>
    </div>
  );
}

function MethodBtn({icon,label,sub,onClick}:{icon:React.ReactNode;label:string;sub:string;onClick:()=>void}) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-left transition-all"
      style={{ background:"rgba(255,255,255,.028)", border:"1px solid rgba(255,255,255,.07)", backdropFilter:"blur(8px)" }}
      onMouseEnter={e=>{
        const el=e.currentTarget as HTMLElement;
        el.style.background="rgba(124,58,237,.07)";
        el.style.borderColor="rgba(124,58,237,.24)";
        el.style.transform="translateY(-1px)";
        el.style.boxShadow="0 8px 24px rgba(0,0,0,.28)";
      }}
      onMouseLeave={e=>{
        const el=e.currentTarget as HTMLElement;
        el.style.background="rgba(255,255,255,.028)";
        el.style.borderColor="rgba(255,255,255,.07)";
        el.style.transform="";
        el.style.boxShadow="";
      }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background:"rgba(255,255,255,.05)", color:"rgba(255,255,255,.38)" }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[13.5px] font-semibold" style={{ color:"rgba(255,255,255,.68)" }}>{label}</p>
        <p className="text-[11px]" style={{ color:"rgba(255,255,255,.24)" }}>{sub}</p>
      </div>
      <ArrowRight className="w-3.5 h-3.5" style={{ color:"rgba(255,255,255,.13)" }} />
    </button>
  );
}

function Field({type="text",placeholder,value,onChange,icon}:{
  type?:string;placeholder:string;value:string;
  onChange:(v:string)=>void;icon?:React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl transition-all"
      style={{
        padding:"15px 16px",
        background:"rgba(255,255,255,.038)",
        border:"1px solid rgba(255,255,255,.08)",
        backdropFilter:"blur(8px)",
      }}
      onFocus={e=>{
        const el=e.currentTarget as HTMLElement;
        el.style.borderColor="rgba(124,58,237,.52)";
        el.style.background="rgba(124,58,237,.06)";
        el.style.boxShadow="0 0 0 3px rgba(124,58,237,.09)";
      }}
      onBlur={e=>{
        const el=e.currentTarget as HTMLElement;
        el.style.borderColor="rgba(255,255,255,.08)";
        el.style.background="rgba(255,255,255,.038)";
        el.style.boxShadow="";
      }}>
      {icon && <span className="flex-shrink-0" style={{ color:"rgba(255,255,255,.26)" }}>{icon}</span>}
      <input type={type} placeholder={placeholder} value={value}
        onChange={e=>onChange(e.target.value)}
        className="input-field flex-1 bg-transparent text-[14.5px] text-white outline-none"
        style={{ caretColor:"#A78BFA" }} />
    </div>
  );
}

function Btn({children,loading}:{children:React.ReactNode;loading?:boolean}) {
  return (
    <button type="submit" disabled={loading}
      className="w-full flex items-center justify-center gap-2 rounded-2xl text-[14.5px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 mt-1"
      style={{
        padding:"14px 20px",
        background:"linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%)",
        boxShadow:"0 4px 22px rgba(124,58,237,.32), inset 0 1px 0 rgba(255,255,255,.13)",
      }}
      onMouseEnter={e=>{
        const el=e.currentTarget as HTMLElement;
        el.style.boxShadow="0 10px 36px rgba(124,58,237,.50), inset 0 1px 0 rgba(255,255,255,.16)";
        el.style.transform="translateY(-1px)";
      }}
      onMouseLeave={e=>{
        const el=e.currentTarget as HTMLElement;
        el.style.boxShadow="0 4px 22px rgba(124,58,237,.32), inset 0 1px 0 rgba(255,255,255,.13)";
        el.style.transform="";
      }}>
      {loading
        ? <span className="rounded-full border-2 border-white/30 border-t-white animate-spin" style={{width:20,height:20}} />
        : children}
    </button>
  );
}
