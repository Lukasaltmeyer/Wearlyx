"use client";

import { cn } from "@/lib/utils";

export interface Style {
  id: string;
  label: string;
  desc: string;
  color: string;
  emoji: string;
  pro?: boolean;
}

export const STYLES: Style[] = [
  { id: "fond_blanc",   label: "Fond blanc",    desc: "E-commerce pur",       color: "#E8E8E8", emoji: "🩶" },
  { id: "marbre_blanc", label: "Marbre blanc",  desc: "Luxe élégant",         color: "#D6CFC8", emoji: "🤍", pro: true },
  { id: "rose_pastel",  label: "Rose pastel",   desc: "Tendance girly",       color: "#F4A7C0", emoji: "🩷", pro: true },
  { id: "bleu_ciel",    label: "Bleu ciel",     desc: "Frais & doux",         color: "#7EC8E3", emoji: "💙", pro: true },
  { id: "menthe",       label: "Menthe",        desc: "Nature douce",         color: "#7BC8A4", emoji: "🌿", pro: true },
  { id: "lavande",      label: "Lavande",       desc: "Élégant & romantique", color: "#A48FD4", emoji: "💜", pro: true },
  { id: "jaune_citron", label: "Jaune citron",  desc: "Joyeux & vif",         color: "#F5D547", emoji: "💛", pro: true },
  { id: "peche",        label: "Pêche",         desc: "Chaud & doux",         color: "#FFAA80", emoji: "🍑", pro: true },
  { id: "noir_luxe",    label: "Noir luxe",     desc: "Haut de gamme",        color: "#1A1A2E", emoji: "🖤", pro: true },
  { id: "anthracite",   label: "Anthracite",    desc: "Moderne sombre",       color: "#3A3A4A", emoji: "🩶", pro: true },
  { id: "sable",        label: "Sable",         desc: "Naturel chic",         color: "#C4A882", emoji: "🤎", pro: true },
  { id: "lin_naturel",  label: "Lin naturel",   desc: "Texture organique",    color: "#D4C4A0", emoji: "🌾", pro: true },
  { id: "beton",        label: "Béton",         desc: "Urban chic",           color: "#8A8A8A", emoji: "🩶", pro: true },
  { id: "bois_clair",   label: "Bois clair",    desc: "Rustique chic",        color: "#C8A870", emoji: "🪵", pro: true },
  { id: "bois_sombre",  label: "Bois sombre",   desc: "Rustique & chic",      color: "#6B4A2A", emoji: "🪵", pro: true },
  { id: "terrazzo",     label: "Terrazzo",      desc: "Retro & moderne",      color: "#C4A890", emoji: "🎨", pro: true },
  { id: "rose_poudre",  label: "Rose poudré",   desc: "Doux & vintage",       color: "#E8B4B8", emoji: "🩷", pro: true },
  { id: "creme_ivoire", label: "Crème ivoire",  desc: "Doux & élégant",       color: "#F5F0E8", emoji: "🤍", pro: true },
  { id: "vert_sauge",   label: "Vert sauge",    desc: "Nature & tendance",    color: "#9CAF88", emoji: "🌿", pro: true },
  { id: "bleu_marine",  label: "Bleu marine",   desc: "Classique & fort",     color: "#1B3A6B", emoji: "💙", pro: true },
  { id: "corail",       label: "Corail",        desc: "Vibrant & estival",    color: "#FF6B6B", emoji: "🪸", pro: true },
  { id: "argile",       label: "Argile",        desc: "Terre & chaleur",      color: "#C97B5A", emoji: "🧱", pro: true },
];

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
  isPro?: boolean;
}

export function StyleSelector({ selected, onSelect, isPro = false }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-full bg-[#8B5CF6] flex items-center justify-center">
          <span className="text-[10px] font-black text-white">2</span>
        </div>
        <p className="text-[12px] font-bold text-white/60 uppercase tracking-wider">Style de photo</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {STYLES.map((s) => {
          const isActive = selected === s.id;
          const locked = s.pro && !isPro;
          const isDark = ["#1A1A2E","#3A3A4A","#6B4A2A","#1B3A6B"].includes(s.color);
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={cn(
                "relative flex flex-col rounded-2xl border overflow-hidden text-left transition-all active:scale-[0.97]",
                isActive
                  ? "border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/20"
                  : "border-white/8 hover:border-white/20"
              )}
            >
              {/* Color preview with emoji */}
              <div
                className="w-full h-16 relative flex items-center justify-center"
                style={{ backgroundColor: s.color }}
              >
                <span className="text-2xl">{s.emoji}</span>

                {/* PRO badge */}
                {s.pro && (
                  <span className="absolute top-1.5 left-1.5 text-[8px] font-black px-1.5 py-0.5 rounded-md"
                    style={{ background: "rgba(139,92,246,0.9)", color: "white" }}>
                    PRO
                  </span>
                )}
                {/* Check */}
                {isActive && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">✓</span>
                  </div>
                )}
              </div>

              {/* Label */}
              <div className={cn("px-2 py-1.5", isActive ? "bg-[#8B5CF6]/15" : "bg-white/3")}>
                <p className="text-[11px] font-bold text-white leading-tight">{s.label}</p>
                <p className="text-[9px] text-white/35 leading-tight mt-0.5">{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}