"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Mail, Lock, Eye, EyeOff, Phone, ArrowRight,
  Sparkles, CheckCircle, Star,
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
        @keyframes orb1 {
          0%,100%{transform:translate(0,0) scale(1);}
          40%{transform:translate(30px,-20px) scale(1.08);}
          70%{transform:translate(-18px,24px) scale(.94);}
        }
        @keyframes orb2 {
          0%,100%{transform:translate(0,0) scale(1);}
          35%{transform:translate(-24px,16px) scale(1.06);}
          70%{transform:translate(20px,-14px) scale(.96);}
        }
        @keyframes orb3 {
          0%,100%{transform:translate(0,0);}
          50%{transform:translate(10px,-18px);}
        }
        @keyframes title-shimmer {
          0%,100%{filter:drop-shadow(0 0 0 rgba(139,92,246,0));}
          50%{filter:drop-shadow(0 0 28px rgba(139,92,246,.20));}
        }
        @keyframes fade-up {
          from{opacity:0;transform:translateY(16px);}
          to{opacity:1;transform:translateY(0);}
        }
        .orb1{animation:orb1 44s ease-in-out infinite;}
        .orb2{animation:orb2 56s ease-in-out infinite;}
        .orb3{animation:orb3 32s ease-in-out infinite;}
        .title-shimmer{animation:title-shimmer 6s ease-in-out infinite;}
        .fade-up{animation:fade-up .55s cubic-bezier(.22,1,.36,1) both;}
        .fade-up-1{animation-delay:.05s;}
        .fade-up-2{animation-delay:.12s;}
        .fade-up-3{animation-delay:.20s;}
        .fade-up-4{animation-delay:.28s;}
        input::placeholder{color:rgba(255,255,255,.20);}
      `}</style>

      <div className="min-h-[100dvh] w-full flex flex-col relative overflow-hidden"
        style={{ background:"#020007" }}>

        {/* ── Atmospheric glows ── */}
        <div className="absolute pointer-events-none orb1"
          style={{ top:"18%", left:"50%", transform:"translateX(-50%)",
            width:800, height:600,
            background:"radial-gradient(ellipse at 50% 40%, rgba(88,28,220,.13) 0%, rgba(67,20,180,.04) 45%, transparent 70%)",
            filter:"blur(64px)" }} />
        <div className="absolute pointer-events-none orb2"
          style={{ top:"-5%", right:"-8%", width:480, height:480,
            background:"radial-gradient(circle, rgba(109,40,217,.11) 0%, transparent 60%)",
            filter:"blur(72px)" }} />
        <div className="absolute pointer-events-none orb3"
          style={{ bottom:"0%", left:"-6%", width:360, height:360,
            background:"radial-gradient(circle, rgba(76,29,149,.09) 0%, transparent 65%)",
            filter:"blur(60px)" }} />

        {/* Thin decorative lines */}
        <div className="absolute pointer-events-none inset-x-0"
          style={{ top:"50%", height:1,
            background:"linear-gradient(90deg,transparent,rgba(124,58,237,.07) 20%,rgba(167,139,250,.10) 50%,rgba(124,58,237,.07) 80%,transparent)" }} />

        {/* Radial gradient behind center content */}
        <div className="absolute pointer-events-none"
          style={{ top:"30%", left:"50%", transform:"translateX(-50%)",
            width:560, height:400,
            background:"radial-gradient(ellipse at 50% 50%, rgba(88,28,220,.07) 0%, transparent 65%)",
            filter:"blur(40px)" }} />

        {/* Glowing micro dots — very subtle */}
        <div className="absolute rounded-full pointer-events-none"
          style={{ top:"22%", left:"18%", width:3, height:3,
            background:"rgba(167,139,250,.30)", boxShadow:"0 0 6px 2px rgba(124,58,237,.14)" }} />
        <div className="absolute rounded-full pointer-events-none"
          style={{ top:"36%", right:"20%", width:2, height:2,
            background:"rgba(139,92,246,.32)", boxShadow:"0 0 5px 1px rgba(109,40,217,.14)" }} />

        {/* ── Main content — centred ── */}
        <div className="relative z-10 flex flex-col items-center flex-1 px-6"
          style={{ paddingTop:"clamp(48px,7vh,88px)", paddingBottom:"clamp(32px,5vh,64px)" }}>

          {/* Logo */}
          <div className="fade-up fade-up-1 flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-[14px] flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)",
                boxShadow:"0 0 22px rgba(124,58,237,.45), inset 0 1px 0 rgba(255,255,255,.15)" }}>
              <Star className="w-4.5 h-4.5 text-white fill-white" style={{width:18,height:18}} />
            </div>
            <span className="text-[22px] font-black text-white tracking-tight">
              Wear<span style={{color:"#A78BFA"}}>lyx</span>
            </span>
          </div>

          {/* Badge */}
          <div className="fade-up fade-up-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7"
            style={{ background:"rgba(124,58,237,.08)", border:"1px solid rgba(124,58,237,.18)" }}>
            <Sparkles className="w-3 h-3 text-[#A78BFA]" />
            <span className="text-[11px] font-semibold text-[#C4B5FD] tracking-[0.14em] uppercase">
              Marketplace mode · France
            </span>
          </div>

          {/* Hero title */}
          <div className="fade-up fade-up-2 text-center mb-5" style={{maxWidth:680}}>
            <h1 className="font-black text-white tracking-tight leading-[1.04]"
              style={{fontSize:"clamp(46px,5vw,72px)"}}>
              Le futur de<br />
              <span className="relative inline-block title-shimmer">
                {/* Glow behind gradient text */}
                <span className="absolute pointer-events-none"
                  style={{ inset:"-12px -20px",
                    background:"radial-gradient(ellipse, rgba(139,92,246,.16) 0%, transparent 68%)",
                    filter:"blur(16px)" }} />
                <span style={{
                  background:"linear-gradient(95deg,#EDE9FF 0%,#C4B5FD 32%,#A78BFA 62%,#7C3AED 100%)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  position:"relative",
                }}>
                  la seconde main.
                </span>
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="fade-up fade-up-2 text-center mb-10"
            style={{ fontSize:15.5, maxWidth:400, color:"rgba(255,255,255,.58)", lineHeight:1.70, fontWeight:400 }}>
            Achète et vends des pièces de mode en quelques secondes grâce à l'intelligence artificielle.
          </p>

          {/* ── Login block ── */}
          <div className="fade-up fade-up-3 w-full" style={{maxWidth:460}}>
            <div className="rounded-3xl relative overflow-hidden"
              style={{
                padding:"28px 32px",
                background:"rgba(255,255,255,.022)",
                border:"1px solid rgba(255,255,255,.052)",
                backdropFilter:"blur(48px) saturate(180%)",
                boxShadow:"0 20px 70px rgba(0,0,0,.50), 0 0 0 .5px rgba(255,255,255,.03) inset, 0 1px 0 rgba(255,255,255,.055) inset",
              }}>

              {/* Inner top line — barely visible */}
              <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
                style={{ background:"linear-gradient(90deg,transparent 15%,rgba(167,139,250,.16) 50%,transparent 85%)" }} />

              {step !== "main" && (
                <button onClick={()=>setStep("main")}
                  className="flex items-center gap-1.5 text-[13px] mb-6 transition-colors"
                  style={{color:"rgba(255,255,255,.28)"}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.60)"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.28)"}}>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180"/> Retour
                </button>
              )}

              {step === "main" && (
                <div className="flex flex-col gap-2.5">
                  {/* Google */}
                  <GlassBtn onClick={handleGoogle} loading={googleLoading}>
                    <GoogleIcon />
                    <span>Continuer avec Google</span>
                  </GlassBtn>

                  <div className="flex items-center gap-3" style={{margin:"2px 0"}}>
                    <div className="flex-1 h-px" style={{background:"rgba(255,255,255,.06)"}}/>
                    <span className="text-[10px] font-bold tracking-widest uppercase"
                      style={{color:"rgba(255,255,255,.14)"}}>ou</span>
                    <div className="flex-1 h-px" style={{background:"rgba(255,255,255,.06)"}}/>
                  </div>

                  <MethodBtn icon={<Mail className="w-4 h-4"/>} label="Email" sub="Connexion par mot de passe" onClick={()=>setStep("email")}/>
                  <MethodBtn icon={<Phone className="w-4 h-4"/>} label="Téléphone" sub="Connexion par SMS" onClick={()=>setStep("phone")}/>

                  {error && <p className="text-[13px] text-red-400 text-center mt-1">{error}</p>}

                  <p className="text-center text-[12.5px] pt-1" style={{color:"rgba(255,255,255,.18)"}}>
                    Pas encore de compte ?{" "}
                    <Link href="/auth/signup" className="font-semibold transition-colors" style={{color:"#A78BFA"}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#C4B5FD"}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="#A78BFA"}}>
                      Créer un compte
                    </Link>
                  </p>
                </div>
              )}

              {step === "email" && (
                <div>
                  <StepHead icon={<Mail className="w-5 h-5 text-[#A78BFA]"/>} title="Connexion par email" sub="Entre ton adresse et ton mot de passe."/>
                  <form onSubmit={handleEmail} className="flex flex-col gap-3">
                    <Field type="email" placeholder="Adresse email" value={email} onChange={setEmail} icon={<Mail className="w-4 h-4"/>}/>
                    <div className="relative">
                      <Field type={showPwd?"text":"password"} placeholder="Mot de passe" value={password} onChange={setPassword} icon={<Lock className="w-4 h-4"/>}/>
                      <button type="button" onClick={()=>setShowPwd(v=>!v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                        style={{color:"rgba(255,255,255,.24)"}}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.55)"}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.24)"}}>
                        {showPwd?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                      </button>
                    </div>
                    {error && <p className="text-[13px] text-red-400">{error}</p>}
                    <PrimaryBtn loading={loading}>Se connecter</PrimaryBtn>
                    <button type="button" onClick={()=>setStep("forgot")}
                      className="text-[12px] transition-colors text-center pt-1"
                      style={{color:"rgba(255,255,255,.22)"}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#A78BFA"}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.22)"}}>
                      Mot de passe oublié ?
                    </button>
                  </form>
                </div>
              )}

              {step === "phone" && (
                <div>
                  <StepHead icon={<Phone className="w-5 h-5 text-[#A78BFA]"/>} title="Par téléphone" sub="On t'envoie un code par SMS."/>
                  <form onSubmit={handlePhone} className="flex flex-col gap-3">
                    <Field type="tel" placeholder="+33 6 00 00 00 00" value={phone} onChange={setPhone} icon={<Phone className="w-4 h-4"/>}/>
                    {error && <p className="text-[13px] text-red-400">{error}</p>}
                    <PrimaryBtn loading={loading}>Envoyer le code</PrimaryBtn>
                  </form>
                </div>
              )}

              {step === "phone-otp" && (
                <div>
                  <StepHead icon={<Sparkles className="w-5 h-5 text-[#A78BFA]"/>} title="Code de vérification" sub={`Code envoyé au ${phone}.`}/>
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
                          }}/>
                      ))}
                    </div>
                    {error && <p className="text-[13px] text-red-400 text-center">{error}</p>}
                    <PrimaryBtn loading={loading}>Vérifier</PrimaryBtn>
                  </form>
                </div>
              )}

              {step === "forgot" && (
                <div>
                  <StepHead icon={<Lock className="w-5 h-5 text-[#A78BFA]"/>} title="Mot de passe oublié" sub="On t'envoie un lien de réinitialisation."/>
                  <form onSubmit={handleForgot} className="flex flex-col gap-3">
                    <Field type="email" placeholder="Ton adresse email" value={forgotEmail} onChange={setForgotEmail} icon={<Mail className="w-4 h-4"/>}/>
                    {error && <p className="text-[13px] text-red-400">{error}</p>}
                    <PrimaryBtn loading={loading}>Envoyer le lien</PrimaryBtn>
                  </form>
                </div>
              )}

              {step === "forgot-sent" && (
                <div>
                  <div className="rounded-2xl flex items-center justify-center mb-6"
                    style={{width:52,height:52,background:"rgba(16,185,129,.09)",border:"1px solid rgba(16,185,129,.20)"}}>
                    <CheckCircle className="w-6 h-6 text-emerald-400"/>
                  </div>
                  <h2 className="text-[26px] font-black text-white tracking-tight mb-2">Email envoyé !</h2>
                  <p className="text-[14px] mb-8 leading-relaxed" style={{color:"rgba(255,255,255,.34)"}}>
                    Vérifie ta boîte mail et clique sur le lien pour réinitialiser ton mot de passe.
                  </p>
                  <button onClick={()=>setStep("main")}
                    className="flex items-center gap-1.5 text-[13.5px] font-semibold transition-colors"
                    style={{color:"#A78BFA"}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#C4B5FD"}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="#A78BFA"}}>
                    Retour à la connexion <ArrowRight className="w-4 h-4"/>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Stats bar ── */}
          <div className="fade-up fade-up-4 flex items-center gap-1 mt-7 flex-nowrap">
            {[
              {value:"50 000+", label:"membres"},
              {value:"1 200",   label:"ventes / jour"},
              {value:"4.8 ★",   label:"satisfaction"},
              {value:"32 000+", label:"articles"},
            ].map(({value,label},i,arr)=>(
              <div key={label} className="flex items-center gap-1">
                <div className="flex items-baseline gap-1.5 px-4 whitespace-nowrap">
                  <span className="text-[13px] font-bold tracking-tight"
                    style={{color:"rgba(255,255,255,.55)"}}>{value}</span>
                  <span className="text-[11px]"
                    style={{color:"rgba(255,255,255,.22)"}}>{label}</span>
                </div>
                {i < arr.length-1 && (
                  <div className="w-px h-3 flex-shrink-0" style={{background:"rgba(255,255,255,.10)"}}/>
                )}
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
    <div className="mb-7">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5"
        style={{background:"rgba(124,58,237,.10)",border:"1px solid rgba(124,58,237,.18)"}}>
        {icon}
      </div>
      <h2 className="text-[24px] font-black text-white tracking-tight mb-1.5">{title}</h2>
      <p className="text-[13.5px]" style={{color:"rgba(255,255,255,.34)"}}>{sub}</p>
    </div>
  );
}

function GlassBtn({children,onClick,loading}:{children:React.ReactNode;onClick?:()=>void;loading?:boolean}) {
  return (
    <button type="button" onClick={onClick} disabled={loading}
      className="w-full flex items-center justify-center gap-3 rounded-2xl text-[13.5px] font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
      style={{
        padding:"12px 20px",
        background:"rgba(255,255,255,.055)",
        border:"1px solid rgba(255,255,255,.09)",
        color:"rgba(255,255,255,.75)",
        backdropFilter:"blur(12px)",
        boxShadow:"inset 0 1px 0 rgba(255,255,255,.08), 0 1px 3px rgba(0,0,0,.25)",
        letterSpacing:"0.01em",
      }}
      onMouseEnter={e=>{
        const el=e.currentTarget as HTMLElement;
        el.style.background="rgba(255,255,255,.085)";
        el.style.borderColor="rgba(255,255,255,.14)";
        el.style.transform="translateY(-1px)";
        el.style.boxShadow="inset 0 1px 0 rgba(255,255,255,.10), 0 12px 32px rgba(0,0,0,.40)";
        el.style.color="rgba(255,255,255,.90)";
      }}
      onMouseLeave={e=>{
        const el=e.currentTarget as HTMLElement;
        el.style.background="rgba(255,255,255,.055)";
        el.style.borderColor="rgba(255,255,255,.09)";
        el.style.transform="";
        el.style.boxShadow="inset 0 1px 0 rgba(255,255,255,.08), 0 1px 3px rgba(0,0,0,.25)";
        el.style.color="rgba(255,255,255,.75)";
      }}>
      {loading ? <span className="rounded-full border-2 border-white/30 border-t-white animate-spin" style={{width:18,height:18}}/> : children}
    </button>
  );
}

function MethodBtn({icon,label,sub,onClick}:{icon:React.ReactNode;label:string;sub:string;onClick:()=>void}) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-left transition-all"
      style={{background:"rgba(255,255,255,.028)",border:"1px solid rgba(255,255,255,.07)"}}
      onMouseEnter={e=>{
        const el=e.currentTarget as HTMLElement;
        el.style.background="rgba(124,58,237,.08)";
        el.style.borderColor="rgba(124,58,237,.26)";
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
        style={{background:"rgba(255,255,255,.055)",color:"rgba(255,255,255,.40)"}}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[13.5px] font-semibold" style={{color:"rgba(255,255,255,.70)"}}>{label}</p>
        <p className="text-[11px]" style={{color:"rgba(255,255,255,.26)"}}>{sub}</p>
      </div>
      <ArrowRight className="w-3.5 h-3.5" style={{color:"rgba(255,255,255,.16)"}}/>
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
        el.style.background="rgba(124,58,237,.07)";
        el.style.boxShadow="0 0 0 3px rgba(124,58,237,.10)";
      }}
      onBlur={e=>{
        const el=e.currentTarget as HTMLElement;
        el.style.borderColor="rgba(255,255,255,.08)";
        el.style.background="rgba(255,255,255,.038)";
        el.style.boxShadow="";
      }}>
      {icon && <span className="flex-shrink-0" style={{color:"rgba(255,255,255,.26)"}}>{icon}</span>}
      <input type={type} placeholder={placeholder} value={value}
        onChange={e=>onChange(e.target.value)}
        className="flex-1 bg-transparent text-[14.5px] text-white outline-none"
        style={{caretColor:"#A78BFA"}}/>
    </div>
  );
}

function PrimaryBtn({children,loading}:{children:React.ReactNode;loading?:boolean}) {
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
        ? <span className="rounded-full border-2 border-white/30 border-t-white animate-spin" style={{width:20,height:20}}/>
        : children}
    </button>
  );
}
