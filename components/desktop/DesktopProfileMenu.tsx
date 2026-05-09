"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Heart, Users, Wallet, ShoppingBag, Zap, Star,
  Shield, Sun, Gift, HelpCircle, Settings, Trophy, Crown, LogOut, Bug,
  MapPin, Package, TrendingUp, ChevronRight, Edit3
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

interface Props {
  profile: Profile | null;
  credits?: number;
  badgesEarned?: number;
  totalBadges?: number;
  levelsEarned?: number;
  totalLevels?: number;
  isAdmin?: boolean;
  productsCount?: number;
  salesCount?: number;
}

const MENU_CARDS = [
  {
    section: "Mon activité",
    items: [
      { label: "Mes annonces",       icon: Package,    href: "/listings",          color: "#8B5CF6", desc: "Gérer mes articles en vente" },
      { label: "Favoris",            icon: Heart,      href: "/favorites",         color: "#EF4444", desc: "Articles que j'ai sauvegardés" },
      { label: "Ventes & achats",    icon: ShoppingBag,href: "/sales",             color: "#10B981", desc: "Historique de mes transactions" },
      { label: "Mon porte-monnaie",  icon: Wallet,     href: "/wallet",            color: "#3B82F6", desc: "Solde et retraits" },
    ],
  },
  {
    section: "Croissance",
    items: [
      { label: "Outils de promotion",icon: Zap,        href: "/promotion-tools",   color: "#F59E0B", desc: "Booster mes annonces" },
      { label: "Inviter des amis",   icon: Users,      href: "/referral",          color: "#EC4899", desc: "Parrainer et gagner des crédits" },
      { label: "Plan Premium",       icon: Crown,      href: "/premium",           color: "#A78BFA", desc: "IA illimitée · Boosts · Badges" },
    ],
  },
  {
    section: "Compte",
    items: [
      { label: "Personnalisation",   icon: Shield,     href: "/personalization",   color: "#6366F1", desc: "Thème et préférences" },
      { label: "Mode vacances",      icon: Sun,        href: "/vacation-mode",     color: "#F97316", desc: "Pause temporaire" },
      { label: "Dons",               icon: Gift,       href: "/donation-mode",     color: "#14B8A6", desc: "Faire un don avec Wearlyx" },
      { label: "Guide Wearlyx",      icon: HelpCircle, href: "/guide",             color: "#8B5CF6", desc: "Aide et documentation" },
      { label: "Signaler un bug",    icon: Bug,        href: "/sales?tab=bugs",    color: "#EF4444", desc: "Reporter un problème" },
      { label: "Paramètres",         icon: Settings,   href: "/profile/settings",  color: "#94A3B8", desc: "Sécurité et confidentialité" },
    ],
  },
];

export function DesktopProfileMenu({
  profile, credits = 500, badgesEarned = 1, totalBadges = 48,
  levelsEarned = 1, totalLevels = 12, isAdmin = false,
  productsCount = 0, salesCount = 0,
}: Props) {
  const router = useRouter();
  const supabase = createClient();
  const pct = Math.round((levelsEarned / totalLevels) * 100);
  const initials = (profile?.full_name || profile?.username || "?")[0]?.toUpperCase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

  return (
    <div className="min-h-[100dvh] px-8 py-7" style={{ background: "#07070A" }}>

      {/* ── Profile Hero ── */}
      <div className="flex items-start gap-8 mb-8 p-6 rounded-3xl"
        style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(109,40,217,0.04))", border: "1px solid rgba(139,92,246,0.12)" }}>

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2"
            style={{ borderColor: "rgba(139,92,246,0.4)", background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
            {profile?.avatar_url
              ? <Image src={profile.avatar_url} alt="avatar" width={96} height={96} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white">{initials}</div>
            }
          </div>
          <Link href="/profile/edit"
            className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#8B5CF6" }}>
            <Edit3 className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-[26px] font-black text-white">{profile?.full_name || profile?.username || "Mon profil"}</h1>
            {isAdmin && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-amber-400"
                style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <Crown className="w-3 h-3 fill-amber-400" /> Premium
              </span>
            )}
          </div>
          {profile?.username && <p className="text-[14px] text-white/35 mb-1">@{profile.username}</p>}
          {profile?.bio && <p className="text-[13px] text-white/50 max-w-[500px] mb-2">{profile.bio}</p>}
          {((profile as any)?.city) && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-white/25" />
              <span className="text-[12px] text-white/35">{(profile as any).city}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {[
            { label: "Annonces", value: productsCount },
            { label: "Ventes", value: salesCount },
            { label: "Crédits", value: credits },
          ].map(({ label, value }) => (
            <div key={label} className="text-center px-4 py-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[22px] font-black text-white">{value}</p>
              <p className="text-[11px] text-white/35">{label}</p>
            </div>
          ))}
          <Link href="/profile/edit"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[13px] font-bold text-white transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 16px rgba(139,92,246,0.3)" }}>
            <Edit3 className="w-4 h-4" /> Modifier
          </Link>
        </div>
      </div>

      {/* ── Badges card ── */}
      <Link href="/credits"
        className="flex items-center gap-5 px-6 py-5 rounded-2xl mb-8 transition-all hover:scale-[1.005]"
        style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(245,158,11,0.15)" }}>
          <Trophy className="w-6 h-6 text-amber-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[15px] font-bold text-white">Badges & Récompenses</p>
            <span className="text-[16px] font-black text-[#8B5CF6]">{credits} cr.</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #8B5CF6, #A78BFA)" }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <p className="text-[11px] text-white/30">{badgesEarned}/{totalBadges} badges</p>
            <p className="text-[11px] text-white/30">{levelsEarned}/{totalLevels} récompenses</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/20 flex-shrink-0" />
      </Link>

      {/* ── Menu Grid ── */}
      {MENU_CARDS.map(({ section, items }) => (
        <div key={section} className="mb-7">
          <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-3">{section}</p>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {items.map(({ label, icon: Icon, href, color, desc }) => (
              <Link key={href + label} href={href}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg group"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}30`; (e.currentTarget as HTMLElement).style.background = `${color}08`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-white">{label}</p>
                  <p className="text-[11px] text-white/30 truncate mt-0.5">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/15 flex-shrink-0 group-hover:text-white/30 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* ── Admin ── */}
      {isAdmin && (
        <div className="mb-7">
          <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-3">Administration</p>
          <Link href="/admin"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.2)" }}>
              <Shield className="w-5 h-5 text-[#A78BFA]" />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-[#A78BFA]">Admin Panel</p>
              <p className="text-[11px] text-white/30">Accès créateur</p>
            </div>
          </Link>
        </div>
      )}

      {/* ── Logout ── */}
      <button onClick={handleLogout}
        className="flex items-center gap-3 px-5 py-4 rounded-2xl text-[14px] font-semibold text-red-400 transition-all hover:bg-red-500/10"
        style={{ border: "1px solid rgba(239,68,68,0.15)" }}>
        <LogOut className="w-5 h-5" />
        Déconnexion
      </button>
    </div>
  );
}
