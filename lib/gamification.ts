// ─── Gamification System ─────────────────────────────────────────────────────

export type BadgeId =
  | "first_sale" | "five_sales" | "twenty_sales" | "hundred_sales"
  | "first_listing" | "ten_listings" | "photo_pro" | "ai_user"
  | "fast_seller" | "top_rated" | "verified" | "premium_member";

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  emoji: string;
  color: string;
  requirement: number; // threshold value
  field: "sales_count" | "products_count" | "ai_photos_used" | "rating" | "special";
}

export const BADGES: Badge[] = [
  { id: "first_listing",  name: "1ère Annonce",    emoji: "🛍️", color: "#8B5CF6", description: "Tu as publié ta 1ère annonce",       requirement: 1,   field: "products_count" },
  { id: "ten_listings",   name: "Vendeur actif",   emoji: "🔥", color: "#F59E0B", description: "10 annonces publiées",                requirement: 10,  field: "products_count" },
  { id: "first_sale",     name: "1ère Vente",      emoji: "💰", color: "#10B981", description: "Tu as réalisé ta 1ère vente",         requirement: 1,   field: "sales_count" },
  { id: "five_sales",     name: "Vendeur confirmé",emoji: "⭐", color: "#3B82F6", description: "5 ventes réalisées",                  requirement: 5,   field: "sales_count" },
  { id: "twenty_sales",   name: "Pro Seller",      emoji: "🏆", color: "#8B5CF6", description: "20 ventes — tu assures !",            requirement: 20,  field: "sales_count" },
  { id: "hundred_sales",  name: "Légende",         emoji: "👑", color: "#F97316", description: "100 ventes — status légendaire",      requirement: 100, field: "sales_count" },
  { id: "ai_user",        name: "IA Master",       emoji: "🤖", color: "#06B6D4", description: "Tu as utilisé l'IA 10 fois",          requirement: 10,  field: "ai_photos_used" },
  { id: "photo_pro",      name: "Photo Pro",       emoji: "📸", color: "#8B5CF6", description: "50 photos améliorées avec l'IA",      requirement: 50,  field: "ai_photos_used" },
  { id: "top_rated",      name: "Top Rated",       emoji: "⭐", color: "#F59E0B", description: "Note moyenne au-dessus de 4.5",       requirement: 45,  field: "rating" },
  { id: "verified",       name: "Vérifié",         emoji: "✅", color: "#10B981", description: "Compte vérifié",                     requirement: 1,   field: "special" },
  { id: "premium_member", name: "Premium",         emoji: "💎", color: "#A855F7", description: "Abonnement premium actif",           requirement: 1,   field: "special" },
];

export interface Challenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  reward: number; // crédits IA
  target: number;
  type: "daily" | "weekly" | "monthly";
  action: "sell" | "list" | "enhance" | "message" | "login";
}

export const CHALLENGES: Challenge[] = [
  { id: "daily_login",    title: "Connexion du jour",    emoji: "☀️", description: "Connecte-toi aujourd'hui",              reward: 1,  target: 1,  type: "daily",   action: "login" },
  { id: "daily_list",     title: "Publie une annonce",   emoji: "📦", description: "Publie 1 article aujourd'hui",          reward: 2,  target: 1,  type: "daily",   action: "list" },
  { id: "weekly_enhance", title: "Photo IA × 5",        emoji: "🤖", description: "Améliore 5 photos cette semaine",       reward: 5,  target: 5,  type: "weekly",  action: "enhance" },
  { id: "weekly_sell",    title: "Vends 2 articles",     emoji: "💸", description: "Réalise 2 ventes cette semaine",        reward: 10, target: 2,  type: "weekly",  action: "sell" },
  { id: "monthly_list",   title: "10 annonces ce mois",  emoji: "🚀", description: "Publie 10 articles ce mois-ci",         reward: 20, target: 10, type: "monthly", action: "list" },
  { id: "monthly_sell",   title: "5 ventes ce mois",     emoji: "🏆", description: "Réalise 5 ventes ce mois-ci",           reward: 30, target: 5,  type: "monthly", action: "sell" },
];

// Compute which badges a user has earned
export function getEarnedBadges(stats: {
  sales_count: number;
  products_count: number;
  ai_photos_used: number;
  rating: number;
  is_premium?: boolean;
  is_verified?: boolean;
}): BadgeId[] {
  return BADGES.filter((b) => {
    if (b.field === "special") {
      if (b.id === "verified")       return stats.is_verified;
      if (b.id === "premium_member") return stats.is_premium;
      return false;
    }
    const value =
      b.field === "rating"
        ? Math.round(stats.rating * 10)
        : stats[b.field as keyof typeof stats] as number;
    return value >= b.requirement;
  }).map((b) => b.id);
}

export function getBadge(id: BadgeId) {
  return BADGES.find((b) => b.id === id)!;
}