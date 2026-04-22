"use client";

import { BADGES, type BadgeId } from "@/lib/gamification";

interface Props {
  earnedIds: BadgeId[];
  showAll?: boolean;
  maxVisible?: number;
}

export function BadgeSystem({ earnedIds, showAll = false, maxVisible = 6 }: Props) {
  const badges = showAll ? BADGES : BADGES.slice(0, maxVisible);

  return (
    <div className="rounded-2xl border border-white/8 p-4" style={{ background: "rgba(14,14,22,0.95)" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-bold text-white">Badges</span>
        <span className="text-[11px] text-white/30">{earnedIds.length}/{BADGES.length}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => {
          const earned = earnedIds.includes(badge.id);
          return (
            <div
              key={badge.id}
              title={badge.description}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
                earned ? "opacity-100" : "opacity-25 grayscale"
              }`}
              style={earned ? {
                borderColor: `${badge.color}40`,
                background: `${badge.color}18`,
                color: badge.color,
              } : {
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              <span>{badge.emoji}</span>
              <span>{badge.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
