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
      {/* CSS animations */}
      <style>{`
        @keyframes drift1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(18px, -12px) scale(1.04); }
          66%       { transform: translate(-10px, 14px) scale(0.97); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          40%       { transform: translate(-14px, 10px) scale(1.03); }
          75%       { transform: translate(12px, -8px) scale(0.98); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0px, 0px); }
          50%       { transform: translate(6px, -10px); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.06; }
          50%       { opacity: 0.13; }
        }
        @keyframes glow-text {
          0%, 100% { text-shadow: 0 0 40px rgba(139,92,246,0); }
          50%       { text-shadow: 0 0 40px rgba(139,92,246,0.18), 0 0 80px rgba(109,40,217,0.10); }
        }
        .animate-drift1 { animation: drift1 18s ease-in-out infinite; }
        .animate-drift2 { animation: drift2 22s ease-in-out infinite; }
        .animate-drift3 { animation: drift3 14s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring 6s ease-in-out infinite; }
        .animate-glow-text { animation: glow-text 5s ease-in-out infinite; }
      `}</style>

      <div className="min-h-[100dvh] w-full flex" style={{ background: "#030008" }}>

        {/* ══════════════════════════════════════════
            LEFT — Immersive brand stage
        ══════════════════════════════════════════ */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col">

          {/* ── Atmosphere glows (animated drift) ── */}
          <div className="absolute pointer-events-none animate-drift1"
            style={{
              top: "38%", left: "44%",
              transform: "translate(-50%, -50%)",
              width: 480, height: 480,
              background: "radial-gradient(circle, rgba(88,28,220,0.13) 0%, rgba(67,20,180,0.05) 40%, transparent 68%)",
              filter: "blur(48px)",
            }} />
          <div className="absolute pointer-events-none animate-drift2"
            style={{
              top: "-10%", right: "-8%",
              width: 340, height: 340,
              background: "radial-gradient(circle, rgba(109,40,217,0.14) 0%, transparent 58%)",
              filter: "blur(60px)",
            }} />
          <div className="absolute pointer-events-none animate-drift3"
            style={{
              bottom: "-8%", left: "-6%",
              width: 280, height: 280,
              background: "radial-gradient(circle, rgba(76,29,149,0.10) 0%, transparent 62%)",
              filter: "blur(55px)",
            }} />

          {/* ── Concentric rings — small, subtle, pulsing ── */}
          <div className="absolute pointer-events-none rounded-full animate-pulse-ring"
            style={{
              top: "50%", left: "44%",
              transform: "translate(-50%, -50%)",
              width: 320, height: 320,
              border: "1px solid rgba(124,58,237,1)",
            }} />
          <div className="absolute pointer-events-none rounded-full"
            style={{
              top: "50%", left: "44%",
              transform: "translate(-50%, -50%)",
              width: 200, height: 200,
              border: "1px solid rgba(139,92,246,0.09)",
            }} />
          <div className="absolute pointer-events-none rounded-full"
            style={{
              top: "50%", left: "44%",
              transform: "translate(-50%, -50%)",
              width: 108, height: 108,
              border: "1px solid rgba(167,139,250,0.12)",
            }} />

          {/* Floating glass orb — small top-right */}
          <div className="absolute pointer-events-none rounded-full animate-drift2"
            style={{
              top: "16%", right: "18%",
              width: 80, height: 80,
              background: "radial-gradient(circle at 35% 30%, rgba(124,58,237,0.16) 0%, rgba(91,33,182,0.04) 55%, transparent 100%)",
              border: "1px solid rgba(167,139,250,0.09)",
              backdropFilter: "blur(4px)",
            }} />
          {/* Micro orb bottom-left */}
          <div className="absolute pointer-events-none rounded-full animate-drift3"
            style={{
              bottom: "22%", left: "20%",
              width: 44, height: 44,
              background: "radial-gradient(circle at 40% 30%, rgba(109,40,217,0.14) 0%, transparent 70%)",
              border: "1px solid rgba(139,92,246,0.08)",
            }} />

          {/* Glowing dots */}
          <div className="absolute pointer-events-none rounded-full"
            style={{ top: "26%", left: "24%", width: 5, height: 5,
              background: "rgba(167,139,250,0.5)",
              boxShadow: "0 0 10px 3px rgba(124,58,237,0.28)" }} />
          <div className="absolute pointer-events-none rounded-full"
            style={{ bottom: "30%", right: "24%", width: 3, height: 3,
              background: "rgba(139,92,246,0.55)",
              boxShadow: "0 0 8px 2px rgba(109,40,217,0.26)" }} />

          {/* Thin cinematic horizontal line */}
          <div className="absolute pointer-events-none"
            style={{
              top: "52%", left: "6%", right: "6%", height: 1,
              background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.10) 28%, rgba(167,139,250,0.15) 50%, rgba(124,58,237,0.10) 72%, transparent)",
            }} />

          {/* Edge fades */}
          <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
            style={{ background: "linear-gradient(to top, #030008, transparent)" }} />
          <div className="absolute top-0 right-0 bottom-0 w-20 pointer-events-none"
            style={{ background: "linear-gradient(to left, #030008, transparent)" }} />

          {/* ── Logo ── */}
          <div className="relative z-10 px-14 pt-11 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)", boxShadow: "0 0 16px rgba(124,58,237,0.38)" }}>
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-[20px] font-black text-white tracking-tight">
                Wear<span style={{ color: "#A78BFA" }}>lyx</span>
              </span>
            </div>
          </div>

          {/* ── Hero — shifted up slightly ── */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-14 text-center"
            style={{ paddingBottom: "8vh" }}>

            {/* Radial glow behind title */}
            <div className="absolute pointer-events-none"
              style={{
                top: "50%", left: "50%",
                transform: "translate(-50%, -54%)",
                width: 440, height: 200,
                background: "radial-gradient(ellipse, rgba(88,28,220,0.10) 0%, transparent 68%)",
                filter: "blur(28px)",
              }} />

            {/* Overline badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{ background: "rgba(124,58,237,0.09)", border: "1px solid rgba(124,58,237,0.20)" }}>
              <Sparkles className="w-3 h-3 text-[#A78BFA]" />
              <span className="text-[11px] font-semibold text-[#C4B5FD] tracking-[0.14em] uppercase">
                Marketplace mode · France
              </span>
            </div>

            {/* Title */}
            <h1 className="font-black text-white tracking-tight leading-[1.05] mb-5"
              style={{ fontSize: "clamp(40px, 3.8vw, 60px)", maxWidth: 560 }}>
              Le futur de<br />
              <span className="animate-glow-text" style={{
                background: "linear-gradient(95deg, #E0D4FF 0%, #C4B5FD 35%, #A78BFA 65%, #7C3AED 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}>
                la seconde main.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[15px] text-white/35 leading-relaxed mb-12" style={{ maxWidth: 380 }}>
              Achète et vends des pièces de mode en quelques secondes grâce à l'intelligence artificielle.
            </p>

            {/* Perks — horizontal pills */}
            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              {[
                { icon: Zap,    text: "Vends en 10s avec l'IA" },
                { icon: Shield, text: "Paiements sécurisés" },
                { icon: Users,  text: "+50 000 membres" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                  }}>
                  <Icon className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span className="text-[12px] text-white/38 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Stats bar — minimal, elegant ── */}
          <div className="relative z-10 px-14 pb-11 flex-shrink-0">
            <div className="flex items-center gap-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 20 }}>
              {[["50K+", "membres"], ["1.2K", "ventes / jour"], ["4.8 ★", "satisfaction"]].map(([v, l]) => (
                <div key={l} className="flex flex-col">
                  <span className="text-[17px] font-black tracking-tight"
                    style={{ color: "rgba(255,255,255,0.65)" }}>{v}</span>
                  <span className="text-[10.5px] mt-0.5"
                    style={{ color: "rgba(255,255,255,0.20)" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            RIGHT — Auth panel (glassmorphism premium)
        ══════════════════════════════════════════ */}
        <div className="w-full lg:w-[460px] xl:w-[500px] flex-shrink-0 flex items-center justify-center relative"
          style={{
            background: "rgba(8,3,20,0.82)",
            backdropFilter: "blur(32px) saturate(180%)",
            borderLeft: "1px solid rgba(255,255,255,0.055)",
            boxShadow: "-32px 0 80px rgba(0,0,0,0.5)",
          }}>

          {/* Inner ambient from left side */}
          <div className="absolute left-0 top-0 bottom-0 w-40 pointer-events-none"
            style={{ background: "linear-gradient(to right, rgba(88,28,220,0.04), transparent)" }} />

          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent 5%, rgba(124,58,237,0.35) 50%, transparent 95%)" }} />
          {/* Bottom accent line */}
          <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent 20%, rgba(124,58,237,0.12) 50%, transparent 80%)" }} />

          <div className="relative z-10 w-full px-10 py-12 max-w-[400px]">

            {step !== "main" && (
              <button onClick={() => setStep("main")}
                className="flex items-center gap-1.5 text-[13px] text-white/28 hover:text-white/60 mb-8 transition-colors">
                <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Retour
              </button>
            )}

            {/* ── MAIN ── */}
            {step === "main" && (
              <div>
                <div className="mb-9">
                  <h2 className="text-[27px] font-black text-white tracking-tight mb-2 leading-tight">Bon retour !</h2>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.30)" }}>
                    Connecte-toi pour accéder à ton compte.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  {/* Google */}
                  <button onClick={handleGoogle} disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 py-[13px] rounded-2xl text-[14px] font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
                    style={{
                      background: "rgba(255,255,255,0.055)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: "rgba(255,255,255,0.78)",
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(255,255,255,0.085)";
                      el.style.borderColor = "rgba(255,255,255,0.14)";
                      el.style.transform = "translateY(-1px)";
                      el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(255,255,255,0.055)";
                      el.style.borderColor = "rgba(255,255,255,0.09)";
                      el.style.transform = "";
                      el.style.boxShadow = "";
                    }}>
                    {googleLoading
                      ? <span className="rounded-full border-2 border-white/30 border-t-white animate-spin" style={{ width: 18, height: 18 }} />
                      : <><GoogleIcon /> Continuer avec Google</>}
                  </button>

                  <div className="flex items-center gap-3 my-0.5">
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.15)" }}>ou</span>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                  </div>

                  <MethodBtn icon={<Mail className="w-4 h-4 flex-shrink-0" />} label="Email" sub="Connexion par mot de passe" onClick={() => setStep("email")} />
                  <MethodBtn icon={<Phone className="w-4 h-4 flex-shrink-0" />} label="Téléphone" sub="Connexion par SMS" onClick={() => setStep("phone")} />
                </div>

                {error && <p className="mt-4 text-[13px] text-red-400 text-center">{error}</p>}

                {/* Benefits grid */}
                <div className="mt-7 grid grid-cols-2 gap-1.5">
                  {[
                    { icon: Zap,     text: "Vends en 10s avec l'IA" },
                    { icon: Shield,  text: "Paiements sécurisés" },
                    { icon: Package, text: "32K+ articles" },
                    { icon: Users,   text: "+50K membres" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#8B5CF6" }} />
                      <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.30)" }}>{text}</span>
                    </div>
                  ))}
                </div>

                <p className="text-center text-[12.5px] mt-6" style={{ color: "rgba(255,255,255,0.20)" }}>
                  Pas encore de compte ?{" "}
                  <Link href="/auth/signup" className="font-semibold hover:text-[#C4B5FD] transition-colors" style={{ color: "#A78BFA" }}>
                    Créer un compte
                  </Link>
                </p>
              </div>
            )}

            {/* ── EMAIL ── */}
            {step === "email" && (
              <div>
                <StepHead icon={<Mail className="w-5 h-5 text-[#A78BFA]" />} title="Connexion par email" sub="Entre ton adresse et ton mot de passe." />
                <form onSubmit={handleEmail} className="flex flex-col gap-3">
                  <Field type="email" placeholder="Adresse email" value={email} onChange={setEmail} icon={<Mail className="w-4 h-4" />} />
                  <div className="relative">
                    <Field type={showPwd ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={setPassword} icon={<Lock className="w-4 h-4" />} />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)"; }}>
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {error && <p className="text-[13px] text-red-400">{error}</p>}
                  <Btn loading={loading}>Se connecter</Btn>
                  <button type="button" onClick={() => setStep("forgot")}
                    className="text-[12px] transition-colors text-center pt-1"
                    style={{ color: "rgba(255,255,255,0.22)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)"; }}>
                    Mot de passe oublié ?
                  </button>
                </form>
              </div>
            )}

            {/* ── PHONE ── */}
            {step === "phone" && (
              <div>
                <StepHead icon={<Phone className="w-5 h-5 text-[#A78BFA]" />} title="Par téléphone" sub="On t'envoie un code par SMS." />
                <form onSubmit={handlePhone} className="flex flex-col gap-3">
                  <Field type="tel" placeholder="+33 6 00 00 00 00" value={phone} onChange={setPhone} icon={<Phone className="w-4 h-4" />} />
                  {error && <p className="text-[13px] text-red-400">{error}</p>}
                  <Btn loading={loading}>Envoyer le code</Btn>
                </form>
              </div>
            )}

            {/* ── OTP ── */}
            {step === "phone-otp" && (
              <div>
                <StepHead icon={<Sparkles className="w-5 h-5 text-[#A78BFA]" />} title="Code de vérification" sub={`Code envoyé au ${phone}.`} />
                <form onSubmit={handleOtp} className="flex flex-col gap-6">
                  <div className="flex gap-2">
                    {otpDigits.map((d, i) => (
                      <input key={i} ref={el => { otpRefs.current[i] = el; }}
                        type="text" inputMode="numeric" maxLength={1} value={d}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => { if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i - 1]?.focus(); }}
                        className="h-14 flex-1 rounded-2xl text-center text-xl font-black text-white outline-none transition-all caret-transparent"
                        style={{
                          background: d ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.05)",
                          border: d ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.09)",
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
                <StepHead icon={<Lock className="w-5 h-5 text-[#A78BFA]" />} title="Mot de passe oublié" sub="On t'envoie un lien de réinitialisation." />
                <form onSubmit={handleForgot} className="flex flex-col gap-3">
                  <Field type="email" placeholder="Ton adresse email" value={forgotEmail} onChange={setForgotEmail} icon={<Mail className="w-4 h-4" />} />
                  {error && <p className="text-[13px] text-red-400">{error}</p>}
                  <Btn loading={loading}>Envoyer le lien</Btn>
                </form>
              </div>
            )}

            {/* ── FORGOT SENT ── */}
            {step === "forgot-sent" && (
              <div>
                <div className="rounded-2xl flex items-center justify-center mb-6"
                  style={{ width: 52, height: 52, background: "rgba(16,185,129,0.09)", border: "1px solid rgba(16,185,129,0.20)" }}>
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-[26px] font-black text-white tracking-tight mb-2">Email envoyé !</h2>
                <p className="text-[14px] mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.30)" }}>
                  Vérifie ta boîte mail et clique sur le lien pour réinitialiser ton mot de passe.
                </p>
                <button onClick={() => setStep("main")}
                  className="flex items-center gap-1.5 text-[13.5px] font-semibold transition-colors"
                  style={{ color: "#A78BFA" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#C4B5FD"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}>
                  Retour à la connexion <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Reusables ── */
function StepHead({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="mb-8">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.18)" }}>
        {icon}
      </div>
      <h2 className="text-[26px] font-black text-white tracking-tight mb-1.5">{title}</h2>
      <p className="text-[13.5px]" style={{ color: "rgba(255,255,255,0.30)" }}>{sub}</p>
    </div>
  );
}

function MethodBtn({ icon, label, sub, onClick }: { icon: React.ReactNode; label: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-left transition-all group"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(8px)",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "rgba(124,58,237,0.07)";
        el.style.borderColor = "rgba(124,58,237,0.26)";
        el.style.transform = "translateY(-1px)";
        el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "rgba(255,255,255,0.03)";
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.transform = "";
        el.style.boxShadow = "";
      }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.40)" }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[13.5px] font-semibold" style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>{sub}</p>
      </div>
      <ArrowRight className="w-3.5 h-3.5 transition-all"
        style={{ color: "rgba(255,255,255,0.13)" }}
        onMouseEnter={e => { (e.currentTarget as SVGElement).style.color = "rgba(255,255,255,0.38)"; }}
        onMouseLeave={e => { (e.currentTarget as SVGElement).style.color = "rgba(255,255,255,0.13)"; }} />
    </button>
  );
}

function Field({ type = "text", placeholder, value, onChange, icon }: {
  type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-[13px] rounded-2xl transition-all"
      style={{
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
      onFocus={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.50)";
        (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.06)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)";
      }}
      onBlur={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.035)";
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}>
      {icon && <span className="flex-shrink-0" style={{ color: "rgba(255,255,255,0.26)" }}>{icon}</span>}
      <input type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[14.5px] text-white outline-none"
        style={{ caretColor: "#A78BFA" }}
        placeholder-style="color: rgba(255,255,255,0.20)" />
    </div>
  );
}

function Btn({ children, loading }: { children: React.ReactNode; loading?: boolean }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14.5px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 mt-1"
      style={{
        background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
        boxShadow: "0 4px 20px rgba(124,58,237,0.30), inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 8px 32px rgba(124,58,237,0.48), inset 0 1px 0 rgba(255,255,255,0.16)";
        el.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 4px 20px rgba(124,58,237,0.30), inset 0 1px 0 rgba(255,255,255,0.12)";
        el.style.transform = "";
      }}>
      {loading
        ? <span className="rounded-full border-2 border-white/30 border-t-white animate-spin" style={{ width: 20, height: 20 }} />
        : children}
    </button>
  );
}
