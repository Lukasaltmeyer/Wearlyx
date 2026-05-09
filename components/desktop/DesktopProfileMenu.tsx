"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Heart, Users, Wallet, ShoppingBag, Zap, Star,
  Shield, Sun, Gift, HelpCircle, Settings, Trophy, Crown, LogOut, Bug,
  MapPin, Package, ChevronRight, Edit3, Camera, Sparkles,
  BarChart2, ArrowUpRight
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
    <div className="min-h-[100dvh]" style={{ background: "#07070A" }}>

      {/* ── COVER BANNER ── */}
      <div className="relative w-full overflow-hidden" style={{ height: 240 }}>
        {/* Gradient cover */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #0f0520 0%, #1e0847 30%, #3b0f8f 60%, #5b1fd4 85%, #7C3AED 100%)" }} />

        {/* Animated glow orbs */}
        <div className="absolute top-[-60px] right-[15%] w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-[-40px] left-[20%] w-[250px] h-[250px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 70%)", filter: "blur(30px)" }} />
        <div className="absolute top-[20px] left-[40%] w-[180px] h-[180px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(109,40,217,0.4) 0%, transparent 70%)", filter: "blur(25px)" }} />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Floating stat pills */}
        <div className="absolute top-5 right-6 flex flex-col gap-2 z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm text-[11px] font-bold text-white/70"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            En ligne
          </div>
        </div>

        {/* Edit cover button */}
        <Link href="/profile/edit"
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white/50 backdrop-blur-sm transition-all hover:text-white/80 z-10"
          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Camera className="w-3.5 h-3.5" /> Modifier la bannière
        </Link>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-20"
          style={{ background: "linear-gradient(to top, #07070A, transparent)" }} />
      </div>

      {/* ── PROFILE HEADER (overlapping banner) ── */}
      <div className="px-10 relative" style={{ marginTop: -64 }}>
        <div className="flex items-end gap-6 mb-6">

          {/* Avatar */}
          <div className="relative flex-shrink-0 z-10">
            <div className="w-[120px] h-[120px] rounded-2xl overflow-hidden"
              style={{
                border: "4px solid #07070A",
                background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                boxShadow: "0 0 0 1px rgba(139,92,246,0.4), 0 16px 40px rgba(139,92,246,0.3)"
              }}>
              {profile?.avatar_url
                ? <Image src={profile.avatar_url} alt="avatar" width={120} height={120} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white">{initials}</div>
              }
            </div>
            {isAdmin && (
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", boxShadow: "0 4px 12px rgba(245,158,11,0.4)" }}>
                <Crown className="w-3.5 h-3.5 text-white fill-white" />
              </div>
            )}
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0 pb-2 z-10">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-[32px] font-black text-white tracking-tight leading-none">
                {profile?.full_name || profile?.username || "Mon profil"}
              </h1>
              {isAdmin && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black text-amber-400 uppercase tracking-wide"
                  style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}>
                  <Crown className="w-3 h-3 fill-amber-400" /> Premium
                </span>
              )}
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-400"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <Star className="w-3 h-3 fill-emerald-400" /> Vérifié
              </span>
            </div>
            {profile?.username && <p className="text-[14px] text-white/35 mb-1.5">@{profile.username}</p>}
            {profile?.bio && <p className="text-[13px] text-white/50 max-w-[600px] leading-relaxed">{profile.bio}</p>}
            {((profile as any)?.city) && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-white/25" />
                <span className="text-[12px] text-white/35">{(profile as any).city}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pb-2 flex-shrink-0 z-10">
            <Link href="/profile/edit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white/70 transition-all hover:text-white hover:bg-white/8"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              <Edit3 className="w-3.5 h-3.5" /> Modifier le profil
            </Link>
            <Link href="/sell/ai"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 16px rgba(139,92,246,0.35)" }}>
              <Sparkles className="w-3.5 h-3.5" /> Vendre un article
            </Link>
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <div className="flex items-stretch gap-3 mb-8">
          {[
            { label: "Annonces", value: productsCount, icon: Package,    color: "#8B5CF6", href: "/listings" },
            { label: "Ventes",   value: salesCount,    icon: ShoppingBag,color: "#10B981", href: "/sales" },
            { label: "Crédits",  value: credits,       icon: Zap,        color: "#F59E0B", href: "/wallet" },
            { label: "Badges",   value: `${badgesEarned}/${totalBadges}`, icon: Trophy, color: "#EC4899", href: "/credits" },
          ].map(({ label, value, icon: Icon, color, href }) => (
            <Link key={label} href={href}
              className="flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl transition-all hover:-translate-y-0.5 group"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}30`; (e.currentTarget as HTMLElement).style.background = `${color}08`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1">
                <p className="text-[22px] font-black text-white leading-none mb-0.5">{value}</p>
                <p className="text-[11px] text-white/35">{label}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>

        {/* ── BADGES & LEVEL PROGRESS ── */}
        <Link href="/credits"
          className="flex items-center gap-5 px-6 py-5 rounded-2xl mb-8 transition-all hover:-translate-y-0.5 group"
          style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.07), rgba(245,158,11,0.03))", border: "1px solid rgba(245,158,11,0.15)" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(245,158,11,0.15)", boxShadow: "0 0 20px rgba(245,158,11,0.15)" }}>
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <p className="text-[15px] font-bold text-white">Badges & Récompenses</p>
                <p className="text-[12px] text-white/30 mt-0.5">{badgesEarned} badge{badgesEarned !== 1 ? "s" : ""} obtenu{badgesEarned !== 1 ? "s" : ""} sur {totalBadges}</p>
              </div>
              <div className="text-right">
                <span className="text-[20px] font-black text-[#8B5CF6]">{credits}</span>
                <p className="text-[10px] text-white/30">crédits</p>
              </div>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: "linear-gradient(90deg, #8B5CF6, #A78BFA, #C4B5FD)" }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <p className="text-[11px] text-white/25">Niveau {levelsEarned}/{totalLevels}</p>
              <p className="text-[11px] text-[#A78BFA]/60">{pct}% vers le prochain niveau</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/15 flex-shrink-0 group-hover:text-amber-400/40 transition-colors" />
        </Link>

        {/* ── MENU GRID ── */}
        {MENU_CARDS.map(({ section, items }) => (
          <div key={section} className="mb-8">
            <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-4 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
              {section}
            </p>
            <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
              {items.map(({ label, icon: Icon, href, color, desc }) => (
                <Link key={href + label} href={href}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] group"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}35`; (e.currentTarget as HTMLElement).style.background = `${color}08`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: `${color}18` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-white">{label}</p>
                    <p className="text-[11px] text-white/30 truncate mt-0.5">{desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/12 flex-shrink-0 group-hover:text-white/35 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* ── ADMIN ── */}
        {isAdmin && (
          <div className="mb-8">
            <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-4 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
              Administration
            </p>
            <Link href="/admin"
              className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(124,58,237,0.05))", border: "1px solid rgba(139,92,246,0.25)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.2)" }}>
                <Shield className="w-5 h-5 text-[#A78BFA]" />
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-[#A78BFA]">Admin Panel</p>
                <p className="text-[11px] text-white/30">Accès créateur</p>
              </div>
              <BarChart2 className="w-4 h-4 text-[#A78BFA]/30 ml-auto" />
            </Link>
          </div>
        )}

        {/* ── LOGOUT ── */}
        <div className="pb-10">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[13.5px] font-semibold text-red-400/70 transition-all hover:text-red-400 hover:bg-red-500/8 group"
            style={{ border: "1px solid rgba(239,68,68,0.1)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.25)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.1)"; }}>
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
