"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Zap, Crown, ArrowLeft, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getUsage, type UsageData } from "@/lib/usage";

// ─── Plan definitions ─────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "starter",
    name: "Starter",
    badge: "🎉 -20% le 1er mois",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    priceNormal: 10,
    priceFirst: 8,
    icon: <Zap className="w-5 h-5" />,
    gradient: "from-blue-600 to-blue-800",
    accentColor: "#3B82F6",
    accentLight: "rgba(59,130,246,0.15)",
    popular: false,
    features: [
      { text: "20 améliorations photo IA / mois", included: true },
      { text: "5 boosts articles / mois", included: true },
      { text: "Badge Vendeur actif", included: true },
      { text: "Statistiques de base (vues, likes)", included: true },
      { text: "Prix conseillé par IA", included: true },
      { text: "Suppression fond IA", included: false },
      { text: "Boutique personnalisée", included: false },
    ],
  },
  {
    id: "pro",
    name: "Vendeur Pro",
    badge: "⭐ Populaire · 🎉 -28% le 1er mois",
    badgeColor: "bg-violet-500/20 text-violet-200 border-violet-500/30",
    priceNormal: 25,
    priceFirst: 18,
    icon: <Star className="w-5 h-5" />,
    gradient: "from-violet-600 to-purple-800",
    accentColor: "#7C3AED",
    accentLight: "rgba(124,58,237,0.15)",
    popular: true,
    features: [
      { text: "60 améliorations photo IA / mois", included: true },
      { text: "15 boosts articles / mois", included: true },
      { text: "Statistiques avancées (conversion, perf.)", included: true },
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
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    priceNormal: 50,
    priceFirst: 25,
    icon: <Crown className="w-5 h-5" />,
    gradient: "from-amber-500 to-orange-700",
    accentColor: "#F59E0B",
    accentLight: "rgba(245,158,11,0.12)",
    popular: false,
    features: [
      { text: "IA & boosts illimités", included: true },
      { text: "Boutique vendeur personnalisée", included: true },
      { text: "Commission réduite sur les achats", included: true },
      { text: "Articles en page d'accueil (priorité)", included: true },
      { text: "Analytics professionnels complets", included: true },
      { text: "Relance automatique acheteurs", included: true },
      { text: "Support prioritaire 24/7", included: true },
    ],
  },
] as const;

type PlanId = "starter" | "pro" | "premium";

// ─── Plan card ────────────────────────────────────────────────────────────────
function PlanCard({
  plan,
  isCurrentPlan,
  onSelect,
  loading,
}: {
  plan: typeof PLANS[number];
  isCurrentPlan: boolean;
  onSelect: (id: PlanId) => void;
  loading: boolean;
}) {
  return (
    <div
      className={`relative rounded-3xl border overflow-hidden transition-all duration-200 ${
        plan.popular
          ? "border-violet-500/50 shadow-2xl shadow-violet-500/20 scale-[1.02]"
          : "border-white/8 opacity-90"
      }`}
      style={{ background: plan.popular ? "rgba(22,10,45,0.98)" : "rgba(14,14,22,0.95)" }}
    >
      {/* Top gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${plan.gradient}`} />

      {/* Popular banner */}
      {plan.popular && (
        <div className="absolute top-0 right-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[11px] font-bold px-3 py-1 rounded-b-xl shadow-lg">
          ⭐ POPULAIRE
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${plan.accentColor}, ${plan.accentColor}88)` }}
          >
            {plan.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-[17px] font-black text-white">{plan.name}</h3>
            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${plan.badgeColor}`}>
              {plan.badge}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[36px] font-black text-white leading-none">{plan.priceFirst}€</span>
            <span className="text-[13px] text-white/40 font-medium">le 1er mois</span>
          </div>
          <p className="text-[12px] text-white/30 mt-1">
            puis <span className="text-white/50 font-semibold">{plan.priceNormal}€/mois</span>
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-2.5 mb-5">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                f.included ? "bg-[#6C63FF]/20 border border-[#6C63FF]/40" : "bg-white/5 border border-white/10"
              }`}>
                {f.included ? (
                  <Check className="w-2.5 h-2.5 text-[#a78bfa]" />
                ) : (
                  <span className="w-1.5 h-0.5 rounded-full bg-white/20 block" />
                )}
              </div>
              <span className={`text-[13px] leading-snug ${f.included ? "text-white/80" : "text-white/25 line-through"}`}>
                {f.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        {isCurrentPlan ? (
          <div className="w-full py-3.5 rounded-2xl border border-white/12 bg-white/5 text-center text-[14px] font-semibold text-white/40">
            ✓ Plan actuel
          </div>
        ) : (
          <button
            onClick={() => onSelect(plan.id as PlanId)}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-[15px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${plan.accentColor}, ${plan.accentColor}cc)`,
              boxShadow: `0 8px 24px ${plan.accentColor}30`,
            }}
          >
            {loading ? (
              <span className="w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>Choisir {plan.name} →</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PremiumPage() {
  const router = useRouter();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [success, setSuccess] = useState<PlanId | null>(null);

  useEffect(() => {
    getUsage().then(setUsage);
  }, []);

  const handleSelect = async (planId: PlanId) => {
    setLoadingPlan(planId);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update plan in user_usage
      await supabase.from("user_usage").upsert({
        user_id: user.id,
        plan: planId,
        ai_photos_used: 0,
        boost_used: 0,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      });

      // Record subscription
      await supabase.from("subscriptions").insert({
        user_id: user.id,
        plan: planId,
        ai_limit: planId === "starter" ? 20 : planId === "pro" ? 60 : null,
        boost_limit: planId === "starter" ? 5 : planId === "pro" ? 15 : null,
        status: "active",
      });

      setSuccess(planId);
      const updatedUsage = await getUsage();
      if (updatedUsage) setUsage(updatedUsage);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#080810] flex flex-col pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-2">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Hero */}
      <div className="px-5 pt-3 pb-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#C084FC] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#6C63FF]/30">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-[28px] font-black text-white leading-tight">
          Vendez plus,<br />gagnez plus 🚀
        </h1>
        <p className="text-[14px] text-white/40 mt-2.5 leading-relaxed">
          Débloquez les outils IA pour vendre<br />plus vite et gagner plus.
        </p>
      </div>

      {/* Current plan banner */}
      {usage && (
        <div className="mx-4 mb-5 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[12px] text-white/40">Plan actuel</p>
            <p className="text-[15px] font-bold text-white capitalize mt-0.5">
              {usage.plan === "free" ? "🆓 Gratuit" :
               usage.plan === "starter" ? "🚀 Starter" :
               usage.plan === "pro" ? "⚡ Vendeur Pro" : "👑 Premium"}
            </p>
          </div>
          {usage.limit !== null && (
            <div className="text-right">
              <p className="text-[12px] text-white/40">IA photos</p>
              <p className="text-[14px] font-bold text-[#a78bfa]">
                {usage.remaining} / {usage.limit}
              </p>
            </div>
          )}
          {usage.limit === null && (
            <span className="text-[12px] font-bold text-amber-400 bg-amber-400/15 border border-amber-400/25 px-2.5 py-1 rounded-full">
              ♾️ Illimité
            </span>
          )}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mx-4 mb-4 rounded-2xl border border-green-500/25 bg-green-500/10 px-4 py-3 flex items-center gap-3 animate-fadeIn">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-green-300">Abonnement activé !</p>
            <p className="text-[11px] text-green-400/60 mt-0.5">Tes nouvelles fonctionnalités sont disponibles.</p>
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div className="px-4 flex flex-col gap-4">
        {PLANS.map((plan) => (
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
        <p className="text-[11px] text-white/20 leading-relaxed">
          Résiliation possible à tout moment · Sans engagement<br />
          Paiement sécurisé · Prix TTC
        </p>
      </div>
    </div>
  );
}
