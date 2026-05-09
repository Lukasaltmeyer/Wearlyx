"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Camera, Sparkles, TrendingUp } from "lucide-react";

const CATEGORIES = [
  { id: "femme",          label: "Femmes",                emoji: "👜", gradient: "from-[#6D28D9] to-[#4C1D95]", glow: "rgba(109,40,217,0.3)" },
  { id: "homme",          label: "Hommes",                emoji: "🧥", gradient: "from-[#065F46] to-[#064E3B]", glow: "rgba(6,95,70,0.3)"   },
  { id: "createurs",      label: "Créateurs",             emoji: "👛", gradient: "from-[#92400E] to-[#78350F]", glow: "rgba(146,64,14,0.3)"  },
  { id: "enfant",         label: "Enfants",               emoji: "🐰", gradient: "from-[#9D174D] to-[#831843]", glow: "rgba(157,23,77,0.3)"  },
  { id: "maison",         label: "Maison",                emoji: "🏮", gradient: "from-[#B45309] to-[#92400E]", glow: "rgba(180,83,9,0.3)"   },
  { id: "electronique",   label: "Électronique",          emoji: "📱", gradient: "from-[#0E7490] to-[#0C4A6E]", glow: "rgba(14,116,144,0.3)" },
  { id: "divertissement", label: "Divertissement",        emoji: "📚", gradient: "from-[#3730A3] to-[#312E81]", glow: "rgba(55,48,163,0.3)"  },
  { id: "sport",          label: "Sport",                 emoji: "🏓", gradient: "from-[#065F46] to-[#064E3B]", glow: "rgba(6,95,70,0.3)"   },
];

const TRENDING = ["Nike Air Force", "Levi's 501", "Sac Zara", "Jordan 1", "Manteau vintage"];

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

  const handleCategoryClick = (categoryId: string) => {
    if (initialCategory === categoryId) router.push("/search");
    else router.push(`/search?category=${categoryId}`);
  };

  return (
    <div
      className="min-h-[100dvh] pb-24"
      style={{
        background: "radial-gradient(ellipse at 20% 0%, rgba(139,92,246,0.1) 0%, transparent 45%), radial-gradient(ellipse at 80% 80%, rgba(109,40,217,0.07) 0%, transparent 40%), #07070A",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-[22px] font-black text-white mb-0.5">Explorer</h1>
        <p className="text-[12px] text-white/30">Découvrez des articles uniques</p>
      </div>

      {/* Search bar */}
      <div className="px-3 pb-4">
        <form onSubmit={handleSearch}>
          <div
            className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(167,139,250,0.6)" }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un article, une marque…"
              className="flex-1 bg-transparent text-[14px] text-white placeholder-white/25 outline-none"
              style={{ caretColor: "#8B5CF6" }}
            />
            <button
              type="button"
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)" }}
            >
              <Camera className="w-3.5 h-3.5" style={{ color: "#A78BFA" }} />
            </button>
          </div>
        </form>
      </div>

      {/* Trending pills */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-2 mb-2.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">Tendances</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TRENDING.map((t) => (
            <button
              key={t}
              onClick={() => router.push(`/search?q=${encodeURIComponent(t)}`)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold text-white/60 active:scale-95 transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* AI picks banner */}
      <div className="px-3 mb-4">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(109,40,217,0.08) 100%)",
            border: "1px solid rgba(139,92,246,0.2)",
            boxShadow: "0 4px 16px rgba(139,92,246,0.08)",
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 0 16px rgba(139,92,246,0.4)" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-white">Sélection IA pour toi</p>
            <p className="text-[11px] text-white/40 mt-0.5">Basée sur tes préférences</p>
          </div>
          <button
            onClick={() => router.push("/search?sort=ai")}
            className="text-[11px] font-bold text-[#A78BFA] px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(139,92,246,0.15)" }}
          >
            Voir →
          </button>
        </div>
      </div>

      {/* Section label */}
      <div className="px-4 mb-3">
        <p className="text-[11px] font-black text-white/30 uppercase tracking-widest">Catégories</p>
      </div>

      {/* Category grid */}
      <div className="px-3 grid grid-cols-2 gap-2.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="text-left active:scale-[0.96] transition-all duration-200"
          >
            <div
              className={`relative rounded-2xl overflow-hidden flex flex-col justify-between bg-gradient-to-br ${cat.gradient}`}
              style={{
                height: 120,
                padding: "14px 14px 12px 14px",
                boxShadow: `0 4px 20px ${cat.glow}, inset 0 1px 0 rgba(255,255,255,0.12)`,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Glow orb */}
              <div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)` }}
              />

              {/* Title */}
              <p className="relative z-10 text-[14px] font-black text-white leading-tight pr-8">
                {cat.label}
              </p>

              {/* Emoji */}
              <div
                className="absolute bottom-2 right-3 text-[44px] leading-none select-none"
                style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
                aria-hidden
              >
                {cat.emoji}
              </div>

              {/* Active indicator */}
              {initialCategory === cat.id && (
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white shadow-lg" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="h-4" />
    </div>
  );
}
