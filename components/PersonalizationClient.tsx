"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const CATEGORIES = [
  { label: "Femme", emoji: "👗" },
  { label: "Homme", emoji: "👔" },
  { label: "Enfant", emoji: "🧸" },
  { label: "Chaussures", emoji: "👟" },
  { label: "Accessoires", emoji: "👜" },
  { label: "Électronique", emoji: "💻" },
  { label: "Téléphones", emoji: "📱" },
  { label: "Gaming", emoji: "🎮" },
  { label: "Beauté", emoji: "💄" },
  { label: "Sport", emoji: "⚽" },
  { label: "Autre", emoji: "🌀" },
];
const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "Unique"];
const BRANDS = ["Nike", "Adidas", "Zara", "H&M", "Levi's", "Louis Vuitton", "Gucci", "Shein", "Uniqlo", "Mango", "The North Face", "Lacoste", "Ralph Lauren", "Tommy Hilfiger", "Vans", "New Balance"];

export function PersonalizationClient() {
  const router = useRouter();
  const [cats, setCats] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-5">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-bold text-white">Personnalisation</h1>
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className="px-4 py-2 rounded-xl text-[13px] font-bold text-white"
          style={{ background: saved ? "#10B981" : "#4CAF50" }}
        >
          {saved ? "✓ Sauvegardé" : "Sauvegarder"}
        </button>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {/* Catégories */}
        <div className="p-4 rounded-2xl border border-white/8 bg-white/3">
          <p className="text-[14px] font-bold text-white mb-3 flex items-center gap-2">
            <span>🏷</span> Catégories favorites
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ label, emoji }) => (
              <button
                key={label}
                onClick={() => toggle(cats, label, setCats)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                  cats.includes(label)
                    ? "bg-white text-black"
                    : "border border-white/15 bg-white/5 text-white/60"
                }`}
              >
                <span>{emoji}</span> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tailles */}
        <div className="p-4 rounded-2xl border border-white/8 bg-white/3">
          <p className="text-[14px] font-bold text-white mb-3 flex items-center gap-2">
            <span>🔖</span> Mes tailles
          </p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => toggle(sizes, s, setSizes)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                  sizes.includes(s)
                    ? "bg-white text-black"
                    : "border border-white/15 bg-white/5 text-white/60"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Marques */}
        <div className="p-4 rounded-2xl border border-white/8 bg-white/3">
          <p className="text-[14px] font-bold text-white mb-3 flex items-center gap-2">
            <span>⭐</span> Marques favorites
          </p>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((b) => (
              <button
                key={b}
                onClick={() => toggle(brands, b, setBrands)}
                className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                  brands.includes(b)
                    ? "bg-white text-black"
                    : "border border-white/15 bg-white/5 text-white/60"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
