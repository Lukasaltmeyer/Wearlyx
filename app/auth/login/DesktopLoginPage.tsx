"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Mail, Lock, Eye, EyeOff, Phone, ArrowRight, Sparkles, Shield, Zap,
  Star, TrendingUp, Package, Heart, ShoppingBag, CheckCircle
} from "lucide-react";
import { signInWithProvider, signInWithEmail, sendPasswordReset, signInWithPhone, verifyPhoneOtp } from "@/lib/auth";
import { GoogleIcon } from "../_components/AuthUI";

type Step = "main" | "email" | "phone" | "phone-otp" | "forgot" | "forgot-sent";

/* ── Floating live activity cards ── */
const LIVE_ACTIVITY = [
  { user: "sophie_m",   action: "vient de vendre",   item: "Nike Air Force 1",     price: "65 €",  color: "#10B981" },
  { user: "king_v",     action: "a acheté",           item: "Veste Zara Vintage",   price: "28 €",  color: "#8B5CF6" },
  { user: "luxmode",    action: "a mis en ligne",     item: "Sac Jacquemus Mini",   price: "145 €", color: "#F59E0B" },
  { user: "lea.style",  action: "vient de vendre",   item: "Jordan 1 Retro OG",    price: "210 €", color: "#EF4444" },
];

const TRENDING = ["Nike Air Force 1", "Jacquemus", "Zara 2024", "Jordan 1 Retro", "Vintage Levi's"];

const STATS = [
  { value: "50 K+",  label: "membres" },
  { value: "1 200",  label: "ventes/jour" },
  { value: "4.8 ★",  label: "note moyenne" },
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
    <div className="min-h-[100dvh] flex" style={{ background: "#07070A" }}>

      {/* ══════════════════════════════
          LEFT — Immersive branding
      ══════════════════════════════ */}
      <div className="hidden lg:flex w-[54%] relative flex-col overflow-hidden"
        style={{ background: "linear-gradient(160deg, #080212 0%, #120428 25%, #1e0847 50%, #2d1070 75%, #4c1d95 100%)" }}>

        {/* Deep glow layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-120px] right-[-80px] w-[600px] h-[600px] rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 65%)", filter: "blur(60px)" }} />
          <div className="absolute bottom-[-100px] left-[-60px] w-[500px] h-[500px] rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #A78BFA 0%, transparent 65%)", filter: "blur(50px)" }} />
          <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #6D28D9 0%, transparent 65%)", filter: "blur(40px)" }} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        {/* Logo */}
        <div className="relative z-10 px-12 pt-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 16px rgba(139,92,246,0.4)" }}>
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-[22px] font-black text-white tracking-tight">
              Wear<span style={{ color: "#C4B5FD" }}>lyx</span>
            </span>
          </div>
        </div>

        {/* Main hero content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-12 py-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-[11px] font-bold text-[#A78BFA] tracking-wide uppercase"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
              La marketplace mode #1 en France
            </div>
            <h1 className="text-[52px] font-black text-white leading-[1.05] tracking-tight mb-4">
              Le futur de<br />
              <span style={{ background: "linear-gradient(90deg, #C4B5FD 0%, #A78BFA 40%, #8B5CF6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                la seconde main.
              </span>
            </h1>
            <p className="text-[17px] text-white/45 leading-relaxed max-w-[420px]">
              Achète et vends des pièces de mode en quelques secondes grâce à l'intelligence artificielle.
            </p>
          </div>

          {/* Live activity feed */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Activité en direct</p>
            </div>
            <div className="flex flex-col gap-2">
              {LIVE_ACTIVITY.map((a, i) => (
                <div key={i}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl backdrop-blur-sm"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", animationDelay: `${i * 0.15}s` }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black text-white"
                    style={{ background: `linear-gradient(135deg, ${a.color}60, ${a.color}30)`, border: `1px solid ${a.color}40` }}>
                    {a.user[0].toUpperCase()}
                  </div>
                  <p className="text-[12px] text-white/50 flex-1 min-w-0 truncate">
                    <span className="text-white/80 font-semibold">@{a.user}</span>
                    {" "}{a.action}{" "}
                    <span className="text-white/60">{a.item}</span>
                  </p>
                  <span className="text-[12px] font-black flex-shrink-0" style={{ color: a.color }}>{a.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending tags */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-white/30" />
              <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Tendances</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full text-[12px] font-semibold text-white/50"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats footer */}
        <div className="relative z-10 px-12 pb-10 flex items-center gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-[22px] font-black text-white leading-none">{value}</p>
              <p className="text-[12px] text-white/35 mt-0.5">{label}</p>
            </div>
          ))}
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 text-[11px] text-white/25">
            <Shield className="w-3.5 h-3.5" />
            Paiements sécurisés
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          RIGHT — Auth form
      ══════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-10 relative">
        {/* Subtle bg glow */}
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

        <div className="relative z-10 w-full max-w-[400px]">

          {step !== "main" && (
            <button onClick={() => setStep("main")}
              className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 mb-8 transition-colors">
              <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Retour
            </button>
          )}

          {/* ── MAIN ── */}
          {step === "main" && (
            <div>
              {/* Header */}
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(109,40,217,0.1))", border: "1px solid rgba(139,92,246,0.25)" }}>
                  <Sparkles className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h2 className="text-[30px] font-black text-white mb-2 tracking-tight">Bon retour !</h2>
                <p className="text-[15px] text-white/40 leading-relaxed">Connecte-toi pour accéder à ton compte Wearlyx.</p>
              </div>

              <div className="flex flex-col gap-3">
                {/* Google */}
                <button onClick={handleGoogle} disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-[14.5px] font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  {googleLoading
                    ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    : <><GoogleIcon /> Continuer avec Google</>}
                </button>

                <div className="flex items-center gap-3 my-1.5">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <span className="text-[11px] text-white/20 font-bold tracking-widest">OU</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                </div>

                <AuthMethodBtn icon={<Mail className="w-4.5 h-4.5" />} label="Continuer avec l'email" onClick={() => setStep("email")} />
                <AuthMethodBtn icon={<Phone className="w-4.5 h-4.5" />} label="Continuer avec le téléphone" onClick={() => setStep("phone")} />
              </div>

              {error && <p className="mt-4 text-[13px] text-red-400 text-center">{error}</p>}

              {/* Benefits */}
              <div className="mt-8 p-4 rounded-2xl" style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.12)" }}>
                <p className="text-[11px] font-bold text-[#A78BFA]/70 uppercase tracking-widest mb-3">Pourquoi Wearlyx ?</p>
                <div className="flex flex-col gap-2">
                  {[
                    { icon: Zap,         text: "Vends en 10 secondes avec l'IA" },
                    { icon: Shield,      text: "Paiements 100% sécurisés" },
                    { icon: Package,     text: "32 000+ articles disponibles" },
                    { icon: Heart,       text: "Communauté de +50 000 membres" },
                  ].map(({ text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#8B5CF6] flex-shrink-0" />
                      <span className="text-[12px] text-white/45">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-[13px] text-white/25 mt-6">
                Pas encore de compte ?{" "}
                <Link href="/auth/signup" className="text-[#A78BFA] font-semibold hover:text-[#C4B5FD] transition-colors">
                  Créer un compte gratuitement
                </Link>
              </p>
            </div>
          )}

          {/* ── EMAIL ── */}
          {step === "email" && (
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <Mail className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h2 className="text-[28px] font-black text-white mb-2 tracking-tight">Connexion par email</h2>
                <p className="text-[14px] text-white/40">Entre ton adresse et ton mot de passe.</p>
              </div>
              <form onSubmit={handleEmail} className="flex flex-col gap-3">
                <AuthInput type="email" placeholder="Adresse email" value={email} onChange={setEmail} icon={<Mail className="w-4 h-4" />} />
                <div className="relative">
                  <AuthInput type={showPwd ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={setPassword} icon={<Lock className="w-4 h-4" />} />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-[13px] text-red-400">{error}</p>}
                <AuthBtn loading={loading}>Se connecter</AuthBtn>
                <button type="button" onClick={() => setStep("forgot")}
                  className="text-[12.5px] text-white/30 hover:text-[#A78BFA] transition-colors text-center pt-1">
                  Mot de passe oublié ?
                </button>
              </form>
            </div>
          )}

          {/* ── PHONE ── */}
          {step === "phone" && (
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <Phone className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h2 className="text-[28px] font-black text-white mb-2 tracking-tight">Connexion par téléphone</h2>
                <p className="text-[14px] text-white/40">On t'envoie un code par SMS.</p>
              </div>
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
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <ShoppingBag className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h2 className="text-[28px] font-black text-white mb-2 tracking-tight">Code de vérification</h2>
                <p className="text-[14px] text-white/40">Entre le code à 6 chiffres envoyé au {phone}.</p>
              </div>
              <form onSubmit={handleOtp} className="flex flex-col gap-6">
                <div className="flex gap-2 justify-center">
                  {otpDigits.map((d, i) => (
                    <input key={i} ref={(el) => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i - 1]?.focus(); }}
                      className="h-14 w-12 rounded-2xl text-center text-xl font-black text-white outline-none transition-all caret-transparent"
                      style={{ background: d ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.05)", border: d ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.1)" }}
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
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <Lock className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h2 className="text-[28px] font-black text-white mb-2 tracking-tight">Mot de passe oublié</h2>
                <p className="text-[14px] text-white/40">On t'envoie un lien de réinitialisation.</p>
              </div>
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
                style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.08))", border: "1px solid rgba(16,185,129,0.3)", boxShadow: "0 0 30px rgba(16,185,129,0.15)" }}>
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-[28px] font-black text-white mb-2 tracking-tight">Email envoyé !</h2>
              <p className="text-[14px] text-white/40 mb-8 leading-relaxed">
                Vérifie ta boîte mail et clique sur le lien pour réinitialiser ton mot de passe.
              </p>
              <button onClick={() => setStep("main")}
                className="text-[14px] text-[#A78BFA] font-semibold hover:text-[#C4B5FD] transition-colors flex items-center gap-1.5">
                Retour à la connexion <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function AuthMethodBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-[14px] font-semibold text-white/70 transition-all hover:text-white group"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
      <div className="flex items-center gap-3 text-white/50 group-hover:text-white/80">{icon}{label}</div>
      <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}

function AuthInput({ type = "text", placeholder, value, onChange, icon }: {
  type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 rounded-2xl transition-all"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)"; (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.05)"; }}
      onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}>
      {icon && <span className="text-white/30 flex-shrink-0">{icon}</span>}
      <input type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[14.5px] text-white placeholder-white/25 outline-none" />
    </div>
  );
}

function AuthBtn({ children, loading }: { children: React.ReactNode; loading?: boolean }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[14.5px] font-bold text-white transition-all hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(139,92,246,0.4)] active:scale-[0.98] disabled:opacity-50 mt-1"
      style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" }}>
      {loading
        ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        : children}
    </button>
  );
}
