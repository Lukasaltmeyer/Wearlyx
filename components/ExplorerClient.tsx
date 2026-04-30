"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Camera } from "lucide-react";

const CATEGORIES = [
  {
    id: "femme",
    label: "Femmes",
    emoji: "👜",
    color: "#6D28D9",
    bg: "rgba(109,40,217,0.12)",
  },
  {
    id: "homme",
    label: "Hommes",
    emoji: "🧥",
    color: "#065F46",
    bg: "rgba(6,95,70,0.12)",
  },
  {
    id: "createurs",
    label: "Articles de créateurs",
    emoji: "👛",
    color: "#92400E",
    bg: "rgba(146,64,14,0.12)",
  },
  {
    id: "enfant",
    label: "Enfants",
    emoji: "🐰",
    color: "#9D174D",
    bg: "rgba(157,23,77,0.12)",
  },
  {
    id: "maison",
    label: "Maison",
    emoji: "🏮",
    color: "#B45309",
    bg: "rgba(180,83,9,0.12)",
  },
  {
    id: "electronique",
    label: "Électronique",
    emoji: "📱",
    color: "#0E7490",
    bg: "rgba(14,116,144,0.12)",
  },
  {
    id: "divertissement",
    label: "Divertissement",
    emoji: "📚",
    color: "#3730A3",
    bg: "rgba(55,48,163,0.12)",
  },
  {
    id: "loisirs",
    label: "Loisirs et collections",
    emoji: "🎫",
    color: "#065F46",
    bg: "rgba(6,95,70,0.12)",
  },
  {
    id: "sport",
    label: "Sport",
    emoji: "🏓",
    color: "#065F46",
    bg: "rgba(6,95,70,0.12)",
  },
];

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
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (initialCategory === categoryId) {
      router.push("/search");
    } else {
      router.push(`/search?category=${categoryId}`);
    }
  };

  return (
    <div className="min-h-[100dvh] pb-24" style={{ background: "#0A0A0A" }}>

      {/* Search bar */}
      <div className="px-3 pt-3 pb-4">
        <form onSubmit={handleSearch}>
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl"
            style={{ background: "#1A1A1A" }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un article ou un membre"
              className="flex-1 bg-transparent text-[14px] text-white placeholder-white/30 outline-none"
              style={{ caretColor: "#8B5CF6" }}
            />
            <button type="button" className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Category grid */}
      <div className="px-3 grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="text-left active:scale-[0.97] transition-transform duration-150"
          >
            <div
              className="relative rounded-2xl overflow-hidden flex flex-col justify-between"
              style={{
                background: "#111111",
                height: 120,
                padding: "14px 14px 12px 14px",
              }}
            >
              {/* Title */}
              <p className="text-[14px] font-bold text-white leading-tight pr-8">
                {cat.label}
              </p>

              {/* Emoji illustration */}
              <div
                className="absolute bottom-2 right-3 text-[44px] leading-none select-none"
                style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}
                aria-hidden
              >
                {cat.emoji}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
