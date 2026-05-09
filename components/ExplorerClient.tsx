"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Camera, Sparkles, TrendingUp } from "lucide-react";

const CATEGORIES = [
  { id: "femme",          label: "Femmes",        emoji: "👜", from: "#3B0D8C", to: "#5B21B6", glow: "rgba(109,40,217,0.35)" },
  { id: "homme",          label: "Hommes",        emoji: "🧥", from: "#014032", to: "#065F46", glow: "rgba(6,95,70,0.35)"   },
  { id: "createurs",      label: "Créateurs",     emoji: "👛", from: "#6B2000", to: "#92400E", glow: "rgba(146,64,14,0.35)" },
  { id: "enfant",         label: "Enfants",       emoji: "🐰", from: "#7A0E3A", to: "#9D174D", glow: "rgba(157,23,77,0.35)" },
  { id: "maison",         label: "Maison",        emoji: "🏮", from: "#6B2D00", to: "#B45309", glow: "rgba(180,83,9,0.35)"  },
  { id: "electronique",   label: "Électronique",  emoji: "📱", from: "#0B4E6B", to: "#0E7490", glow: "rgba(14,116,144,0.35)"},
  { id: "divertissement", label: "Divertissement",emoji: "📚", from: "#1E1A6B", to: "#3730A3", glow: "rgba(55,48,163,0.35)" },
  { id: "sport",          label: "Sport",         emoji: "🏓", from: "#014032", to: "#065F46", glow: "rgba(6,95,70,0.35)"   },
];

const TRENDING = ["Nike Air Force", "Levi's 501", "Sac Zara", "Jordan 1", "Manteau vintage", "Blazer"];

interface Props {
  products: any[];
  currentUserId?: string;
  initialQ?: string;
  initialCategory?: string;
}

export function ExplorerClient({ initialQ, initialCategory }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ ?? "");

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const handleCategoryClick = (id: string) => {
    router.push(initialCategory === id ? "/search" : `/search?category=${id}`);
  };

  return (
    <div
      className="min-h-[100dvh] pb-24"
      style={{
        background: "radial-gradient(ellipse at 25% 0%, rgba(139,92,246,0.09) 0%, transparent 50%), radial-gradient(ellipse at 80% 85%, rgba(109,40,217,0.06) 0%, transparent 40%), #07070A",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-[24px] font-black text-white tracking-tight">Explorer</h1>
        <p className="text-[12.5px] text-white/28 mt-0.5 font-medium">Découvrez des articles uniques</p>
      </div>

      {/* Search bar */}
      <div className="px-3 pb-4">
        <form onSubmit={handleSearch}>
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <Search style={{ width: 16, height: 16, color: "rgba(167,139,250,0.55)", flexShrink: 0 }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un article, une marque…"
              className="flex-1 bg-transparent text-[14px] text-white font-medium outline-none"
              style={{ caretColor: "#8B5CF6" }}
            />
            <button
              type="button"
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all active:scale-90"
              style={{ background: "rgba(139,92,246,0.14)", border: "1px solid rgba(139,92,246,0.18)" }}
            >
              <Camera style={{ width: 14, height: 14, color: "#A78BFA" }} />
            </button>
          </div>
        </form>
      </div>

      {/* Trending pills */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-2 mb-2.5 px-1">
          <TrendingUp style={{ width: 13, height: 13, color: "#8B5CF6" }} />
          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Tendances</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TRENDING.map((t) => (
            <button
              key={t}
              onClick={() => router.push(`/search?q=${encodeURIComponent(t)}`)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold text-white/50 active:scale-95 transition-all duration-150"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* AI banner */}
      <div className="px-3 mb-5">
        <button
          onClick={() => router.push("/search?sort=ai")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl active:scale-[0.98] transition-all duration-150"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(109,40,217,0.07) 100%)",
            border: "1px solid rgba(139,92,246,0.18)",
            boxShadow: "0 4px 20px rgba(139,92,246,0.07)",
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
              boxShadow: "0 0 14px rgba(139,92,246,0.45)",
            }}
          >
            <Sparkles style={{ width: 15, height: 15, color: "white" }} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-bold text-white">Sélection IA pour toi</p>
            <p className="text-[11px] text-white/35 mt-0.5">Basée sur tes préférences</p>
          </div>
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(139,92,246,0.18)", color: "#C4B5FD" }}
          >
            Voir →
          </span>
        </button>
      </div>

      {/* Section label */}
      <div className="px-4 mb-3">
        <p className="text-[10px] font-black text-white/25 uppercase tracking-widest">Catégories</p>
      </div>

      {/* Category grid */}
      <div className="px-3 grid grid-cols-2 gap-2.5 pb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="text-left active:scale-[0.95] transition-all duration-200"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <div
              className="relative rounded-[20px] overflow-hidden flex flex-col justify-between"
              style={{
                background: `linear-gradient(145deg, ${cat.from} 0%, ${cat.to} 100%)`,
                height: 118,
                padding: "14px 14px 12px 14px",
                boxShadow: `0 4px 20px ${cat.glow}, 0 1px 0 rgba(255,255,255,0.10) inset`,
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              {/* Highlight reflet */}
              <div
                className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 65%)" }}
              />
              {/* Grid texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />

              <p className="relative z-10 text-[14px] font-black text-white leading-tight pr-10">
                {cat.label}
              </p>

              <div
                className="absolute bottom-1.5 right-2.5 text-[42px] leading-none select-none"
                style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.45))" }}
                aria-hidden
              >
                {cat.emoji}
              </div>

              {/* Active check */}
              {initialCategory === cat.id && (
                <div
                  className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 0 6px rgba(255,255,255,0.6)" }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
