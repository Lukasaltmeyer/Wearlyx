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

/* ── Scattered product cards data ── */
const CARDS = [
  { title: "Nike Tech Fleece",   price: "89 €",  size: "M",   brand: "Nike",      color: "#8B5CF6", emoji: "🧥", rotate: "-6deg",  x: "8%",  y: "12%" },
  { title: "Jordan 4 Retro OG",  price: "245 €", size: "42",  brand: "Jordan",    color: "#F59E0B", emoji: "👟", rotate: "4deg",   x: "52%", y: "6%"  },
  { title: "Sac Jacquemus Mini", price: "145 €", size: "OS",  brand: "Jacquemus", color: "#EC4899", emoji: "👜", rotate: "-3deg",  x: "72%", y: "28%" },
  { title: "Blazer Zara 2024",   price: "38 €",  size: "S",   brand: "Zara",      color: "#10B981", emoji: "🧣", rotate: "7deg",   x: "18%", y: "54%" },
  { title: "Cap Supreme Box",    price: "62 €",  size: "OS",  brand: "Supreme",   color: "#EF4444", emoji: "🧢", rotate: "-5deg",  x: "60%", y: "58%" },
  { title: "Vintage Levi's 501", price: "55 €",  size: "28",  brand: "Levi's",    color: "#3B82F6", emoji: "👖", rotate: "3deg",   x: "35%", y: "72%" },
];

const NOTIFS = [
  { text: "Nike Tech vendue", sub: "il y a 2 min",    color: "#10B981", icon: "💚" },
  { text: "+34 en ligne",      sub: "maintenant",      color: "#8B5CF6", icon: "👥" },
  { text: "Offre reçue",       sub: "Jordan 4 · 200€", color: "#F59E0B", icon: "✨" },
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
    <div className="min-h-[100dvh] w-full flex" style={{ background: "#050208" }}>

      {/* ══════════════════════════════════════════
          LEFT — Immersive visual stage
      ══════════════════════════════════════════ */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">

        {/* ── Deep cinematic background ── */}
        <div className="absolute inset-0" style={{ background: "#050208" }} />

        {/* Focused light sources — small & directional, NOT one giant blob */}
        <div className="absolute pointer-events-none"
          style={{ top: "-10%", left: "-5%", width: 480, height: 480,
            background: "radial-gradient(circle, rgba(109,40,217,0.28) 0%, transparent 65%)",
            filter: "blur(70px)" }} />
        <div className="absolute pointer-events-none"
          style={{ bottom: "5%", right: "10%", width: 360, height: 360,
            background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 65%)",
            filter: "blur(60px)" }} />
        <div className="absolute pointer-events-none"
          style={{ top: "40%", left: "55%", width: 280, height: 280,
            background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 65%)",
            filter: "blur(50px)" }} />
        <div className="absolute pointer-events-none"
          style={{ top: "15%", right: "5%", width: 200, height: 200,
            background: "radial-gradient(circle, rgba(88,28,220,0.2) 0%, transparent 70%)",
            filter: "blur(40px)" }} />

        {/* Very fine dot texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.018]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* ── Scattered product cards ── */}
        <div className="absolute inset-0">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="absolute"
              style={{
                left: c.x, top: c.y,
                transform: `rotate(${c.rotate})`,
                width: 158,
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.7))",
              }}>
              <div className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                }}>
                {/* Image area */}
                <div className="relative flex items-center justify-center"
                  style={{
                    height: 130,
                    background: `linear-gradient(145deg, ${c.color}20 0%, ${c.color}08 100%)`,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}>
                  <span style={{ fontSize: 44, opacity: 0.7 }}>{c.emoji}</span>
                  {/* Brand badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[9px] font-black"
                    style={{ background: `${c.color}22`, color: c.color, border: `1px solid ${c.color}35` }}>
                    {c.brand}
                  </div>
                  {/* Fav */}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
                    <Heart className="w-3 h-3 text-white/40" />
                  </div>
                </div>
                {/* Info */}
                <div className="px-3 py-2.5">
                  <p className="text-[11px] font-bold text-white/80 truncate mb-0.5">{c.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-black text-white">{c.price}</span>
                    <span className="text-[9px] text-white/30 font-medium">{c.size}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Floating notification pills ── */}
        <div className="absolute" style={{ bottom: "30%", left: "6%", zIndex: 10 }}>
          {NOTIFS.map((n, i) => (
            <div key={n.text}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl mb-2"
              style={{
                background: "rgba(10,5,20,0.75)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(14px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                transform: `translateX(${i * 8}px)`,
              }}>
              <span style={{ fontSize: 14 }}>{n.icon}</span>
              <div>
                <p className="text-[11.5px] font-bold text-white leading-none mb-0.5">{n.text}</p>
                <p className="text-[9.5px]" style={{ color: n.color }}>{n.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Logo ── */}
        <div className="absolute top-10 left-10 z-20 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", boxShadow: "0 0 16px rgba(139,92,246,0.45)" }}>
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-[20px] font-black text-white tracking-tight">
            Wear<span style={{ color: "#C4B5FD" }}>lyx</span>
          </span>
        </div>

        {/* ── Hero text — bottom left overlay ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-12 pb-12 pt-32"
          style={{ background: "linear-gradient(to top, rgba(5,2,8,0.92) 0%, rgba(5,2,8,0.6) 60%, transparent 100%)" }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35 mb-3">
            Marketplace mode · France
          </p>
          <h1 className="text-[44px] xl:text-[52px] font-black text-white tracking-tight leading-[1.08] mb-4">
            Le futur de<br />
            <span style={{
              background: "linear-gradient(90deg, #E0D7FF 0%, #C4B5FD 40%, #A78BFA 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              la seconde main.
            </span>
          </h1>
          <div className="flex items-center gap-6">
            {[["50K+", "membres"], ["1.2K", "ventes/jour"], ["4.8★", "note"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-[18px] font-black text-white">{v}</p>
                <p className="text-[11px] text-white/30">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT — Auth panel
      ══════════════════════════════════════════ */}
      <div className="w-full lg:w-[460px] xl:w-[500px] flex-shrink-0 flex items-center justify-center relative"
        style={{ background: "#07070A", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Ambient top glow */}
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)", filter: "blur(20px)" }} />

        <div className="relative z-10 w-full px-10 py-12 max-w-[420px]">

          {step !== "main" && (
            <button onClick={() => setStep("main")}
              className="flex items-center gap-1.5 text-[13px] text-white/30 hover:text-white/60 mb-8 transition-colors">
              <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Retour
            </button>
          )}

          {/* ── MAIN ── */}
          {step === "main" && (
            <div>
              <div className="mb-9">
                <h2 className="text-[30px] font-black text-white tracking-tight mb-1.5">Bon retour !</h2>
                <p className="text-[14.5px] text-white/35 leading-relaxed">Connecte-toi pour accéder à ton compte.</p>
              </div>

              <div className="flex flex-col gap-2.5">
                {/* Google */}
                <button onClick={handleGoogle} disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-[14px] rounded-2xl text-[14.5px] font-semibold text-white/85 transition-all active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.11)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.11)"; }}>
                  {googleLoading
                    ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    : <><GoogleIcon /><span>Continuer avec Google</span></>}
                </button>

                <div className="flex items-center gap-3 my-0.5">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <span className="text-[11px] text-white/20 font-bold tracking-widest">OU</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                </div>

                <PrimaryMethodBtn icon={<Mail className="w-4 h-4 flex-shrink-0" />} label="Email" sub="Mot de passe ou magic link" onClick={() => setStep("email")} />
                <PrimaryMethodBtn icon={<Phone className="w-4 h-4 flex-shrink-0" />} label="Téléphone" sub="Code SMS" onClick={() => setStep("phone")} />
              </div>

              {error && <p className="mt-4 text-[13px] text-red-400 text-center">{error}</p>}

              {/* Perks strip */}
              <div className="mt-8 grid grid-cols-2 gap-2">
                {[
                  { icon: Zap,     text: "Vends en 10s avec l'IA" },
                  { icon: Shield,  text: "Paiements sécurisés" },
                  { icon: Package, text: "32K+ articles" },
                  { icon: Users,   text: "+50K membres" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.055)" }}>
                    <Icon className="w-3.5 h-3.5 flex-shrink-0 text-[#A78BFA]" />
                    <span className="text-[11.5px] text-white/40 font-medium">{text}</span>
                  </div>
                ))}
              </div>

              <p className="text-center text-[13px] text-white/22 mt-7">
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
              <StepHeader icon={<Mail className="w-5 h-5 text-[#A78BFA]" />} title="Connexion par email" sub="Entre ton adresse et ton mot de passe." />
              <form onSubmit={handleEmail} className="flex flex-col gap-3">
                <AuthInput type="email" placeholder="Adresse email" value={email} onChange={setEmail} icon={<Mail className="w-4 h-4" />} />
                <div className="relative">
                  <AuthInput type={showPwd ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={setPassword} icon={<Lock className="w-4 h-4" />} />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-[13px] text-red-400">{error}</p>}
                <AuthBtn loading={loading}>Se connecter</AuthBtn>
                <button type="button" onClick={() => setStep("forgot")}
                  className="text-[12.5px] text-white/25 hover:text-[#A78BFA] transition-colors text-center pt-1">
                  Mot de passe oublié ?
                </button>
              </form>
            </div>
          )}

          {/* ── PHONE ── */}
          {step === "phone" && (
            <div>
              <StepHeader icon={<Phone className="w-5 h-5 text-[#A78BFA]" />} title="Par téléphone" sub="On t'envoie un code par SMS." />
              <form onSubmit={handlePhone} className="flex flex-col gap-3">
                <AuthInput type="tel" placeholder="+33 6 00 00 00 00" value={phone} onChange={setPhone} icon={<Phone className="w-4 h-4" />} />
                {error && <p className="text-[13px] text-red-400">{error}</p>}
                <AuthBtn loading={loading}>Envoyer le code</AuthBtn>
              </form>
            </div>
          )}

          {/* ── OTP ── */}
          {step === "phone-otp" && (
            <div>
              <StepHeader icon={<Sparkles className="w-5 h-5 text-[#A78BFA]" />} title="Code de vérification" sub={`Code envoyé au ${phone}.`} />
              <form onSubmit={handleOtp} className="flex flex-col gap-6">
                <div className="flex gap-2">
                  {otpDigits.map((d, i) => (
                    <input key={i} ref={el => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => { if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i - 1]?.focus(); }}
                      className="h-14 flex-1 rounded-2xl text-center text-xl font-black text-white outline-none transition-all caret-transparent"
                      style={{ background: d ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.05)", border: d ? "1px solid rgba(139,92,246,0.55)" : "1px solid rgba(255,255,255,0.1)" }}
                    />
                  ))}
                </div>
                {error && <p className="text-[13px] text-red-400 text-center">{error}</p>}
                <AuthBtn loading={loading}>Vérifier</AuthBtn>
              </form>
            </div>
          )}

          {/* ── FORGOT ── */}
          {step === "forgot" && (
            <div>
              <StepHeader icon={<Lock className="w-5 h-5 text-[#A78BFA]" />} title="Mot de passe oublié" sub="On t'envoie un lien de réinitialisation." />
              <form onSubmit={handleForgot} className="flex flex-col gap-3">
                <AuthInput type="email" placeholder="Ton adresse email" value={forgotEmail} onChange={setForgotEmail} icon={<Mail className="w-4 h-4" />} />
                {error && <p className="text-[13px] text-red-400">{error}</p>}
                <AuthBtn loading={loading}>Envoyer le lien</AuthBtn>
              </form>
            </div>
          )}

          {/* ── FORGOT SENT ── */}
          {step === "forgot-sent" && (
            <div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", boxShadow: "0 0 24px rgba(16,185,129,0.1)" }}>
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-[28px] font-black text-white tracking-tight mb-2">Email envoyé !</h2>
              <p className="text-[14px] text-white/35 mb-8 leading-relaxed">
                Vérifie ta boîte mail et clique sur le lien pour réinitialiser ton mot de passe.
              </p>
              <button onClick={() => setStep("main")}
                className="flex items-center gap-1.5 text-[14px] text-[#A78BFA] font-semibold hover:text-[#C4B5FD] transition-colors">
                Retour à la connexion <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Reusable sub-components ── */

function StepHeader({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="mb-8">
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
        {icon}
      </div>
      <h2 className="text-[27px] font-black text-white tracking-tight mb-1.5">{title}</h2>
      <p className="text-[14px] text-white/35">{sub}</p>
    </div>
  );
}

function PrimaryMethodBtn({ icon, label, sub, onClick }: {
  icon: React.ReactNode; label: string; sub: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-left transition-all group"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.055)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.3)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white/50"
        style={{ background: "rgba(255,255,255,0.06)" }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-semibold text-white/75">{label}</p>
        <p className="text-[11px] text-white/30">{sub}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </button>
  );
}

function AuthInput({ type = "text", placeholder, value, onChange, icon }: {
  type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-[14px] rounded-2xl transition-all"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.55)"; (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.05)"; }}
      onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}>
      {icon && <span className="text-white/28 flex-shrink-0">{icon}</span>}
      <input type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[15px] text-white placeholder-white/22 outline-none" />
    </div>
  );
}

function AuthBtn({ children, loading }: { children: React.ReactNode; loading?: boolean }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-[14px] rounded-2xl text-[15px] font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 mt-1"
      style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(139,92,246,0.45)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(139,92,246,0.3)"; }}>
      {loading
        ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        : children}
    </button>
  );
}
