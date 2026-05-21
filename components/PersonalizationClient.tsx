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

export function PersonalizationClient({ isDesktop }: { isDesktop?: boolean }) {
  const router = useRouter();
  const [cats, setCats] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const saveBtn = (full?: boolean) => (
    <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
      className={`${full ? "w-full py-3.5" : "px-4 py-2"} rounded-[12px] text-[13px] font-bold text-white transition-all`}
      style={{ background: saved ? "#10B981" : "#4CAF50" }}>
      {saved ? "✓ Sauvegardé" : "Sauvegarder"}
    </button>
  );

  if (isDesktop) {
    return (
      <div className="flex gap-10">
        {/* Left — sections */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-[20px] px-7 py-6"
            style={{ background: "linear-gradient(135deg, rgba(76,175,80,0.08) 0%, rgba(16,185,129,0.04) 100%)", border: "1px solid rgba(76,175,80,0.14)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(74,222,128,0.5)" }}>Personnalisation</p>
            <p className="text-[20px] font-black text-white tracking-tight mb-1">Affine ton fil d'actu</p>
            <p className="text-[12.5px] text-white/35 leading-relaxed">Sélectionne tes catégories, tailles et marques préférées pour voir en priorité ce qui te correspond.</p>
          </div>

          {/* Categories */}
          <div className="rounded-[16px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="px-5 pt-4 pb-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>🏷 Catégories favorites</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(({ label, emoji }) => {
                  const active = cats.includes(label);
                  return (
                    <button key={label} onClick={() => toggle(cats, label, setCats)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12.5px] font-semibold transition-all"
                      style={{
                        background: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.05)",
                        color: active ? "#07070A" : "rgba(255,255,255,0.5)",
                        border: active ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                      }}>
                      <span>{emoji}</span> {label}
                      {active && <span className="text-[10px] font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="rounded-[16px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="px-5 pt-4 pb-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>🔖 Mes tailles</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => {
                  const active = sizes.includes(s);
                  return (
                    <button key={s} onClick={() => toggle(sizes, s, setSizes)}
                      className="px-4 py-2 rounded-full text-[12.5px] font-bold transition-all"
                      style={{
                        background: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.05)",
                        color: active ? "#07070A" : "rgba(255,255,255,0.5)",
                        border: active ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                      }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Brands */}
          <div className="rounded-[16px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="px-5 pt-4 pb-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>⭐ Marques favorites</p>
              <div className="flex flex-wrap gap-2">
                {BRANDS.map((b) => {
                  const active = brands.includes(b);
                  return (
                    <button key={b} onClick={() => toggle(brands, b, setBrands)}
                      className="px-3.5 py-2 rounded-full text-[12.5px] font-semibold transition-all"
                      style={{
                        background: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.05)",
                        color: active ? "#07070A" : "rgba(255,255,255,0.5)",
                        border: active ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                      }}>
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            className="py-3 px-6 rounded-[12px] text-[13.5px] font-bold text-white transition-all self-start"
            style={{
              background: saved ? "#10B981" : "linear-gradient(135deg, #4CAF50, #10B981)",
              boxShadow: saved ? "none" : "0 4px 16px rgba(76,175,80,0.25)",
            }}>
            {saved ? "✓ Préférences sauvegardées" : "Sauvegarder mes préférences"}
          </button>
        </div>

        {/* Right — summary */}
        <div className="w-[220px] flex-shrink-0 flex flex-col gap-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.22)" }}>Sélection actuelle</p>
          <div className="flex flex-col gap-3">
            {[
              { label: "Catégories", count: cats.length, color: "#A78BFA" },
              { label: "Tailles",    count: sizes.length, color: "#34D399" },
              { label: "Marques",    count: brands.length, color: "#F59E0B" },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3.5 rounded-[12px]"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[13px] font-semibold text-white/60">{label}</p>
                <span className="text-[16px] font-black" style={{ color: count > 0 ? color : "rgba(255,255,255,0.18)" }}>
                  {count > 0 ? count : "—"}
                </span>
              </div>
            ))}
          </div>
          <div className="px-4 py-4 rounded-[14px]" style={{ background: "rgba(76,175,80,0.06)", border: "1px solid rgba(76,175,80,0.12)" }}>
            <p className="text-[11px] text-white/35 leading-relaxed">Plus tu sélectionnes, plus ton fil d'actu sera précis et personnalisé.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-5 pb-5">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-bold text-white">Personnalisation</h1>
        {saveBtn()}
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
