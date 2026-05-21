"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Share2, Check, Gift, Users, Star, Zap } from "lucide-react";

interface Props {
  referralCode: string;
  isDesktop?: boolean;
}

export function ReferralClient({ referralCode, isDesktop }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const referralLink = `https://wearlyx.app/r/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rewards = [
    { icon: Users, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)", title: "Ami inscrit",   desc: "Ton ami crée un compte sur Wearlyx",   reward: "+50 cr." },
    { icon: Star,  color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  title: "1ère vente",   desc: "Ton ami réalise sa première vente",    reward: "+100 cr." },
    { icon: Gift,  color: "#A78BFA", bg: "rgba(167,139,250,0.1)", title: "×5 parrainages", desc: "5 amis invités et inscrits au total", reward: "+500 cr." },
  ];

  if (isDesktop) {
    return (
      <div className="flex gap-8">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-[20px] px-8 py-8"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.14) 0%, rgba(109,40,217,0.06) 100%)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <div className="absolute pointer-events-none" style={{ top: -80, right: -40, width: 280, height: 280, background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 65%)", filter: "blur(40px)" }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: "rgba(139,92,246,0.2)" }}>
                  <Zap className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A78BFA]/60">Programme de parrainage</span>
              </div>
              <p className="text-[26px] font-black text-white tracking-tight mb-2">Invitez. Gagnez.<br /><span style={{ color: "#A78BFA" }}>Répétez.</span></p>
              <p className="text-[13px] text-white/40 leading-relaxed max-w-[420px]">
                Chaque ami que tu invites sur Wearlyx te rapporte des crédits. Plus tu parraines, plus tu gagnes.
              </p>
            </div>
          </div>

          {/* Link box */}
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>Ton lien de parrainage</p>
            <div className="flex items-center gap-3 p-3 pl-4 rounded-[14px]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="flex-1 text-[13px] font-mono truncate" style={{ color: "rgba(255,255,255,0.45)" }}>{referralLink}</p>
              <button onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[12.5px] font-bold transition-all flex-shrink-0 ${
                  copied ? "text-emerald-400" : "text-white"
                }`}
                style={{ background: copied ? "rgba(16,185,129,0.15)" : "rgba(139,92,246,0.85)", boxShadow: copied ? "none" : "0 4px 14px rgba(139,92,246,0.3)" }}>
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
          </div>

          <button className="flex items-center gap-2.5 px-5 py-3 rounded-[12px] text-[13px] font-semibold text-white/55 transition-all self-start hover:text-white/80"
            style={{ border: "1px solid rgba(255,255,255,0.09)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <Share2 className="w-4 h-4" />
            Partager mon lien
          </button>
        </div>

        {/* Right */}
        <div className="w-[280px] flex-shrink-0">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: "rgba(255,255,255,0.22)" }}>Récompenses</p>
          <div className="flex flex-col gap-2">
            {rewards.map(({ icon: Icon, color, bg, title, desc, reward }) => (
              <div key={title} className="flex items-center gap-4 p-4 rounded-[14px]" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-white/85">{title}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{desc}</p>
                </div>
                <span className="text-[13px] font-black flex-shrink-0" style={{ color }}>{reward}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-[14px]" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)" }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-semibold text-white/35">Amis invités</p>
              <span className="text-[13px] font-black text-white/60">0</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-white/35">Crédits gagnés</p>
              <span className="text-[13px] font-black" style={{ color: "#A78BFA" }}>0 cr.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[18px] font-black text-white">Inviter des amis</h1>
      </div>
      <div className="mx-4 mb-5 p-5 rounded-3xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10" />
        <div className="relative z-10">
          <p className="text-white font-black text-[22px] leading-tight">Parrainez, gagnez !</p>
          <p className="text-white/70 text-[13px] mt-2">Invite tes amis et gagne des crédits.</p>
        </div>
      </div>
      <div className="px-4 mb-5">
        <p className="text-[12px] font-bold text-white/40 uppercase tracking-wider mb-2">Ton lien</p>
        <div className="flex items-center gap-2 p-3 rounded-2xl border border-white/8 bg-white/4">
          <p className="flex-1 text-[12px] text-white/50 truncate">{referralLink}</p>
          <button onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all flex-shrink-0 ${copied ? "bg-[#10B981]/20 text-[#10B981]" : "bg-[#8B5CF6] text-white"}`}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>
      </div>
      <div className="px-4 mb-6">
        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-white/10 bg-white/4 text-[14px] font-bold text-white">
          <Share2 className="w-4 h-4" /> Partager mon lien
        </button>
      </div>
      <div className="px-4">
        <p className="text-[12px] font-black text-white/30 uppercase tracking-wider mb-3">Récompenses</p>
        <div className="flex flex-col gap-2">
          {rewards.map(({ icon: Icon, color, title, desc, reward }) => (
            <div key={title} className="flex items-center gap-3 p-4 rounded-2xl border border-white/6 bg-white/2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-white">{title}</p>
                <p className="text-[12px] text-white/40">{desc}</p>
              </div>
              <span className="text-[12px] font-black" style={{ color }}>{reward}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
