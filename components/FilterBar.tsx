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
    <div className="px-4 py-2">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {FILTER_CATEGORIES.map(({ value, label, emoji }) => {
          const isActive = value === "all"
            ? !activeCategory || activeCategory === "all"
            : activeCategory === value;
          return (
            <button
              key={value}
              onClick={() => setParam("category", value)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-all duration-150 active:scale-95",
                isActive ? "text-white" : "text-white/40 hover:text-white/60"
              )}
              style={isActive ? {
                background: "#8B5CF6",
                boxShadow: "0 0 0 1px rgba(139,92,246,0.4), 0 4px 12px rgba(139,92,246,0.2)",
                color: "#fff",
              } : {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
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