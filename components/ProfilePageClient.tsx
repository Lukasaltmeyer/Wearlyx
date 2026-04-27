"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Settings, Star, ShoppingBag, Heart, Zap, Trophy, ChevronRight, MoreHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { WalletCard } from "@/components/WalletCard";
import { BadgeSystem } from "@/components/BadgeSystem";
import { ChallengeList } from "@/components/ChallengeList";
import { getEarnedBadges, type BadgeId } from "@/lib/gamification";
import type { Profile, Product } from "@/types/database";

interface UsageRow {
  plan: string;
  ai_photos_used: number;
  boost_used: number;
  reset_date: string;
}

interface Props {
  profile: Profile;
  products: Product[];
  savedProducts: Product[];
  usageRow: UsageRow | null;
  currentUserId: string;
}

const PLAN_LIMITS: Record<string, number | null> = {
  free: 5, starter: 20, pro: 60, premium: null,
};

export function ProfilePageClient({ profile, products, savedProducts, usageRow, currentUserId }: Props) {
  const [tab, setTab] = useState<"items" | "saved" | "badges" | "challenges">("items");
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  // Build usage data for WalletCard
  const plan = (usageRow?.plan ?? "free") as string;
  const limit = PLAN_LIMITS[plan] ?? 5;
  const used = usageRow?.ai_photos_used ?? 0;
  const remaining = limit === null ? null : Math.max(0, (limit as number) - used);
  const pct = limit === null ? 0 : Math.round((used / (limit as number)) * 100);

  const usageData = {
    plan: plan as any,
    ai_photos_used: used,
    boost_used: usageRow?.boost_used ?? 0,
    reset_date: usageRow?.reset_date ?? "",
    limit: limit as number | null,
    remaining: remaining as number,
    pct,
  };

  const earnedIds: BadgeId[] = getEarnedBadges({
    sales_count: profile?.sales_count ?? 0,
    products_count: products.length,
    ai_photos_used: used,
    rating: profile?.rating ?? 0,
    is_premium: plan === "premium",
  });

  const tabs = [
    { id: "items",      label: "Articles",   count: products.length },
    { id: "saved",      label: "Sauvegardés", count: savedProducts.length },
    { id: "badges",     label: "Badges",      count: earnedIds.length },
    { id: "challenges", label: "Défis",       count: null },
  ] as const;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="relative px-4 pt-5 pb-4">
        <div className="flex items-start justify-between">
          {/* Avatar + info */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] flex-shrink-0">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="avatar" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white font-black text-2xl">
                    {(profile?.full_name || profile?.username || "?")[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-[18px] font-black text-white leading-tight">
                {profile?.full_name || profile?.username || "Mon profil"}
              </h1>
              {profile?.username && (
                <p className="text-[13px] text-white/40">@{profile.username}</p>
              )}
              {/* Rating */}
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-[12px] font-bold text-white">{(profile?.rating ?? 0).toFixed(1)}</span>
                <span className="text-[11px] text-white/30">· {profile?.sales_count ?? 0} ventes</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link href="/profile/menu"
              className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </Link>
            <Link href="/profile/settings"
              className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <p className="mt-3 text-[13px] text-white/50 leading-relaxed">{profile.bio}</p>
        )}

        {/* Stats row */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: "Articles", value: products.length, icon: ShoppingBag, color: "#8B5CF6" },
            { label: "Ventes",   value: profile?.sales_count ?? 0, icon: Trophy, color: "#10B981" },
            { label: "Badges",   value: earnedIds.length, icon: Star, color: "#F59E0B" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-white/6 bg-white/3 px-3 py-2.5 text-center">
              <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
              <p className="text-[16px] font-black text-white">{value}</p>
              <p className="text-[10px] text-white/35 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet */}
      <div className="px-4 mb-3">
        <WalletCard usage={usageData} balance={0} />
      </div>

      {/* Quick action — mes annonces */}
      <div className="px-4 mb-4">
        <Link href="/listings"
          className="flex items-center justify-between px-4 py-3 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white">Mes annonces</p>
              <p className="text-[11px] text-white/35">{products.length} article{products.length !== 1 ? "s" : ""} publiés</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/25" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-3">
        <div className="flex gap-1 p-1 rounded-2xl bg-white/4 border border-white/6">
          {tabs.map(({ id, label, count }) => (
            <button key={id} onClick={() => setTab(id as any)}
              className={`flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                tab === id
                  ? "bg-[#8B5CF6] text-white shadow-sm"
                  : "text-white/40 hover:text-white/60"
              }`}>
              {label}{count !== null ? ` (${count})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 pb-4">
        {tab === "items" && (
          products.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-[14px] font-semibold text-white/30">Aucun article publié</p>
              <Link href="/sell/ai"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-2xl text-[13px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #A855F7)" }}>
                <Zap className="w-3.5 h-3.5" /> Vendre avec l'IA
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} currentUserId={currentUserId} />
              ))}
            </div>
          )
        )}

        {tab === "saved" && (
          savedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-[14px] font-semibold text-white/30">Aucun article sauvegardé</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {savedProducts.map((p) => (
                <ProductCard key={p.id} product={p} currentUserId={currentUserId} />
              ))}
            </div>
          )
        )}

        {tab === "badges" && <BadgeSystem earnedIds={earnedIds} showAll />}
        {tab === "challenges" && <ChallengeList />}
      </div>
    </div>
  );
}