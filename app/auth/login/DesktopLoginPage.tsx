"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Mail, Lock, Eye, EyeOff, Phone, ArrowRight, Sparkles,
  CheckCircle, Star, Zap, Shield, Users, Package,
  TrendingUp, Check, ArrowUpRight,
} from "lucide-react";
import { signInWithProvider, signInWithEmail, sendPasswordReset, signInWithPhone, verifyPhoneOtp } from "@/lib/auth";
import { GoogleIcon } from "../_components/AuthUI";

type Step = "main" | "email" | "phone" | "phone-otp" | "forgot" | "forgot-sent";

/* ─── Fade-in on scroll hook ─────────────────────────────────── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; } },
      { threshold: 0.10 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        @keyframes title-glow{0%,100%{filter:drop-shadow(0 0 0 rgba(139,92,246,0));}50%{filter:drop-shadow(0 0 28px rgba(139,92,246,.18));}}
        @keyframes pulse-dot{0%,100%{opacity:.4;transform:scale(1);}50%{opacity:1;transform:scale(1.3);}}
        @keyframes count-up{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
        @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
        .aorb1{animation:orb1 44s ease-in-out infinite;}
        .aorb2{animation:orb2 56s ease-in-out infinite;}
        .aorb3{animation:orb3 32s ease-in-out infinite;}
        .aglow{animation:title-glow 6s ease-in-out infinite;}
        .apulse{animation:pulse-dot 2s ease-in-out infinite;}
        .fade-section{opacity:0;transform:translateY(28px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);}
        input::placeholder{color:rgba(255,255,255,.20);}
        .shimmer-text{background:linear-gradient(90deg,#c4b5fd,#fff,#a78bfa,#c4b5fd);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite;}
      `}</style>

      <div className="min-h-[100dvh] flex flex-col" style={{ background: "#020007" }}>

        {/* ══════════════════════════════════════
            NAVBAR
        ══════════════════════════════════════ */}
        <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
          style={{
            background: scrolled ? "rgba(2,0,7,0.88)" : "rgba(2,0,7,0.50)",
            backdropFilter: "blur(24px) saturate(160%)",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          }}>
          <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow: "0 0 16px rgba(124,58,237,.40)" }}>
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-[19px] font-black text-white tracking-tight">
                Wear<span style={{ color:"#A78BFA" }}>lyx</span>
              </span>
            </div>

            {/* Nav links */}
            <div className="flex items-center gap-1">
              {[
                { label:"Explorer",         href:"/search" },
                { label:"Vendre avec l'IA", href:"/sell/ai" },
                { label:"Premium",          href:"/premium" },
                { label:"Fonctionnalités",  href:"#features" },
              ].map(({label, href}) => (
                <Link key={label} href={href}
                  className="px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
                  style={{ color:"rgba(255,255,255,.50)" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.85)";(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.05)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.50)";(e.currentTarget as HTMLElement).style.background="";}}>
                  {label}
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2.5">
              <a href="#login"
                className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
                style={{ color:"rgba(255,255,255,.55)", border:"1px solid rgba(255,255,255,.08)" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.16)";(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.80)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.08)";(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.55)";}}>
                Connexion
              </a>
              <Link href="/sell/ai"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold text-white transition-all"
                style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow:"0 4px 14px rgba(124,58,237,.30)" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 6px 20px rgba(124,58,237,.48)";(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 4px 14px rgba(124,58,237,.30)";(e.currentTarget as HTMLElement).style.transform="";}}>
                <Zap className="w-3.5 h-3.5 fill-white" /> Vendre avec l'IA
              </Link>
            </div>
          </div>
        </nav>

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative overflow-hidden pt-16 flex-shrink-0" id="login">
          {/* Atmosphere */}
          <div className="absolute pointer-events-none aorb1"
            style={{ top:"10%", left:"50%", transform:"translateX(-50%)", width:900, height:700,
              background:"radial-gradient(ellipse at 50% 35%, rgba(88,28,220,.13) 0%, rgba(67,20,180,.04) 42%, transparent 68%)",
              filter:"blur(70px)" }} />
          <div className="absolute pointer-events-none aorb2"
            style={{ top:"-10%", right:"-8%", width:500, height:500,
              background:"radial-gradient(circle, rgba(109,40,217,.12) 0%, transparent 60%)",
              filter:"blur(80px)" }} />
          <div className="absolute pointer-events-none aorb3"
            style={{ bottom:"5%", left:"-5%", width:400, height:400,
              background:"radial-gradient(circle, rgba(76,29,149,.09) 0%, transparent 65%)",
              filter:"blur(64px)" }} />

          {/* Subtle grid lines */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage:"linear-gradient(rgba(124,58,237,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.025) 1px,transparent 1px)", backgroundSize:"80px 80px", maskImage:"radial-gradient(ellipse at 50% 30%, black 30%, transparent 70%)" }} />

          {/* Micro dots */}
          <div className="absolute rounded-full pointer-events-none" style={{ top:"24%",left:"17%",width:3,height:3,background:"rgba(167,139,250,.32)",boxShadow:"0 0 6px 2px rgba(124,58,237,.14)" }} />
          <div className="absolute rounded-full pointer-events-none" style={{ top:"38%",right:"19%",width:2,height:2,background:"rgba(139,92,246,.36)",boxShadow:"0 0 5px 1px rgba(109,40,217,.14)" }} />

          {/* Cinematic line */}
          <div className="absolute pointer-events-none"
            style={{ top:"55%",left:"5%",right:"5%",height:1,
              background:"linear-gradient(90deg,transparent,rgba(124,58,237,.08) 28%,rgba(167,139,250,.12) 50%,rgba(124,58,237,.08) 72%,transparent)" }} />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center"
            style={{ paddingTop:"clamp(60px,9vh,110px)", paddingBottom:"clamp(40px,6vh,72px)" }}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{ background:"rgba(124,58,237,.08)", border:"1px solid rgba(124,58,237,.18)" }}>
              <span className="apulse w-1.5 h-1.5 rounded-full bg-[#A78BFA] flex-shrink-0" />
              <Sparkles className="w-3 h-3 text-[#A78BFA]" />
              <span className="text-[11px] font-semibold text-[#C4B5FD] tracking-[0.14em] uppercase">
                Marketplace mode · France · 50 000+ membres
              </span>
            </div>

            {/* Title */}
            <h1 className="font-black text-white tracking-tight leading-[1.03] mb-6"
              style={{ fontSize:"clamp(48px,5.5vw,78px)", maxWidth:700 }}>
              Le futur de<br />
              <span className="relative inline-block aglow">
                <span className="absolute pointer-events-none"
                  style={{ inset:"-14px -24px", background:"radial-gradient(ellipse,rgba(139,92,246,.18) 0%,transparent 68%)", filter:"blur(18px)" }} />
                <span className="shimmer-text" style={{ position:"relative" }}>la seconde main.</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mb-10 text-center leading-relaxed"
              style={{ fontSize:16, maxWidth:440, color:"rgba(255,255,255,.54)", fontWeight:400 }}>
              Achète et vends des pièces de mode en quelques secondes grâce à l'intelligence artificielle.
            </p>

            {/* Login block */}
            <div className="w-full" style={{ maxWidth:460 }}>
              <div className="rounded-3xl relative overflow-hidden"
                style={{ padding:"28px 32px", background:"rgba(255,255,255,.022)", border:"1px solid rgba(255,255,255,.052)", backdropFilter:"blur(48px) saturate(180%)", boxShadow:"0 20px 70px rgba(0,0,0,.50),inset 0 1px 0 rgba(255,255,255,.055)" }}>
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
                    <GlassBtn onClick={handleGoogle} loading={googleLoading}>
                      <GoogleIcon /><span>Continuer avec Google</span>
                    </GlassBtn>
                    <div className="flex items-center gap-3" style={{margin:"2px 0"}}>
                      <div className="flex-1 h-px" style={{background:"rgba(255,255,255,.06)"}}/>
                      <span className="text-[10px] font-bold tracking-widest uppercase" style={{color:"rgba(255,255,255,.14)"}}>ou</span>
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
                            style={{background:d?"rgba(124,58,237,.18)":"rgba(255,255,255,.05)",border:d?"1px solid rgba(124,58,237,.50)":"1px solid rgba(255,255,255,.08)"}}/>
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
                    <div className="rounded-2xl flex items-center justify-center mb-6" style={{width:52,height:52,background:"rgba(16,185,129,.09)",border:"1px solid rgba(16,185,129,.20)"}}>
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

            {/* Stats bar */}
            <div className="flex items-center gap-1 mt-8 flex-nowrap">
              {[
                {value:"50 000+",label:"membres"},
                {value:"1 200",label:"ventes / jour"},
                {value:"4.8 ★",label:"satisfaction"},
                {value:"32 000+",label:"articles"},
              ].map(({value,label},i,arr)=>(
                <div key={label} className="flex items-center gap-1">
                  <div className="flex items-baseline gap-1.5 px-4 whitespace-nowrap">
                    <span className="text-[13px] font-bold tracking-tight" style={{color:"rgba(255,255,255,.55)"}}>{value}</span>
                    <span className="text-[11px]" style={{color:"rgba(255,255,255,.22)"}}>{label}</span>
                  </div>
                  {i<arr.length-1 && <div className="w-px h-3 flex-shrink-0" style={{background:"rgba(255,255,255,.10)"}}/>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 1 — IA Marketplace
        ══════════════════════════════════════ */}
        <Section id="features">
          <SectionLabel>Intelligence Artificielle</SectionLabel>
          <SectionTitle>Vends en <Highlight>30 secondes</Highlight><br />avec l'IA</SectionTitle>
          <SectionSub>Une photo, et l'IA génère tout : titre accrocheur, description parfaite, prix optimal, fond supprimé.</SectionSub>

          <div className="grid grid-cols-3 gap-5 mt-14">
            {[
              { icon:"📸", title:"Photo → Annonce", sub:"Prends une photo. L'IA détecte la marque, l'état, la taille et génère l'annonce complète.", color:"#8B5CF6" },
              { icon:"🎨", title:"Fond supprimé", sub:"Arrière-plan blanc ou neutre généré automatiquement. Tes articles ressemblent à des produits pro.", color:"#3B82F6" },
              { icon:"💰", title:"Prix conseillé", sub:"L'IA analyse le marché en temps réel et te suggère le prix idéal pour vendre vite.", color:"#10B981" },
            ].map(c => (
              <FeatureCard key={c.title} {...c} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-5 mt-5">
            {[
              { icon:"✍️", title:"Titre & description", sub:"Générés automatiquement, optimisés pour attirer les acheteurs et apparaître dans les recherches.", color:"#F59E0B" },
              { icon:"📊", title:"Statistiques vendeur", sub:"Vues, conversions, favoris, revenus. Tout est tracké pour que tu vendes de mieux en mieux.", color:"#EC4899" },
            ].map(c => (
              <FeatureCard key={c.title} {...c} />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center">
            <Link href="/sell/ai"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[14px] font-bold text-white transition-all"
              style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow:"0 8px 28px rgba(124,58,237,.32)" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 12px 36px rgba(124,58,237,.50)";(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 28px rgba(124,58,237,.32)";(e.currentTarget as HTMLElement).style.transform="";}}>
              <Zap className="w-4 h-4 fill-white"/> Essayer maintenant — c'est gratuit
            </Link>
          </div>
        </Section>

        {/* ══════════════════════════════════════
            SECTION 2 — Communauté & Social
        ══════════════════════════════════════ */}
        <Section dark>
          <SectionLabel>Communauté</SectionLabel>
          <SectionTitle>Une marketplace <Highlight>vivante</Highlight></SectionTitle>
          <SectionSub>50 000 membres actifs, des vendeurs certifiés, des échanges en temps réel.</SectionSub>

          <div className="grid grid-cols-4 gap-4 mt-14">
            {[
              { stat:"50 000+", label:"Membres actifs", sub:"Rejoins une communauté qui grandit chaque jour", icon:<Users className="w-5 h-5"/> },
              { stat:"1 200",   label:"Ventes / jour",   sub:"Des transactions en temps réel partout en France", icon:<TrendingUp className="w-5 h-5"/> },
              { stat:"32 000+", label:"Articles live",   sub:"Nouvelles pièces publiées en permanence", icon:<Package className="w-5 h-5"/> },
              { stat:"4.8 ★",   label:"Satisfaction",    sub:"Note moyenne des acheteurs et vendeurs", icon:<Star className="w-5 h-5 fill-amber-400"/> },
            ].map(s => (
              <div key={s.label} className="p-6 rounded-2xl transition-all group"
                style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.06)" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(139,92,246,.22)";(e.currentTarget as HTMLElement).style.transform="translateY(-3px)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.06)";(e.currentTarget as HTMLElement).style.transform="";}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-[#A78BFA]"
                  style={{ background:"rgba(139,92,246,.12)", border:"1px solid rgba(139,92,246,.20)" }}>
                  {s.icon}
                </div>
                <p className="text-[28px] font-black text-white leading-none mb-1">{s.stat}</p>
                <p className="text-[13px] font-semibold text-white/70 mb-1">{s.label}</p>
                <p className="text-[11.5px] text-white/30 leading-snug">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Live feed mockup */}
          <div className="mt-8 p-6 rounded-3xl" style={{ background:"rgba(255,255,255,.018)", border:"1px solid rgba(255,255,255,.05)" }}>
            <div className="flex items-center gap-2 mb-5">
              <span className="apulse w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
              <p className="text-[13px] font-bold text-white">Activité en direct</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { user:"sophia_m",   action:"vient de vendre",  item:"Nike Air Force 1",    price:"65 €",  time:"il y a 2 min",  color:"#10B981" },
                { user:"kilian.v",   action:"vient d'acheter",  item:"Veste Carhartt WIP",  price:"48 €",  time:"il y a 5 min",  color:"#3B82F6" },
                { user:"luxmode",    action:"vient de publier", item:"Sac Jacquemus 2024",  price:"145 €", time:"il y a 8 min",  color:"#8B5CF6" },
                { user:"lea.style",  action:"vient de vendre",  item:"Jordan 4 Retro",      price:"210 €", time:"il y a 12 min", color:"#F59E0B" },
              ].map(ev => (
                <div key={ev.user} className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all"
                  style={{ background:"rgba(255,255,255,.025)" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.04)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.025)";}}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-[11px] flex-shrink-0"
                    style={{ background:`linear-gradient(135deg,${ev.color}50,${ev.color}28)`, border:`1px solid ${ev.color}35` }}>
                    {ev.user[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[12.5px] font-bold text-white">{ev.user}</span>
                    <span className="text-[12.5px] text-white/40"> {ev.action} </span>
                    <span className="text-[12.5px] font-semibold text-white/70">{ev.item}</span>
                  </div>
                  <span className="text-[13px] font-black flex-shrink-0" style={{ color:ev.color }}>{ev.price}</span>
                  <span className="text-[10.5px] text-white/25 flex-shrink-0">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════
            SECTION 3 — Sécurité
        ══════════════════════════════════════ */}
        <Section>
          <SectionLabel>Confiance & Sécurité</SectionLabel>
          <SectionTitle>Transactions <Highlight>100% sécurisées</Highlight></SectionTitle>
          <SectionSub>Paiements protégés, vendeurs vérifiés, litiges gérés. Tu achètes et vends sans stress.</SectionSub>

          <div className="grid grid-cols-4 gap-5 mt-14">
            {[
              { icon:<Shield className="w-6 h-6"/>,     title:"Paiement sécurisé",         sub:"Chaque transaction est chiffrée et protégée. Ton argent est sûr à 100%.",               color:"#10B981" },
              { icon:<Check className="w-6 h-6"/>,      title:"Vendeurs vérifiés",          sub:"Identité, avis, historique. Chaque profil est contrôlé avant d'être certifié.",         color:"#3B82F6" },
              { icon:<ArrowUpRight className="w-6 h-6"/>,title:"Protection acheteur",       sub:"Objet non conforme ? Tu es remboursé intégralement, sans discussion.",                  color:"#8B5CF6" },
              { icon:<Sparkles className="w-6 h-6"/>,   title:"Support dédié",             sub:"Une équipe disponible 7j/7 pour résoudre tout litige en moins de 24h.",                  color:"#F59E0B" },
            ].map(c => (
              <div key={c.title} className="p-6 rounded-2xl group transition-all"
                style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=`${c.color}35`;(e.currentTarget as HTMLElement).style.transform="translateY(-3px)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.06)";(e.currentTarget as HTMLElement).style.transform="";}}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all"
                  style={{ background:`${c.color}14`, border:`1px solid ${c.color}28`, color:c.color }}>
                  {c.icon}
                </div>
                <p className="text-[15px] font-black text-white mb-2">{c.title}</p>
                <p className="text-[12.5px] leading-relaxed text-white/38">{c.sub}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ══════════════════════════════════════
            SECTION 4 — Premium preview
        ══════════════════════════════════════ */}
        <Section dark>
          <SectionLabel>Wearlyx Premium</SectionLabel>
          <SectionTitle>Vendez encore plus<br />avec nos <Highlight>plans pro</Highlight></SectionTitle>
          <SectionSub>Des outils IA avancés pour transformer ta passion en revenu régulier.</SectionSub>

          <div className="grid grid-cols-3 gap-5 mt-14">
            {[
              { name:"Starter", emoji:"🚀", price:"8€", regular:"10€", color:"#3B82F6", perks:["20 IA photos/mois","5 boosts/mois","Badge Actif","Prix conseillé"] },
              { name:"Vendeur Pro", emoji:"⭐", price:"18€", regular:"25€", color:"#8B5CF6", popular:true, perks:["60 IA photos/mois","15 boosts/mois","Suppression fond","Stats avancées","Relance auto"] },
              { name:"Premium", emoji:"👑", price:"25€", regular:"50€", color:"#F59E0B", perks:["IA illimitée","Boutique perso","Commission -","Articles mis en avant","Support 24/7"] },
            ].map(p => (
              <div key={p.name} className="relative rounded-3xl overflow-hidden transition-all duration-300 group"
                style={{
                  background: p.popular ? "rgba(12,6,28,.98)" : "rgba(14,14,22,.95)",
                  border: p.popular ? "1px solid rgba(139,92,246,.40)" : "1px solid rgba(255,255,255,.07)",
                  transform: p.popular ? "translateY(-6px)" : undefined,
                  boxShadow: p.popular ? "0 0 60px rgba(139,92,246,.12)" : undefined,
                }}
                onMouseEnter={e=>{if(!p.popular)(e.currentTarget as HTMLElement).style.transform="translateY(-4px)";}}
                onMouseLeave={e=>{if(!p.popular)(e.currentTarget as HTMLElement).style.transform="";}} >
                <div className="h-1" style={{ background:`linear-gradient(90deg,${p.color},${p.color}88)` }} />
                {p.popular && <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black text-white" style={{ background:"linear-gradient(135deg,#8B5CF6,#7C3AED)" }}>⭐ POPULAIRE</div>}
                <div className="p-7">
                  <p className="text-[20px] font-black text-white mb-1">{p.emoji} {p.name}</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[38px] font-black text-white leading-none">{p.price}</span>
                    <span className="text-[13px] text-white/36">/ 1er mois</span>
                  </div>
                  <p className="text-[11.5px] text-white/24 mb-5">puis {p.regular}/mois</p>
                  <div className="flex flex-col gap-2 mb-6">
                    {p.perks.map(perk => (
                      <div key={perk} className="flex items-center gap-2.5">
                        <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color:p.color }} />
                        <span className="text-[12.5px] text-white/68">{perk}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/premium"
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl text-[13.5px] font-bold text-white transition-all"
                    style={{ background:`linear-gradient(135deg,${p.color},${p.color}bb)`, boxShadow:`0 6px 20px ${p.color}28` }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";(e.currentTarget as HTMLElement).style.boxShadow=`0 10px 28px ${p.color}45`;}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="";(e.currentTarget as HTMLElement).style.boxShadow=`0 6px 20px ${p.color}28`;}}>
                    Choisir {p.name} <ArrowRight className="w-4 h-4"/>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ══════════════════════════════════════
            SECTION 5 — Live stats
        ══════════════════════════════════════ */}
        <Section>
          <SectionLabel>En ce moment</SectionLabel>
          <SectionTitle>Wearlyx est <Highlight>vivant</Highlight></SectionTitle>
          <SectionSub>Des dizaines de ventes par heure. Des milliers de membres actifs. Une plateforme qui ne dort jamais.</SectionSub>

          <div className="grid grid-cols-2 gap-6 mt-14">
            {/* Live counter */}
            <div className="p-7 rounded-3xl relative overflow-hidden"
              style={{ background:"rgba(139,92,246,.06)", border:"1px solid rgba(139,92,246,.14)" }}>
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
                style={{ background:"radial-gradient(circle,rgba(139,92,246,.15) 0%,transparent 65%)", filter:"blur(30px)" }} />
              <div className="flex items-center gap-2 mb-6">
                <span className="apulse w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-[12px] font-bold text-emerald-400">Live · Maintenant</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value:"1 287", label:"Ventes aujourd'hui", color:"#10B981" },
                  { value:"8 432", label:"Membres connectés",  color:"#3B82F6" },
                  { value:"  342", label:"Articles publiés",   color:"#8B5CF6" },
                  { value:" 2 1K", label:"Messages échangés",  color:"#F59E0B" },
                ].map(s => (
                  <div key={s.label} className="p-4 rounded-2xl" style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.05)" }}>
                    <p className="text-[26px] font-black leading-none mb-1" style={{ color:s.color }}>{s.value}</p>
                    <p className="text-[11.5px] text-white/38">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className="p-7 rounded-3xl" style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)" }}>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
                <p className="text-[13px] font-bold text-white">Tendances de la semaine</p>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { rank:1, label:"Nike Air Force 1",       delta:"+28%",  color:"#10B981" },
                  { rank:2, label:"Jacquemus Le Chiquito",  delta:"+19%",  color:"#3B82F6" },
                  { rank:3, label:"Jordan 4 Retro",         delta:"+16%",  color:"#8B5CF6" },
                  { rank:4, label:"Carhartt WIP",           delta:"+12%",  color:"#F59E0B" },
                  { rank:5, label:"Vintage Levi's 501",     delta:"+9%",   color:"#EC4899" },
                ].map(t => (
                  <div key={t.rank} className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all"
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.04)";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="";}}>
                    <span className="text-[12px] font-black w-4 text-center" style={{ color:"rgba(255,255,255,.22)" }}>#{t.rank}</span>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:t.color }} />
                    <span className="flex-1 text-[13px] text-white/65">{t.label}</span>
                    <span className="text-[12px] font-bold" style={{ color:t.color }}>{t.delta}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════
            FOOTER
        ══════════════════════════════════════ */}
        <footer className="flex-shrink-0 border-t px-10 py-10"
          style={{ borderColor:"rgba(255,255,255,.05)", background:"rgba(255,255,255,.008)" }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)" }}>
                <Star className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="text-[16px] font-black text-white">Wear<span style={{color:"#A78BFA"}}>lyx</span></span>
              <span className="text-[12px] text-white/20 ml-2">© 2025</span>
            </div>
            <div className="flex items-center gap-6">
              {["Confidentialité","CGU","Contact","Blog"].map(l => (
                <Link key={l} href="#"
                  className="text-[12px] transition-colors"
                  style={{color:"rgba(255,255,255,.25)"}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.55)"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.25)"}}>
                  {l}
                </Link>
              ))}
            </div>
            <p className="text-[11.5px]" style={{color:"rgba(255,255,255,.18)"}}>
              Fait avec ❤️ en France
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

/* ─── Section wrapper ─────────────────────────────────────────── */
function Section({ children, dark, id }: { children: React.ReactNode; dark?: boolean; id?: string }) {
  const ref = useFadeIn();
  return (
    <section id={id} ref={ref} className="fade-section px-10 py-20 flex-shrink-0"
      style={{ background: dark ? "rgba(255,255,255,.010)" : "transparent", borderTop:"1px solid rgba(255,255,255,.04)" }}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5"
      style={{ background:"rgba(124,58,237,.08)", border:"1px solid rgba(124,58,237,.16)" }}>
      <span className="text-[11px] font-semibold text-[#C4B5FD] tracking-[0.12em] uppercase">{children}</span>
    </div>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[38px] font-black text-white tracking-tight leading-[1.06] mb-4">{children}</h2>;
}
function SectionSub({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] max-w-xl leading-relaxed" style={{ color:"rgba(255,255,255,.42)" }}>{children}</p>;
}
function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background:"linear-gradient(95deg,#C4B5FD,#A78BFA,#7C3AED)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
      {children}
    </span>
  );
}
function FeatureCard({ icon, title, sub, color }: { icon:string; title:string; sub:string; color:string }) {
  return (
    <div className="p-6 rounded-2xl transition-all group"
      style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.06)" }}
      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=`${color}35`;(e.currentTarget as HTMLElement).style.transform="translateY(-3px)";(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.038)";}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.06)";(e.currentTarget as HTMLElement).style.transform="";(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.025)";}}>
      <span className="text-2xl mb-4 block">{icon}</span>
      <p className="text-[15px] font-black text-white mb-2">{title}</p>
      <p className="text-[12.5px] leading-relaxed text-white/38">{sub}</p>
    </div>
  );
}

/* ─── Reusables ─────────────────────────────────────────────────── */
function StepHead({icon,title,sub}:{icon:React.ReactNode;title:string;sub:string}) {
  return (
    <div className="mb-7">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5"
        style={{background:"rgba(124,58,237,.10)",border:"1px solid rgba(124,58,237,.18)"}}>
        {icon}
      </div>
      <h2 className="text-[24px] font-black text-white tracking-tight mb-1.5">{title}</h2>
      <p className="text-[13.5px]" style={{color:"rgba(255,255,255,.32)"}}>{sub}</p>
    </div>
  );
}
function GlassBtn({children,onClick,loading}:{children:React.ReactNode;onClick?:()=>void;loading?:boolean}) {
  return (
    <button type="button" onClick={onClick} disabled={loading}
      className="w-full flex items-center justify-center gap-3 rounded-2xl text-[13.5px] font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
      style={{ padding:"12px 20px", background:"rgba(255,255,255,.055)", border:"1px solid rgba(255,255,255,.09)", color:"rgba(255,255,255,.75)", backdropFilter:"blur(12px)", boxShadow:"inset 0 1px 0 rgba(255,255,255,.08),0 1px 3px rgba(0,0,0,.25)" }}
      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background="rgba(255,255,255,.085)";el.style.borderColor="rgba(255,255,255,.14)";el.style.transform="translateY(-1px)";el.style.boxShadow="inset 0 1px 0 rgba(255,255,255,.10),0 12px 32px rgba(0,0,0,.40)";el.style.color="rgba(255,255,255,.90)";}}
      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background="rgba(255,255,255,.055)";el.style.borderColor="rgba(255,255,255,.09)";el.style.transform="";el.style.boxShadow="inset 0 1px 0 rgba(255,255,255,.08),0 1px 3px rgba(0,0,0,.25)";el.style.color="rgba(255,255,255,.75)";}}>
      {loading ? <span className="rounded-full border-2 border-white/30 border-t-white animate-spin" style={{width:18,height:18}}/> : children}
    </button>
  );
}
function MethodBtn({icon,label,sub,onClick}:{icon:React.ReactNode;label:string;sub:string;onClick:()=>void}) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-left transition-all"
      style={{background:"rgba(255,255,255,.028)",border:"1px solid rgba(255,255,255,.07)"}}
      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background="rgba(124,58,237,.08)";el.style.borderColor="rgba(124,58,237,.26)";el.style.transform="translateY(-1px)";el.style.boxShadow="0 8px 24px rgba(0,0,0,.28)";}}
      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background="rgba(255,255,255,.028)";el.style.borderColor="rgba(255,255,255,.07)";el.style.transform="";el.style.boxShadow="";}}>
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
  type?:string;placeholder:string;value:string;onChange:(v:string)=>void;icon?:React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl transition-all"
      style={{padding:"15px 16px",background:"rgba(255,255,255,.038)",border:"1px solid rgba(255,255,255,.08)",backdropFilter:"blur(8px)"}}
      onFocus={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(124,58,237,.52)";el.style.background="rgba(124,58,237,.07)";el.style.boxShadow="0 0 0 3px rgba(124,58,237,.10)";}}
      onBlur={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(255,255,255,.08)";el.style.background="rgba(255,255,255,.038)";el.style.boxShadow="";}}>
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
      style={{padding:"14px 20px",background:"linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%)",boxShadow:"0 4px 22px rgba(124,58,237,.32),inset 0 1px 0 rgba(255,255,255,.13)"}}
      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow="0 10px 36px rgba(124,58,237,.50),inset 0 1px 0 rgba(255,255,255,.16)";el.style.transform="translateY(-1px)";}}
      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow="0 4px 22px rgba(124,58,237,.32),inset 0 1px 0 rgba(255,255,255,.13)";el.style.transform="";}}>
      {loading ? <span className="rounded-full border-2 border-white/30 border-t-white animate-spin" style={{width:20,height:20}}/> : children}
    </button>
  );
}
