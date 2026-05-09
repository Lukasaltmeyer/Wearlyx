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
    <div className="min-h-[100dvh] w-full flex" style={{ background: "#030008" }}>

      {/* ══════════════════════════════════════════
          LEFT — Immersive brand stage
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col">

        {/* ── Atmosphere: layered glows ── */}
        {/* Primary orb — deep centre, large, very soft */}
        <div className="absolute pointer-events-none"
          style={{
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900, height: 900,
            background: "radial-gradient(circle, rgba(88,28,220,0.11) 0%, rgba(67,20,180,0.05) 35%, transparent 65%)",
            filter: "blur(60px)",
          }} />
        {/* Top-right accent */}
        <div className="absolute pointer-events-none"
          style={{
            top: "-20%", right: "-15%",
            width: 600, height: 600,
            background: "radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 55%)",
            filter: "blur(80px)",
          }} />
        {/* Bottom-left whisper */}
        <div className="absolute pointer-events-none"
          style={{
            bottom: "-15%", left: "-10%",
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(76,29,149,0.10) 0%, transparent 60%)",
            filter: "blur(70px)",
          }} />

        {/* ── Abstract geometry ── */}
        {/* Large outer ring — faint */}
        <div className="absolute pointer-events-none rounded-full"
          style={{
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 680, height: 680,
            border: "1px solid rgba(124,58,237,0.07)",
          }} />
        {/* Mid ring */}
        <div className="absolute pointer-events-none rounded-full"
          style={{
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 440, height: 440,
            border: "1px solid rgba(139,92,246,0.09)",
          }} />
        {/* Inner ring */}
        <div className="absolute pointer-events-none rounded-full"
          style={{
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 240, height: 240,
            border: "1px solid rgba(167,139,250,0.11)",
          }} />

        {/* Floating glass orb — large, blurred, top-right quadrant */}
        <div className="absolute pointer-events-none rounded-full"
          style={{
            top: "12%", right: "14%",
            width: 180, height: 180,
            background: "radial-gradient(circle at 35% 35%, rgba(124,58,237,0.14) 0%, rgba(91,33,182,0.05) 55%, transparent 100%)",
            border: "1px solid rgba(167,139,250,0.08)",
            backdropFilter: "blur(2px)",
          }} />
        {/* Floating glass orb — small, bottom-left quadrant */}
        <div className="absolute pointer-events-none rounded-full"
          style={{
            bottom: "18%", left: "18%",
            width: 96, height: 96,
            background: "radial-gradient(circle at 40% 30%, rgba(109,40,217,0.12) 0%, transparent 70%)",
            border: "1px solid rgba(139,92,246,0.07)",
          }} />
        {/* Micro dot accent top-left area */}
        <div className="absolute pointer-events-none rounded-full"
          style={{
            top: "28%", left: "22%",
            width: 6, height: 6,
            background: "rgba(167,139,250,0.45)",
            boxShadow: "0 0 12px 4px rgba(124,58,237,0.3)",
          }} />
        {/* Micro dot bottom-right */}
        <div className="absolute pointer-events-none rounded-full"
          style={{
            bottom: "28%", right: "22%",
            width: 4, height: 4,
            background: "rgba(139,92,246,0.5)",
            boxShadow: "0 0 10px 3px rgba(109,40,217,0.28)",
          }} />

        {/* Thin horizontal line — cinematic divider */}
        <div className="absolute pointer-events-none"
          style={{
            top: "50%", left: "8%", right: "8%", height: 1,
            background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.12) 30%, rgba(167,139,250,0.16) 50%, rgba(124,58,237,0.12) 70%, transparent)",
          }} />

        {/* Bottom fade — blends left into background */}
        <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to top, #030008, transparent)" }} />
        {/* Right edge fade — bleeds into login panel */}
        <div className="absolute top-0 right-0 bottom-0 w-24 pointer-events-none"
          style={{ background: "linear-gradient(to left, #030008, transparent)" }} />

        {/* ── Logo ── */}
        <div className="relative z-10 px-14 pt-12 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
                boxShadow: "0 0 18px rgba(124,58,237,0.4)",
              }}>
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-[20px] font-black text-white tracking-tight">
              Wear<span style={{ color: "#A78BFA" }}>lyx</span>
            </span>
          </div>
        </div>

        {/* ── Hero content — centred vertically ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-14 text-center">

          {/* Overline badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10"
            style={{
              background: "rgba(124,58,237,0.10)",
              border: "1px solid rgba(124,58,237,0.22)",
            }}>
            <Sparkles className="w-3 h-3 text-[#A78BFA]" />
            <span className="text-[11px] font-semibold text-[#C4B5FD] tracking-[0.14em] uppercase">
              Marketplace mode · France
            </span>
          </div>

          {/* Title */}
          <h1 className="font-black text-white tracking-tight leading-[1.05] mb-6"
            style={{ fontSize: "clamp(42px, 4vw, 64px)", maxWidth: 600 }}>
            Le futur de<br />
            <span style={{
              background: "linear-gradient(95deg, #E0D4FF 0%, #C4B5FD 35%, #A78BFA 65%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              la seconde main.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] text-white/38 leading-relaxed mb-14" style={{ maxWidth: 420 }}>
            Achète et vends des pièces de mode en quelques secondes grâce à l'intelligence artificielle.
          </p>

          {/* Perks — horizontal pill list */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {[
              { icon: Zap,     text: "Vends en 10s avec l'IA" },
              { icon: Shield,  text: "Paiements sécurisés" },
              { icon: Users,   text: "+50 000 membres" },
            ].map(({ icon: Icon, text }) => (
              <div key={text}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(8px)",
                }}>
                <Icon className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span className="text-[12px] text-white/42 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom stats bar ── */}
        <div className="relative z-10 px-14 pb-12 flex-shrink-0">
          <div className="flex items-center gap-8">
            {[["50K+", "membres"], ["1.2K", "ventes/jour"], ["4.8★", "satisfaction"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-[18px] font-black text-white/80 leading-none">{v}</p>
                <p className="text-[11px] text-white/24 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT — Auth panel
      ══════════════════════════════════════════ */}
      <div className="w-full lg:w-[460px] xl:w-[500px] flex-shrink-0 flex items-center justify-center relative"
        style={{ background: "#050010", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Subtle inner glow from left — connects both panels */}
        <div className="absolute left-0 top-0 bottom-0 w-48 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(88,28,220,0.05), transparent)" }} />

        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 10%, rgba(124,58,237,0.3) 50%, transparent 90%)" }} />

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
              <div className="mb-8">
                <h2 className="text-[28px] font-black text-white tracking-tight mb-1.5 leading-tight">Bon retour !</h2>
                <p className="text-[14px] text-white/32 leading-relaxed">Connecte-toi pour accéder à ton compte.</p>
              </div>

              <div className="flex flex-col gap-2.5">
                {/* Google */}
                <button onClick={handleGoogle} disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-[14px] font-semibold text-white/80 transition-all active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.16)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
                  {googleLoading
                    ? <span className="rounded-full border-2 border-white/30 border-t-white animate-spin" style={{ width: 18, height: 18 }} />
                    : <><GoogleIcon /> Continuer avec Google</>}
                </button>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <span className="text-[10.5px] text-white/18 font-bold tracking-widest uppercase">ou</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                </div>

                <MethodBtn icon={<Mail className="w-4 h-4 flex-shrink-0" />} label="Email" sub="Connexion par mot de passe" onClick={() => setStep("email")} />
                <MethodBtn icon={<Phone className="w-4 h-4 flex-shrink-0" />} label="Téléphone" sub="Connexion par SMS" onClick={() => setStep("phone")} />
              </div>

              {error && <p className="mt-4 text-[13px] text-red-400 text-center">{error}</p>}

              {/* Minimal stats */}
              <div className="mt-7 grid grid-cols-2 gap-2">
                {[
                  { icon: Zap,     text: "Vends en 10s avec l'IA" },
                  { icon: Shield,  text: "Paiements sécurisés" },
                  { icon: Package, text: "32K+ articles" },
                  { icon: Users,   text: "+50K membres" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <Icon className="w-3.5 h-3.5 text-[#7C3AED] flex-shrink-0" />
                    <span className="text-[11px] text-white/35 font-medium">{text}</span>
                  </div>
                ))}
              </div>

              <p className="text-center text-[12.5px] text-white/22 mt-6">
                Pas encore de compte ?{" "}
                <Link href="/auth/signup" className="text-[#A78BFA] font-semibold hover:text-[#C4B5FD] transition-colors">
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-[13px] text-red-400">{error}</p>}
                <Btn loading={loading}>Se connecter</Btn>
                <button type="button" onClick={() => setStep("forgot")}
                  className="text-[12px] text-white/25 hover:text-[#A78BFA] transition-colors text-center pt-1">
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
                      style={{ background: d ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.05)", border: d ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.1)" }} />
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
                style={{ width: 52, height: 52, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.22)" }}>
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-[26px] font-black text-white tracking-tight mb-2">Email envoyé !</h2>
              <p className="text-[14px] text-white/32 mb-8 leading-relaxed">
                Vérifie ta boîte mail et clique sur le lien pour réinitialiser ton mot de passe.
              </p>
              <button onClick={() => setStep("main")}
                className="flex items-center gap-1.5 text-[13.5px] text-[#A78BFA] font-semibold hover:text-[#C4B5FD] transition-colors">
                Retour à la connexion <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Reusables ── */
function StepHead({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="mb-8">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.18)" }}>
        {icon}
      </div>
      <h2 className="text-[26px] font-black text-white tracking-tight mb-1.5">{title}</h2>
      <p className="text-[13.5px] text-white/32">{sub}</p>
    </div>
  );
}

function MethodBtn({ icon, label, sub, onClick }: { icon: React.ReactNode; label: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-left transition-all group"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.055)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.28)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white/40"
        style={{ background: "rgba(255,255,255,0.05)" }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[13.5px] font-semibold text-white/70">{label}</p>
        <p className="text-[11px] text-white/28">{sub}</p>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-white/14 group-hover:text-white/38 group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}

function Field({ type = "text", placeholder, value, onChange, icon }: {
  type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-[13px] rounded-2xl transition-all"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.55)"; (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.05)"; }}
      onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}>
      {icon && <span className="text-white/28 flex-shrink-0">{icon}</span>}
      <input type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[14.5px] text-white placeholder-white/22 outline-none" />
    </div>
  );
}

function Btn({ children, loading }: { children: React.ReactNode; loading?: boolean }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14.5px] font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 mt-1"
      style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)", boxShadow: "0 4px 18px rgba(124,58,237,0.28)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(124,58,237,0.42)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 18px rgba(124,58,237,0.28)"; }}>
      {loading
        ? <span className="rounded-full border-2 border-white/30 border-t-white animate-spin" style={{ width: 20, height: 20 }} />
        : children}
    </button>
  );
}
