"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Mail, Lock, Eye, EyeOff, Phone, ArrowRight,
  Sparkles, Shield, Zap, Star, CheckCircle, Package,
  Heart, Users
} from "lucide-react";
import { signInWithProvider, signInWithEmail, sendPasswordReset, signInWithPhone, verifyPhoneOtp } from "@/lib/auth";
import { GoogleIcon } from "../_components/AuthUI";

type Step = "main" | "email" | "phone" | "phone-otp" | "forgot" | "forgot-sent";

/* Product cards — structured showcase, not random scatter */
const SHOWCASE = [
  // Column 1 (left)
  [
    { title: "Nike Air Force 1",  price: "65 €",  brand: "Nike",      grad: ["#1a0533","#2d0f5e"], accent: "#8B5CF6", emoji: "👟" },
    { title: "Veste Carhartt",    price: "42 €",  brand: "Carhartt",  grad: ["#0a1f0a","#0f3012"], accent: "#10B981", emoji: "🧥" },
    { title: "Sac Jacquemus",     price: "145 €", brand: "Jacquemus", grad: ["#2a0f1a","#4a1228"], accent: "#EC4899", emoji: "👜" },
  ],
  // Column 2 (right, offset up)
  [
    { title: "Jordan 4 Retro",    price: "245 €", brand: "Jordan",    grad: ["#1a1200","#352400"], accent: "#F59E0B", emoji: "👟" },
    { title: "Cap Supreme",       price: "55 €",  brand: "Supreme",   grad: ["#1a0000","#330000"], accent: "#EF4444", emoji: "🧢" },
    { title: "Vintage Levi's",    price: "38 €",  brand: "Levi's",    grad: ["#001520","#002a3d"], accent: "#3B82F6", emoji: "👖" },
  ],
];

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
    <div className="min-h-[100dvh] w-full flex" style={{ background: "#040110" }}>

      {/* ══════════════════════════════════════════
          LEFT — Premium visual stage
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col">

        {/* ── Background — minimal, cinematic ── */}
        {/* Single soft glow, top-right, very diffuse */}
        <div className="absolute pointer-events-none"
          style={{ top: "-15%", right: "-10%", width: 700, height: 700,
            background: "radial-gradient(circle, rgba(88,28,220,0.13) 0%, transparent 60%)",
            filter: "blur(100px)" }} />
        {/* Accent bottom-left, barely visible */}
        <div className="absolute pointer-events-none"
          style={{ bottom: "-10%", left: "-5%", width: 500, height: 500,
            background: "radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 60%)",
            filter: "blur(80px)" }} />

        {/* Logo — top left */}
        <div className="relative z-10 px-12 pt-11 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)", boxShadow: "0 0 14px rgba(124,58,237,0.35)" }}>
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-[20px] font-black text-white tracking-tight">
              Wear<span style={{ color: "#A78BFA" }}>lyx</span>
            </span>
          </div>
        </div>

        {/* ── Main stage: text left + cards right ── */}
        <div className="relative z-10 flex-1 flex items-center px-12 gap-10 py-10">

          {/* TEXT COLUMN */}
          <div className="flex flex-col justify-center flex-shrink-0" style={{ width: 320 }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/28 mb-5">
              Marketplace mode · France
            </p>

            <h1 className="font-black text-white tracking-tight leading-[1.1] mb-5"
              style={{ fontSize: "clamp(34px, 3.2vw, 48px)" }}>
              Le futur de<br />
              <span style={{
                background: "linear-gradient(90deg, #D4CAFE 0%, #B39DFF 45%, #9166FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                la seconde main.
              </span>
            </h1>

            <p className="text-[15px] text-white/38 leading-relaxed mb-10">
              Achète et vends des pièces de mode en quelques secondes grâce à l'intelligence artificielle.
            </p>

            {/* Perks — minimal */}
            <div className="flex flex-col gap-2.5 mb-10">
              {[
                "Vends en 10 secondes avec l'IA",
                "Paiements 100% sécurisés",
                "+50 000 membres vérifiés",
              ].map(text => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#7C3AED" }} />
                  <span className="text-[13px] text-white/40">{text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-6"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {[["50K+", "membres"], ["1.2K", "ventes/jour"], ["4.8★", "note"]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-[20px] font-black text-white leading-none">{v}</p>
                  <p className="text-[11px] text-white/28 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CARDS COLUMN — structured 2-col showcase */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex gap-4 items-start">

              {/* Column 1 — normal position */}
              <div className="flex flex-col gap-4" style={{ marginTop: 32 }}>
                {SHOWCASE[0].map((card) => (
                  <ShowcaseCard key={card.title} card={card} />
                ))}
              </div>

              {/* Column 2 — offset up */}
              <div className="flex flex-col gap-4" style={{ marginTop: -16 }}>
                {SHOWCASE[1].map((card) => (
                  <ShowcaseCard key={card.title} card={card} />
                ))}
              </div>
            </div>

            {/* Subtle fade on edges so cards blend into bg */}
            <div className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none"
              style={{ background: "linear-gradient(to right, #040110, transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none"
              style={{ background: "linear-gradient(to left, #040110, transparent)" }} />
            <div className="absolute top-0 inset-x-0 h-20 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, #040110, transparent)" }} />
            <div className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
              style={{ background: "linear-gradient(to top, #040110, transparent)" }} />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT — Auth panel
      ══════════════════════════════════════════ */}
      <div className="w-full lg:w-[460px] xl:w-[500px] flex-shrink-0 flex items-center justify-center relative"
        style={{ background: "#06040f", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 10%, rgba(124,58,237,0.35) 50%, transparent 90%)" }} />

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
                    ? <span className="w-4.5 h-4.5 rounded-full border-2 border-white/30 border-t-white animate-spin" style={{ width: 18, height: 18 }} />
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

              {/* Benefits */}
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
              <div className="w-13 h-13 rounded-2xl flex items-center justify-center mb-6"
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

/* ── Showcase product card ── */
function ShowcaseCard({ card }: { card: typeof SHOWCASE[0][0] }) {
  return (
    <div className="rounded-2xl overflow-hidden flex-shrink-0"
      style={{
        width: 152,
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 24px 48px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.06)",
      }}>
      {/* Image area */}
      <div className="relative flex items-center justify-center"
        style={{ height: 120, background: `linear-gradient(145deg, ${card.grad[0]}, ${card.grad[1]})` }}>
        {/* Subtle inner glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${card.accent}20 0%, transparent 70%)` }} />
        <span style={{ fontSize: 38, opacity: 0.65, position: "relative", zIndex: 1 }}>{card.emoji}</span>
        {/* Brand chip */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold"
          style={{ background: `${card.accent}18`, color: card.accent, border: `1px solid ${card.accent}28` }}>
          {card.brand}
        </div>
        {/* Heart */}
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}>
          <Heart className="w-3 h-3 text-white/30" />
        </div>
      </div>
      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-[10.5px] font-semibold text-white/65 truncate mb-1">{card.title}</p>
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-black text-white">{card.price}</span>
          {/* Size dot */}
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: card.accent }} />
        </div>
      </div>
    </div>
  );
}

/* ── Small reusables ── */
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
        ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        : children}
    </button>
  );
}
