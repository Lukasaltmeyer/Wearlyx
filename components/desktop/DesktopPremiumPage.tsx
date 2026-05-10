"use client";

import { useState, useEffect } from "react";
import { Check, X, Sparkles, Zap, Crown, Star, Shield, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getUsage, type UsageData } from "@/lib/usage";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    emoji: "🚀",
    badge: "-20% le 1er mois",
    priceNormal: 10,
    priceFirst: 8,
    icon: Zap,
    gradient: "from-blue-600 to-blue-800",
    accentColor: "#3B82F6",
    popular: false,
    tagline: "Pour commencer à vendre",
    features: [
      "20 améliorations photo IA / mois",
      "5 boosts articles / mois",
      "Badge Vendeur actif",
      "Stats de base (vues, likes)",
      "Prix conseillé par IA",
    ],
    notIncluded: ["Suppression fond IA", "Boutique personnalisée", "Analytics avancés"],
  },
  {
    id: "pro",
    name: "Vendeur Pro",
    emoji: "⭐",
    badge: "Populaire · -28% le 1er mois",
    priceNormal: 25,
    priceFirst: 18,
    icon: Star,
    gradient: "from-[#8B5CF6] to-[#6D28D9]",
    accentColor: "#8B5CF6",
    popular: true,
    tagline: "Pour les vendeurs sérieux",
    features: [
      "60 améliorations photo IA / mois",
      "15 boosts articles / mois",
      "Suppression fond IA",
      "Stats avancées (conversion, perf.)",
      "Relance automatique acheteurs",
      "Suggestions prix pour vendre vite",
    ],
    notIncluded: ["Boutique personnalisée"],
  },
  {
    id: "premium",
    name: "Premium",
    emoji: "👑",
    badge: "-50% le 1er mois",
    priceNormal: 50,
    priceFirst: 25,
    icon: Crown,
    gradient: "from-amber-500 to-orange-700",
    accentColor: "#F59E0B",
    popular: false,
    tagline: "Pour les pros de la revente",
    features: [
      "IA & boosts illimités",
      "Boutique vendeur personnalisée",
      "Commission réduite",
      "Articles en page d'accueil",
      "Analytics professionnels",
      "Relance automatique acheteurs",
      "Support prioritaire 24/7",
    ],
    notIncluded: [],
  },
] as const;

type PlanId = "starter" | "pro" | "premium";

const COMPARISON_ROWS = [
  { label: "Améliorations photo IA", starter: "20 / mois", pro: "60 / mois", premium: "Illimitées" },
  { label: "Boosts articles", starter: "5 / mois", pro: "15 / mois", premium: "Illimités" },
  { label: "Prix conseillé IA", starter: true, pro: true, premium: true },
  { label: "Suppression fond IA", starter: false, pro: true, premium: true },
  { label: "Statistiques avancées", starter: false, pro: true, premium: true },
  { label: "Relance acheteurs", starter: false, pro: true, premium: true },
  { label: "Boutique personnalisée", starter: false, pro: false, premium: true },
  { label: "Commission réduite", starter: false, pro: false, premium: true },
  { label: "Support prioritaire", starter: false, pro: false, premium: true },
];

const TESTIMONIALS = [
  { name: "Sophie M.", handle: "@sophie_mode", plan: "pro", text: "J'ai triplé mes ventes le premier mois. L'IA génère des descriptions bien meilleures que les miennes.", avatar: "S" },
  { name: "Kilian V.", handle: "@kilian.vintage", plan: "premium", text: "La boutique personnalisée et les analytics m'ont permis de passer à 3K€/mois de revenu.", avatar: "K" },
  { name: "Léa T.", handle: "@lea.style", plan: "starter", text: "Le prix conseillé par l'IA est bluffant. Mes articles se vendent 2× plus vite qu'avant.", avatar: "L" },
];

const FAQ = [
  { q: "Puis-je annuler à tout moment ?", a: "Oui, sans engagement. Tu peux annuler depuis ton espace membre à tout moment." },
  { q: "Comment fonctionne la réduction du 1er mois ?", a: "La réduction est automatiquement appliquée lors de ta première facturation. Ensuite le tarif normal s'applique." },
  { q: "Les crédits IA non utilisés sont-ils reportés ?", a: "Non, les crédits se renouvellent chaque mois. Ils ne sont pas cumulables." },
  { q: "Qu'est-ce que la boutique personnalisée ?", a: "Une page dédiée à ton profil de vendeur avec URL personnalisée, bio, et mise en avant de tes articles." },
];

export function DesktopPremiumPage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [success, setSuccess] = useState<PlanId | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => { getUsage().then(setUsage); }, []);

  const handleSelect = async (planId: PlanId) => {
    setLoadingPlan(planId);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("user_usage").upsert({
        user_id: user.id, plan: planId,
        ai_photos_used: 0, boost_used: 0,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      });
      await supabase.from("subscriptions").insert({
        user_id: user.id, plan: planId,
        ai_limit: planId === "starter" ? 20 : planId === "pro" ? 60 : null,
        boost_limit: planId === "starter" ? 5 : planId === "pro" ? 15 : null,
        status: "active",
      });
      setSuccess(planId);
      const u = await getUsage(); if (u) setUsage(u);
    } catch (e) { console.error(e); }
    finally { setLoadingPlan(null); }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col pb-16 relative" style={{ background: "#07070A" }}>
      <div className="fixed pointer-events-none" style={{ top: -200, left: "25%", width: 900, height: 900, background: "radial-gradient(circle, rgba(88,28,220,0.07) 0%, transparent 60%)", filter: "blur(120px)", zIndex: 0 }} />
      <div className="fixed pointer-events-none" style={{ bottom: -100, right: "10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(245,158,11,0.03) 0%, transparent 65%)", filter: "blur(130px)", zIndex: 0 }} />

      {/* ── HERO ── */}
      <div className="relative overflow-hidden px-10 py-16 text-center flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Bg glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(88,28,220,0.12) 0%, transparent 65%)", filter: "blur(40px)" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(139,92,246,0.10)", border: "1px solid rgba(139,92,246,0.20)" }}>
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span className="text-[11px] font-semibold text-[#C4B5FD] tracking-[0.14em] uppercase">Wearlyx Premium</span>
          </div>
          <h1 className="text-[48px] font-black text-white tracking-tight leading-tight mb-4">
            Vendez plus,<br />
            <span style={{ background: "linear-gradient(95deg,#E0D4FF,#A78BFA,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              gagnez plus.
            </span>
          </h1>
          <p className="text-[16px] max-w-md mx-auto mb-8" style={{ color: "rgba(255,255,255,.44)" }}>
            Des outils IA puissants pour vendre plus vite et transformer ta passion en revenu régulier.
          </p>
          {usage && (
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-[13px]" style={{ color: "rgba(255,255,255,.40)" }}>Plan actuel :</span>
              <span className="text-[13px] font-black text-white">
                {usage.plan === "free" ? "🆓 Gratuit" : usage.plan === "starter" ? "🚀 Starter" : usage.plan === "pro" ? "⭐ Vendeur Pro" : "👑 Premium"}
              </span>
              {usage.limit !== null && (
                <span className="text-[12px] font-semibold text-[#A78BFA]">{usage.remaining}/{usage.limit} IA restantes</span>
              )}
              {usage.limit === null && (
                <span className="text-[12px] font-semibold text-amber-400">♾️ Illimité</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── PLAN CARDS — 3 colonnes ── */}
      <div className="px-10 py-12 flex-shrink-0">
        {success && (
          <div className="mb-6 mx-auto max-w-xl flex items-center gap-3 px-5 py-4 rounded-2xl"
            style={{ background: "rgba(139,92,246,0.10)", border: "1px solid rgba(139,92,246,0.25)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(139,92,246,0.20)" }}>
              <Check className="w-4 h-4 text-violet-400" />
            </div>
            <p className="text-[13.5px] font-semibold text-violet-300">Abonnement activé ! Tes nouvelles fonctionnalités sont disponibles.</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6 items-start">
          {PLANS.map(plan => {
            const Icon = plan.icon;
            const isCurrent = usage?.plan === plan.id;
            return (
              <div key={plan.id}
                className="relative rounded-3xl overflow-hidden transition-all duration-300"
                style={{
                  background: plan.popular ? "rgba(12,6,28,0.98)" : "rgba(12,12,20,0.95)",
                  border: plan.popular ? "1px solid rgba(139,92,246,0.40)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: plan.popular ? "0 0 60px rgba(139,92,246,0.12), 0 0 0 1px rgba(139,92,246,0.15)" : undefined,
                  transform: plan.popular ? "translateY(-8px)" : undefined,
                }}>

                {/* Top gradient bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${plan.gradient}`} />

                {plan.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black text-white"
                    style={{ background: "linear-gradient(135deg,#8B5CF6,#7C3AED)" }}>
                    ⭐ POPULAIRE
                  </div>
                )}

                <div className="p-7">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg,${plan.accentColor},${plan.accentColor}88)` }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[18px] font-black text-white">{plan.emoji} {plan.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,.35)" }}>{plan.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[40px] font-black text-white leading-none">{plan.priceFirst}€</span>
                      <span className="text-[13px]" style={{ color: "rgba(255,255,255,.35)" }}>1er mois</span>
                    </div>
                    <p className="text-[12px] mt-1.5" style={{ color: "rgba(255,255,255,.28)" }}>
                      puis <span className="font-semibold" style={{ color: "rgba(255,255,255,.50)" }}>{plan.priceNormal}€/mois</span>
                    </p>
                    <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: `${plan.accentColor}18`, color: plan.accentColor, border: `1px solid ${plan.accentColor}28` }}>
                      🎉 {plan.badge}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-col gap-2.5 mb-6">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-start gap-2.5">
                        <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ width:18, height:18, background: `${plan.accentColor}20`, border: `1px solid ${plan.accentColor}40` }}>
                          <Check className="w-2.5 h-2.5" style={{ color: plan.accentColor }} />
                        </div>
                        <span className="text-[12.5px] leading-snug" style={{ color: "rgba(255,255,255,.78)" }}>{f}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map(f => (
                      <div key={f} className="flex items-start gap-2.5 opacity-35">
                        <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ width:18, height:18, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}>
                          <X className="w-2.5 h-2.5 text-white/40" />
                        </div>
                        <span className="text-[12.5px] leading-snug line-through" style={{ color: "rgba(255,255,255,.30)" }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  {isCurrent ? (
                    <div className="w-full py-3.5 rounded-2xl text-center text-[13.5px] font-semibold"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,.38)" }}>
                      ✓ Plan actuel
                    </div>
                  ) : (
                    <button onClick={() => handleSelect(plan.id as PlanId)} disabled={loadingPlan === plan.id}
                      className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{
                        background: `linear-gradient(135deg,${plan.accentColor},${plan.accentColor}bb)`,
                        boxShadow: `0 8px 24px ${plan.accentColor}28`,
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px ${plan.accentColor}45`;
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${plan.accentColor}28`;
                        (e.currentTarget as HTMLElement).style.transform = "";
                      }}>
                      {loadingPlan === plan.id
                        ? <span className="w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        : <>Choisir {plan.name} <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── COMPARISON TABLE ── */}
      <div className="px-10 pb-12 flex-shrink-0">
        <h2 className="text-[22px] font-black text-white mb-6">Comparaison détaillée</h2>
        <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Header */}
          <div className="grid grid-cols-4 px-6 py-4"
            style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div />
            {["Starter", "Vendeur Pro", "Premium"].map((n, i) => (
              <div key={n} className="text-center">
                <p className="text-[13px] font-black text-white">{n}</p>
                <p className="text-[11px] mt-0.5" style={{ color: ["#3B82F6","#8B5CF6","#F59E0B"][i] }}>
                  {[8, 18, 25][i]}€ / 1er mois
                </p>
              </div>
            ))}
          </div>
          {COMPARISON_ROWS.map((row, i) => (
            <div key={row.label} className="grid grid-cols-4 px-6 py-3.5 transition-all"
              style={{ borderBottom: i < COMPARISON_ROWS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; }}>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,.55)" }}>{row.label}</p>
              {([row.starter, row.pro, row.premium] as (boolean | string)[]).map((val, j) => (
                <div key={j} className="flex items-center justify-center">
                  {typeof val === "boolean"
                    ? val
                      ? <Check className="w-4 h-4" style={{ color: ["#3B82F6","#8B5CF6","#F59E0B"][j] }} />
                      : <X className="w-4 h-4 text-white/15" />
                    : <span className="text-[12.5px] font-semibold" style={{ color: ["#60A5FA","#C4B5FD","#FCD34D"][j] }}>{val}</span>
                  }
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS + FAQ — 2 col ── */}
      <div className="grid grid-cols-2 gap-8 px-10 pb-12">

        {/* Testimonials */}
        <div>
          <h2 className="text-[22px] font-black text-white mb-5">Ce qu'ils en disent</h2>
          <div className="flex flex-col gap-4">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="p-5 rounded-2xl transition-all"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.18)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-[13px]"
                    style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-white">{t.name}</p>
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,.30)" }}>{t.handle} · Plan {t.plan}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,.55)" }}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-[22px] font-black text-white mb-5">Questions fréquentes</h2>
          <div className="flex flex-col gap-2">
            {FAQ.map((item, i) => (
              <div key={i} className="rounded-2xl overflow-hidden transition-all"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-all"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; }}>
                  <p className="text-[13.5px] font-semibold" style={{ color: "rgba(255,255,255,.75)" }}>{item.q}</p>
                  <span className="text-[18px] leading-none ml-4 flex-shrink-0 transition-transform"
                    style={{ color: "rgba(255,255,255,.28)", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,.42)" }}>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Trust footer */}
          <div className="mt-6 flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.12)" }}>
            <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-[12px]" style={{ color: "rgba(52,211,153,.55)" }}>
              Résiliation possible à tout moment · Sans engagement · Paiement sécurisé · Prix TTC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
