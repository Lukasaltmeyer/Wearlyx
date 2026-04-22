"use client";

import { useEffect, useState } from "react";
import { getUsage, getPlanInfo, type UsageData } from "@/lib/usage";

interface Props {
  onUsageLoaded?: (usage: UsageData) => void;
}

export function UsageCounter({ onUsageLoaded }: Props) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsage().then((u) => {
      setUsage(u);
      if (u) onUsageLoaded?.(u);
      setLoading(false);
    });
  }, [onUsageLoaded]);

  if (loading) {
    return (
      <div className="h-16 rounded-2xl bg-white/4 border border-white/6 animate-pulse" />
    );
  }

  if (!usage) return null;

  const plan = getPlanInfo(usage.plan);
  const isUnlimited = usage.limit === null;
  const isWarning = !isUnlimited && (usage.remaining ?? 0) <= 1;
  const isDanger = !isUnlimited && (usage.remaining ?? 0) === 0;

  return (
    <div className={`rounded-2xl border p-4 transition-colors ${
      isDanger ? "border-red-500/25 bg-red-500/8" :
      isWarning ? "border-amber-500/25 bg-amber-500/8" :
      "border-white/8 bg-white/4"
    }`}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base">{plan.emoji}</span>
          <span className="text-[13px] font-semibold text-white/70">{plan.label}</span>
        </div>
        {isUnlimited ? (
          <span className="text-[11px] font-bold text-amber-400 bg-amber-400/15 border border-amber-400/25 px-2 py-0.5 rounded-full">
            ♾️ Illimité
          </span>
        ) : (
          <span className={`text-[12px] font-bold ${isDanger ? "text-red-400" : isWarning ? "text-amber-400" : "text-[#a78bfa]"}`}>
            {usage.remaining} restante{(usage.remaining ?? 0) > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {!isUnlimited && (
        <>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/8 overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${usage.pct}%`,
                background: isDanger ? "#EF4444" : isWarning ? "#F59E0B" :
                  "linear-gradient(to right, #6C63FF, #C084FC)",
              }}
            />
          </div>
          <p className="text-[11px] text-white/30">
            {usage.ai_photos_used} / {usage.limit} améliorations utilisées ce mois
            {isDanger && <span className="text-red-400 font-semibold"> · Limite atteinte</span>}
          </p>
        </>
      )}
    </div>
  );
}
