"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle, X, ArrowRight } from "lucide-react";

// ─── Background carousel ──────────────────────────────────────────────────────
const IMAGES = ["/auth-bg/1.jpg", "/auth-bg/2.jpg", "/auth-bg/3.jpg", "/auth-bg/4.jpg", "/auth-bg/5.jpg", "/auth-bg/6.jpg"];
const GRADIENTS = [
  "linear-gradient(160deg, #1a0533 0%, #3b0764 35%, #1e1b4b 70%, #0a0a14 100%)",
  "linear-gradient(160deg, #0f172a 0%, #1e1b4b 40%, #4c1d95 80%, #0a0a14 100%)",
  "linear-gradient(160deg, #18181b 0%, #2d1b69 45%, #7c3aed 85%, #0a0a14 100%)",
  "linear-gradient(160deg, #0a0a14 0%, #1a0533 50%, #6d28d9 90%, #18181b 100%)",
  "linear-gradient(160deg, #14001f 0%, #4a044e 45%, #8B5CF6 85%, #0a0a14 100%)",
  "linear-gradient(160deg, #0a0a14 0%, #1e1b4b 40%, #5b21b6 75%, #2d1b69 100%)",
];

export function useCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % IMAGES.length), 4500);
    return () => clearInterval(t);
  }, []);
  return idx;
}

export function AuthBackground({ idx }: { idx: number }) {
  const [prev, setPrev] = useState<number | null>(null);
  const cb = useCallback(() => {
    setPrev(idx - 1 < 0 ? IMAGES.length - 1 : idx - 1);
    setTimeout(() => setPrev(null), 1200);
  }, [idx]);
  useEffect(() => { cb(); }, [cb]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {IMAGES.map((src, i) => (
        <div key={src} className="absolute inset-0 transition-opacity ease-in-out"
          style={{ opacity: i === idx ? 1 : 0, transitionDuration: i === idx ? "1200ms" : "800ms", zIndex: i === idx ? 2 : i === prev ? 1 : 0 }}>
          <div className="absolute inset-0" style={{ background: GRADIENTS[i] }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover object-center" loading={i === 0 ? "eager" : "lazy"} />
        </div>
      ))}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/88 via-black/10 to-black/25" />
    </div>
  );
}

export function SlideDots({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-full bg-white transition-all duration-500"
          style={{ width: i === active ? 20 : 5, height: 5, opacity: i === active ? 0.9 : 0.3 }} />
      ))}
    </div>
  );
}

export function DarkInput({ type = "text", placeholder, value, onChange, leftIcon, autoComplete, inputMode, maxLength }: {
  type?: string; placeholder: string; value: string; onChange: (v: string) => void;
  leftIcon?: React.ReactNode; autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; maxLength?: number;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 px-4 py-4 transition-all focus-within:border-[#8B5CF6]/50 focus-within:bg-white/10">
      {leftIcon && <span className="text-white/35 flex-shrink-0 transition-colors group-focus-within:text-[#A78BFA]">{leftIcon}</span>}
      <input type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete} inputMode={inputMode} maxLength={maxLength}
        className="flex-1 bg-transparent text-[15px] text-white placeholder-white/30 outline-none" />
    </div>
  );
}

export function PrimaryBtn({ children, loading, disabled, type = "submit", onClick }: {
  children: React.ReactNode; loading?: boolean; disabled?: boolean;
  type?: "submit" | "button"; onClick?: () => void;
}) {
  return (
    <button type={type} disabled={loading || disabled} onClick={onClick}
      className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-[0.97] disabled:opacity-50"
      style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.35)" }}>
      {loading
        ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        : children}
    </button>
  );
}

export function GoogleBtn({ onClick, loading, label }: { onClick: () => void; loading?: boolean; label: string }) {
  return (
    <button type="button" disabled={loading} onClick={onClick}
      className="w-full flex items-center justify-center gap-3 rounded-2xl py-4 text-[14px] font-bold text-white border border-white/12 bg-white/8 transition-all active:scale-[0.97] hover:bg-white/12 disabled:opacity-50">
      {loading
        ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        : <><GoogleIcon /><span>{label}</span></>}
    </button>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-[11px] font-semibold text-white/25 tracking-widest">OU</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

export function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 px-3.5 py-3 animate-fadeIn">
      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-[13px] text-red-300 leading-relaxed">{message}</p>
      <button onClick={onDismiss}><X className="w-3.5 h-3.5 text-red-400/50 hover:text-red-400" /></button>
    </div>
  );
}

export function OtpGrid({ digits, refs, onChange }: {
  digits: string[];
  refs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onChange: (i: number, v: string) => void;
}) {
  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }}
          type="text" inputMode="numeric" maxLength={1} value={d}
          onChange={(e) => onChange(i, e.target.value)}
          onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); }}
          className="h-[52px] w-11 rounded-2xl border border-white/10 bg-white/7 text-center text-xl font-bold text-white outline-none transition-all focus:border-[#8B5CF6]/60 focus:bg-white/12 caret-transparent"
        />
      ))}
    </div>
  );
}

export function ProfileFields({ firstName, lastName, username, city, postalCode, phone,
  setFirstName, setLastName, setUsername, setCity, setPostalCode, setPhone, showPhone }: {
  firstName: string; lastName: string; username: string; city: string; postalCode: string; phone: string;
  setFirstName: (v: string) => void; setLastName: (v: string) => void; setUsername: (v: string) => void;
  setCity: (v: string) => void; setPostalCode: (v: string) => void; setPhone: (v: string) => void;
  showPhone: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <DarkInput placeholder="Prénom *" value={firstName} onChange={setFirstName} autoComplete="given-name" />
        <DarkInput placeholder="Nom *" value={lastName} onChange={setLastName} autoComplete="family-name" />
      </div>
      <DarkInput placeholder="@pseudo *" value={username}
        onChange={(v) => setUsername(v.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
        leftIcon={<span className="text-sm font-bold text-white/35">@</span>} />
      <DarkInput placeholder="Ville *" value={city} onChange={setCity} autoComplete="address-level2" />
      <DarkInput placeholder="Code postal *" value={postalCode} onChange={setPostalCode}
        inputMode="numeric" maxLength={5} autoComplete="postal-code" />
      {showPhone && (
        <DarkInput placeholder="Téléphone (+33 6…) *" value={phone} onChange={setPhone}
          type="tel" inputMode="tel" autoComplete="tel" />
      )}
    </div>
  );
}

export const IMAGES_COUNT = IMAGES.length;

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border border-white/8 p-5"
      style={{ background: "rgba(8,8,14,0.92)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)" }}>
      {children}
    </div>
  );
}

export function TaglineBlock({ idx }: { idx: number }) {
  return (
    <div className="mb-5 px-1">
      <h1 className="text-[42px] font-black leading-[1.02] tracking-tight text-white drop-shadow-lg">
        Le futur de<br />
        <span style={{ background: "linear-gradient(90deg, #A78BFA, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          la seconde main.
        </span>
      </h1>
      <p className="mt-2 text-[14px] text-white/50">La marketplace mode qui cartonne en France.</p>
      <div className="flex items-center gap-3 mt-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/8 border border-white/10">
          <span className="text-[11px] font-bold text-white/80">+50 000</span>
          <span className="text-[10px] text-white/35">membres</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/8 border border-white/10">
          <span className="text-yellow-400 text-[11px]">★</span>
          <span className="text-[11px] font-bold text-white/80">4.8</span>
        </div>
      </div>
      <div className="mt-3.5"><SlideDots count={IMAGES_COUNT} active={idx} /></div>
    </div>
  );
}

export function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="mb-4 flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors">
      <ArrowRight className="w-4 h-4 rotate-180" /> Retour
    </button>
  );
}
