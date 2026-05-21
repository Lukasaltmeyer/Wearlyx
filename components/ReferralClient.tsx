"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Share2, Check, Gift, Users, Star } from "lucide-react";

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
    { icon: Users, color: "#8B5CF6", title: "Ami inscrit", desc: "Ton ami crée un compte", reward: "+50 crédits" },
    { icon: Star, color: "#F59E0B", title: "1ère vente", desc: "Ton ami réalise sa 1ère vente", reward: "+100 crédits" },
    { icon: Gift, color: "#8B5CF6", title: "Bonus fidélité", desc: "5 amis invités au total", reward: "+500 crédits" },
  ];

  if (isDesktop) {
    return (
      <div className="flex gap-8">
        {/* Left — link + share */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="p-6 rounded-[16px] relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(109,40,217,0.08) 100%)", border: "1px solid rgba(139,92,246,0.18)" }}>
            <p className="text-[22px] font-black text-white mb-1">Parrainez, gagnez !</p>
            <p className="text-[13px] text-white/45 leading-relaxed">
              Invite tes amis sur Wearlyx et gagne des crédits pour chaque inscription.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-2">Ton lien de parrainage</p>
            <div className="flex items-center gap-2 p-3 rounded-[12px] border border-white/8 bg-white/[0.03]">
              <p className="flex-1 text-[13px] text-white/50 truncate font-mono">{referralLink}</p>
              <button onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-[12px] font-bold transition-all flex-shrink-0 ${
                  copied ? "bg-[#10B981]/20 text-[#10B981]" : "bg-[#8B5CF6] text-white"
                }`}>
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
          </div>

          <button className="flex items-center gap-2 py-3 px-5 rounded-[12px] border border-white/10 bg-white/[0.03] text-[13px] font-semibold text-white/70 hover:bg-white/[0.06] transition-all self-start">
            <Share2 className="w-4 h-4" />
            Partager mon lien
          </button>
        </div>

        {/* Right — rewards */}
        <div className="w-[300px] flex-shrink-0">
          <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-3">Récompenses</p>
          <div className="flex flex-col gap-2">
            {rewards.map(({ icon: Icon, color, title, desc, reward }) => (
              <div key={title} className="flex items-center gap-3 p-4 rounded-[12px] border border-white/5 bg-white/[0.02]">
                <div className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-white/80">{title}</p>
                  <p className="text-[11px] text-white/35">{desc}</p>
                </div>
                <span className="text-[12px] font-black" style={{ color: "#A78BFA" }}>{reward}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[18px] font-black text-white">Inviter des amis</h1>
      </div>

      <div className="mx-4 mb-5 p-5 rounded-3xl relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #8B5CF6 100%)" }}>
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/8" />
        <div className="relative z-10">
          <p className="text-white font-black text-[22px] leading-tight">Parrainez,<br />gagnez !</p>
          <p className="text-white/70 text-[13px] mt-2 leading-relaxed">
            Invite tes amis sur Wearlyx et gagne des crédits pour chaque inscription.
          </p>
        </div>
      </div>

      <div className="px-4 mb-5">
        <p className="text-[12px] font-bold text-white/40 uppercase tracking-wider mb-2">Ton lien de parrainage</p>
        <div className="flex items-center gap-2 p-3 rounded-2xl border border-white/8 bg-white/4">
          <p className="flex-1 text-[12px] text-white/50 truncate">{referralLink}</p>
          <button onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all flex-shrink-0 ${
              copied ? "bg-[#10B981]/20 text-[#10B981]" : "bg-[#8B5CF6] text-white"
            }`}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>
      </div>

      <div className="px-4 mb-6">
        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-white/10 bg-white/4 text-[14px] font-bold text-white hover:bg-white/8 transition-all active:scale-[0.98]">
          <Share2 className="w-4 h-4" />
          Partager mon lien
        </button>
      </div>

      <div className="px-4">
        <p className="text-[12px] font-black text-white/30 uppercase tracking-wider mb-3">Tes récompenses</p>
        <div className="flex flex-col gap-2">
          {rewards.map(({ icon: Icon, color, title, desc, reward }) => (
            <div key={title} className="flex items-center gap-3 p-4 rounded-2xl border border-white/6 bg-white/2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-white">{title}</p>
                <p className="text-[12px] text-white/40">{desc}</p>
              </div>
              <span className="text-[12px] font-black text-[#8B5CF6]">{reward}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
