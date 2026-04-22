"use client";

import { useState, useEffect } from "react";
import { Zap, Trophy, ChevronDown, ChevronUp } from "lucide-react";
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
    !usage || usage.plan === "free" ? "#6C63FF" :
    usage.plan === "starter"        ? "#3B82F6" :
    usage.plan === "pro"            ? "#8B5CF6" : "#F59E0B";

  const dailyChallenges = CHALLENGES.filter((c) => c.type === "daily");

  return (
    <div className="mx-3 mb-2 rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(12,12,20,0.98)" }}>
      {/* Compact bar — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-3">
          {/* Plan badge */}
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border"
            style={{ color: planColor, borderColor: `${planColor}40`, background: `${planColor}18` }}>
            {planLabel}
          </span>

          {/* IA credits */}
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#6C63FF]" />
            <span className="text-[12px] font-bold text-white">
              {usage?.limit === null ? "∞" : (usage?.remaining ?? 0)}
            </span>
            <span className="text-[11px] text-white/30">crédits IA</span>
          </div>

          {/* Badges count */}
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-[#F59E0B]" />
            <span className="text-[12px] font-bold text-white">{earnedIds.length}</span>
            <span className="text-[11px] text-white/30">badges</span>
          </div>
        </div>

        {open ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="border-t border-white/6 px-4 pb-4 pt-3 space-y-4">
          {/* Credits bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#6C63FF]" />
                <span className="text-[12px] font-bold text-white">Crédits IA</span>
              </div>
              {usage?.limit !== null && (
                <span className="text-[11px] text-white/40">{usage?.remaining ?? 0} / {usage?.limit ?? 5} restants</span>
              )}
              {usage?.limit === null && <span className="text-[11px] font-bold text-[#F59E0B]">Illimité ♾️</span>}
            </div>
            {usage?.limit !== null && (
              <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${Math.max(0, 100 - (usage?.pct ?? 0))}%`, background: planColor }} />
              </div>
            )}
          </div>

          {/* Earned badges */}
          <div>
            <p className="text-[12px] font-bold text-white mb-2">Badges ({earnedIds.length}/{BADGES.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {BADGES.map((badge) => {
                const earned = earnedIds.includes(badge.id);
                return (
                  <span key={badge.id}
                    className={`text-[11px] px-2 py-1 rounded-full border font-medium transition-all ${earned ? "" : "opacity-20 grayscale"}`}
                    style={earned ? {
                      borderColor: `${badge.color}40`,
                      background: `${badge.color}18`,
                      color: badge.color,
                    } : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.3)" }}>
                    {badge.emoji} {badge.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Daily challenges */}
          <div>
            <p className="text-[12px] font-bold text-white mb-2">Défis du jour</p>
            <div className="flex flex-col gap-1.5">
              {dailyChallenges.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-2 rounded-xl border border-white/6 bg-white/2">
                  <span className="text-base">{c.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold text-white/80">{c.title}</p>
                    <div className="h-1 mt-1 rounded-full bg-white/8">
                      <div className="h-full w-0 rounded-full bg-[#4CAF50]" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#6C63FF] flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 fill-[#6C63FF]" />+{c.reward}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          {(!usage || usage.plan === "free") && (
            <Link href="/premium"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6C63FF, #A855F7)" }}>
              <Zap className="w-3.5 h-3.5 fill-white" />
              Débloquer plus de crédits
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
