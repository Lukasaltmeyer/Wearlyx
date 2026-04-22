"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Zap } from "lucide-react";

interface Props {
  salesCount: number;
  productsCount: number;
  aiPhotosUsed: number;
  rating: number;
  isPremium: boolean;
}

const LEVELS = [
  { name: "1ère étoile",   reward: "Badge Bronze 🥉 sur ton profil",                      credits: 0,      icon: "🥉" },
  { name: "Débutant+",    reward: 'Boost 12h offert 🚀 + Titre "Membre actif"',           credits: 1500,   icon: "⚡" },
  { name: "Curieux",      reward: "Boost 12h offert + Badge Argent 🥈",                    credits: 4000,   icon: "🔍" },
  { name: "Actif",        reward: 'Boost 12h offert + Titre "Membre confirmé"',            credits: 10000,  icon: "🎯" },
  { name: "Confirmé",     reward: "Abonnement Starter (10€) — 2 jours offerts 🎟",         credits: 22000,  icon: "✅" },
  { name: "Régulier",     reward: "Badge Or 🥇 + Boost 18h offert",                        credits: 38000,  icon: "🔄" },
  { name: "Expérimenté",  reward: 'Boost 18h offert + Titre "Vendeur de confiance"',       credits: 58000,  icon: "🧠" },
  { name: "Expert",       reward: "Boost 18h offert + Badge Diamant 💎",                   credits: 82000,  icon: "💡" },
  { name: "Elite",        reward: "Boost 18h offert + Badge Platine 🏆",                   credits: 110000, icon: "🏅" },
  { name: "Master",       reward: "Cadre Légendaire animé exclusif",                       credits: 140000, icon: "🏆" },
  { name: "Légende",      reward: "Abonnement Premium (50€) — 50% de réduction 1 mois 💎", credits: 182000, icon: "👑" },
  { name: "Wearly Ultime",reward: "Statut Immortel — profil mis en avant ✨ + Boost 24h",  credits: 250000, icon: "💫" },
];

const BADGE_TIERS = [
  {
    name: "DÉBUTANT", creditsPerBadge: 500,
    badges: [
      { name: "Annonceur",     desc: "Publier 1 annonce",   field: "listings", target: 1 },
      { name: "Coup de cœur", desc: "Ajouter 1 favori",    field: "favorites", target: 1 },
      { name: "Premier contact",desc:"Envoyer 1 message",  field: "messages",  target: 1 },
      { name: "Première vente",desc: "Vendre 1 article",   field: "sales",     target: 1 },
    ],
  },
  {
    name: "APPRENTI", creditsPerBadge: 1000,
    badges: [
      { name: "Petit catalogue", desc: "Publier 3 annonces",  field: "listings",  target: 3 },
      { name: "Explorateur",     desc: "Ajouter 5 favoris",   field: "favorites", target: 5 },
      { name: "Bavard",          desc: "Envoyer 3 messages",  field: "messages",  target: 3 },
      { name: "Vendeur débutant",desc: "Vendre 2 articles",   field: "sales",     target: 2 },
    ],
  },
  {
    name: "ACTIF", creditsPerBadge: 1750,
    badges: [
      { name: "Boutique naissante", desc: "Publier 6 annonces",  field: "listings",  target: 6 },
      { name: "Collectionneur",     desc: "Ajouter 10 favoris",  field: "favorites", target: 10 },
      { name: "Communicant",        desc: "Envoyer 8 messages",  field: "messages",  target: 8 },
      { name: "Vendeur Actif",      desc: "Vendre 4 articles",   field: "sales",     target: 4 },
    ],
  },
  {
    name: "CONFIRMÉ", creditsPerBadge: 2750,
    badges: [
      { name: "Bon catalogue",    desc: "Publier 10 annonces", field: "listings",  target: 10 },
      { name: "Grand explorateur",desc: "Ajouter 20 favoris",  field: "favorites", target: 20 },
      { name: "Bien noté",        desc: "Recevoir 3 avis",     field: "reviews",   target: 3 },
      { name: "Vendeur confirmé", desc: "Vendre 7 articles",   field: "sales",     target: 7 },
    ],
  },
  {
    name: "EXPÉRIMENTÉ", creditsPerBadge: 4250,
    badges: [
      { name: "Vrai catalogue", desc: "Publier 15 annonces", field: "listings",  target: 15 },
      { name: "Mode addict",    desc: "Ajouter 35 favoris",  field: "favorites", target: 35 },
      { name: "Star des avis",  desc: "Recevoir 7 avis",     field: "reviews",   target: 7 },
      { name: "Vendeur expert", desc: "Vendre 12 articles",  field: "sales",     target: 12 },
    ],
  },
  {
    name: "PRO", creditsPerBadge: 6500,
    badges: [
      { name: "Mega boutique",  desc: "Publier 25 annonces", field: "listings",  target: 25 },
      { name: "Mode obsession", desc: "Ajouter 60 favoris",  field: "favorites", target: 60 },
      { name: "Vendeur Stars",  desc: "Recevoir 15 avis",    field: "reviews",   target: 15 },
      { name: "Pro de la vente",desc: "Vendre 20 articles",  field: "sales",     target: 20 },
    ],
  },
  {
    name: "ELITE", creditsPerBadge: 10000,
    badges: [
      { name: "Dressing infini",  desc: "Publier 40 annonces",   field: "listings",  target: 40 },
      { name: "Curateur mode",    desc: "Ajouter 100 favoris",   field: "favorites", target: 100 },
      { name: "Légende des avis", desc: "Recevoir 25 avis",      field: "reviews",   target: 25 },
      { name: "Wearly Star",      desc: "Vendre 35 articles",    field: "sales",     target: 35 },
    ],
  },
  {
    name: "LÉGENDE", creditsPerBadge: 15000,
    badges: [
      { name: "Boutique légendaire", desc: "Publier 60 annonces",   field: "listings",  target: 60 },
      { name: "Encyclopédie mode",   desc: "Ajouter 150 favoris",   field: "favorites", target: 150 },
      { name: "Icône Wearly",        desc: "Recevoir 50 avis",      field: "reviews",   target: 50 },
      { name: "Top vendeur absolu",  desc: "Vendre 60 articles",    field: "sales",     target: 60 },
    ],
  },
  {
    name: "MASTER", creditsPerBadge: 22500,
    badges: [
      { name: "Empire de la mode", desc: "Publier 80 annonces",  field: "listings",  target: 80 },
      { name: "Mémoire de mode",   desc: "Ajouter 200 favoris",  field: "favorites", target: 200 },
      { name: "Dieu des avis",     desc: "Recevoir 75 avis",     field: "reviews",   target: 75 },
      { name: "Machine à vendre",  desc: "Vendre 80 articles",   field: "sales",     target: 80 },
    ],
  },
  {
    name: "CHAMPION", creditsPerBadge: 33000,
    badges: [
      { name: "Catalogueur fou",    desc: "Publier 100 annonces",  field: "listings",  target: 100 },
      { name: "Obsessionnel mode",  desc: "Ajouter 300 favoris",   field: "favorites", target: 300 },
      { name: "Centurion des avis", desc: "Recevoir 100 avis",     field: "reviews",   target: 100 },
      { name: "Centurion des ventes",desc:"Vendre 100 articles",   field: "sales",     target: 100 },
    ],
  },
  {
    name: "TITAN", creditsPerBadge: 48500,
    badges: [
      { name: "Titan du catalogue", desc: "Publier 150 annonces",  field: "listings",  target: 150 },
      { name: "Titan des favoris",  desc: "Ajouter 500 favoris",   field: "favorites", target: 500 },
      { name: "Titan des avis",     desc: "Recevoir 150 avis",     field: "reviews",   target: 150 },
      { name: "Titan des ventes",   desc: "Vendre 150 articles",   field: "sales",     target: 150 },
    ],
  },
  {
    name: "IMMORTEL", creditsPerBadge: 54000,
    badges: [
      { name: "Immortel du style",   desc: "Publier 200 annonces",  field: "listings",  target: 200 },
      { name: "Immortel des favoris",desc: "Ajouter 750 favoris",   field: "favorites", target: 750 },
      { name: "Immortel des avis",   desc: "Recevoir 200 avis",     field: "reviews",   target: 200 },
      { name: "Immortel des ventes", desc: "Vendre 200 articles",   field: "sales",     target: 200 },
    ],
  },
];

export function CreditsClient({ salesCount, productsCount, aiPhotosUsed, rating, isPremium }: Props) {
  const router = useRouter();

  // Crédits calculés (500 de base comme dans le screenshot)
  const credits = 500 + salesCount * 100 + productsCount * 10;

  // Niveau actuel
  const currentLevelIdx = LEVELS.reduce((best, lvl, i) => (credits >= lvl.credits ? i : best), 0);
  const currentLevel = LEVELS[currentLevelIdx];
  const nextLevel = LEVELS[currentLevelIdx + 1] ?? null;
  const progressPct = nextLevel
    ? Math.min(100, Math.round(((credits - currentLevel.credits) / (nextLevel.credits - currentLevel.credits)) * 100))
    : 100;
  const remaining = nextLevel ? nextLevel.credits - credits : 0;

  // Progression par champ (simulée à partir des props)
  const progress: Record<string, number> = {
    listings:  productsCount,
    favorites: 0,
    messages:  0,
    reviews:   0,
    sales:     salesCount,
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-5">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-bold text-white">Crédits & Badges</h1>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#4CAF50]/30 bg-[#4CAF50]/10">
          <Zap className="w-3 h-3 text-[#4CAF50]" />
          <span className="text-[12px] font-bold text-[#4CAF50]">{credits.toLocaleString()} crédits</span>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Hero card */}
        <div className="p-4 rounded-2xl border border-[#4CAF50]/20 bg-[#4CAF50]/8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-[#4CAF50] fill-[#4CAF50]" />
            </div>
            <div>
              <p className="text-[28px] font-black text-white leading-none">{credits.toLocaleString()}</p>
              <p className="text-[13px] text-white/50">crédits gagnés</p>
            </div>
          </div>
          <p className="text-[12px] text-white/30">{credits.toLocaleString()} / 799 000 crédits max</p>
        </div>

        {/* Prochain palier */}
        {nextLevel && (
          <div>
            <p className="text-[11px] font-black text-white/30 uppercase tracking-wider mb-2">Prochain palier</p>
            <div className="p-4 rounded-2xl border border-white/8 bg-white/3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[20px]">{nextLevel.icon}</span>
                  <div>
                    <p className="text-[15px] font-black text-white">{nextLevel.name}</p>
                    <p className="text-[12px] text-white/40">{nextLevel.reward}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-black text-white">{nextLevel.credits.toLocaleString()} crédits</p>
                  <p className="text-[11px] text-white/35">encore {remaining.toLocaleString()} à gagner</p>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-[#4CAF50] transition-all" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Paliers de récompenses */}
        <div>
          <p className="text-[11px] font-black text-white/30 uppercase tracking-wider mb-2">Paliers de récompenses</p>
          <div className="flex flex-col gap-1">
            {LEVELS.map((lvl, i) => {
              const attained = credits >= lvl.credits;
              const isCurrent = i === currentLevelIdx;
              return (
                <div
                  key={lvl.name}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    isCurrent ? "border-[#4CAF50]/30 bg-[#4CAF50]/8" : "border-white/5 bg-transparent"
                  }`}
                >
                  <span className={`text-[18px] ${attained ? "" : "grayscale opacity-40"}`}>{lvl.icon}</span>
                  <div className="flex-1">
                    <p className={`text-[13px] font-bold ${attained ? "text-white" : "text-white/35"}`}>{lvl.name}</p>
                    <p className="text-[11px] text-white/25 line-clamp-1">{lvl.reward}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {attained ? (
                      <span className="text-[11px] font-bold text-[#4CAF50]">✓ Atteint</span>
                    ) : (
                      <span className="text-[12px] font-semibold text-white/30">{lvl.credits.toLocaleString()} cr.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges à compléter */}
        <div>
          <p className="text-[11px] font-black text-white/30 uppercase tracking-wider mb-3">Badges à compléter</p>
          <div className="flex flex-col gap-5">
            {BADGE_TIERS.map((tier) => {
              const earned = tier.badges.filter((b) => (progress[b.field] ?? 0) >= b.target).length;
              return (
                <div key={tier.name}>
                  {/* Tier header */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-black text-white/40 uppercase tracking-wider">{tier.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#4CAF50]">
                        + {tier.creditsPerBadge.toLocaleString()} cr./badge
                      </span>
                      <span className="text-[11px] text-white/25">{earned}/{tier.badges.length}</span>
                    </div>
                  </div>
                  {/* Badge cards grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {tier.badges.map((badge) => {
                      const val = progress[badge.field] ?? 0;
                      const done = val >= badge.target;
                      const pct = Math.min(100, Math.round((val / badge.target) * 100));
                      return (
                        <div
                          key={badge.name}
                          className={`p-3 rounded-2xl border transition-all ${
                            done
                              ? "border-[#4CAF50]/25 bg-[#4CAF50]/8"
                              : "border-white/6 bg-white/2"
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              done ? "bg-[#4CAF50]/20" : "bg-white/8"
                            }`}>
                              <span className="text-[14px]">
                                {badge.field === "listings" ? "🗂" :
                                 badge.field === "favorites" ? "❤️" :
                                 badge.field === "messages" ? "💬" :
                                 badge.field === "reviews" ? "⭐" : "🛍"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[12px] font-bold leading-tight ${done ? "text-white" : "text-white/70"}`}>
                                {badge.name}
                              </p>
                              <p className="text-[10px] text-white/30 leading-tight mt-0.5">{badge.desc}</p>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-1">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                background: done ? "#4CAF50" : pct > 0 ? "#4CAF50" : "transparent",
                              }}
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            {done ? (
                              <>
                                <span className="text-[10px] font-bold text-[#4CAF50]">✓ Débloqué</span>
                                <span className="text-[10px] font-bold text-[#4CAF50]">+{tier.creditsPerBadge} cr.</span>
                              </>
                            ) : (
                              <span className="text-[10px] text-white/25">{val} / {badge.target}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
