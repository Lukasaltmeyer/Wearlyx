"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  activeCategory?: string;
  activeSort?: string;
}

const FILTER_CATEGORIES = [
  { value: "all",            label: "Tout",          emoji: "✦" },
  { value: "femme",          label: "Femmes",        emoji: "👗" },
  { value: "homme",          label: "Hommes",        emoji: "👕" },
  { value: "createurs",      label: "Créateurs",     emoji: "✨" },
  { value: "enfant",         label: "Enfants",       emoji: "🧸" },
  { value: "maison",         label: "Maison",        emoji: "🏠" },
  { value: "electronique",   label: "Électronique",  emoji: "📱" },
  { value: "divertissement", label: "Divertissement",emoji: "🎮" },
  { value: "loisirs",        label: "Loisirs",       emoji: "⚽" },
  { value: "sport",          label: "Sport",         emoji: "🏃" },
];

export function FilterBar({ activeCategory, activeSort }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="px-3 py-2.5">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {FILTER_CATEGORIES.map(({ value, label, emoji }) => {
          const isActive = value === "all"
            ? !activeCategory || activeCategory === "all"
            : activeCategory === value;
          return (
            <button
              key={value}
              onClick={() => setParam("category", value)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-150 active:scale-95",
                isActive
                  ? "text-white border border-transparent"
                  : "bg-white/[0.05] text-white/45 border border-white/[0.07] hover:bg-white/[0.08] hover:text-white/65"
              )}
              style={isActive ? {
                background: "linear-gradient(135deg, #6C3AED, #C026D3)",
                boxShadow: "0 2px 12px rgba(108,58,237,0.45), 0 0 0 1px rgba(124,58,237,0.3)",
              } : {}}
            >
              <span className="text-[11px]">{emoji}</span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
