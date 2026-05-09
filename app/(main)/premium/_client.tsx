"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Zap, Crown, ArrowLeft, Star, Shield, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getUsage, type UsageData } from "@/lib/usage";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    badge: "🎉 -20% le 1er mois",
    priceNormal: 10,
    priceFirst: 8,
    icon: <Zap className="w-5 h-5" />,
    gradient: "linear-gradient(135deg, #1D4ED8, #2563EB)",
    glow: "rgba(59,130,246,0.3)",
    accentColor: "#3B82F6",
    popular: false,
    features: [
      { text: "20 améliorations photo IA / mois", included: true },
      { text: "5 boosts articles / mois", included: true },
      { text: "Badge Vendeur actif", included: true },
      { text: "Statistiques de base", included: true },
      { text: "Prix conseillé par IA", included: true },
      { text: "Suppression fond IA", included: false },
      { text: "Boutique personnalisée", included: false },
    ],
  },
  {
    id: "pro",
    name: "Vendeur Pro",
    badge: "⭐ Populaire · -28% le 1er mois",
    priceNormal: 25,
    priceFirst: 18,
    icon: <Star className="w-5 h-5" />,
    gradient: "linear-gradient(135deg, #6D28D9, #8B5CF6)",
    glow: "rgba(139,92,246,0.4)",
    accentColor: "#8B5CF6",
    popular: true,
    features: [
      { text: "60 améliorations photo IA / mois", included: true },
      { text: "15 boosts articles / mois", included: true },
      { text: "Statistiques avancées", included: true },
      { text: "Suppression fond IA", included: true },
      { text: "Relance automatique acheteurs", included: true },
      { text: "Suggestions prix pour vendre vite", included: true },
      { text: "Boutique personnalisée", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    badge: "🎉 -50% le 1er mois",
    priceNormal: 50,
    priceFirst: 25,
    icon: <Crown className="w-5 h-5" />,
    gradient: "linear-gradient(135deg, #92400E, #D97706)",
    glow: "rgba(245,158,11,0.3)",
    accentColor: "#F59E0B",
    popular: false,
    features: [
      { text: "IA & boosts illimités", included: true },
      { text: "Boutique vendeur personnalisée", included: true },
      { text: "Commission réduite", included: true },
      { text: "Articles en page d'accueil", included: true },
      { text: "Analytics professionnels complets", included: true },
      { text: "Relance automatique acheteurs", included: true },
      { text: "Support prioritaire 24/7", included: true },
    ],
  },
] as const;

type PlanId = "starter" | "pro" | "premium";

function PlanCard({ plan, isCurrentPlan, onSelect, loading }: {
  plan: typeof PLANS[number];
  isCurrentPlan: boolean;
  onSelect: (id: PlanId) => void;
  loading: boolean;
}) {
  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: plan.popular
          ? "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)"
          : "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        border: plan.popular ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: plan.popular
          ? "0 8px 40px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Top gradient bar */}
      <div className="h-1.5 w-full" style={{ background: plan.gradient }} />

      {/* Popular badge */}
      {plan.popular && (
        <div
          className="absolute top-0 right-5 text-white text-[10px] font-black px-3 py-1 rounded-b-xl"
          style={{ background: plan.gradient }}
        >
          ⭐ POPULAIRE
        </div>
      )}

      {/* Glow orb */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${plan.glow} 0%, transparent 70%)` }}
      />

      <div className="p-5 relative z-10">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
            style={{ background: plan.gradient, boxShadow: `0 6px 20px ${plan.glow}` }}
          >
            {plan.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-[17px] font-black text-white">{plan.name}</h3>
            <span
              className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1"
              style={{
                background: `${plan.accentColor}15`,
                color: plan.accentColor,
                border: `1px solid ${plan.accentColor}30`,
              }}
            >
              {plan.badge}
            </span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-5 p-3.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[38px] font-black text-white leading-none">{plan.priceFirst}€</span>
            <span className="text-[12px] text-white/35">le 1er mois</span>
          </div>
          <p className="text-[11.5px] text-white/25 mt-1">
            puis <span className="text-white/45 font-bold">{plan.priceNormal}€/mois</span>
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-2.5 mb-5">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: f.included ? `${plan.accentColor}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${f.included ? plan.accentColor + "35" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {f.included
                  ? <Check className="w-2.5 h-2.5" style={{ color: plan.accentColor }} />
                  : <span className="w-1.5 h-0.5 rounded-full bg-white/15 block" />
                }
              </div>
              <span className={`text-[13px] leading-snug ${f.included ? "text-white/75" : "text-white/22 line-through"}`}>
                {f.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        {isCurrentPlan ? (
          <div
            className="w-full py-3.5 rounded-2xl text-center text-[13px] font-bold text-white/35"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            ✓ Plan actuel
          </div>
        ) : (
          <button
            onClick={() => onSelect(plan.id as PlanId)}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-[15px] font-black text-white transition-all active:scale-[0.97] disabled:opacity-60"
            style={{ background: plan.gradient, boxShadow: `0 8px 24px ${plan.glow}` }}
          >
            {loading
              ? <span className="inline-block w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              : `Choisir ${plan.name} →`
            }
          </button>
        )}
      </div>
    </div>
  );
}

export default function PremiumClientPage() {
  const router = useRouter();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [success, setSuccess] = useState<PlanId | null>(null);

  useEffect(() => { getUsage().then(setUsage); }, []);

  const handleSelect = async (planId: PlanId) => {
    setLoadingPlan(planId);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("user_usage").upsert({
        user_id: user.id, plan: planId, ai_photos_used: 0, boost_used: 0,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      });
      await supabase.from("subscriptions").insert({
        user_id: user.id, plan: planId,
        ai_limit: planId === "starter" ? 20 : planId === "pro" ? 60 : null,
        boost_limit: planId === "starter" ? 5 : planId === "pro" ? 15 : null,
        status: "active",
      });
      setSuccess(planId);
      const u = await getUsage();
      if (u) setUsage(u);
    } catch (e) { console.error(e); }
    finally { setLoadingPlan(null); }
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col pb-28"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(109,40,217,0.1) 0%, transparent 45%), #07070A",
      }}
    >
      {/* Back */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-2">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60 active:scale-95 transition-transform"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Hero */}
      <div className="px-5 pt-3 pb-6 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
            boxShadow: "0 8px 32px rgba(139,92,246,0.45)",
          }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-[28px] font-black text-white leading-tight">
          Vendez plus,<br />
          <span style={{
            background: "linear-gradient(135deg, #C4B5FD, #A78BFA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>gagnez plus 🚀</span>
        </h1>
        <p className="text-[13.5px] text-white/35 mt-2.5 leading-relaxed">
          Débloquez les outils IA pour vendre<br />plus vite et gagner plus.
        </p>
      </div>

      {/* Trust badges */}
      <div className="px-4 mb-5">
        <div className="flex gap-2 justify-center flex-wrap">
          {[
            { icon: Shield, text: "Sans engagement", color: "#10B981" },
            { icon: TrendingUp, text: "Résiliation libre", color: "#8B5CF6" },
            { icon: Zap, text: "Actif immédiatement", color: "#F59E0B" },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
              <Icon className="w-3 h-3" style={{ color }} />
              <span className="text-[11px] font-semibold" style={{ color }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current plan indicator */}
      {usage && (
        <div
          className="mx-4 mb-5 rounded-2xl px-4 py-3 flex items-center justify-between"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div>
            <p className="text-[11px] text-white/30">Plan actuel</p>
            <p className="text-[15px] font-bold text-white capitalize mt-0.5">
              {usage.plan === "free" ? "🆓 Gratuit" : usage.plan === "starter" ? "🚀 Starter" : usage.plan === "pro" ? "⚡ Vendeur Pro" : "👑 Premium"}
            </p>
          </div>
          {usage.limit !== null ? (
            <div className="text-right">
              <p className="text-[11px] text-white/30">IA photos</p>
              <p className="text-[14px] font-bold text-[#A78BFA]">{usage.remaining} / {usage.limit}</p>
            </div>
          ) : (
            <span className="text-[11px] font-black text-amber-400 px-2.5 py-1 rounded-full"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>
              ♾️ Illimité
            </span>
          )}
        </div>
      )}

      {/* Success banner */}
      {success && (
        <div
          className="mx-4 mb-4 rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(16,185,129,0.15)" }}>
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-emerald-300">Abonnement activé !</p>
            <p className="text-[11px] text-emerald-400/50 mt-0.5">Tes nouvelles fonctionnalités sont disponibles.</p>
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div className="px-4 flex flex-col gap-4">
        {PLANS.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={usage?.plan === plan.id}
            onSelect={handleSelect}
            loading={loadingPlan === plan.id}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 pt-6 text-center">
        <p className="text-[11px] text-white/18 leading-relaxed">
          Résiliation possible à tout moment · Sans engagement<br />Paiement sécurisé · Prix TTC
        </p>
      </div>
    </div>
  );
}
