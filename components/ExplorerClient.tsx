"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Camera, Sparkles, TrendingUp } from "lucide-react";

const CATEGORIES = [
  { id: "femme",          label: "Femmes",        emoji: "👜", from: "#3B0D8C", to: "#5B21B6", glow: "rgba(109,40,217,0.4)"  },
  { id: "homme",          label: "Hommes",        emoji: "🧥", from: "#013828", to: "#065F46", glow: "rgba(6,95,70,0.4)"    },
  { id: "createurs",      label: "Créateurs",     emoji: "👛", from: "#6B2000", to: "#92400E", glow: "rgba(146,64,14,0.4)"  },
  { id: "enfant",         label: "Enfants",       emoji: "🐰", from: "#7A0E3A", to: "#9D174D", glow: "rgba(157,23,77,0.4)"  },
  { id: "maison",         label: "Maison",        emoji: "🏮", from: "#6B2D00", to: "#B45309", glow: "rgba(180,83,9,0.4)"   },
  { id: "electronique",   label: "Électronique",  emoji: "📱", from: "#0B4060", to: "#0E7490", glow: "rgba(14,116,144,0.4)" },
  { id: "divertissement", label: "Divert.",       emoji: "📚", from: "#1C1860", to: "#3730A3", glow: "rgba(55,48,163,0.4)"  },
  { id: "sport",          label: "Sport",         emoji: "🏓", from: "#013828", to: "#065F46", glow: "rgba(6,95,70,0.4)"    },
];

const TRENDING = ["Nike Air Force", "Levi's 501", "Sac Zara", "Jordan 1", "Manteau vintage", "Blazer"];

interface Props {
  products: any[];
  currentUserId?: string;
  initialQ?: string;
  initialCategory?: string;
  initialSort?: string;
}

export function ExplorerClient({ initialQ, initialCategory, initialSort }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ ?? "");
  const isAI = initialSort === "ai";

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const handleCategoryClick = (id: string) => {
    router.push(initialCategory === id ? "/search" : `/search?category=${id}`);
  };

  return (
    <div
      className="min-h-[100dvh] pb-8 relative overflow-hidden"
      style={{ background: "#07070A" }}
    >
      {/* Ambient orbs */}
      <div className="absolute pointer-events-none animate-orb"
        style={{ top: -120, left: "25%", width: 400, height: 400,
          background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 65%)", filter: "blur(60px)" }} />
      <div className="absolute pointer-events-none animate-orb-r"
        style={{ top: "45%", right: -80, width: 300, height: 300,
          background: "radial-gradient(circle, rgba(109,40,217,0.07) 0%, transparent 70%)", filter: "blur(70px)" }} />

      {/* Header */}
      <div className="relative z-10 px-4 pt-7 pb-3">
        <h1 className="text-[26px] font-black text-white tracking-tight" style={{ letterSpacing: "-0.02em" }}>Explorer</h1>
        <p className="text-[12.5px] font-medium mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
          Découvrez des articles uniques
        </p>
      </div>

      {/* Search bar */}
      <div className="relative z-10 px-3 pb-4">
        <form onSubmit={handleSearch}>
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              boxShadow: "0 4px 28px rgba(0,0,0,0.32), 0 1px 0 rgba(255,255,255,0.06) inset",
            }}
          >
            <Search style={{ width: 16, height: 16, color: "rgba(167,139,250,0.5)", flexShrink: 0 }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un article, une marque…"
              className="flex-1 bg-transparent text-[14px] text-white font-medium outline-none placeholder:text-white/25"
              style={{ caretColor: "#8B5CF6" }}
            />
            <button
              type="button"
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all active:scale-90"
              style={{ background: "rgba(139,92,246,0.14)", border: "1px solid rgba(139,92,246,0.2)" }}
            >
              <Camera style={{ width: 14, height: 14, color: "#A78BFA" }} />
            </button>
          </div>
        </form>
      </div>

      {/* Trending pills */}
      <div className="relative z-10 px-3 pb-4">
        <div className="flex items-center gap-2 mb-2.5 px-1">
          <TrendingUp style={{ width: 13, height: 13, color: "#8B5CF6" }} />
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.28)" }}>
            Tendances
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TRENDING.map((t) => (
            <button
              key={t}
              onClick={() => router.push(`/search?q=${encodeURIComponent(t)}`)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold active:scale-95 transition-all duration-150"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.48)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* AI banner */}
      <div className="relative z-10 px-3 mb-5">
        <button
          onClick={() => router.push(isAI ? "/search" : "/search?sort=ai")}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[20px] active:scale-[0.98] transition-all duration-200 relative overflow-hidden"
          style={isAI ? {
            background: "linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(109,40,217,0.14) 100%)",
            border: "1px solid rgba(139,92,246,0.38)",
            boxShadow: "0 6px 24px rgba(139,92,246,0.22), 0 1px 0 rgba(255,255,255,0.08) inset",
          } : {
            background: "linear-gradient(135deg, rgba(139,92,246,0.10) 0%, rgba(109,40,217,0.05) 100%)",
            border: "1px solid rgba(139,92,246,0.16)",
            boxShadow: "0 4px 20px rgba(139,92,246,0.07)",
          }}
        >
          {/* Inner shine */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(167,139,250,0.08) 0%, transparent 60%)" }} />
          <div
            className="w-9 h-9 rounded-[14px] flex items-center justify-center flex-shrink-0 relative"
            style={{
              background: "linear-gradient(145deg, #9B6FF8, #7C3AED)",
              boxShadow: isAI ? "0 0 22px rgba(139,92,246,0.7)" : "0 0 16px rgba(139,92,246,0.5)",
            }}
          >
            <div className="absolute inset-0 rounded-[14px]"
              style={{ background: "radial-gradient(circle at 40% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)" }} />
            <Sparkles style={{ width: 15, height: 15, color: "white", position: "relative", zIndex: 1 }} />
          </div>
          <div className="flex-1 text-left relative z-10">
            <p className="text-[13px] font-bold text-white">Sélection IA pour toi</p>
            <p className="text-[11px] mt-0.5" style={{ color: isAI ? "#A78BFA" : "rgba(255,255,255,0.32)" }}>
              {isAI ? "Mode IA actif · Articles les plus aimés" : "Basée sur tes préférences"}
            </p>
          </div>
          <span
            className="relative z-10 text-[11px] font-bold px-2.5 py-1 rounded-lg"
            style={isAI ? {
              background: "rgba(139,92,246,0.28)",
              color: "#E9D5FF",
              border: "1px solid rgba(139,92,246,0.35)",
            } : {
              background: "rgba(139,92,246,0.16)",
              color: "#C4B5FD",
            }}
          >
            {isAI ? "Actif ✦" : "Voir →"}
          </span>
        </button>
      </div>

      {/* Section label */}
      <div className="relative z-10 px-5 mb-3">
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
          Catégories
        </p>
      </div>

      {/* Category grid */}
      <div className="relative z-10 px-3 grid grid-cols-2 gap-2.5 pb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="text-left active:scale-[0.94] transition-all duration-200"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <div
              className="relative rounded-[22px] overflow-hidden flex flex-col justify-between"
              style={{
                background: `linear-gradient(150deg, ${cat.from} 0%, ${cat.to} 100%)`,
                height: 120,
                padding: "15px 14px 13px 15px",
                boxShadow: `0 6px 24px ${cat.glow}, 0 1px 0 rgba(255,255,255,0.12) inset`,
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              {/* Top-right reflet */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 65%)" }} />

              {/* Grid texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.07]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Bottom vignette */}
              <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
                style={{ background: `linear-gradient(to top, ${cat.to}cc, transparent)` }} />

              <p className="relative z-10 text-[14.5px] font-black text-white leading-tight pr-10"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
                {cat.label}
              </p>

              <div
                className="absolute bottom-2 right-2.5 text-[44px] leading-none select-none"
                style={{ filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.5))" }}
                aria-hidden
              >
                {cat.emoji}
              </div>

              {/* Active dot */}
              {initialCategory === cat.id && (
                <div
                  className="absolute top-3 left-3 w-2 h-2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 0 8px rgba(255,255,255,0.7)" }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
