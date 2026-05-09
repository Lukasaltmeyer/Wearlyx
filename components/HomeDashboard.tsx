"use client";

import { useState, useEffect } from "react";
import { Zap, Trophy, ChevronDown, ChevronUp, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { getUsage, type UsageData } from "@/lib/usage";
import { BADGES, CHALLENGES, getEarnedBadges, type BadgeId } from "@/lib/gamification";

export function HomeDashboard() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [open, setOpen] = useState(false);
  const [earnedIds, setEarnedIds] = useState<BadgeId[]>([]);

  useEffect(() => {
    getUsage().then((u) => {
      if (!u) return;
      setUsage(u);
      setEarnedIds(getEarnedBadges({
        sales_count: 0,
        products_count: 0,
        ai_photos_used: u.ai_photos_used,
        rating: 0,
      }));
    });
  }, []);

  const planLabel =
    !usage || usage.plan === "free" ? "Gratuit" :
    usage.plan === "starter"        ? "Starter" :
    usage.plan === "pro"            ? "Vendeur Pro" : "Premium";

  const planColor =
    !usage || usage.plan === "free" ? "#8B5CF6" :
    usage.plan === "starter"        ? "#3B82F6" :
    usage.plan === "pro"            ? "#8B5CF6" : "#F59E0B";

  const dailyChallenges = CHALLENGES.filter((c) => c.type === "daily");

  return (
    <div
      className="mx-3 mb-1 rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Compact row */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] font-black px-2.5 py-1 rounded-full"
            style={{ color: planColor, background: `${planColor}18`, border: `1px solid ${planColor}30` }}
          >
            {planLabel}
          </span>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.15)" }}>
            <Zap className="w-3 h-3 text-[#8B5CF6] fill-[#8B5CF6]" />
            <span className="text-[11px] font-black text-white">
              {usage?.limit === null ? "∞" : (usage?.remaining ?? 0)}
            </span>
            <span className="text-[10px] text-white/30">IA</span>
          </div>

          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] font-bold text-white">{earnedIds.length}</span>
          </div>
        </div>

        {open
          ? <ChevronUp className="w-3.5 h-3.5 text-white/20" />
          : <ChevronDown className="w-3.5 h-3.5 text-white/20" />
        }
      </button>

      {/* Expanded panel */}
      {open && (
        <div
          className="border-t px-4 pb-4 pt-3 space-y-4"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {/* Credits bar */}
          {usage?.limit !== null && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
                  <span className="text-[12px] font-semibold text-white/60">Crédits IA</span>
                </div>
                <span className="text-[11px] text-white/30 font-mono">
                  {usage?.remaining ?? 0} / {usage?.limit ?? 5}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.max(4, 100 - (usage?.pct ?? 0))}%`,
                    background: `linear-gradient(90deg, ${planColor}, ${planColor}cc)`,
                    boxShadow: `0 0 8px ${planColor}50`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Badges */}
          <div>
            <p className="text-[10px] font-black text-white/25 mb-2 uppercase tracking-widest">
              Badges ({earnedIds.length}/{BADGES.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {BADGES.map((badge) => {
                const earned = earnedIds.includes(badge.id);
                return (
                  <span
                    key={badge.id}
                    className={`text-[10.5px] px-2 py-1 rounded-full font-medium transition-all ${earned ? "" : "opacity-20 grayscale"}`}
                    style={earned ? {
                      borderColor: `${badge.color}35`,
                      background: `${badge.color}12`,
                      color: badge.color,
                      border: `1px solid ${badge.color}35`,
                    } : {
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.02)",
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    {badge.emoji} {badge.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Daily challenges */}
          <div>
            <p className="text-[10px] font-black text-white/25 mb-2 uppercase tracking-widest">Défis du jour</p>
            <div className="flex flex-col gap-1.5">
              {dailyChallenges.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="text-base">{c.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[11.5px] font-semibold text-white/70">{c.title}</p>
                    <div className="h-1 mt-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full w-0 rounded-full"
                        style={{ background: "linear-gradient(90deg, #8B5CF6, #A78BFA)" }} />
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-[#A78BFA] flex items-center gap-0.5"
                    style={{ textShadow: "0 0 10px rgba(167,139,250,0.5)" }}>
                    <Zap className="w-2.5 h-2.5 fill-[#8B5CF6]" />+{c.reward}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade CTA */}
          {(!usage || usage.plan === "free") && (
            <Link
              href="/premium"
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-black text-white transition-all active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                boxShadow: "0 6px 20px rgba(139,92,246,0.35)",
              }}
            >
              <Crown className="w-3.5 h-3.5" />
              Débloquer Premium
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
