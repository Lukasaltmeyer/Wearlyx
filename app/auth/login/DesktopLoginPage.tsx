"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Phone, ArrowRight, Sparkles, Shield, Zap, Crown } from "lucide-react";
import { signInWithProvider, signInWithEmail, sendPasswordReset, signInWithPhone, verifyPhoneOtp } from "@/lib/auth";
import { GoogleIcon } from "../_components/AuthUI";

type Step = "main" | "email" | "phone" | "phone-otp" | "forgot" | "forgot-sent";

const PERKS = [
  { icon: Zap,      title: "Vends en 10 secondes",     desc: "Photo → annonce publiée grâce à l'IA" },
  { icon: Shield,   title: "Paiements sécurisés",       desc: "Argent retenu jusqu'à la livraison" },
  { icon: Crown,    title: "Marques premium",            desc: "Nike, Zara, Jacquemus et plus encore" },
  { icon: Sparkles, title: "Communauté de +50 000",     desc: "Acheteurs et vendeurs vérifiés" },
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

      {/* ── LEFT — Branding ── */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between p-14 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f0520 0%, #1a0533 30%, #2d1062 60%, #4c1d95 100%)" }}>

        {/* Ambient glows */}
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)" }} />
        <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, #A78BFA, transparent 70%)" }} />

        {/* Logo */}
        <div className="relative z-10">
          <span className="text-[28px] font-black text-white tracking-tight">
            Wear<span style={{ color: "#C4B5FD" }}>lyx</span>
          </span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-[52px] font-black text-white leading-[1.05] mb-4 tracking-tight">
            Le futur de<br />
            <span style={{ background: "linear-gradient(90deg, #C4B5FD, #A78BFA, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              la seconde main.
            </span>
          </h1>
          <p className="text-[18px] text-white/50 mb-10 leading-relaxed">
            La marketplace mode qui cartonne en France.
          </p>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-4">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(139,92,246,0.2)" }}>
                  <Icon className="w-4 h-4 text-[#A78BFA]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-white">{title}</p>
                  <p className="text-[12px] text-white/40 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex items-center gap-6">
          {[["50 000+", "membres actifs"], ["1 200", "ventes par jour"], ["4.8 ★", "note moyenne"]].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="text-[20px] font-black text-white">{val}</p>
              <p className="text-[12px] text-white/40">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT — Form ── */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-[420px]">

          {/* Back button for sub-steps */}
          {step !== "main" && (
            <button onClick={() => setStep("main")}
              className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 mb-8 transition-colors">
              <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Retour
            </button>
          )}

          {/* MAIN */}
          {step === "main" && (
            <>
              <h2 className="text-[32px] font-black text-white mb-2">Bon retour !</h2>
              <p className="text-[15px] text-white/40 mb-8">Connecte-toi pour accéder à ton compte.</p>

              <div className="flex flex-col gap-3">
                <button onClick={handleGoogle} disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[15px] font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {googleLoading
                    ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    : <><GoogleIcon /> Se connecter avec Google</>}
                </button>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-[12px] text-white/25 font-semibold tracking-widest">OU</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                <button onClick={() => setStep("email")}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[15px] font-semibold text-white transition-all hover:bg-white/6 active:scale-[0.98]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-white/40" /> Se connecter avec l'email</div>
                  <ArrowRight className="w-4 h-4 text-white/20" />
                </button>

                <button onClick={() => setStep("phone")}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[15px] font-semibold text-white transition-all hover:bg-white/6 active:scale-[0.98]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-white/40" /> Se connecter avec le téléphone</div>
                  <ArrowRight className="w-4 h-4 text-white/20" />
                </button>
              </div>

              {error && <p className="mt-4 text-[13px] text-red-400 text-center">{error}</p>}

              <p className="text-center text-[14px] text-white/30 mt-8">
                Pas encore de compte ?{" "}
                <Link href="/auth/signup" className="text-[#A78BFA] font-semibold hover:text-[#C4B5FD] transition-colors">
                  Créer un compte
                </Link>
              </p>
            </>
          )}

          {/* EMAIL */}
          {step === "email" && (
            <>
              <h2 className="text-[28px] font-black text-white mb-2">Connexion par email</h2>
              <p className="text-[14px] text-white/40 mb-8">Entre ton adresse et ton mot de passe.</p>
              <form onSubmit={handleEmail} className="flex flex-col gap-4">
                <DesktopInput type="email" placeholder="Adresse email" value={email} onChange={setEmail} icon={<Mail className="w-4 h-4" />} />
                <div className="relative">
                  <DesktopInput type={showPwd ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={setPassword} icon={<Lock className="w-4 h-4" />} />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-[13px] text-red-400">{error}</p>}
                <DesktopBtn loading={loading}>Se connecter</DesktopBtn>
                <button type="button" onClick={() => setStep("forgot")}
                  className="text-[13px] text-white/35 hover:text-[#A78BFA] transition-colors text-center">
                  Mot de passe oublié ?
                </button>
              </form>
            </>
          )}

          {/* PHONE */}
          {step === "phone" && (
            <>
              <h2 className="text-[28px] font-black text-white mb-2">Connexion par téléphone</h2>
              <p className="text-[14px] text-white/40 mb-8">On t'envoie un code par SMS.</p>
              <form onSubmit={handlePhone} className="flex flex-col gap-4">
                <DesktopInput type="tel" placeholder="+33 6 00 00 00 00" value={phone} onChange={setPhone} icon={<Phone className="w-4 h-4" />} />
                {error && <p className="text-[13px] text-red-400">{error}</p>}
                <DesktopBtn loading={loading}>Envoyer le code</DesktopBtn>
              </form>
            </>
          )}

          {/* PHONE OTP */}
          {step === "phone-otp" && (
            <>
              <h2 className="text-[28px] font-black text-white mb-2">Code de vérification</h2>
              <p className="text-[14px] text-white/40 mb-8">Entre le code à 6 chiffres envoyé au {phone}.</p>
              <form onSubmit={handleOtp} className="flex flex-col gap-6">
                <div className="flex gap-2 justify-center">
                  {otpDigits.map((d, i) => (
                    <input key={i} ref={(el) => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i - 1]?.focus(); }}
                      className="h-[56px] w-12 rounded-2xl text-center text-xl font-bold text-white outline-none transition-all focus:border-[#8B5CF6]/60 caret-transparent"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  ))}
                </div>
                {error && <p className="text-[13px] text-red-400 text-center">{error}</p>}
                <DesktopBtn loading={loading}>Vérifier</DesktopBtn>
              </form>
            </>
          )}

          {/* FORGOT */}
          {step === "forgot" && (
            <>
              <h2 className="text-[28px] font-black text-white mb-2">Mot de passe oublié</h2>
              <p className="text-[14px] text-white/40 mb-8">On t'envoie un lien de réinitialisation.</p>
              <form onSubmit={handleForgot} className="flex flex-col gap-4">
                <DesktopInput type="email" placeholder="Ton adresse email" value={forgotEmail} onChange={setForgotEmail} icon={<Mail className="w-4 h-4" />} />
                {error && <p className="text-[13px] text-red-400">{error}</p>}
                <DesktopBtn loading={loading}>Envoyer le lien</DesktopBtn>
              </form>
            </>
          )}

          {/* FORGOT SENT */}
          {step === "forgot-sent" && (
            <>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
                <Mail className="w-6 h-6 text-[#A78BFA]" />
              </div>
              <h2 className="text-[28px] font-black text-white mb-2">Email envoyé !</h2>
              <p className="text-[14px] text-white/40 mb-8">Vérifie ta boîte mail et clique sur le lien pour réinitialiser ton mot de passe.</p>
              <button onClick={() => setStep("main")}
                className="text-[14px] text-[#A78BFA] font-semibold hover:text-[#C4B5FD] transition-colors">
                Retour à la connexion →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DesktopInput({ type = "text", placeholder, value, onChange, icon }: {
  type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 rounded-2xl transition-all"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
      {icon && <span className="text-white/30 flex-shrink-0">{icon}</span>}
      <input type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[15px] text-white placeholder-white/25 outline-none" />
    </div>
  );
}

function DesktopBtn({ children, loading }: { children: React.ReactNode; loading?: boolean }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
      style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" }}>
      {loading
        ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        : children}
    </button>
  );
}
