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
  { value: "sport",          label: "Sport",         emoji: "🏃" },
];

export function FilterBar({ activeCategory }: FilterBarProps) {
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
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
        {FILTER_CATEGORIES.map(({ value, label, emoji }) => {
          const isActive = value === "all"
            ? !activeCategory || activeCategory === "all"
            : activeCategory === value;
          return (
            <button
              key={value}
              onClick={() => setParam("category", value)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12.5px] font-semibold transition-all duration-200 active:scale-[0.93]",
                isActive ? "text-white" : "text-white/35"
              )}
              style={isActive ? {
                background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                boxShadow: "0 4px 14px rgba(139,92,246,0.35), 0 0 0 1px rgba(167,139,250,0.2)",
              } : {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
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
