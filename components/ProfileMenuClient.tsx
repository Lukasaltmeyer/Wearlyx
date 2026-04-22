"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Heart, Users, Wallet, ShoppingBag, Zap, Star,
  Shield, Sun, Gift, HelpCircle, Settings, ChevronRight, Trophy, Crown, LogOut, Bug
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import { cn } from "@/lib/utils";

interface Props {
  profile: Profile | null;
  credits?: number;
  badgesEarned?: number;
  totalBadges?: number;
  levelsEarned?: number;
  totalLevels?: number;
  isAdmin?: boolean;
}

export function ProfileMenuClient({
  profile,
  credits = 500,
  badgesEarned = 1,
  totalBadges = 48,
  levelsEarned = 1,
  totalLevels = 12,
  isAdmin = false,
}: Props) {
  const router = useRouter();
  const supabase = createClient();
  const pct = Math.round((levelsEarned / totalLevels) * 100);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const menuSections = [
    {
      items: [
        { label: "Favoris",              icon: Heart,      href: "/favorites" },
        { label: "Inviter des amis",     icon: Users,      href: "/referral" },
        { label: "Mon porte-monnaie",    icon: Wallet,     href: "/wallet",  value: "0.00 €" },
        { label: "Mes ventes & achats",  icon: ShoppingBag, href: "/sales" },
        { label: "Outils de promotion",  icon: Zap,        href: "/promotion-tools" },
      ],
    },
    {
      items: [
        {
          label: isAdmin ? "Premium actif — Accès illimité" : "Abonnements & Plans",
          icon: isAdmin ? Crown : Star,
          href: "/premium",
          highlight: true,
          subtitle: isAdmin ? "IA illimitée · Boosts illimités · 50€/mois" : "Boosts, IA illimitée, badge vendeur",
        },
      ],
    },
    {
      items: [
        ...(isAdmin ? [{ label: "Admin Panel", icon: Shield, href: "/admin", adminBadge: true }] : []),
        { label: "Personnalisation", icon: Shield,      href: "/personalization" },
        { label: "Mode vacances",    icon: Sun,         href: "/vacation-mode" },
        { label: "Dons",             icon: Gift,        href: "/donation-mode" },
        { label: "Guide Wearlyx",    icon: HelpCircle,  href: "/guide" },
        { label: "Signaler un bug",  icon: Bug,         href: "/sales?tab=bugs" },
        { label: "Paramètres",       icon: Settings,    href: "/profile/settings" },
      ],
    },
  ];

  return (
    <div className="pb-6">
      {/* Profile card */}
      <Link
        href={`/profile/${profile?.id}`}
        className="flex items-center gap-3.5 mx-4 mt-4 mb-3 p-4 rounded-2xl border border-white/[0.08] active:scale-[0.99] transition-transform"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
          {profile?.avatar_url ? (
            <Image src={profile.avatar_url} alt="avatar" width={48} height={48} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#6C63FF] to-[#C026D3] flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {(profile?.full_name || profile?.username || "?")[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[15px] font-bold text-white truncate">{profile?.full_name || profile?.username || "Mon profil"}</p>
            {isAdmin && (
              <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 flex-shrink-0">
                <Crown className="w-2 h-2 fill-amber-400" /> Premium
              </span>
            )}
          </div>
          <p className="text-[12px] text-white/35 mt-0.5">{isAdmin ? "Créateur · Accès illimité" : "Voir mes annonces →"}</p>
        </div>
      </Link>

      {/* Badges & Récompenses */}
      <Link
        href="/credits"
        className="flex items-center gap-3.5 mx-4 mb-4 p-4 rounded-2xl border border-white/[0.08] active:scale-[0.99] transition-transform"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Trophy className="w-4.5 h-4.5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[13px] font-semibold text-white">Badges & Récompenses</p>
            <span className="text-[13px] font-bold text-[#6C63FF]">{credits} cr.</span>
          </div>
          <div className="w-full h-1 rounded-full bg-white/8 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#C026D3]" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <p className="text-[10px] text-white/25">{badgesEarned}/{totalBadges} badges</p>
            <p className="text-[10px] text-white/25">{levelsEarned}/{totalLevels} récompenses</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-white/15 flex-shrink-0" />
      </Link>

      {/* Menu sections */}
      <div className="px-4 flex flex-col gap-3">
        {menuSections.map((section, si) => (
          <div key={si} className="rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
            {section.items.map(({ label, icon: Icon, href, value, highlight, subtitle, adminBadge }: any) => (
              <Link
                key={href + label}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-white/5 border-b border-white/[0.05] last:border-0",
                  highlight && "bg-[#6C63FF]/[0.06]",
                  adminBadge && "bg-[#6C63FF]/[0.06]"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                  highlight ? "bg-[#6C63FF]/15" : adminBadge ? "bg-[#6C63FF]/15" : "bg-white/[0.06]"
                )}>
                  <Icon className={cn("w-4 h-4", highlight ? "text-[#6C63FF]" : adminBadge ? "text-[#9B93FF]" : "text-white/45")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-[13px] font-semibold", highlight ? "text-[#6C63FF]" : adminBadge ? "text-[#9B93FF]" : "text-white/85")}>{label}</p>
                  {subtitle && <p className={cn("text-[11px] mt-0.5", highlight ? "text-[#6C63FF]/50" : "text-white/30")}>{subtitle}</p>}
                </div>
                {value && <span className="text-[12px] text-white/40 mr-1">{value}</span>}
                <ChevronRight className="w-3.5 h-3.5 text-white/15 flex-shrink-0" />
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Déconnexion */}
      <div className="px-4 mt-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-500/20 text-red-400 text-[13px] font-semibold active:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
