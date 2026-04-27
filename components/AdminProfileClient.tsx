"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shield, Crown, Zap, Users, ShoppingBag, AlertTriangle,
  BarChart3, Bell, Send, CheckCircle, Package, ExternalLink,
  TrendingUp, Cpu, CreditCard, Activity, Eye, ToggleLeft,
  ToggleRight, Megaphone, Wrench, ChevronRight,
  DollarSign, Star, UserPlus, ArrowUpRight,
} from "lucide-react";
import type { Profile } from "@/types/database";
import { cn } from "@/lib/utils";

interface Props {
  profile: Profile | null;
  stats: {
    usersCount: number;
    ordersCount: number;
    disputesCount: number;
    revenue: number;
    productsCount?: number;
    aiCount?: number;
    planCounts?: { free: number; starter: number; pro: number; premium: number };
  };
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5 p-3 rounded-2xl border", color)}>
      <Icon className="w-4 h-4 opacity-70" />
      <p className="text-[18px] font-bold text-white leading-none">{value}</p>
      <p className="text-[10px] text-white/35">{label}</p>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="mx-4 mt-3 rounded-2xl border border-white/[0.07] overflow-hidden bg-[#0D0D15]">
      <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-[#8B5CF6]" />
        <p className="text-[12px] font-semibold text-white/70">{title}</p>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

export function AdminProfileClient({ profile, stats }: Props) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [msgType, setMsgType] = useState<"info" | "promo" | "maintenance">("info");
  const [advancedMode, setAdvancedMode] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  const mrr = ((stats.planCounts?.starter ?? 0) * 5 + (stats.planCounts?.pro ?? 0) * 15 + (stats.planCounts?.premium ?? 0) * 30);
  const paidUsers = (stats.planCounts?.starter ?? 0) + (stats.planCounts?.pro ?? 0) + (stats.planCounts?.premium ?? 0);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setSending(false);
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  const msgTemplates = [
    { icon: "🚀", text: "Nouvelle fonctionnalité disponible sur Wearlyx !" },
    { icon: "🔧", text: "Maintenance prévue cette nuit de 02h à 04h." },
    { icon: "🎉", text: "Promotion : -30% sur le plan Pro ce week-end !" },
    { icon: "💡", text: "Astuce : utilisez l'IA pour vendre 3× plus vite." },
  ];

  return (
    <div className="pb-10">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden border border-[#8B5CF6]/25">
        {/* Banner */}
        <div className="h-24 relative flex items-end px-4 pb-0" style={{ background: "linear-gradient(135deg, #4C1D95 0%, #8B5CF6 50%, #A855F7 100%)" }}>
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 75% 40%, white 0%, transparent 55%)" }} />
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-white">LIVE</span>
          </div>
        </div>

        <div className="bg-[#0D0D15] px-4 pb-4 -mt-8">
          <div className="flex items-end justify-between mb-3">
            <div className="w-16 h-16 rounded-2xl border-2 border-[#8B5CF6]/60 overflow-hidden bg-[#1A1040] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20">
              {profile?.avatar_url
                ? <Image src={profile.avatar_url} alt="" width={64} height={64} className="w-full h-full object-cover" />
                : <Shield className="w-8 h-8 text-[#8B5CF6]" />}
            </div>
            <Link href="/admin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-[#9B93FF] border border-[#8B5CF6]/25 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Admin Panel
            </Link>
          </div>

          <p className="text-[18px] font-bold text-white">{profile?.full_name ?? profile?.username ?? "Admin"}</p>
          <p className="text-[12px] text-white/35 mb-3">@{profile?.username ?? "admin"}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Fondateur",   icon: Crown,   style: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
              { label: "Admin",       icon: Shield,  style: "bg-[#8B5CF6]/15 text-[#9B93FF] border-[#8B5CF6]/25" },
              { label: "Premium",     icon: Star,    style: "bg-violet-500/15 text-violet-400 border-violet-500/25" },
              { label: "Accès total", icon: Zap,     style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
            ].map(({ label, icon: Icon, style }) => (
              <span key={label} className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border", style)}>
                <Icon className="w-2.5 h-2.5" /> {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Platform overview ─────────────────────────────────────────────── */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
        <StatCard label="Utilisateurs"  value={stats.usersCount.toLocaleString()}   icon={Users}       color="bg-blue-500/8 border-blue-500/15 text-blue-400" />
        <StatCard label="Commandes"     value={stats.ordersCount.toLocaleString()}  icon={Package}     color="bg-emerald-500/8 border-emerald-500/15 text-emerald-400" />
        <StatCard label="Revenus GMV"   value={`€${stats.revenue.toFixed(0)}`}      icon={DollarSign}  color="bg-amber-500/8 border-amber-500/15 text-amber-400" />
        <StatCard label="Litiges"       value={stats.disputesCount}                  icon={AlertTriangle} color={stats.disputesCount > 0 ? "bg-red-500/8 border-red-500/15 text-red-400" : "bg-zinc-500/8 border-zinc-500/15 text-zinc-400"} />
      </div>

      {/* ── Abonnement admin ──────────────────────────────────────────────── */}
      <Section title="Mon abonnement — Admin Premium" icon={Crown}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[13px] font-bold text-white">Plan Owner Premium</p>
            <p className="text-[11px] text-white/30">Accès complet et illimité</p>
          </div>
          <div className="text-right">
            <p className="text-[20px] font-black text-amber-400">50€<span className="text-[12px] text-white/30 font-normal">/mois</span></p>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/12 border border-emerald-500/20 px-2 py-0.5 rounded-full">✓ Actif</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { l: "Crédits IA",    v: "∞",    c: "text-violet-400" },
            { l: "Boosts",        v: "∞",    c: "text-blue-400" },
            { l: "Fonctions",     v: "Tout", c: "text-emerald-400" },
          ].map(({ l, v, c }) => (
            <div key={l} className="bg-white/[0.04] rounded-xl p-2.5 text-center border border-white/[0.06]">
              <p className={cn("text-[15px] font-black", c)}>{v}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Business metrics ──────────────────────────────────────────────── */}
      <Section title="Business Control" icon={TrendingUp}>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
            <p className="text-[10px] text-white/30 mb-1">MRR estimé</p>
            <p className="text-[20px] font-bold text-emerald-400">€{mrr.toLocaleString()}</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
            <p className="text-[10px] text-white/30 mb-1">Utilisateurs payants</p>
            <p className="text-[20px] font-bold text-blue-400">{paidUsers}</p>
          </div>
        </div>
        <div className="space-y-0">
          {[
            { l: "Free",    n: stats.planCounts?.free ?? 0,    c: "bg-zinc-600" },
            { l: "Starter", n: stats.planCounts?.starter ?? 0, c: "bg-blue-500" },
            { l: "Pro",     n: stats.planCounts?.pro ?? 0,     c: "bg-violet-500" },
            { l: "Premium", n: stats.planCounts?.premium ?? 0, c: "bg-amber-500" },
          ].map(({ l, n, c }) => {
            const pct = stats.usersCount > 0 ? (n / stats.usersCount) * 100 : 0;
            return (
              <div key={l} className="flex items-center gap-3 py-1.5">
                <span className="text-[11px] text-white/35 w-14">{l}</span>
                <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", c)} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[11px] text-white/30 w-8 text-right">{n}</span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── AI Control ────────────────────────────────────────────────────── */}
      <Section title="Contrôle IA" icon={Cpu}>
        <div className="grid grid-cols-2 gap-2">
          {[
            { l: "Générations totales",  v: (stats.aiCount ?? 0).toLocaleString(), c: "text-violet-400" },
            { l: "Coût estimé API",      v: `€${((stats.aiCount ?? 0) * 0.002).toFixed(2)}`, c: "text-amber-400" },
            { l: "Moy. / utilisateur",   v: stats.usersCount > 0 ? ((stats.aiCount ?? 0) / stats.usersCount).toFixed(1) : "0", c: "text-blue-400" },
            { l: "Utilisateurs IA",      v: paidUsers.toLocaleString(), c: "text-emerald-400" },
          ].map(({ l, v, c }) => (
            <div key={l} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
              <p className={cn("text-[16px] font-bold", c)}>{v}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Actions rapides ───────────────────────────────────────────────── */}
      <Section title="Actions rapides" icon={Wrench}>
        <div className="grid grid-cols-2 gap-2">
          {[
            { l: "Nouveaux utilisateurs",  icon: UserPlus,    href: "/admin", c: "text-blue-400 bg-blue-500/8 border-blue-500/15" },
            { l: "Ventes récentes",        icon: Package,      href: "/admin", c: "text-emerald-400 bg-emerald-500/8 border-emerald-500/15" },
            { l: "Litiges urgents",        icon: AlertTriangle, href: "/admin", c: "text-red-400 bg-red-500/8 border-red-500/15" },
            { l: "Analytics",              icon: BarChart3,    href: "/admin", c: "text-violet-400 bg-violet-500/8 border-violet-500/15" },
            { l: "Abonnements",            icon: CreditCard,   href: "/admin", c: "text-amber-400 bg-amber-500/8 border-amber-500/15" },
            { l: "Produits",               icon: ShoppingBag,  href: "/admin", c: "text-indigo-400 bg-indigo-500/8 border-indigo-500/15" },
          ].map(({ l, icon: Icon, href, c }) => (
            <Link key={l} href={href} className={cn("flex items-center gap-2.5 p-3 rounded-xl border transition-all active:scale-95", c)}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-[12px] font-semibold">{l}</span>
              <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
            </Link>
          ))}
        </div>

        {/* Maintenance toggle */}
        <button
          onClick={() => setMaintenance(m => !m)}
          className={cn(
            "mt-3 w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
            maintenance
              ? "bg-red-500/10 border-red-500/25 text-red-400"
              : "bg-white/[0.03] border-white/[0.07] text-white/40"
          )}>
          <div className="flex items-center gap-2.5">
            <Wrench className="w-4 h-4" />
            <div className="text-left">
              <p className="text-[12px] font-semibold">{maintenance ? "Maintenance ACTIVE" : "Mode maintenance"}</p>
              <p className="text-[10px] opacity-50">{maintenance ? "Plateforme en maintenance" : "Désactivé"}</p>
            </div>
          </div>
          {maintenance
            ? <ToggleRight className="w-6 h-6 text-red-400" />
            : <ToggleLeft className="w-6 h-6" />}
        </button>
      </Section>

      {/* ── Mode admin avancé ─────────────────────────────────────────────── */}
      <div className="mx-4 mt-3">
        <button
          onClick={() => setAdvancedMode(m => !m)}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all",
            advancedMode
              ? "bg-[#8B5CF6]/12 border-[#8B5CF6]/30 text-[#9B93FF]"
              : "bg-white/[0.03] border-white/[0.07] text-white/40"
          )}>
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4" />
            <div className="text-left">
              <p className="text-[13px] font-semibold">Mode admin avancé</p>
              <p className="text-[11px] opacity-50">Outils supplémentaires et modération rapide</p>
            </div>
          </div>
          {advancedMode
            ? <ToggleRight className="w-6 h-6 text-[#8B5CF6]" />
            : <ToggleLeft className="w-6 h-6" />}
        </button>

        {advancedMode && (
          <div className="mt-2 rounded-2xl border border-[#8B5CF6]/20 bg-[#0D0D18] p-4 space-y-2">
            {[
              { l: "Modération rapide produits",  icon: ShoppingBag, c: "text-violet-400" },
              { l: "Accès analytics avancés",     icon: BarChart3,   c: "text-blue-400" },
              { l: "Logs activité plateforme",    icon: Activity,    c: "text-emerald-400" },
              { l: "Suppression rapide contenu",  icon: AlertTriangle, c: "text-red-400" },
            ].map(({ l, icon: Icon, c }) => (
              <Link key={l} href="/admin" className="flex items-center gap-3 py-2 border-b border-white/[0.05] last:border-0 hover:opacity-80 transition-opacity">
                <Icon className={cn("w-4 h-4 flex-shrink-0", c)} />
                <span className="text-[12px] text-white/60 flex-1">{l}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/20" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Notifications importantes ─────────────────────────────────────── */}
      <Section title="Alertes plateforme" icon={Bell}>
        <div className="space-y-2">
          {[
            stats.disputesCount > 0 && { icon: "🔴", text: `${stats.disputesCount} litige${stats.disputesCount > 1 ? "s" : ""} en attente`, urgent: true },
            paidUsers > 0           && { icon: "💚", text: `${paidUsers} abonnements actifs`, urgent: false },
            (stats.aiCount ?? 0) > 0 && { icon: "🤖", text: `${stats.aiCount} générations IA au total`, urgent: false },
            stats.usersCount > 0    && { icon: "👥", text: `${stats.usersCount} utilisateurs inscrits`, urgent: false },
          ].filter(Boolean).map((notif: any, i) => (
            <div key={i} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl border",
              notif.urgent ? "bg-red-500/8 border-red-500/15" : "bg-white/[0.03] border-white/[0.06]"
            )}>
              <span className="text-[14px]">{notif.icon}</span>
              <p className="text-[12px] text-white/60 flex-1">{notif.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Communication plateforme ──────────────────────────────────────── */}
      <Section title="Communication plateforme" icon={Megaphone}>
        <div className="space-y-3">
          {/* Type */}
          <div className="flex gap-1.5">
            {(["info", "promo", "maintenance"] as const).map(t => (
              <button key={t} onClick={() => setMsgType(t)}
                className={cn("flex-1 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all border",
                  msgType === t ? "bg-[#8B5CF6] text-white border-[#8B5CF6]" : "text-white/25 border-white/[0.07] hover:text-white/50"
                )}>
                {t}
              </button>
            ))}
          </div>

          {/* Templates */}
          <div className="grid grid-cols-1 gap-1.5">
            {msgTemplates.map(({ icon, text }) => (
              <button key={text} onClick={() => setMessage(text)}
                className="flex items-center gap-2.5 text-left px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
                <span className="text-[13px]">{icon}</span>
                <span className="text-[11px] text-white/40 flex-1 truncate">{text}</span>
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Écris ton annonce pour tous les utilisateurs…"
            rows={3}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-[#8B5CF6]/40 resize-none transition-colors"
          />

          {/* Send */}
          <button onClick={handleSend} disabled={sending || !message.trim()}
            className={cn(
              "w-full py-3 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all",
              sent
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                : "bg-[#8B5CF6] text-white hover:bg-[#5B52E0] disabled:opacity-30 disabled:cursor-not-allowed"
            )}>
            {sent
              ? <><CheckCircle className="w-4 h-4" /> Envoyé à tous !</>
              : sending
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Envoi…</>
                : <><Send className="w-4 h-4" /> Envoyer à tous les utilisateurs</>}
          </button>
        </div>
      </Section>

    </div>
  );
}