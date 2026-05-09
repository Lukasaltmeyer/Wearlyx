"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Mail, Lock, Eye, EyeOff, Phone, ArrowRight,
  Sparkles, Shield, Zap, Star, CheckCircle, Package, Heart
} from "lucide-react";
import { signInWithProvider, signInWithEmail, sendPasswordReset, signInWithPhone, verifyPhoneOtp } from "@/lib/auth";
import { GoogleIcon } from "../_components/AuthUI";

type Step = "main" | "email" | "phone" | "phone-otp" | "forgot" | "forgot-sent";

const PERKS = [
  { icon: Zap,      text: "Vends en 10 secondes avec l'IA" },
  { icon: Shield,   text: "Paiements 100% sécurisés" },
  { icon: Package,  text: "32 000+ articles disponibles" },
  { icon: Heart,    text: "+50 000 membres vérifiés" },
];

/* Floating mockup cards shown on the left */
const MOCKUP_ITEMS = [
  { title: "Nike Air Force 1",  price: "65 €",  badge: "Vendu",    badgeColor: "#10B981", img: null },
  { title: "Veste Carhartt",    price: "42 €",  badge: "Boost",    badgeColor: "#8B5CF6", img: null },
  { title: "Sac Jacquemus",     price: "145 €", badge: "Nouveau",  badgeColor: "#F59E0B", img: null },
  { title: "Jordan 1 Retro",    price: "210 €", badge: "Favori",   badgeColor: "#EF4444", img: null },
  { title: "Zara Blazer",       price: "28 €",  badge: "Boost",    badgeColor: "#8B5CF6", img: null },
  { title: "Vintage Levi's",    price: "35 €",  badge: "Nouveau",  badgeColor: "#F59E0B", img: null },
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
    <div className="min-h-[100dvh] w-full flex" style={{ background: "#07070A" }}>

      {/* ══════════════ LEFT — Visual branding ══════════════ */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col"
        style={{ background: "linear-gradient(145deg, #0a0118 0%, #140530 20%, #220a52 45%, #3b1278 65%, #5b1fd4 85%, #7C3AED 100%)" }}>

        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Main glow */}
          <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.55) 0%, transparent 65%)", filter: "blur(80px)" }} />
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 65%)", filter: "blur(60px)" }} />
          <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(88,28,220,0.4) 0%, transparent 70%)", filter: "blur(50px)" }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
          {/* Vignette */}
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)" }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 px-14 pt-12 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", boxShadow: "0 0 20px rgba(139,92,246,0.5)" }}>
              <Star className="w-4.5 h-4.5 text-white fill-white" style={{ width: 18, height: 18 }} />
            </div>
            <span className="text-[24px] font-black text-white tracking-tight">
              Wear<span style={{ color: "#C4B5FD" }}>lyx</span>
            </span>
          </div>
        </div>

        {/* Center hero text */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-14 py-10">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 text-[11px] font-bold uppercase tracking-widest"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.6)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4B5FD]" />
              Marketplace mode — France
            </div>

            <h1 className="text-[56px] xl:text-[68px] font-black text-white leading-[1.02] tracking-tight mb-6">
              Le futur de<br />
              <span style={{
                background: "linear-gradient(90deg, #ffffff 0%, #C4B5FD 35%, #A78BFA 70%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                la seconde main.
              </span>
            </h1>

            <p className="text-[17px] text-white/45 leading-relaxed max-w-[480px]">
              Achète et vends des pièces de mode en quelques secondes grâce à l'intelligence artificielle.
            </p>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-3 max-w-[520px]">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.1)" }}>
                  <Icon className="w-4 h-4 text-white/80" />
                </div>
                <span className="text-[12.5px] font-semibold text-white/65">{text}</span>
              </div>
            ))}
          </div>

          {/* Mini product grid mockup */}
          <div className="mt-10 grid grid-cols-3 gap-2.5 max-w-[520px]">
            {MOCKUP_ITEMS.map(({ title, price, badge, badgeColor }) => (
              <div key={title}
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                {/* Placeholder image area */}
                <div className="h-20 relative flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, rgba(139,92,246,0.15), rgba(109,40,217,0.08))` }}>
                  <span className="text-2xl opacity-40">👕</span>
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[8px] font-black"
                    style={{ background: `${badgeColor}25`, color: badgeColor, border: `1px solid ${badgeColor}40` }}>
                    {badge}
                  </span>
                </div>
                <div className="px-2.5 py-2">
                  <p className="text-[10px] font-semibold text-white/55 truncate">{title}</p>
                  <p className="text-[11px] font-black text-white">{price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 px-14 pb-12 flex items-center gap-10 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
          {[["50 K+", "membres actifs"], ["1 200", "ventes par jour"], ["4.8 ★", "note moyenne"]].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="text-[22px] font-black text-white leading-none">{val}</p>
              <p className="text-[11px] text-white/35 mt-0.5">{lbl}</p>
            </div>
          ))}
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 text-[11px] text-white/25">
            <Shield className="w-3.5 h-3.5" />
            Paiements sécurisés
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT — Auth form ══════════════ */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex-shrink-0 flex items-center justify-center relative px-8 py-12"
        style={{ background: "#07070A", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Subtle ambient */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.06) 0%, transparent 65%)" }} />

        <div className="relative z-10 w-full max-w-[380px]">

          {step !== "main" && (
            <button onClick={() => setStep("main")}
              className="flex items-center gap-1.5 text-[13px] text-white/35 hover:text-white/65 mb-8 transition-colors">
              <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Retour
            </button>
          )}

          {/* ── MAIN ── */}
          {step === "main" && (
            <div>
              <div className="mb-8">
                <h2 className="text-[32px] font-black text-white tracking-tight mb-2">Bon retour !</h2>
                <p className="text-[15px] text-white/35">Connecte-toi pour accéder à ton compte.</p>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={handleGoogle} disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[15px] font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  {googleLoading
                    ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    : <><GoogleIcon /> Continuer avec Google</>}
                </button>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <span className="text-[11px] text-white/20 font-bold tracking-widest">OU</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                </div>

                <AuthMethodBtn icon={<Mail className="w-4 h-4" />} label="Continuer avec l'email" onClick={() => setStep("email")} />
                <AuthMethodBtn icon={<Phone className="w-4 h-4" />} label="Continuer avec le téléphone" onClick={() => setStep("phone")} />
              </div>

              {error && <p className="mt-4 text-[13px] text-red-400 text-center">{error}</p>}

              <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex flex-col gap-2 mb-6">
                  {PERKS.map(({ text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#8B5CF6] flex-shrink-0" />
                      <span className="text-[12.5px] text-white/35">{text}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-[13px] text-white/25">
                  Pas encore de compte ?{" "}
                  <Link href="/auth/signup" className="text-[#A78BFA] font-semibold hover:text-[#C4B5FD] transition-colors">
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* ── EMAIL ── */}
          {step === "email" && (
            <div>
              <div className="mb-8">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <Mail className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h2 className="text-[28px] font-black text-white tracking-tight mb-1.5">Connexion par email</h2>
                <p className="text-[14px] text-white/35">Entre ton adresse et ton mot de passe.</p>
              </div>
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
                  className="text-[13px] text-white/30 hover:text-[#A78BFA] transition-colors text-center pt-1">
                  Mot de passe oublié ?
                </button>
              </form>
            </div>
          )}

          {/* ── PHONE ── */}
          {step === "phone" && (
            <div>
              <div className="mb-8">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <Phone className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h2 className="text-[28px] font-black text-white tracking-tight mb-1.5">Par téléphone</h2>
                <p className="text-[14px] text-white/35">On t'envoie un code par SMS.</p>
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
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <Sparkles className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h2 className="text-[28px] font-black text-white tracking-tight mb-1.5">Code de vérification</h2>
                <p className="text-[14px] text-white/35">Code à 6 chiffres envoyé au {phone}.</p>
              </div>
              <form onSubmit={handleOtp} className="flex flex-col gap-6">
                <div className="flex gap-2 justify-between">
                  {otpDigits.map((d, i) => (
                    <input key={i} ref={(el) => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i - 1]?.focus(); }}
                      className="h-14 w-full rounded-2xl text-center text-xl font-black text-white outline-none transition-all caret-transparent"
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
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <Lock className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h2 className="text-[28px] font-black text-white tracking-tight mb-1.5">Mot de passe oublié</h2>
                <p className="text-[14px] text-white/35">On t'envoie un lien de réinitialisation.</p>
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
                style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", boxShadow: "0 0 30px rgba(16,185,129,0.1)" }}>
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

function AuthMethodBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[14.5px] font-semibold transition-all group"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.13)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}>
      <div className="flex items-center gap-3">{icon}{label}</div>
      <ArrowRight className="w-4 h-4 opacity-30 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" />
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
      onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.55)"; (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.05)"; }}
      onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}>
      {icon && <span className="text-white/30 flex-shrink-0">{icon}</span>}
      <input type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[15px] text-white placeholder-white/25 outline-none" />
    </div>
  );
}

function AuthBtn({ children, loading }: { children: React.ReactNode; loading?: boolean }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-bold text-white transition-all hover:scale-[1.01] hover:shadow-[0_8px_28px_rgba(139,92,246,0.4)] active:scale-[0.98] disabled:opacity-50 mt-1"
      style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" }}>
      {loading
        ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        : children}
    </button>
  );
}
