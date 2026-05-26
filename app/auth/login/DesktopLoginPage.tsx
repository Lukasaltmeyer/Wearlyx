"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Mail, Lock, Eye, EyeOff, Phone, ArrowRight,
  Sparkles, Check,
} from "lucide-react";
import { signInWithProvider, signInWithEmail, sendPasswordReset, signInWithPhone, verifyPhoneOtp } from "@/lib/auth";
import { GoogleIcon } from "../_components/AuthUI";
import { LandingSections } from "../_components/LandingSections";

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

  const Spinner = () => <span className="inline-block w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />;
  const Back = ({ to }: { to: Step }) => (
    <button type="button" onClick={() => { setStep(to); setError(""); }}
      className="text-[12px] text-white/30 hover:text-white/60 transition-colors mb-2 block">
      ← Retour
    </button>
  );

  return (
    <div style={{ background: "#07070A", overflowX: "hidden" }}>
      <style>{`
        .li{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:14px 16px;font-size:15px;color:white;outline:none;transition:all .2s;}
        .li::placeholder{color:rgba(255,255,255,0.25);}
        .li:hover{border-color:rgba(255,255,255,0.16);background:rgba(255,255,255,0.07);}
        .li:focus{border-color:rgba(139,92,246,0.65);background:rgba(139,92,246,0.07);box-shadow:0 0 0 3px rgba(139,92,246,0.14);}
        .li-w{position:relative;display:flex;align-items:center;}
        .li-w svg.ico{position:absolute;left:15px;width:16px;height:16px;color:rgba(255,255,255,0.28);pointer-events:none;}
        .li-w .li{padding-left:44px;}
        .li-w .eye{position:absolute;right:15px;color:rgba(255,255,255,0.28);background:none;border:none;cursor:pointer;display:flex;padding:0;}
        .li-w .eye:hover{color:rgba(255,255,255,0.6);}
        .pbtn{width:100%;padding:15px;border-radius:14px;font-size:15px;font-weight:900;color:white;background:linear-gradient(135deg,#7C3AED,#5B21B6);box-shadow:0 8px 28px rgba(124,58,237,0.4);transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;}
        .pbtn:hover{box-shadow:0 12px 36px rgba(124,58,237,0.55);transform:translateY(-1px);}
        .pbtn:active{transform:scale(0.98);}
        .pbtn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
        .mbtn{width:100%;display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);transition:all .18s;cursor:pointer;}
        .mbtn:hover{background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.15);transform:translateY(-1px);}
        .mbtn:active{transform:scale(0.98);}
        .otp-row{display:flex;gap:10px;justify-content:center;}
        .otp-cell{width:52px;height:60px;text-align:center;font-size:24px;font-weight:900;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:14px;color:white;outline:none;transition:all .2s;}
        .otp-cell:focus{border-color:rgba(139,92,246,0.65);box-shadow:0 0 0 3px rgba(139,92,246,0.14);}
      `}</style>

      {/* ══════════════════════════════════════════════════════════
          HERO — pleine largeur
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">

        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)", width:800, height:800, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%)", filter:"blur(80px)" }} />
          <div style={{ position:"absolute", bottom:"-10%", left:"20%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 65%)", filter:"blur(100px)" }} />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">

          {/* Logo */}
          <Link href="/" className="text-[26px] font-black tracking-tight mb-10">
            <span className="text-white">Wear</span>
            <span style={{ background:"linear-gradient(135deg,#C4B5FD,#8B5CF6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>lyx</span>
          </Link>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background:"rgba(139,92,246,0.12)", border:"1px solid rgba(139,92,246,0.28)" }}>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[12px] font-bold text-purple-300 uppercase tracking-[0.18em]">Marketplace Mode IA · France</span>
          </div>

          {/* Headline */}
          <h1 className="font-black text-center leading-[1.05] tracking-tight mb-5 text-white" style={{ fontSize:"clamp(42px,5vw,72px)" }}>
            Le futur de<br />
            <span style={{ background:"linear-gradient(135deg,#8B5CF6,#C4B5FD)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              la seconde main.
            </span>
          </h1>

          <p className="text-center text-[16px] text-white/40 mb-10 max-w-[480px] leading-relaxed">
            Achète et vends des pièces de mode en quelques secondes grâce à l&apos;intelligence artificielle.
          </p>

          {/* ── FORM CARD ── */}
          <div className="w-full max-w-[460px]"
            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:24, padding:"32px 28px" }}>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-[14px] text-[13px] text-red-300"
                style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.18)" }}>
                {error}
              </div>
            )}

            {/* MAIN */}
            {step === "main" && (
              <div className="flex flex-col gap-3">
                <p className="text-[22px] font-black text-white mb-1">Connexion</p>
                <button onClick={handleGoogle} disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-[14px] text-[14px] font-bold text-white transition-all hover:bg-white/10 disabled:opacity-60"
                  style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.13)" }}>
                  {googleLoading ? <Spinner /> : <><GoogleIcon /><span>Continuer avec Google</span></>}
                </button>
                <div className="flex items-center gap-3 my-0.5">
                  <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.08)" }} />
                  <span className="text-[11px] text-white/20 font-bold tracking-widest">OU</span>
                  <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.08)" }} />
                </div>
                <button className="mbtn" onClick={() => { setStep("email"); setError(""); }}>
                  <div className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0" style={{ background:"rgba(255,255,255,0.07)" }}>
                    <Mail className="w-4 h-4 text-white/55" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-bold text-white">Email</p>
                    <p className="text-[12px] text-white/30">Connexion par mot de passe</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                </button>
                <button className="mbtn" onClick={() => { setStep("phone"); setError(""); }}>
                  <div className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0" style={{ background:"rgba(255,255,255,0.07)" }}>
                    <Phone className="w-4 h-4 text-white/55" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-bold text-white">Téléphone</p>
                    <p className="text-[12px] text-white/30">Connexion par SMS</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                </button>
                <div className="pt-2 border-t text-center" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
                  <p className="text-[13px] text-white/35 mt-2">
                    Pas encore de compte ?{" "}
                    <Link href="/auth/signup" className="font-bold" style={{ color:"#A78BFA" }}>Créer un compte</Link>
                  </p>
                </div>
              </div>
            )}

            {/* EMAIL */}
            {step === "email" && (
              <form onSubmit={handleEmail} className="flex flex-col gap-3">
                <Back to="main" />
                <p className="text-[20px] font-black text-white mb-1">Connexion par email</p>
                <div className="li-w"><Mail className="ico" /><input className="li" type="email" placeholder="Adresse email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" /></div>
                <div className="li-w">
                  <Lock className="ico" />
                  <input className="li" type={showPwd?"text":"password"} placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" />
                  <button type="button" className="eye" onClick={()=>setShowPwd(v=>!v)}>{showPwd?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
                </div>
                <button type="button" onClick={()=>{setStep("forgot");setForgotEmail(email);}} className="text-right text-[12px] -mt-1" style={{color:"#A78BFA"}}>Mot de passe oublié ?</button>
                <button className="pbtn" type="submit" disabled={loading||!email||!password}>{loading?<Spinner/>:<>Se connecter <ArrowRight className="w-4 h-4"/></>}</button>
              </form>
            )}

            {/* PHONE */}
            {step === "phone" && (
              <form onSubmit={handlePhone} className="flex flex-col gap-3">
                <Back to="main" />
                <p className="text-[20px] font-black text-white mb-1">Connexion par téléphone</p>
                <div className="li-w"><Phone className="ico" /><input className="li" type="tel" placeholder="+33 6 12 34 56 78" value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" /></div>
                <button className="pbtn" type="submit" disabled={loading||!phone}>{loading?<Spinner/>:<>Envoyer le code <ArrowRight className="w-4 h-4"/></>}</button>
              </form>
            )}

            {/* PHONE OTP */}
            {step === "phone-otp" && (
              <form onSubmit={handleOtp} className="flex flex-col gap-4">
                <Back to="phone" />
                <div>
                  <p className="text-[20px] font-black text-white mb-1">Code SMS</p>
                  <p className="text-[13px] text-white/35">Envoyé au <span className="text-white/60 font-semibold">{phone}</span></p>
                </div>
                <div className="otp-row">
                  {otpDigits.map((d,i)=>(
                    <input key={i} className="otp-cell" maxLength={1} value={d}
                      ref={el=>{otpRefs.current[i]=el;}}
                      onChange={e=>handleOtpChange(i,e.target.value)}
                      onKeyDown={e=>{if(e.key==="Backspace"&&!d&&i>0)otpRefs.current[i-1]?.focus();}}
                      inputMode="numeric"/>
                  ))}
                </div>
                <button className="pbtn" type="submit" disabled={loading||otpDigits.join("").length<6}>{loading?<Spinner/>:<>Confirmer <ArrowRight className="w-4 h-4"/></>}</button>
              </form>
            )}

            {/* FORGOT */}
            {step === "forgot" && (
              <form onSubmit={handleForgot} className="flex flex-col gap-3">
                <Back to="email" />
                <p className="text-[20px] font-black text-white mb-1">Mot de passe oublié</p>
                <div className="li-w"><Mail className="ico" /><input className="li" type="email" placeholder="ton@email.com" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} autoComplete="email" /></div>
                <button className="pbtn" type="submit" disabled={loading||!forgotEmail}>{loading?<Spinner/>:<>Envoyer le lien <ArrowRight className="w-4 h-4"/></>}</button>
              </form>
            )}

            {/* FORGOT SENT */}
            {step === "forgot-sent" && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background:"rgba(139,92,246,0.12)", border:"1px solid rgba(139,92,246,0.22)" }}>
                  <Check className="w-7 h-7 text-purple-400" />
                </div>
                <p className="text-[18px] font-black text-white">Email envoyé !</p>
                <p className="text-[13px] text-white/40 leading-relaxed">Vérifie <span className="text-white/65 font-semibold">{forgotEmail}</span> et clique sur le lien.</p>
                <button onClick={()=>setStep("main")} className="text-[13px] font-semibold mt-1" style={{color:"#A78BFA"}}>Retour à la connexion</button>
              </div>
            )}
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-8 mt-10 flex-wrap justify-center">
            {[
              { value:"50 000+", label:"membres" },
              { value:"1 200",   label:"ventes / jour" },
              { value:"4.8★",    label:"satisfaction" },
              { value:"32 000+", label:"articles" },
            ].map(({value,label})=>(
              <div key={label} className="text-center">
                <p className="text-[16px] font-black text-white">{value}</p>
                <p className="text-[11px] text-white/30">{label}</p>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="mt-14 flex flex-col items-center gap-2 opacity-40">
            <p className="text-[12px] text-white/50 tracking-widest uppercase font-semibold">Découvrir</p>
            <div className="w-px h-10" style={{ background:"linear-gradient(to bottom, rgba(139,92,246,0.6), transparent)" }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTIONS MARKETING — pleine largeur en scrollant
      ══════════════════════════════════════════════════════════ */}
      <LandingSections />
    </div>
  );
}
