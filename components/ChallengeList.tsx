"use client";

import { CHALLENGES } from "@/lib/gamification";
import { Zap } from "lucide-react";

interface ChallengeProgress {
  id: string;
  current: number;
}

interface Props {
  progress?: ChallengeProgress[];
  type?: "daily" | "weekly" | "monthly" | "all";
}

export function ChallengeList({ progress = [], type = "all" }: Props) {
  const challenges = type === "all" ? CHALLENGES : CHALLENGES.filter((c) => c.type === type);

  return (
    <div className="rounded-2xl border border-white/8 p-4" style={{ background: "rgba(14,14,22,0.95)" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-bold text-white">Défis</span>
        <div className="flex gap-1.5">
          {(["daily", "weekly", "monthly"] as const).map((t) => (
            <span key={t} className="text-[10px] text-white/30 capitalize">{
              t === "daily" ? "Jour" : t === "weekly" ? "Sem." : "Mois"
            }</span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {challenges.map((challenge) => {
          const prog = progress.find((p) => p.id === challenge.id);
          const current = prog?.current ?? 0;
          const pct = Math.min(100, Math.round((current / challenge.target) * 100));
          const done = pct >= 100;
          const typeColor =
            challenge.type === "daily"   ? "#4CAF50" :
            challenge.type === "weekly"  ? "#22C55E" : "#F59E0B";

          return (
            <div key={challenge.id}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                done ? "border-[#4CAF50]/25 bg-[#4CAF50]/8" : "border-white/6 bg-white/2"
              }`}>
              <span className="text-xl flex-shrink-0">{challenge.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-[12px] font-semibold truncate ${done ? "text-[#4CAF50]" : "text-white/80"}`}>
                    {challenge.title}
                  </p>
                  <span className="text-[10px] flex-shrink-0 font-bold text-[#22C55E] flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 fill-[#22C55E]" />
                    +{challenge.reward}
                  </span>
                </div>
                <div className="mt-1.5 h-1 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: done ? "#4CAF50" : typeColor }} />
                </div>
                <p className="text-[10px] text-white/25 mt-0.5">{current}/{challenge.target}</p>
              </div>
              {done && <span className="text-sm flex-shrink-0">✅</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
