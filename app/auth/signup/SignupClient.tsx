"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Mail, Lock, Eye, EyeOff, Phone, ArrowRight,
  User, MapPin, Hash, Sparkles, Check,
} from "lucide-react";
import {
  signInWithProvider, signInWithEmailOtp, verifyEmailOtp,
  setPassword, signInWithPhone, verifyPhoneOtp, updateProfile, getSession,
} from "@/lib/auth";
import { GoogleIcon } from "../_components/AuthUI";
import { LandingSections } from "../_components/LandingSections";

type Step = "main" | "form-1" | "form-2" | "otp" | "phone-contact" | "phone-otp" | "phone-profile";

export default function SignupClient() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>("main");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password_, setPassword_] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [phoneContact, setPhoneContact] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [otpDigits, setOtpDigits] = useState(["","","","","",""]);
  const otpRefs = useRef<(HTMLInputElement|null)[]>([]);
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
    try { await signInWithProvider("google", "signup"); }
    catch (e:any) { setError(e.message??"Erreur Google."); setGoogleLoading(false); }
  };

  const handleFormSubmit = async (e:React.SyntheticEvent) => {
    e.preventDefault(); setError("");
    if (!firstName.trim()) { setError("Le prénom est obligatoire."); return; }
    if (!email.trim()) { setError("L'email est obligatoire."); return; }
    if (password_.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères."); return; }
    if (password_ !== confirmPassword) { setError("Les mots de passe ne correspondent pas."); return; }
    if (!username.trim() || username.length < 3) { setError("Le pseudo doit faire au moins 3 caractères."); return; }
    if (!phone.trim()) { setError("Le téléphone est obligatoire."); return; }
    if (!city.trim()) { setError("La ville est obligatoire."); return; }
    if (!postalCode.trim()) { setError("Le code postal est obligatoire."); return; }
    setLoading(true);
    try {
      await signInWithEmailOtp(email.trim());
      setStep("otp");
    } catch (e:any) {
      const m = e.message??"";
      if (m.includes("rate")||m.includes("limit")) setError("Trop de tentatives. Attends quelques secondes.");
      else setError("Impossible d'envoyer le code. Vérifie l'email.");
    } finally { setLoading(false); }
  };

  const handleVerifyEmailOtp = async (e:React.SyntheticEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) return;
    setLoading(true); setError("");
    try {
      const user = await verifyEmailOtp(email.trim(), code);
      if (!user) throw new Error("Session non créée.");
      await setPassword(password_);
      await updateProfile(user.id, {
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        username: username.trim().toLowerCase(),
        city: city.trim(), postal_code: postalCode.trim(), phone: phone.trim(),
      });
      sessionStorage.setItem("wlx_just_authed", "1");
      window.location.replace("/");
    } catch (e:any) {
      const m = e.message??"";
      if (m.includes("unique")||m.includes("duplicate")) setError("Ce pseudo est déjà pris.");
      else if (m.includes("expired")||m.includes("invalid")||m.includes("otp")) {
        setError("Code incorrect ou expiré."); setOtpDigits(["","","","","",""]); otpRefs.current[0]?.focus();
      } else setError(m||"Erreur lors de la création du compte.");
    } finally { setLoading(false); }
  };

  const handleSendSms = async (e:React.SyntheticEvent) => {
    e.preventDefault();
    if (!phoneContact.trim()) return;
    setLoading(true); setError("");
    try { await signInWithPhone(phoneContact.trim()); setStep("phone-otp"); setOtpDigits(["","","","","",""]); }
    catch { setError("Impossible d'envoyer le SMS. Vérifie le numéro (+33 6…)."); }
    finally { setLoading(false); }
  };

  const handleVerifyPhoneOtp = async (e:React.SyntheticEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) return;
    setLoading(true); setError("");
    try {
      const user = await verifyPhoneOtp(phoneContact.trim(), code);
      if (!user) throw new Error("Session non créée.");
      setUserId(user.id); setStep("phone-profile");
    } catch { setError("Code incorrect ou expiré."); setOtpDigits(["","","","","",""]); otpRefs.current[0]?.focus(); }
    finally { setLoading(false); }
  };

  const handlePhoneProfile = async (e:React.SyntheticEvent) => {
    e.preventDefault(); setError("");
    if (!username.trim()||username.length<3) { setError("Le pseudo doit faire au moins 3 caractères."); return; }
    if (!city.trim()) { setError("La ville est obligatoire."); return; }
    if (!postalCode.trim()) { setError("Le code postal est obligatoire."); return; }
    if (!userId) return;
    setLoading(true);
    try {
      await updateProfile(userId, {
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim()||undefined,
        username: username.trim().toLowerCase(),
        city: city.trim(), postal_code: postalCode.trim(), phone: phoneContact.trim(),
      });
      sessionStorage.setItem("wlx_just_authed", "1");
      window.location.replace("/");
    } catch (e:any) {
      const m = e.message??"";
      if (m.includes("unique")||m.includes("duplicate")) setError("Ce pseudo est déjà pris.");
      else setError("Erreur lors de la sauvegarde. Réessaie.");
    } finally { setLoading(false); }
  };

  const handleOtpChange = (i:number, v:string) => {
    if (!/^\d*$/.test(v)) return;
    const d=[...otpDigits]; d[i]=v.slice(-1); setOtpDigits(d);
    if (v&&i<5) otpRefs.current[i+1]?.focus();
  };

  const goBack = () => {
    setError("");
    if (step==="otp") { setStep("form-2"); setOtpDigits(["","","","","",""]); }
    else if (step==="form-2") setStep("form-1");
    else if (step==="phone-otp") { setStep("phone-contact"); setOtpDigits(["","","","","",""]); }
    else if (step==="phone-profile") setStep("phone-otp");
    else setStep("main");
  };

  const Spinner = () => <span className="inline-block w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />;
  const Back = () => (
    <button type="button" onClick={goBack} className="text-[12px] text-white/30 hover:text-white/60 transition-colors mb-2 block">
      ← Retour
    </button>
  );

  return (
    <div style={{ opacity: visible?1:0, transition:"opacity 0.4s ease", background:"#07070A", overflowX:"hidden" }}>
      <style>{`
        .li{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:14px 16px;font-size:15px;color:white;outline:none;transition:all .2s;}
        .li::placeholder{color:rgba(255,255,255,0.25);}
        .li:hover{border-color:rgba(255,255,255,0.16);background:rgba(255,255,255,0.07);}
        .li:focus{border-color:rgba(139,92,246,0.65);background:rgba(139,92,246,0.07);box-shadow:0 0 0 3px rgba(139,92,246,0.14);}
        .li-w{position:relative;display:flex;align-items:center;}
        .li-w svg.ico{position:absolute;left:15px;width:16px;height:16px;color:rgba(255,255,255,0.28);pointer-events:none;}
        .li-w .li{padding-left:44px;}
        .li-w .at{position:absolute;left:15px;font-size:14px;font-weight:700;color:rgba(255,255,255,0.3);pointer-events:none;}
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

      {/* ══ HERO ══ */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)", width:800, height:800, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%)", filter:"blur(80px)" }} />
          <div style={{ position:"absolute", bottom:"-10%", right:"20%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 65%)", filter:"blur(100px)" }} />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">

          <Link href="/" className="text-[26px] font-black tracking-tight mb-10">
            <span className="text-white">Wear</span>
            <span style={{ background:"linear-gradient(135deg,#C4B5FD,#8B5CF6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>lyx</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background:"rgba(139,92,246,0.12)", border:"1px solid rgba(139,92,246,0.28)" }}>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[12px] font-bold text-purple-300 uppercase tracking-[0.18em]">Rejoins 50 000 vendeurs · Gratuit</span>
          </div>

          <h1 className="font-black text-center leading-[1.05] tracking-tight mb-5 text-white" style={{ fontSize:"clamp(42px,5vw,72px)" }}>
            Lance-toi en<br />
            <span style={{ background:"linear-gradient(135deg,#8B5CF6,#C4B5FD)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              quelques minutes.
            </span>
          </h1>

          <p className="text-center text-[16px] text-white/40 mb-10 max-w-[480px] leading-relaxed">
            Crée ton compte gratuitement et commence à vendre ta garde-robe grâce à l&apos;IA.
          </p>

          {/* FORM CARD */}
          <div className="w-full max-w-[460px]"
            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:24, padding:"32px 28px" }}>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-[14px] text-[13px] text-red-300"
                style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.18)" }}>
                {error}
              </div>
            )}

            {/* MAIN */}
            {step === "main" && (
              <div className="flex flex-col gap-3">
                <p className="text-[22px] font-black text-white mb-1">Créer un compte</p>
                <button onClick={handleGoogle} disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-[14px] text-[14px] font-bold text-white transition-all hover:bg-white/10 disabled:opacity-60"
                  style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.13)" }}>
                  {googleLoading?<Spinner/>:<><GoogleIcon/><span>S&apos;inscrire avec Google</span></>}
                </button>
                <div className="flex items-center gap-3 my-0.5">
                  <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.08)" }}/>
                  <span className="text-[11px] text-white/20 font-bold tracking-widest">OU</span>
                  <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.08)" }}/>
                </div>
                <button className="mbtn" onClick={()=>{setStep("form-1");setError("");}}>
                  <div className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0" style={{ background:"rgba(255,255,255,0.07)" }}>
                    <Mail className="w-4 h-4 text-white/55"/>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-bold text-white">Email</p>
                    <p className="text-[12px] text-white/30">Inscription par email</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 flex-shrink-0"/>
                </button>
                <button className="mbtn" onClick={()=>{setStep("phone-contact");setError("");}}>
                  <div className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0" style={{ background:"rgba(255,255,255,0.07)" }}>
                    <Phone className="w-4 h-4 text-white/55"/>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-bold text-white">Téléphone</p>
                    <p className="text-[12px] text-white/30">Inscription par SMS</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 flex-shrink-0"/>
                </button>
                <div className="pt-2 border-t text-center" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
                  <p className="text-[13px] text-white/35 mt-2">
                    Déjà un compte ?{" "}
                    <Link href="/auth/login" className="font-bold" style={{ color:"#A78BFA" }}>Se connecter</Link>
                  </p>
                </div>
                <p className="text-center text-[11px] text-white/20 leading-relaxed">
                  En t&apos;inscrivant tu acceptes nos{" "}
                  <span className="text-white/40 underline underline-offset-2 cursor-pointer">CGU</span>{" "}
                  et notre{" "}
                  <span className="text-white/40 underline underline-offset-2 cursor-pointer">Politique de confidentialité</span>
                </p>
              </div>
            )}

            {/* FORM-1 */}
            {step === "form-1" && (
              <div className="flex flex-col gap-3">
                <Back/>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[20px] font-black text-white">Ton identité</p>
                  <span className="text-[11px] font-bold text-white/25 px-2.5 py-1 rounded-full" style={{ background:"rgba(255,255,255,0.06)" }}>1 / 2</span>
                </div>
                <div className="flex gap-2">
                  <div className="li-w flex-1"><User className="ico"/><input className="li" placeholder="Prénom *" value={firstName} onChange={e=>setFirstName(e.target.value)} autoComplete="given-name"/></div>
                  <div className="li-w flex-1"><User className="ico"/><input className="li" placeholder="Nom" value={lastName} onChange={e=>setLastName(e.target.value)} autoComplete="family-name"/></div>
                </div>
                <div className="li-w"><Mail className="ico"/><input className="li" type="email" placeholder="Adresse email *" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/></div>
                <div className="li-w">
                  <Lock className="ico"/>
                  <input className="li" type={showPwd?"text":"password"} placeholder="Mot de passe (6 car. min.) *" value={password_} onChange={e=>setPassword_(e.target.value)} autoComplete="new-password"/>
                  <button type="button" className="eye" onClick={()=>setShowPwd(v=>!v)}>{showPwd?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
                </div>
                <div className="li-w">
                  <Lock className="ico"/>
                  <input className="li" type={showConfirm?"text":"password"} placeholder="Confirmer le mot de passe *" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} autoComplete="new-password"/>
                  <button type="button" className="eye" onClick={()=>setShowConfirm(v=>!v)}>{showConfirm?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
                </div>
                <button className="pbtn" type="button" onClick={()=>{
                  setError("");
                  if (!firstName.trim()) { setError("Le prénom est obligatoire."); return; }
                  if (!email.trim()) { setError("L'email est obligatoire."); return; }
                  if (password_.length<6) { setError("Le mot de passe doit faire au moins 6 caractères."); return; }
                  if (password_!==confirmPassword) { setError("Les mots de passe ne correspondent pas."); return; }
                  setStep("form-2");
                }}>
                  Continuer <ArrowRight className="w-4 h-4"/>
                </button>
              </div>
            )}

            {/* FORM-2 */}
            {step === "form-2" && (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
                <Back/>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[20px] font-black text-white">Ton profil</p>
                  <span className="text-[11px] font-bold text-white/25 px-2.5 py-1 rounded-full" style={{ background:"rgba(255,255,255,0.06)" }}>2 / 2</span>
                </div>
                <div className="li-w"><span className="at">@</span><input className="li" placeholder="pseudo * (unique)" value={username} onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g,""))}/></div>
                <div className="li-w"><Phone className="ico"/><input className="li" type="tel" placeholder="Téléphone * (+33 6…)" value={phone} onChange={e=>setPhone(e.target.value)} inputMode="tel" autoComplete="tel"/></div>
                <div className="li-w"><MapPin className="ico"/><input className="li" placeholder="Ville *" value={city} onChange={e=>setCity(e.target.value)} autoComplete="address-level2"/></div>
                <div className="li-w"><Hash className="ico"/><input className="li" placeholder="Code postal *" value={postalCode} onChange={e=>setPostalCode(e.target.value)} inputMode="numeric" maxLength={5}/></div>
                <button className="pbtn" type="submit" disabled={loading||!username.trim()||!phone.trim()||!city.trim()||!postalCode.trim()}>
                  {loading?<Spinner/>:<>Recevoir le code <ArrowRight className="w-4 h-4"/></>}
                </button>
              </form>
            )}

            {/* OTP EMAIL */}
            {step === "otp" && (
              <form onSubmit={handleVerifyEmailOtp} className="flex flex-col gap-4">
                <Back/>
                <div>
                  <p className="text-[20px] font-black text-white mb-1">Vérifie ton email</p>
                  <p className="text-[13px] text-white/35">Code envoyé à <span className="text-white/60 font-semibold">{email}</span></p>
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
                <button className="pbtn" type="submit" disabled={loading||otpDigits.join("").length<6}>{loading?<Spinner/>:<>Créer mon compte <Check className="w-4 h-4"/></>}</button>
                <button type="button" onClick={async()=>{await signInWithEmailOtp(email.trim());setOtpDigits(["","","","","",""]);}} className="text-center text-[12px] text-white/30 hover:text-white/55 transition-colors">Renvoyer le code</button>
              </form>
            )}

            {/* PHONE CONTACT */}
            {step === "phone-contact" && (
              <form onSubmit={handleSendSms} className="flex flex-col gap-3">
                <Back/>
                <div>
                  <p className="text-[20px] font-black text-white mb-1">Ton numéro</p>
                  <p className="text-[13px] text-white/35">On t&apos;envoie un code par SMS</p>
                </div>
                <div className="li-w"><Phone className="ico"/><input className="li" type="tel" placeholder="+33 6 12 34 56 78" value={phoneContact} onChange={e=>setPhoneContact(e.target.value)} inputMode="tel" autoComplete="tel"/></div>
                <button className="pbtn" type="submit" disabled={loading||!phoneContact.trim()}>{loading?<Spinner/>:<>Recevoir le code <ArrowRight className="w-4 h-4"/></>}</button>
              </form>
            )}

            {/* PHONE OTP */}
            {step === "phone-otp" && (
              <form onSubmit={handleVerifyPhoneOtp} className="flex flex-col gap-4">
                <Back/>
                <div>
                  <p className="text-[20px] font-black text-white mb-1">Code SMS</p>
                  <p className="text-[13px] text-white/35">Envoyé au <span className="text-white/60 font-semibold">{phoneContact}</span></p>
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
                <button className="pbtn" type="submit" disabled={loading||otpDigits.join("").length<6}>{loading?<Spinner/>:<>Vérifier <ArrowRight className="w-4 h-4"/></>}</button>
                <button type="button" onClick={async()=>{await signInWithPhone(phoneContact.trim());setOtpDigits(["","","","","",""]);}} className="text-center text-[12px] text-white/30 hover:text-white/55 transition-colors">Renvoyer le code</button>
              </form>
            )}

            {/* PHONE PROFILE */}
            {step === "phone-profile" && (
              <form onSubmit={handlePhoneProfile} className="flex flex-col gap-3">
                <Back/>
                <div>
                  <p className="text-[20px] font-black text-white mb-1">Complète ton profil</p>
                  <p className="text-[13px] text-white/35">Quelques infos pour finaliser</p>
                </div>
                <div className="flex gap-2">
                  <div className="li-w flex-1"><User className="ico"/><input className="li" placeholder="Prénom" value={firstName} onChange={e=>setFirstName(e.target.value)} autoComplete="given-name"/></div>
                  <div className="li-w flex-1"><User className="ico"/><input className="li" placeholder="Nom" value={lastName} onChange={e=>setLastName(e.target.value)} autoComplete="family-name"/></div>
                </div>
                <div className="li-w"><span className="at">@</span><input className="li" placeholder="pseudo * (unique)" value={username} onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g,""))}/></div>
                <div className="flex gap-2">
                  <div className="li-w flex-1"><MapPin className="ico"/><input className="li" placeholder="Ville *" value={city} onChange={e=>setCity(e.target.value)} autoComplete="address-level2"/></div>
                  <div className="li-w flex-1"><Hash className="ico"/><input className="li" placeholder="Code postal *" value={postalCode} onChange={e=>setPostalCode(e.target.value)} inputMode="numeric" maxLength={5}/></div>
                </div>
                <button className="pbtn" type="submit" disabled={loading||!username.trim()||!city.trim()||!postalCode.trim()}>
                  {loading?<Spinner/>:<>Créer mon compte <Check className="w-4 h-4"/></>}
                </button>
              </form>
            )}
          </div>

          {/* Stats */}
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
            <div className="w-px h-10" style={{ background:"linear-gradient(to bottom, rgba(139,92,246,0.6), transparent)" }}/>
          </div>
        </div>
      </section>

      <LandingSections />
    </div>
  );
}
