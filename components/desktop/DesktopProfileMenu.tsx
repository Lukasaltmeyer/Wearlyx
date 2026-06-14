"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Heart, Users, Wallet, ShoppingBag, Zap,
  Shield, Sun, Gift, HelpCircle, Settings, Trophy, Crown, LogOut, Bug,
  MapPin, Package, ChevronRight, Edit3, Camera, Sparkles,
  ArrowUpRight, BarChart2, TrendingUp, Eye, MessageSquare,
  CheckCircle, Clock, Flame, Target
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
      { label: "Mes annonces",      icon: Package,    href: "/listings",         color: "#8B5CF6", desc: "Gérer mes articles" },
      { label: "Favoris",           icon: Heart,      href: "/favorites",        color: "#EF4444", desc: "Articles sauvegardés" },
      { label: "Ventes & achats",   icon: ShoppingBag,href: "/sales",            color: "#10B981", desc: "Mes transactions" },
      { label: "Analytiques",       icon: BarChart2,  href: "/analytics",        color: "#8B5CF6", desc: "Stats de ma boutique" },
      { label: "Porte-monnaie",     icon: Wallet,     href: "/wallet",           color: "#3B82F6", desc: "Solde et retraits" },
    ],
  },
  {
    section: "Croissance",
    items: [
      { label: "Promotion",         icon: Zap,        href: "/promotion-tools",  color: "#F59E0B", desc: "Booster mes annonces" },
      { label: "Inviter des amis",  icon: Users,      href: "/referral",         color: "#EC4899", desc: "Gagner des crédits" },
      { label: "Plan Premium",      icon: Crown,      href: "/premium",          color: "#A78BFA", desc: "IA · Boosts · Badges" },
    ],
  },
  {
    section: "Compte",
    items: [
      { label: "Personnalisation",  icon: Shield,     href: "/personalization",  color: "#6366F1", desc: "Thème et préférences" },
      { label: "Mode vacances",     icon: Sun,        href: "/vacation-mode",    color: "#F97316", desc: "Pause temporaire" },
      { label: "Dons",              icon: Gift,       href: "/donation-mode",    color: "#14B8A6", desc: "Faire un don" },
      { label: "Guide Wearlyx",     icon: HelpCircle, href: "/guide",            color: "#8B5CF6", desc: "Aide et documentation" },
      { label: "Signaler un bug",   icon: Bug,        href: "/sales?tab=bugs",   color: "#EF4444", desc: "Reporter un problème" },
      { label: "Paramètres",        icon: Settings,   href: "/profile/settings", color: "#94A3B8", desc: "Sécurité et confidentialité" },
    ],
  },
];

const PROFILE_TASKS = [
  { label: "Ajouter une photo",     done: false, href: "/profile/edit" },
  { label: "Compléter ta bio",      done: false, href: "/profile/edit" },
  { label: "Première annonce",      done: false, href: "/sell/ai" },
  { label: "Vérifier ton compte",   done: true,  href: "/profile/settings" },
];

const TRENDING_ITEMS = [
  { name: "Nike Air Force 1", price: "65 €", emoji: "👟" },
  { name: "Veste Carhartt",   price: "42 €", emoji: "🧥" },
  { name: "Cap Supreme",      price: "55 €", emoji: "🧢" },
  { name: "Jordan 4 Retro",   price: "245€", emoji: "👟" },
];

export function DesktopProfileMenu({
  profile, credits = 500, badgesEarned = 1, totalBadges = 48,
  levelsEarned = 1, totalLevels = 12, isAdmin = false,
  productsCount = 0, salesCount = 0,
}: Props) {
  const router = useRouter();
  const supabase = createClient();
  const pct = Math.round((levelsEarned / totalLevels) * 100);
  const profileCompletion = Math.round((PROFILE_TASKS.filter(t => t.done).length / PROFILE_TASKS.length) * 100);
  const initials = (profile?.full_name || profile?.username || "?")[0]?.toUpperCase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

  return (
    <div className="min-h-[100dvh]" style={{ background: "#07070A" }}>

      {/* ── COVER BANNER ── */}
      <div className="relative w-full overflow-hidden" style={{ height: 260 }}>
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #080115 0%, #160840 25%, #2e1272 55%, #5a1fd1 80%, #7C3AED 100%)" }} />

        {/* Cinematic light sources */}
        <div className="absolute pointer-events-none"
          style={{ top: -80, right: "20%", width: 400, height: 400, background: "radial-gradient(circle, rgba(139,92,246,0.45) 0%, transparent 65%)", filter: "blur(50px)" }} />
        <div className="absolute pointer-events-none"
          style={{ bottom: -60, left: "10%", width: 320, height: 320, background: "radial-gradient(circle, rgba(109,40,217,0.35) 0%, transparent 65%)", filter: "blur(40px)" }} />
        <div className="absolute pointer-events-none"
          style={{ top: "20%", left: "45%", width: 200, height: 200, background: "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 65%)", filter: "blur(30px)" }} />

        {/* Fine dot texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Status + edit */}
        <div className="absolute top-5 right-6 flex items-center gap-2 z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm text-[11px] font-semibold text-white/60"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            En ligne
          </div>
        </div>
        <Link href="/profile/edit"
          className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white/45 backdrop-blur-sm transition-all hover:text-white/70 z-10"
          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Camera className="w-3.5 h-3.5" /> Modifier la bannière
        </Link>

        <div className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: "linear-gradient(to top, #07070A, transparent)" }} />
      </div>

      {/* ── TWO COLUMN LAYOUT ── */}
      <div className="flex gap-0 px-8" style={{ marginTop: -72 }}>

        {/* ════ LEFT/MAIN COLUMN ════ */}
        <div className="flex-1 min-w-0 pr-8">

          {/* Profile identity row */}
          <div className="flex items-end gap-5 mb-7">
            {/* Avatar */}
            <div className="relative flex-shrink-0 z-10">
              <div className="w-[116px] h-[116px] rounded-2xl overflow-hidden"
                style={{ border: "4px solid #07070A", background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 0 0 1px rgba(139,92,246,0.35), 0 20px 48px rgba(139,92,246,0.25)" }}>
                {profile?.avatar_url
                  ? <Image src={profile.avatar_url} alt="avatar" width={116} height={116} className="w-full h-full object-cover" />
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
            <div className="flex-1 min-w-0 pb-1 z-10">
              <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                <h1 className="text-[30px] font-black text-white tracking-tight leading-none">
                  {profile?.full_name || profile?.username || "Mon profil"}
                </h1>
                {isAdmin && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black text-amber-400 uppercase tracking-wide"
                    style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                    <Crown className="w-2.5 h-2.5 fill-amber-400" /> Premium
                  </span>
                )}
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-400"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)" }}>
                  <CheckCircle className="w-2.5 h-2.5" /> Vérifié
                </span>
              </div>
              {profile?.username && <p className="text-[13px] text-white/30 mb-1">@{profile.username}</p>}
              {profile?.bio && <p className="text-[13px] text-white/45 max-w-[500px] leading-relaxed">{profile.bio}</p>}
              <div className="flex items-center gap-4 mt-1.5">
                {((profile as any)?.city) && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-white/25" />
                    <span className="text-[12px] text-white/30">{(profile as any).city}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-white/25" />
                  <span className="text-[12px] text-white/30">Membre depuis 2024</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pb-1 flex-shrink-0 z-10">
              <Link href="/profile/edit"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white/55 transition-all hover:text-white/80"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <Edit3 className="w-3.5 h-3.5" /> Modifier
              </Link>
              <Link href="/sell/ai"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(139,92,246,0.4)]"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 16px rgba(139,92,246,0.3)" }}>
                <Sparkles className="w-3.5 h-3.5" /> Vendre
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-4 gap-3 mb-7">
            {[
              { label: "Annonces",  value: productsCount, icon: Package,     color: "#8B5CF6", href: "/listings", trend: "+2 ce mois" },
              { label: "Ventes",    value: salesCount,    icon: ShoppingBag,  color: "#10B981", href: "/sales",    trend: "0 en attente" },
              { label: "Crédits",   value: credits,       icon: Zap,          color: "#F59E0B", href: "/wallet",   trend: "Gagner plus" },
              { label: "Badges",    value: `${badgesEarned}/${totalBadges}`, icon: Trophy, color: "#EC4899", href: "/credits", trend: `${pct}% niveau` },
            ].map(({ label, value, icon: Icon, color, href, trend }) => (
              <Link key={label} href={href}
                className="flex flex-col gap-3 px-5 py-4 rounded-2xl transition-all hover:-translate-y-0.5 group relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}30`; (e.currentTarget as HTMLElement).style.background = `${color}07`; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color, width: 18, height: 18 }} />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/10 group-hover:text-white/30 transition-colors" />
                </div>
                <div>
                  <p className="text-[26px] font-black text-white leading-none mb-0.5">{value}</p>
                  <p className="text-[11px] text-white/35 mb-1">{label}</p>
                  <p className="text-[10px] font-semibold" style={{ color: `${color}80` }}>{trend}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Badges progress */}
          <Link href="/credits"
            className="flex items-center gap-5 px-6 py-4 rounded-2xl mb-7 transition-all hover:-translate-y-0.5 group"
            style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(245,158,11,0.02))", border: "1px solid rgba(245,158,11,0.14)" }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(245,158,11,0.15)" }}>
              <Trophy className="w-5.5 h-5.5 text-amber-400" style={{ width: 22, height: 22 }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[14px] font-bold text-white">Badges & Récompenses</p>
                <span className="text-[18px] font-black text-[#8B5CF6]">{credits} cr.</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: "linear-gradient(90deg, #8B5CF6, #A78BFA, #C4B5FD)" }} />
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-[10px] text-white/25">Niveau {levelsEarned}/{totalLevels}</p>
                <p className="text-[10px] text-[#A78BFA]/50">{pct}% vers le prochain</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/12 group-hover:text-amber-400/40 transition-colors flex-shrink-0" />
          </Link>

          {/* Menu grid */}
          {MENU_CARDS.map(({ section, items }) => (
            <div key={section} className="mb-7">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">{section}</p>
              <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
                {items.map(({ label, icon: Icon, href, color, desc }) => (
                  <Link key={href + label} href={href}
                    className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5 group"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.055)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}32`; (e.currentTarget as HTMLElement).style.background = `${color}07`; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.055)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: `${color}16` }}>
                      <Icon className="w-4.5 h-4.5" style={{ color, width: 18, height: 18 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white">{label}</p>
                      <p className="text-[10.5px] text-white/28 truncate mt-0.5">{desc}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/10 flex-shrink-0 group-hover:text-white/30 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {isAdmin && (
            <div className="mb-7">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Administration</p>
              <Link href="/admin"
                className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.09), rgba(124,58,237,0.04))", border: "1px solid rgba(139,92,246,0.22)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.18)" }}>
                  <Shield className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <div className="flex-1">
                  <p className="text-[13.5px] font-semibold text-[#A78BFA]">Admin Panel</p>
                  <p className="text-[11px] text-white/28">Accès créateur</p>
                </div>
                <BarChart2 className="w-4 h-4 text-[#A78BFA]/30" />
              </Link>
            </div>
          )}

          <div className="pb-10">
            <button onClick={handleLogout}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl text-[13px] font-semibold text-red-400/60 transition-all hover:text-red-400 group"
              style={{ border: "1px solid rgba(239,68,68,0.1)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.22)"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div className="w-[300px] flex-shrink-0 pt-24">

          {/* Profile completion */}
          <div className="rounded-2xl p-5 mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-black text-white/50 uppercase tracking-widest">Profil</p>
              <span className="text-[13px] font-black text-white">{profileCompletion}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full" style={{ width: `${profileCompletion}%`, background: "linear-gradient(90deg, #8B5CF6, #A78BFA)" }} />
            </div>
            <div className="flex flex-col gap-2">
              {PROFILE_TASKS.map(t => (
                <Link key={t.label} href={t.href}
                  className="flex items-center gap-2.5 group">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${t.done ? "bg-emerald-500/20" : "bg-white/5"}`}
                    style={{ border: t.done ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.1)" }}>
                    {t.done
                      ? <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                      : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                  </div>
                  <span className={`text-[11.5px] ${t.done ? "text-white/25 line-through" : "text-white/55 group-hover:text-white/80"} transition-colors`}>{t.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div className="rounded-2xl p-5 mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[12px] font-black text-white/50 uppercase tracking-widest mb-3">Statistiques</p>
            {[
              { icon: Eye,          label: "Vues annonces",   value: "—",   color: "#3B82F6" },
              { icon: MessageSquare,label: "Taux de réponse", value: "—",   color: "#10B981" },
              { icon: TrendingUp,   label: "Profil visité",   value: "—",   color: "#8B5CF6" },
              { icon: Target,       label: "Taux conversion", value: "—",   color: "#F59E0B" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                  <span className="text-[12px] text-white/40">{label}</span>
                </div>
                <span className="text-[12px] font-bold text-white/60">{value}</span>
              </div>
            ))}
          </div>

          {/* Trending now */}
          <div className="rounded-2xl p-5 mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <p className="text-[12px] font-black text-white/50 uppercase tracking-widest">Tendances</p>
            </div>
            <div className="flex flex-col gap-1.5">
              {TRENDING_ITEMS.map((t, i) => (
                <Link key={t.name} href={`/search?q=${encodeURIComponent(t.name)}`}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/4 transition-all group">
                  <span className="text-[10px] font-black text-white/15 w-3.5">{i + 1}</span>
                  <span className="text-lg flex-shrink-0">{t.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11.5px] font-semibold text-white/55 group-hover:text-white/80 transition-colors truncate">{t.name}</p>
                  </div>
                  <span className="text-[11px] font-black text-[#8B5CF6]/60">{t.price}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* IA tip */}
          <Link href="/sell/ai"
            className="flex items-start gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5 group"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(109,40,217,0.04))", border: "1px solid rgba(139,92,246,0.16)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(139,92,246,0.18)" }}>
              <Sparkles className="w-4 h-4 text-[#A78BFA]" />
            </div>
            <div>
              <p className="text-[12.5px] font-bold text-white mb-0.5">Vendre avec l'IA</p>
              <p className="text-[11px] text-white/30 leading-relaxed">Photo → annonce publiée en 10 secondes</p>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/15 group-hover:text-[#A78BFA]/60 transition-colors flex-shrink-0 mt-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
