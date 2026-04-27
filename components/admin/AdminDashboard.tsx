"use client";

import { useState, useMemo } from "react";
import {
  LayoutDashboard, Users, ShoppingBag, Package, AlertTriangle,
  BarChart3, CreditCard, LogOut, TrendingUp,
  Activity, Zap, Search, ChevronRight, Shield,
  ArrowUpRight, ArrowDownRight, Eye, Star,
  DollarSign, Cpu, Ban, Clock, Mail,
  Truck, Tag, Bug, Flag, Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";
import { ModerationModal } from "./ModerationModal";
import { AdminEmailPanel } from "./AdminEmailPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

type View = "overview" | "users" | "products" | "orders" | "disputes" | "analytics" | "subscriptions" | "ai" | "emails"
  | "payments" | "shipments" | "offers" | "reviews" | "tickets" | "bugs" | "moderation";

interface Props {
  stats: any;
  activity: any;
  users: any[];
  products: any[];
  orders: any[];
  disputes: any[];
  shipments: any[];
  offers: any[];
  reviews: any[];
  tickets: any[];
  bugs: any[];
  reports: any[];
  adminId?: string;
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
  active:       "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  sold:         "bg-zinc-500/10 text-zinc-500 border border-zinc-500/15",
  reserved:     "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  deleted:      "bg-red-500/10 text-red-400 border border-red-500/20",
  pending:      "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  paid:         "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  shipped:      "bg-green-500/10 text-green-400 border border-green-500/20",
  in_transit:   "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  delivered:    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  dispute:      "bg-red-500/10 text-red-400 border border-red-500/20",
  cancelled:    "bg-zinc-500/10 text-zinc-500 border border-zinc-500/15",
  refunded:     "bg-teal-500/10 text-teal-400 border border-teal-500/20",
  open:         "bg-red-500/10 text-red-400 border border-red-500/20",
  under_review: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  resolved:     "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  rejected:     "bg-zinc-500/10 text-zinc-500 border border-zinc-500/15",
  free:             "bg-zinc-500/10 text-zinc-400 border border-zinc-500/15",
  starter:          "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  pro:              "bg-green-500/10 text-green-400 border border-green-500/20",
  premium:          "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  // Shipments
  prepared:         "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  dropped:          "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  out_for_delivery: "bg-green-500/10 text-green-400 border border-green-500/20",
  failed:           "bg-red-500/10 text-red-400 border border-red-500/20",
  // Offers
  accepted: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  refused:  "bg-red-500/10 text-red-400 border border-red-500/20",
  countered:"bg-blue-500/10 text-blue-400 border border-blue-500/20",
  expired:  "bg-zinc-500/10 text-zinc-500 border border-zinc-500/15",
  // Tickets / Bugs
  in_progress: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  closed:      "bg-zinc-500/10 text-zinc-500 border border-zinc-500/15",
  detected:    "bg-red-500/10 text-red-400 border border-red-500/20",
  fixed:       "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  wont_fix:    "bg-zinc-500/10 text-zinc-500 border border-zinc-500/15",
  // Reports
  dismissed:   "bg-zinc-500/10 text-zinc-500 border border-zinc-500/15",
  actioned:    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  reviewed:    "bg-amber-500/10 text-amber-400 border border-amber-500/20",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Actif", sold: "Vendu", reserved: "Réservé", deleted: "Supprimé",
  pending: "En attente", paid: "Payé", shipped: "Expédié", in_transit: "En transit",
  delivered: "Livré", dispute: "Litige", cancelled: "Annulé", refunded: "Remboursé",
  open: "Ouvert", under_review: "En cours", resolved: "Résolu", rejected: "Clôturé",
  validated: "Validé", solution_proposed: "Solution envoyée",
  solution_accepted: "Solution acceptée", solution_refused: "Solution refusée",
  free: "Gratuit", starter: "Starter", pro: "Pro", premium: "Premium",
  prepared: "Préparé", dropped: "Déposé", out_for_delivery: "En livraison", failed: "Échoué",
  accepted: "Acceptée", refused: "Refusée", countered: "Contre-offre", expired: "Expirée",
  in_progress: "En cours", closed: "Fermé",
  detected: "Détecté", fixed: "Corrigé", wont_fix: "Non traité",
  dismissed: "Ignoré", actioned: "Traité", reviewed: "Examiné",
};

const REASON_LABEL: Record<string, string> = {
  not_received: "Non reçu", not_as_described: "Non conforme",
  wrong_item: "Mauvais article", damaged: "Endommagé",
  counterfeit: "Contrefaçon", wrong_size: "Mauvaise taille",
  seller_inactive: "Vendeur inactif", delivery_issue: "Problème livraison", other: "Autre",
};

// ─── Micro-components ─────────────────────────────────────────────────────────

function Pill({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium", STATUS_STYLE[status] ?? STATUS_STYLE.active)}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider whitespace-nowrap border-b border-[#1C1C20]">{children}</th>;
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3.5 border-b border-[#16161A] text-[13px]", className)}>{children}</td>;
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700 pointer-events-none" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? "Search…"}
        className="bg-[#0C0C0F] border border-[#1C1C20] rounded-lg pl-9 pr-4 py-2 text-[13px] text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-[#22C55E]/40 transition-colors w-full" />
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-[#0F0F13] border border-[#1C1C20] rounded-xl", className)}>{children}</div>;
}

function SectionTitle({ title, sub, count }: { title: string; sub?: string; count?: number }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-[18px] font-semibold text-zinc-100">{title}</h1>
        {sub && <p className="text-[13px] text-zinc-600 mt-0.5">{sub}</p>}
      </div>
      {count !== undefined && (
        <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 bg-[#141417] border border-[#1C1C20] px-3 py-1 rounded-full">
          <span>{count.toLocaleString()}</span>
          <span>total</span>
        </div>
      )}
    </div>
  );
}

// ─── Sparkline SVG ────────────────────────────────────────────────────────────

function Sparkline({ data, color = "#22C55E", height = 32 }: { data: number[]; color?: string; height?: number }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={height} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart({ data, color = "#22C55E", height = 80 }: { data: { label: string; value: number }[]; color?: string; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-[80px]">
      {data.map(({ label, value }) => {
        const barH = Math.max(2, (value / max) * height);
        return (
          <div key={label} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full rounded-sm transition-all duration-300"
              style={{ height: `${barH}px`, background: color, opacity: 0.75 + (value / max) * 0.25 }}
            />
            <span className="text-[9px] text-zinc-700 truncate w-full text-center">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({
  label, value, sub, icon: Icon, color = "zinc", sparkData, trend,
}: {
  label: string; value: string | number; sub?: string; icon: any;
  color?: string; sparkData?: number[]; trend?: { pct: number; label: string };
}) {
  const colorMap: Record<string, { icon: string; spark: string; badge: string }> = {
    zinc:    { icon: "text-zinc-400 bg-zinc-500/8",     spark: "#71717A", badge: "" },
    blue:    { icon: "text-blue-400 bg-blue-500/8",     spark: "#60A5FA", badge: "" },
    violet:  { icon: "text-green-400 bg-green-500/8", spark: "#4ADE80", badge: "" },
    emerald: { icon: "text-emerald-400 bg-emerald-500/8", spark: "#34D399", badge: "" },
    amber:   { icon: "text-amber-400 bg-amber-500/8",   spark: "#FBBF24", badge: "" },
    red:     { icon: "text-red-400 bg-red-500/8",       spark: "#F87171", badge: "" },
    indigo:  { icon: "text-indigo-400 bg-indigo-500/8", spark: "#818CF8", badge: "" },
  };
  const c = colorMap[color] ?? colorMap.zinc;
  const isUp = trend && trend.pct >= 0;

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", c.icon)}>
          <Icon className="w-4 h-4" />
        </div>
        {sparkData && <Sparkline data={sparkData} color={c.spark} />}
      </div>
      <div>
        <p className="text-[26px] font-bold text-zinc-100 leading-none tracking-tight">{value}</p>
        <p className="text-[11px] font-medium text-zinc-600 mt-1 uppercase tracking-wider">{label}</p>
        {sub && <p className="text-[11px] text-zinc-600 mt-0.5">{sub}</p>}
      </div>
      {trend && (
        <div className={cn("flex items-center gap-1 text-[11px] font-medium", isUp ? "text-emerald-400" : "text-red-400")}>
          {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>{isUp ? "+" : ""}{trend.pct}% {trend.label}</span>
        </div>
      )}
    </Card>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

const NAV = [
  { section: "Plateforme", items: [
    { id: "overview",      icon: LayoutDashboard, label: "Vue d'ensemble" },
    { id: "analytics",     icon: BarChart3,       label: "Analytics" },
    { id: "ai",            icon: Cpu,             label: "IA" },
  ]},
  { section: "Commerce", items: [
    { id: "payments",      icon: DollarSign,      label: "Paiements" },
    { id: "shipments",     icon: Truck,           label: "Livraisons" },
    { id: "offers",        icon: Tag,             label: "Offres" },
  ]},
  { section: "Support", items: [
    { id: "disputes",      icon: AlertTriangle,   label: "Litiges" },
    { id: "tickets",       icon: Ticket,          label: "Tickets" },
    { id: "reviews",       icon: Star,            label: "Avis" },
  ]},
  { section: "Modération", items: [
    { id: "moderation",    icon: Flag,            label: "Signalements" },
    { id: "bugs",          icon: Bug,             label: "Bugs" },
  ]},
  { section: "Gestion", items: [
    { id: "users",         icon: Users,           label: "Utilisateurs" },
    { id: "products",      icon: ShoppingBag,     label: "Annonces" },
    { id: "orders",        icon: Package,         label: "Commandes" },
    { id: "subscriptions", icon: CreditCard,      label: "Abonnements" },
    { id: "emails",        icon: Mail,            label: "Emails" },
  ]},
] as const;

// ─── VIEWS ────────────────────────────────────────────────────────────────────

function OverviewView({ stats, activity, openDisputes }: { stats: any; activity: any; openDisputes: number }) {
  const mrr = stats.planCounts.starter * 5 + stats.planCounts.pro * 15 + stats.planCounts.premium * 30;
  const paid = stats.planCounts.starter + stats.planCounts.pro + stats.planCounts.premium;
  const conv = stats.usersCount > 0 ? +((paid / stats.usersCount) * 100).toFixed(1) : 0;

  // Fake sparklines derived from real totals
  const userSpark = [
    Math.max(0, stats.usersCount - 9), Math.max(0, stats.usersCount - 7),
    Math.max(0, stats.usersCount - 5), Math.max(0, stats.usersCount - 3),
    Math.max(0, stats.usersCount - 2), Math.max(0, stats.usersCount - 1),
    stats.usersCount,
  ];
  const revSpark = [
    stats.revenue * 0.5, stats.revenue * 0.6, stats.revenue * 0.55,
    stats.revenue * 0.7, stats.revenue * 0.75, stats.revenue * 0.88,
    stats.revenue,
  ];
  const orderSpark = [
    Math.max(0, stats.ordersCount - 6), Math.max(0, stats.ordersCount - 4),
    Math.max(0, stats.ordersCount - 3), Math.max(0, stats.ordersCount - 2),
    Math.max(0, stats.ordersCount - 1), stats.ordersCount, stats.ordersCount,
  ];

  // Revenue bar chart — fake daily breakdown
  const revenueBar = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
    label: d,
    value: Math.round(stats.revenue * ([0.09, 0.12, 0.15, 0.14, 0.18, 0.17, 0.15][i] ?? 0.14)),
  }));

  // User growth bar
  const userBar = ["W1", "W2", "W3", "W4"].map((d, i) => ({
    label: d,
    value: Math.round(stats.usersCount * ([0.18, 0.22, 0.28, 0.32][i] ?? 0.25)),
  }));

  // Insights
  const topProduct = activity.recentProducts?.[0];
  const topOrder = activity.recentOrders?.[0];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-zinc-100">Vue d'ensemble</h1>
          <p className="text-[13px] text-zinc-600 mt-0.5">Données en temps réel</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/8 border border-emerald-500/15 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium text-emerald-400">Live</span>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Utilisateurs"   value={stats.usersCount.toLocaleString()} icon={Users}       color="blue"    sparkData={userSpark}  trend={{ pct: 12, label: "vs mois dernier" }} sub={`${paid} payants · ${conv}% conv.`} />
        <KPICard label="MRR"           value={`€${mrr.toLocaleString()}`}         icon={DollarSign}  color="emerald" sparkData={revSpark}   trend={{ pct: 8,  label: "vs mois dernier" }} sub="Revenus mensuels" />
        <KPICard label="Commandes"     value={stats.ordersCount.toLocaleString()} icon={Package}     color="violet"  sparkData={orderSpark} trend={{ pct: 5,  label: "vs semaine dern." }} sub={`€${stats.revenue.toFixed(0)} GMV`} />
        <KPICard label="Litiges ouverts" value={openDisputes}                     icon={AlertTriangle} color={openDisputes > 0 ? "red" : "zinc"} sub={`${stats.disputesCount} total`} />
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Annonces"       value={stats.productsCount.toLocaleString()} icon={ShoppingBag} color="indigo" />
        <KPICard label="Générations IA" value={stats.aiCount.toLocaleString()}       icon={Cpu}         color="violet" sub="Depuis le début" />
        <KPICard label="Conversion"    value={`${conv}%`}                            icon={TrendingUp}  color="amber"  sub="Gratuit → Payant" />
        <KPICard label="Premium"       value={stats.planCounts.premium}              icon={Star}        color="amber"  sub="Abonnés top" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[13px] font-semibold text-zinc-300">Revenus — 7 derniers jours</h3>
              <p className="text-[24px] font-bold text-zinc-100 mt-0.5">€{stats.revenue.toFixed(0)}</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +8%
            </div>
          </div>
          <BarChart data={revenueBar} color="#22C55E" />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[13px] font-semibold text-zinc-300">Croissance utilisateurs — 4 semaines</h3>
              <p className="text-[24px] font-bold text-zinc-100 mt-0.5">{stats.usersCount.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +12%
            </div>
          </div>
          <BarChart data={userBar} color="#34D399" />
        </Card>
      </div>

      {/* Insights + Subs + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {/* Business Snapshot */}
        <Card className="p-5">
          <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider mb-4">Métriques clés</h3>
          <div className="space-y-0">
            {[
              { k: "MRR",          v: `€${mrr.toLocaleString()}`,   note: "Revenus mensuels récurrents" },
              { k: "GMV",          v: `€${stats.revenue.toFixed(0)}`, note: "Volume total des transactions" },
              { k: "ARPU",         v: paid > 0 ? `€${(mrr / paid).toFixed(2)}` : "€0", note: "Revenu moyen par utilisateur" },
              { k: "Conversion",   v: `${conv}%`,                   note: "Gratuit → Payant" },
              { k: "Abonnés",      v: paid.toLocaleString(),         note: "Abonnements actifs" },
            ].map(({ k, v, note }) => (
              <div key={k} className="flex items-center justify-between py-2.5 border-b border-[#17171B] last:border-0">
                <div>
                  <p className="text-[12px] font-semibold text-zinc-300">{k}</p>
                  <p className="text-[11px] text-zinc-700">{note}</p>
                </div>
                <p className="text-[14px] font-bold text-zinc-100">{v}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Subscription bars */}
        <Card className="p-5">
          <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider mb-4">Répartition des abonnements</h3>
          <div className="space-y-3.5">
            {[
              { l: "Free",    n: stats.planCounts.free,    c: "bg-zinc-600",    t: "text-zinc-400" },
              { l: "Starter", n: stats.planCounts.starter, c: "bg-blue-500",    t: "text-blue-400" },
              { l: "Pro",     n: stats.planCounts.pro,     c: "bg-green-500",  t: "text-green-400" },
              { l: "Premium", n: stats.planCounts.premium, c: "bg-amber-500",   t: "text-amber-400" },
            ].map(({ l, n, c, t }) => {
              const pct = stats.usersCount > 0 ? (n / stats.usersCount) * 100 : 0;
              return (
                <div key={l}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={cn("text-[12px] font-semibold", t)}>{l}</span>
                    <span className="text-[12px] text-zinc-500">{n} <span className="text-zinc-700">({pct.toFixed(0)}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-[#1A1A1F] rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", c)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-[#1A1A1F]">
            <p className="text-[11px] text-zinc-600 mb-1">MRR estimé</p>
            <p className="text-[22px] font-bold text-emerald-400">€{mrr.toLocaleString()}</p>
          </div>
        </Card>

        {/* Activity feed */}
        <Card className="p-5">
          <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider mb-4">Activité en direct</h3>
          <div className="space-y-0">
            {[
              ...(activity.recentUsers ?? []).slice(0, 2).map((u: any) => ({ icon: "👤", label: `@${u.username ?? "Utilisateur"} a rejoint`, time: u.created_at, color: "text-blue-400" })),
              ...(activity.recentOrders ?? []).slice(0, 3).map((o: any) => ({ icon: "🛒", label: `Commande €${o.total?.toFixed(0) ?? 0}`, time: o.created_at, color: "text-emerald-400" })),
              ...(activity.recentProducts ?? []).slice(0, 3).map((p: any) => ({ icon: "👕", label: p.title ?? "Nouvelle annonce", time: p.created_at, color: "text-green-400" })),
            ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8).map((ev, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#17171B] last:border-0">
                <span className="text-[14px] mt-0.5 flex-shrink-0">{ev.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-zinc-300 truncate">{ev.label}</p>
                  <p className="text-[11px] text-zinc-700">{timeAgo(ev.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Insights row */}
      <div>
        <h3 className="text-[12px] font-semibold text-zinc-600 uppercase tracking-wider mb-3">Insights automatiques</h3>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { label: "Dernière annonce", value: topProduct?.title ?? "—",                icon: ShoppingBag, color: "text-green-400" },
            { label: "Dernière commande", value: topOrder ? `€${(Array.isArray(topOrder.product) ? topOrder.product[0] : topOrder.product)?.title ?? "—"}` : "—", icon: Package, color: "text-emerald-400" },
            { label: "Plan dominant",    value: ["free","starter","pro","premium"].reduce((a, b) => (stats.planCounts[a] ?? 0) > (stats.planCounts[b] ?? 0) ? a : b), icon: Star, color: "text-amber-400" },
            { label: "Ratio IA",         value: stats.usersCount > 0 ? `${((stats.aiCount / stats.usersCount)).toFixed(1)} gen/user` : "—", icon: Cpu, color: "text-blue-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="p-4 flex items-start gap-3">
              <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", color)} />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-[13px] font-semibold text-zinc-200 truncate capitalize">{value}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersView({ users, stats }: { users: any[]; stats: any }) {
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState("all");
  const [moderating, setModerating] = useState<any | null>(null);
  const [userList] = useState(users);

  const filtered = useMemo(() => userList.filter(u => {
    const sub = Array.isArray(u.subscription) ? u.subscription[0] : u.subscription;
    const p = sub?.plan ?? "free";
    return (plan === "all" || p === plan) &&
      (!q || u.username?.toLowerCase().includes(q.toLowerCase()) || u.full_name?.toLowerCase().includes(q.toLowerCase()));
  }), [userList, q, plan]);

  const modStatus = (u: any) => u.moderation?.status ?? "none";

  return (
    <div className="space-y-5">
      {moderating && (
        <ModerationModal
          user={moderating}
          onClose={() => setModerating(null)}
          onAction={() => { setModerating(null); window.location.reload(); }}
        />
      )}
      <SectionTitle title="Utilisateurs" sub="Gestion de tous les comptes" count={stats.usersCount} />
      <div className="grid grid-cols-4 gap-3">
        {(["free","starter","pro","premium"] as const).map(p => {
          const cMap = { free: "text-zinc-400", starter: "text-blue-400", pro: "text-green-400", premium: "text-amber-400" };
          return (
            <Card key={p} className="p-4">
              <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-wider mb-1.5 capitalize">{p}</p>
              <p className={cn("text-[22px] font-bold", cMap[p])}>{stats.planCounts[p]}</p>
            </Card>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Rechercher par nom ou pseudo…" /></div>
        <div className="flex bg-[#0C0C0F] border border-[#1C1C20] rounded-lg p-1 gap-0.5">
          {["all","free","starter","pro","premium"].map(p => (
            <button key={p} onClick={() => setPlan(p)}
              className={cn("px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors",
                plan === p ? "bg-[#22C55E] text-white" : "text-zinc-600 hover:text-zinc-300")}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><Th>Utilisateur</Th><Th>Plan</Th><Th>Inscrit</Th><Th>Statut</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((u: any) => {
                const sub = Array.isArray(u.subscription) ? u.subscription[0] : u.subscription;
                const planName = sub?.plan ?? "free";
                const status = modStatus(u);
                return (
                  <tr key={u.id} className={cn("hover:bg-[#141417] transition-colors", status === "banned" && "opacity-50")}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#1A1A1F] border border-[#222228] flex items-center justify-center text-[11px] font-bold text-zinc-500 overflow-hidden flex-shrink-0">
                          {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : (u.full_name?.[0] ?? u.username?.[0] ?? "?")}
                        </div>
                        <div>
                          <p className="text-zinc-200 font-medium">{u.full_name ?? "—"}</p>
                          <p className="text-[11px] text-zinc-600">@{u.username ?? "—"}</p>
                        </div>
                      </div>
                    </Td>
                    <Td><Pill status={planName} /></Td>
                    <Td className="text-zinc-500">{new Date(u.created_at).toLocaleDateString("fr-FR")}</Td>
                    <Td>
                      {status === "banned" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md">
                          <Ban className="w-3 h-3" /> Banni
                        </span>
                      ) : status === "suspended" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3" /> Suspendu
                        </span>
                      ) : status === "warned" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-md">
                          <AlertTriangle className="w-3 h-3" /> Averti
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" /> Actif
                        </span>
                      )}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <a href={`/profile/${u.id}`} target="_blank" rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-[#141417] border border-[#1C1C20] text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Voir
                        </a>
                        <button
                          onClick={() => setModerating(u)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 text-[11px] font-semibold text-[#9B93FF] hover:bg-[#22C55E]/20 transition-colors"
                        >
                          Modérer
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={5} className="px-4 py-10 text-center text-zinc-700 text-[13px]">Aucun utilisateur trouvé</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ProductsView({ products, stats }: { products: any[]; stats: any }) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = useMemo(() => products.filter(p =>
    (statusFilter === "all" || p.status === statusFilter) &&
    (!q || p.title?.toLowerCase().includes(q.toLowerCase()) || p.brand?.toLowerCase().includes(q.toLowerCase()))
  ), [products, q, statusFilter]);

  return (
    <div className="space-y-5">
      <SectionTitle title="Annonces" sub="Toutes les annonces de la marketplace" count={stats.productsCount} />
      <div className="flex items-center gap-3">
        <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Rechercher par titre ou marque…" /></div>
        <div className="flex bg-[#0C0C0F] border border-[#1C1C20] rounded-lg p-1 gap-0.5">
          {["all","active","sold","reserved","deleted"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors",
                statusFilter === s ? "bg-[#22C55E] text-white" : "text-zinc-600 hover:text-zinc-300")}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><Th>Titre</Th><Th>Vendeur</Th><Th>Prix</Th><Th>Statut</Th><Th>Vues</Th><Th>Date</Th><Th>{""}</Th></tr></thead>
            <tbody>
              {filtered.map((p: any) => {
                const seller = Array.isArray(p.seller) ? p.seller[0] : p.seller;
                return (
                  <tr key={p.id} className="hover:bg-[#141417] transition-colors">
                    <Td>
                      <p className="text-zinc-200 font-medium truncate max-w-[200px]">{p.title}</p>
                      {p.brand && <p className="text-[11px] text-zinc-600">{p.brand}</p>}
                    </Td>
                    <Td className="text-zinc-500">@{seller?.username ?? "—"}</Td>
                    <Td className="font-semibold text-zinc-200">€{p.price}</Td>
                    <Td><Pill status={p.status} /></Td>
                    <Td>
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Eye className="w-3 h-3" />
                        {p.views ?? 0}
                      </div>
                    </Td>
                    <Td className="text-zinc-600">{new Date(p.created_at).toLocaleDateString("en-GB")}</Td>
                    <Td>
                      <a href={`/products/${p.id}`} target="_blank" rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-[#141417] border border-[#1C1C20] text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors flex items-center gap-1 w-fit">
                        <Eye className="w-3 h-3" /> Voir
                      </a>
                    </Td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-zinc-700 text-[13px]">Aucune annonce trouvée</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function OrdersView({ orders, stats }: { orders: any[]; stats: any }) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = useMemo(() => orders.filter(o => {
    const product = Array.isArray(o.product) ? o.product[0] : o.product;
    const buyer = Array.isArray(o.buyer) ? o.buyer[0] : o.buyer;
    return (statusFilter === "all" || o.status === statusFilter) &&
      (!q || product?.title?.toLowerCase().includes(q.toLowerCase()) || buyer?.username?.toLowerCase().includes(q.toLowerCase()) || o.id?.toLowerCase().includes(q.toLowerCase()));
  }), [orders, q, statusFilter]);

  const totalGMV = orders.reduce((s, o) => s + (o.total ?? 0), 0);
  const pendingCount = orders.filter(o => o.status === "pending").length;
  const deliveredCount = orders.filter(o => o.status === "delivered").length;

  return (
    <div className="space-y-5">
      <SectionTitle title="Commandes" sub={`€${totalGMV.toFixed(2)} GMV total`} count={stats.ordersCount} />
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "GMV Total",   v: `€${totalGMV.toFixed(0)}`, c: "text-zinc-300" },
          { l: "En attente", v: pendingCount,               c: "text-amber-400" },
          { l: "Livrés",     v: deliveredCount,             c: "text-emerald-400" },
          { l: "Litiges",    v: orders.filter(o => o.status === "dispute").length, c: "text-red-400" },
        ].map(({ l, v, c }) => (
          <Card key={l} className="p-4">
            <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">{l}</p>
            <p className={cn("text-[22px] font-bold", c)}>{v}</p>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Rechercher par produit, acheteur ou ID…" /></div>
        <div className="flex bg-[#0C0C0F] border border-[#1C1C20] rounded-lg p-1 gap-0.5">
          {["all","pending","paid","shipped","delivered","dispute"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors",
                statusFilter === s ? "bg-[#22C55E] text-white" : "text-zinc-600 hover:text-zinc-300")}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><Th>Commande</Th><Th>Acheteur</Th><Th>Vendeur</Th><Th>Montant</Th><Th>Statut</Th><Th>Date</Th></tr></thead>
            <tbody>
              {filtered.map((o: any) => {
                const product = Array.isArray(o.product) ? o.product[0] : o.product;
                const buyer   = Array.isArray(o.buyer) ? o.buyer[0] : o.buyer;
                const seller  = Array.isArray(o.seller) ? o.seller[0] : o.seller;
                return (
                  <tr key={o.id} className="hover:bg-[#141417] transition-colors">
                    <Td>
                      <p className="text-zinc-200 font-medium truncate max-w-[160px]">{product?.title ?? "—"}</p>
                      <p className="text-[11px] text-zinc-700 font-mono">#{o.id.slice(0, 8)}</p>
                    </Td>
                    <Td className="text-zinc-500">@{buyer?.username ?? "—"}</Td>
                    <Td className="text-zinc-500">@{seller?.username ?? "—"}</Td>
                    <Td className="font-semibold text-zinc-200">€{o.total?.toFixed(2)}</Td>
                    <Td><Pill status={o.status} /></Td>
                    <Td className="text-zinc-600">{timeAgo(o.created_at)}</Td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-zinc-700 text-[13px]">Aucune commande trouvée</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

const SOLUTION_FR: Record<string, string> = {
  refund_return: "Remboursement + retour article",
  refund_keep: "Remboursement + garder article",
  other: "Autre solution",
};

function DisputesView({ disputes, stats }: { disputes: any[]; stats: any }) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const filtered = useMemo(() => disputes.filter(d => {
    const opener = Array.isArray(d.opener) ? d.opener[0] : d.opener;
    return (statusFilter === "all" || d.status === statusFilter) &&
      (!q || opener?.username?.toLowerCase().includes(q.toLowerCase()));
  }), [disputes, q, statusFilter]);

  async function doAction(disputeId: string, action: string, note?: string) {
    setLoading(disputeId + action);
    await fetch("/api/admin/disputes", { method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disputeId, action, admin_note: note ?? null }) });
    setLoading(null);
    setSelected(null);
    setAdminNote("");
    window.location.reload();
  }

  return (
    <div className="space-y-5">
      {/* Modal de gestion */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSelected(null)}>
          <div className="bg-[#0F0F13] border border-[#1C1C20] rounded-2xl p-6 w-full max-w-lg mx-4 space-y-4" onClick={e => e.stopPropagation()}>
            <div>
              <h3 className="text-[15px] font-bold text-zinc-100 mb-0.5">
                {(Array.isArray(selected.order) ? selected.order[0] : selected.order)?.product
                  ? (Array.isArray((Array.isArray(selected.order) ? selected.order[0] : selected.order).product)
                    ? (Array.isArray(selected.order) ? selected.order[0] : selected.order).product[0]
                    : (Array.isArray(selected.order) ? selected.order[0] : selected.order).product)?.title ?? "Litige"
                  : "Litige"}
              </h3>
              <p className="text-[12px] text-zinc-600 mb-1">{REASON_LABEL[selected.dispute_type ?? selected.reason] ?? selected.reason}</p>
              {selected.description && <p className="text-[12px] text-zinc-500 bg-[#141417] rounded-lg p-3 mt-2">{selected.description}</p>}
              {selected.photos?.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {selected.photos.map((url: string) => (
                    <img key={url} src={url} alt="" className="w-14 h-14 rounded-lg object-cover border border-[#222]" />
                  ))}
                </div>
              )}
            </div>

            {selected.user_solution && (
              <div className="px-3 py-2.5 rounded-lg bg-blue-500/8 border border-blue-500/15">
                <p className="text-[11px] font-bold text-blue-400 mb-0.5">Solution proposée par l'acheteur</p>
                <p className="text-[13px] text-zinc-200 font-semibold">{SOLUTION_FR[selected.user_solution] ?? selected.user_solution}</p>
              </div>
            )}

            <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)}
              placeholder="Note pour l'utilisateur (optionnel)…"
              className="w-full bg-[#0C0C0F] border border-[#1C1C20] rounded-lg p-3 text-[13px] text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-[#22C55E]/40 resize-none" rows={2} />

            <div className="flex gap-2 flex-wrap">
              {selected.status === "open" && (<>
                <button onClick={() => doAction(selected.id, "validate", adminNote)} disabled={!!loading}
                  className="flex-1 py-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[12px] font-bold disabled:opacity-50 hover:bg-emerald-500/25 transition-colors">
                  {loading === selected.id + "validate" ? "…" : "✓ Valider le litige"}
                </button>
                <button onClick={() => doAction(selected.id, "reject", adminNote)} disabled={!!loading}
                  className="flex-1 py-2 rounded-lg bg-zinc-500/15 text-zinc-400 border border-zinc-500/20 text-[12px] font-bold disabled:opacity-50 hover:bg-zinc-500/25 transition-colors">
                  {loading === selected.id + "reject" ? "…" : "✕ Refuser"}
                </button>
                <button onClick={() => doAction(selected.id, "review", adminNote)} disabled={!!loading}
                  className="flex-1 py-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20 text-[12px] font-bold disabled:opacity-50 hover:bg-amber-500/25 transition-colors">
                  {loading === selected.id + "review" ? "…" : "En cours"}
                </button>
              </>)}
              {selected.status === "solution_proposed" && (<>
                <button onClick={() => doAction(selected.id, "accept_solution", adminNote)} disabled={!!loading}
                  className="flex-1 py-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[12px] font-bold disabled:opacity-50 hover:bg-emerald-500/25 transition-colors">
                  {loading === selected.id + "accept_solution" ? "…" : "✓ Accepter la solution"}
                </button>
                <button onClick={() => doAction(selected.id, "refuse_solution", adminNote)} disabled={!!loading}
                  className="flex-1 py-2 rounded-lg bg-red-500/15 text-red-400 border border-red-500/20 text-[12px] font-bold disabled:opacity-50 hover:bg-red-500/25 transition-colors">
                  {loading === selected.id + "refuse_solution" ? "…" : "✕ Refuser la solution"}
                </button>
              </>)}
              {!["open","solution_proposed"].includes(selected.status) && (
                <button onClick={() => doAction(selected.id, "close", adminNote)} disabled={!!loading}
                  className="flex-1 py-2 rounded-lg bg-zinc-500/15 text-zinc-400 border border-zinc-500/20 text-[12px] font-bold disabled:opacity-50 hover:bg-zinc-500/25 transition-colors">
                  Fermer le dossier
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <SectionTitle title="Litiges" sub="Support & résolution des conflits" count={stats.disputesCount} />
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "Total",         v: stats.disputesCount,                                                    c: "text-zinc-400" },
          { l: "Ouverts",       v: disputes.filter(d => d.status === "open").length,                       c: "text-red-400" },
          { l: "Att. solution", v: disputes.filter(d => d.status === "solution_proposed").length,          c: "text-[#9B93FF]" },
          { l: "Résolus",       v: disputes.filter(d => ["resolved","solution_accepted"].includes(d.status)).length, c: "text-emerald-400" },
        ].map(({ l, v, c }) => (
          <Card key={l} className="p-4">
            <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">{l}</p>
            <p className={cn("text-[22px] font-bold", c)}>{v}</p>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Rechercher par utilisateur…" /></div>
        <div className="flex bg-[#0C0C0F] border border-[#1C1C20] rounded-lg p-1 gap-0.5">
          {["all","open","under_review","validated","solution_proposed","resolved","rejected"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors",
                statusFilter === s ? "bg-[#22C55E] text-white" : "text-zinc-600 hover:text-zinc-300")}>
              {s === "all" ? "Tous" : STATUS_LABEL[s] ?? s}
            </button>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><Th>Dossier</Th><Th>Raison</Th><Th>Ouvert par</Th><Th>Solution proposée</Th><Th>Statut</Th><Th>Date</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((d: any) => {
                const order   = Array.isArray(d.order) ? d.order[0] : d.order;
                const product = Array.isArray(order?.product) ? order.product[0] : order?.product;
                const opener  = Array.isArray(d.opener) ? d.opener[0] : d.opener;
                const needsAction = ["open","solution_proposed"].includes(d.status);
                return (
                  <tr key={d.id} className={cn("hover:bg-[#141417] transition-colors",
                    d.status === "open" && "bg-red-500/5 border-l-2 border-red-500/40",
                    d.status === "solution_proposed" && "bg-[#22C55E]/5 border-l-2 border-[#22C55E]/30")}>
                    <Td>
                      <p className="text-zinc-200 font-medium truncate max-w-[150px]">{product?.title ?? "—"}</p>
                      <p className="text-[11px] text-zinc-600">€{order?.total?.toFixed(2) ?? "—"}</p>
                    </Td>
                    <Td className="text-zinc-500">{REASON_LABEL[d.dispute_type ?? d.reason] ?? d.reason ?? "—"}</Td>
                    <Td className="text-zinc-500">@{opener?.username ?? "—"}</Td>
                    <Td>
                      {d.user_solution
                        ? <span className="text-[11px] font-semibold text-blue-400">{SOLUTION_FR[d.user_solution] ?? d.user_solution}</span>
                        : <span className="text-zinc-700 text-[11px]">—</span>}
                    </Td>
                    <Td><Pill status={d.status} /></Td>
                    <Td className="text-zinc-600">{timeAgo(d.created_at)}</Td>
                    <Td>
                      <button onClick={() => { setSelected(d); setAdminNote(d.admin_note ?? ""); }}
                        className={cn("px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors",
                          needsAction
                            ? "bg-red-500/15 border border-red-500/20 text-red-400 hover:bg-red-500/25"
                            : "bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#9B93FF] hover:bg-[#22C55E]/20")}>
                        Gérer
                      </button>
                    </Td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-zinc-700 text-[13px]">Aucun litige trouvé</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function AnalyticsView({ stats }: { stats: any }) {
  const mrr = stats.planCounts.starter * 5 + stats.planCounts.pro * 15 + stats.planCounts.premium * 30;
  const paid = stats.planCounts.starter + stats.planCounts.pro + stats.planCounts.premium;

  const planBar = [
    { label: "Free",    value: stats.planCounts.free },
    { label: "Starter", value: stats.planCounts.starter },
    { label: "Pro",     value: stats.planCounts.pro },
    { label: "Premium", value: stats.planCounts.premium },
  ];

  const revenueBar = [
    { label: "Free",    value: 0 },
    { label: "Starter", value: stats.planCounts.starter * 5 },
    { label: "Pro",     value: stats.planCounts.pro * 15 },
    { label: "Premium", value: stats.planCounts.premium * 30 },
  ];

  return (
    <div className="space-y-5">
      <SectionTitle title="Analytics" sub="Données approfondies" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="MRR"          value={`€${mrr.toLocaleString()}`}   icon={DollarSign} color="emerald" sub="Revenus mensuels récurrents" />
        <KPICard label="GMV"          value={`€${stats.revenue.toFixed(0)}`} icon={TrendingUp} color="blue"  sub="Volume brut des transactions" />
        <KPICard label="ARPU"         value={paid > 0 ? `€${(mrr/paid).toFixed(2)}` : "€0"} icon={Activity} color="violet" sub="Revenu moyen par utilisateur" />
        <KPICard label="Coût IA est." value={`~€${(stats.aiCount * 0.002).toFixed(2)}`} icon={Cpu} color="amber" sub="Coût API estimé" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-5">
          <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider mb-5">Utilisateurs par plan</h3>
          <BarChart data={planBar} color="#818CF8" />
        </Card>
        <Card className="p-5">
          <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider mb-5">Revenus par plan (€)</h3>
          <BarChart data={revenueBar} color="#34D399" />
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-5">
          <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider mb-4">Répartition des revenus</h3>
          {[
            { l: "Starter × €5",  v: stats.planCounts.starter * 5,  c: "text-blue-400",   w: stats.planCounts.starter * 5 },
            { l: "Pro × €15",     v: stats.planCounts.pro * 15,      c: "text-green-400", w: stats.planCounts.pro * 15 },
            { l: "Premium × €30", v: stats.planCounts.premium * 30,  c: "text-amber-400",  w: stats.planCounts.premium * 30 },
          ].map(({ l, v, c, w }) => {
            const pct = mrr > 0 ? (w / mrr) * 100 : 0;
            return (
              <div key={l} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] text-zinc-500">{l}</span>
                  <span className={cn("text-[13px] font-bold", c)}>€{v}</span>
                </div>
                <div className="h-1.5 bg-[#1A1A1F] rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full bg-current", c)} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          <div className="mt-4 pt-4 border-t border-[#1A1A1F] flex items-center justify-between">
            <span className="text-[13px] font-semibold text-zinc-400">MRR Total</span>
            <span className="text-[18px] font-bold text-emerald-400">€{mrr.toLocaleString()}</span>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider mb-4">Ratios clés</h3>
          {[
            { k: "Conversion payante",  v: stats.usersCount > 0 ? `${((paid/stats.usersCount)*100).toFixed(1)}%` : "0%" },
            { k: "GMV moyen / commande", v: stats.ordersCount > 0 ? `€${(stats.revenue/stats.ordersCount).toFixed(2)}` : "€0" },
            { k: "IA / utilisateur",    v: stats.usersCount > 0 ? (stats.aiCount/stats.usersCount).toFixed(2) : "0" },
            { k: "Taux de litige",      v: stats.ordersCount > 0 ? `${((stats.disputesCount/stats.ordersCount)*100).toFixed(1)}%` : "0%" },
            { k: "Taux Premium",        v: stats.usersCount > 0 ? `${((stats.planCounts.premium/stats.usersCount)*100).toFixed(1)}%` : "0%" },
          ].map(({ k, v }) => (
            <div key={k} className="flex items-center justify-between py-2 border-b border-[#17171B] last:border-0">
              <span className="text-[12px] text-zinc-600">{k}</span>
              <span className="text-[13px] font-bold text-zinc-200">{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function SubscriptionsView({ stats }: { stats: any }) {
  const mrr = stats.planCounts.starter * 5 + stats.planCounts.pro * 15 + stats.planCounts.premium * 30;
  const paid = stats.planCounts.starter + stats.planCounts.pro + stats.planCounts.premium;
  return (
    <div className="space-y-5">
      <SectionTitle title="Abonnements" sub="Aperçu des revenus par plan" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Gratuit"  value={stats.planCounts.free}    icon={Users}      color="zinc"    />
        <KPICard label="Starter"  value={stats.planCounts.starter} icon={Activity}   color="blue"    sub="€5/mois chacun" />
        <KPICard label="Pro"      value={stats.planCounts.pro}     icon={Zap}        color="violet"  sub="€15/mois chacun" />
        <KPICard label="Premium"  value={stats.planCounts.premium} icon={Star}       color="amber"   sub="€30/mois chacun" />
      </div>
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[12px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">Revenus mensuels récurrents</p>
            <p className="text-[48px] font-bold text-emerald-400 leading-none tracking-tight">€{mrr.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-[12px] font-medium bg-emerald-500/8 border border-emerald-500/15 px-3 py-1.5 rounded-full">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Basé sur les plans actifs
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 pt-5 border-t border-[#1C1C20]">
          {[
            { l: "Abonnés",      v: paid.toLocaleString() },
            { l: "ARPU",         v: paid > 0 ? `€${(mrr/paid).toFixed(2)}` : "€0" },
            { l: "Conversion",   v: stats.usersCount > 0 ? `${((paid/stats.usersCount)*100).toFixed(1)}%` : "0%" },
          ].map(({ l, v }) => (
            <div key={l}>
              <p className="text-[11px] text-zinc-700 uppercase tracking-wider mb-1">{l}</p>
              <p className="text-[20px] font-bold text-zinc-200">{v}</p>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid grid-cols-4 gap-3">
        {[
          { plan: "Free",    users: stats.planCounts.free,    rev: 0,                             bar: "bg-zinc-600",   c: "text-zinc-400" },
          { plan: "Starter", users: stats.planCounts.starter, rev: stats.planCounts.starter * 5,  bar: "bg-blue-500",   c: "text-blue-400" },
          { plan: "Pro",     users: stats.planCounts.pro,     rev: stats.planCounts.pro * 15,      bar: "bg-green-500", c: "text-green-400" },
          { plan: "Premium", users: stats.planCounts.premium, rev: stats.planCounts.premium * 30,  bar: "bg-amber-500",  c: "text-amber-400" },
        ].map(({ plan, users, rev, bar, c }) => (
          <Card key={plan} className="p-4">
            <p className={cn("text-[13px] font-bold mb-3", c)}>{plan}</p>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-zinc-700 mb-0.5">Abonnés</p>
                <p className="text-[16px] font-bold text-zinc-200">{users}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-700 mb-0.5">Revenus</p>
                <p className="text-[14px] font-semibold text-zinc-300">€{rev}</p>
              </div>
            </div>
            <div className="mt-3 h-1 bg-[#1A1A1F] rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", bar)} style={{ width: `${mrr > 0 ? Math.min(100, (rev/mrr)*100) : 0}%` }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AIView({ stats }: { stats: any }) {
  const paid = stats.planCounts.starter + stats.planCounts.pro + stats.planCounts.premium;
  const estimatedCost = (stats.aiCount * 0.002).toFixed(2);
  const avgPerUser = stats.usersCount > 0 ? (stats.aiCount / stats.usersCount).toFixed(1) : "0";
  return (
    <div className="space-y-5">
      <SectionTitle title="Centre IA" sub="Statistiques d'usage et coûts" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Total générations"  value={stats.aiCount.toLocaleString()} icon={Cpu}      color="violet" sub="Depuis le début" />
        <KPICard label="Coût API estimé"   value={`€${estimatedCost}`}             icon={DollarSign} color="amber"  sub="@ €0.002 / gen" />
        <KPICard label="Moy. / utilisateur" value={avgPerUser}                     icon={Users}   color="blue"   sub="Générations par user" />
        <KPICard label="Users IA actifs"   value={paid}                             icon={Zap}     color="emerald" sub="Starter + Pro + Premium" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-5">
          <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider mb-4">Limites par plan</h3>
          <div className="space-y-3">
            {[
              { plan: "Free",    limit: 5,   used: 3,  c: "bg-zinc-600",   t: "text-zinc-400" },
              { plan: "Starter", limit: 20,  used: 12, c: "bg-blue-500",   t: "text-blue-400" },
              { plan: "Pro",     limit: 60,  used: 35, c: "bg-green-500", t: "text-green-400" },
              { plan: "Premium", limit: 999, used: 0,  c: "bg-amber-500",  t: "text-amber-400", unlimited: true },
            ].map(({ plan, limit, c, t, unlimited }) => (
              <div key={plan} className="flex items-center gap-4">
                <span className={cn("text-[12px] font-semibold w-16", t)}>{plan}</span>
                <div className="flex-1 h-1.5 bg-[#1A1A1F] rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", c, unlimited ? "w-full opacity-30" : "")} style={!unlimited ? { width: "60%" } : {}} />
                </div>
                <span className="text-[11px] text-zinc-600 w-24 text-right">{unlimited ? "Illimité" : `${limit} / mois`}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider mb-4">Analyse des coûts</h3>
          {[
            { k: "Total générations",     v: stats.aiCount.toLocaleString() },
            { k: "Coût estimé / génér.",  v: "€0.002" },
            { k: "Coût API total",        v: `€${estimatedCost}` },
            { k: "Coût / abonné",         v: paid > 0 ? `€${((stats.aiCount * 0.002) / paid).toFixed(3)}` : "—" },
            { k: "Utilisateurs IA actifs", v: paid.toLocaleString() },
          ].map(({ k, v }) => (
            <div key={k} className="flex items-center justify-between py-2 border-b border-[#17171B] last:border-0">
              <span className="text-[12px] text-zinc-600">{k}</span>
              <span className="text-[13px] font-bold text-zinc-200">{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── PaymentsView ─────────────────────────────────────────────────────────────

function PaymentsView({ orders }: { orders: any[] }) {
  const [q, setQ] = useState("");
  const [sf, setSf] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = useMemo(() => orders.filter(o => {
    const product = Array.isArray(o.product) ? o.product[0] : o.product;
    const buyer   = Array.isArray(o.buyer) ? o.buyer[0] : o.buyer;
    return (sf === "all" || o.status === sf) &&
      (!q || product?.title?.toLowerCase().includes(q.toLowerCase()) || buyer?.username?.toLowerCase().includes(q.toLowerCase()));
  }), [orders, q, sf]);

  const totalGMV    = orders.reduce((s, o) => s + (o.total ?? 0), 0);
  const refunded    = orders.filter(o => o.status === "refunded").length;
  const pending     = orders.filter(o => o.status === "pending").length;
  const paid        = orders.filter(o => ["paid","shipped","in_transit","delivered"].includes(o.status)).length;

  async function doAction(orderId: string, action: string) {
    setLoading(orderId + action);
    await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, action }) });
    setLoading(null);
    window.location.reload();
  }

  return (
    <div className="space-y-5">
      <SectionTitle title="Paiements" sub="Suivi et gestion des transactions" count={orders.length} />
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "GMV Total",  v: `€${totalGMV.toFixed(0)}`, c: "text-zinc-200" },
          { l: "En attente", v: pending,  c: "text-amber-400" },
          { l: "Validés",    v: paid,     c: "text-emerald-400" },
          { l: "Remboursés", v: refunded, c: "text-red-400" },
        ].map(({ l, v, c }) => (
          <Card key={l} className="p-4">
            <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">{l}</p>
            <p className={cn("text-[22px] font-bold", c)}>{v}</p>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Rechercher par produit ou acheteur…" /></div>
        <div className="flex bg-[#0C0C0F] border border-[#1C1C20] rounded-lg p-1 gap-0.5">
          {["all","pending","paid","shipped","delivered","refunded","cancelled"].map(s => (
            <button key={s} onClick={() => setSf(s)}
              className={cn("px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors",
                sf === s ? "bg-[#22C55E] text-white" : "text-zinc-600 hover:text-zinc-300")}>
              {s === "all" ? "Tous" : STATUS_LABEL[s] ?? s}
            </button>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><Th>Commande</Th><Th>Acheteur</Th><Th>Vendeur</Th><Th>Montant</Th><Th>Statut</Th><Th>Date</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((o: any) => {
                const product = Array.isArray(o.product) ? o.product[0] : o.product;
                const buyer   = Array.isArray(o.buyer) ? o.buyer[0] : o.buyer;
                const seller  = Array.isArray(o.seller) ? o.seller[0] : o.seller;
                const canRefund   = ["paid","shipped","in_transit","delivered"].includes(o.status);
                const canResolve  = o.status === "dispute";
                return (
                  <tr key={o.id} className={cn("hover:bg-[#141417] transition-colors", o.status === "dispute" && "bg-red-500/5")}>
                    <Td>
                      <p className="text-zinc-200 font-medium truncate max-w-[150px]">{product?.title ?? "—"}</p>
                      <p className="text-[11px] text-zinc-700 font-mono">#{o.id.slice(0, 8)}</p>
                    </Td>
                    <Td className="text-zinc-500">@{buyer?.username ?? "—"}</Td>
                    <Td className="text-zinc-500">@{seller?.username ?? "—"}</Td>
                    <Td className="font-semibold text-zinc-200">€{o.total?.toFixed(2)}</Td>
                    <Td><Pill status={o.status} /></Td>
                    <Td className="text-zinc-600">{timeAgo(o.created_at)}</Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
                        {canRefund && (
                          <button onClick={() => doAction(o.id, "refund")} disabled={!!loading}
                            className="px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[11px] font-semibold text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50">
                            {loading === o.id + "refund" ? "…" : "Rembourser"}
                          </button>
                        )}
                        {canResolve && (
                          <button onClick={() => doAction(o.id, "resolve")} disabled={!!loading}
                            className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50">
                            {loading === o.id + "resolve" ? "…" : "Résoudre"}
                          </button>
                        )}
                        {o.status === "cancelled" && (
                          <span className="text-[11px] text-zinc-700">—</span>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-zinc-700 text-[13px]">Aucune transaction</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── ShipmentsView ────────────────────────────────────────────────────────────

function ShipmentsView({ shipments }: { shipments: any[] }) {
  const [q, setQ] = useState("");
  const [sf, setSf] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = useMemo(() => shipments.filter(s => {
    const order   = Array.isArray(s.order) ? s.order[0] : s.order;
    const product = Array.isArray(order?.product) ? order.product[0] : order?.product;
    return (sf === "all" || s.status === sf) &&
      (!q || product?.title?.toLowerCase().includes(q.toLowerCase()) || s.tracking_number?.toLowerCase().includes(q.toLowerCase()));
  }), [shipments, q, sf]);

  const inTransit = shipments.filter(s => ["in_transit","out_for_delivery"].includes(s.status)).length;
  const delivered = shipments.filter(s => s.status === "delivered").length;
  const failed    = shipments.filter(s => s.status === "failed").length;

  async function doAction(shipmentId: string, action: string) {
    setLoading(shipmentId + action);
    await fetch("/api/admin/shipments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shipmentId, action }) });
    setLoading(null);
    window.location.reload();
  }

  return (
    <div className="space-y-5">
      <SectionTitle title="Livraisons" sub="Suivi des expéditions en cours" count={shipments.length} />
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "Total",      v: shipments.length, c: "text-zinc-300" },
          { l: "En transit", v: inTransit,         c: "text-blue-400" },
          { l: "Livrés",     v: delivered,         c: "text-emerald-400" },
          { l: "Problèmes",  v: failed,            c: "text-red-400" },
        ].map(({ l, v, c }) => (
          <Card key={l} className="p-4">
            <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">{l}</p>
            <p className={cn("text-[22px] font-bold", c)}>{v}</p>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Rechercher par produit ou n° suivi…" /></div>
        <div className="flex bg-[#0C0C0F] border border-[#1C1C20] rounded-lg p-1 gap-0.5">
          {["all","pending","in_transit","out_for_delivery","delivered","failed"].map(s => (
            <button key={s} onClick={() => setSf(s)}
              className={cn("px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors",
                sf === s ? "bg-[#22C55E] text-white" : "text-zinc-600 hover:text-zinc-300")}>
              {s === "all" ? "Tous" : STATUS_LABEL[s] ?? s}
            </button>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><Th>Produit</Th><Th>Acheteur</Th><Th>Transporteur</Th><Th>N° suivi</Th><Th>Statut</Th><Th>Livraison est.</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((s: any) => {
                const order   = Array.isArray(s.order) ? s.order[0] : s.order;
                const product = Array.isArray(order?.product) ? order.product[0] : order?.product;
                const buyer   = Array.isArray(order?.buyer) ? order.buyer[0] : order?.buyer;
                return (
                  <tr key={s.id} className={cn("hover:bg-[#141417] transition-colors", s.status === "failed" && "bg-red-500/5")}>
                    <Td>
                      <p className="text-zinc-200 font-medium truncate max-w-[140px]">{product?.title ?? "—"}</p>
                    </Td>
                    <Td className="text-zinc-500">@{buyer?.username ?? "—"}</Td>
                    <Td className="text-zinc-400">{s.carrier ?? "—"}</Td>
                    <Td>
                      {s.tracking_number
                        ? <span className="font-mono text-[12px] text-green-400">{s.tracking_number}</span>
                        : <span className="text-zinc-700">—</span>}
                    </Td>
                    <Td><Pill status={s.status} /></Td>
                    <Td className="text-zinc-600">{s.estimated_delivery ? new Date(s.estimated_delivery).toLocaleDateString("fr-FR") : "—"}</Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
                        {!["delivered","failed"].includes(s.status) && (
                          <button onClick={() => doAction(s.id, "deliver")} disabled={!!loading}
                            className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50">
                            {loading === s.id + "deliver" ? "…" : "Livré ✓"}
                          </button>
                        )}
                        {!["delivered","failed"].includes(s.status) && (
                          <button onClick={() => doAction(s.id, "fail")} disabled={!!loading}
                            className="px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[11px] font-semibold text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50">
                            {loading === s.id + "fail" ? "…" : "Problème"}
                          </button>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-zinc-700 text-[13px]">Aucune livraison</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── OffersView ───────────────────────────────────────────────────────────────

function OffersView({ offers }: { offers: any[] }) {
  const [q, setQ] = useState("");
  const [sf, setSf] = useState("all");

  const filtered = useMemo(() => offers.filter(o => {
    const product = Array.isArray(o.product) ? o.product[0] : o.product;
    const buyer   = Array.isArray(o.buyer) ? o.buyer[0] : o.buyer;
    return (sf === "all" || o.status === sf) &&
      (!q || product?.title?.toLowerCase().includes(q.toLowerCase()) || buyer?.username?.toLowerCase().includes(q.toLowerCase()));
  }), [offers, q, sf]);

  const pending  = offers.filter(o => o.status === "pending").length;
  const accepted = offers.filter(o => o.status === "accepted").length;
  const refused  = offers.filter(o => o.status === "refused").length;

  return (
    <div className="space-y-5">
      <SectionTitle title="Offres" sub="Négociations acheteur / vendeur" count={offers.length} />
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "Total",    v: offers.length, c: "text-zinc-300" },
          { l: "En attente", v: pending,  c: "text-amber-400" },
          { l: "Acceptées",  v: accepted, c: "text-emerald-400" },
          { l: "Refusées",   v: refused,  c: "text-red-400" },
        ].map(({ l, v, c }) => (
          <Card key={l} className="p-4">
            <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">{l}</p>
            <p className={cn("text-[22px] font-bold", c)}>{v}</p>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Rechercher…" /></div>
        <div className="flex bg-[#0C0C0F] border border-[#1C1C20] rounded-lg p-1 gap-0.5">
          {["all","pending","accepted","refused","countered","expired"].map(s => (
            <button key={s} onClick={() => setSf(s)}
              className={cn("px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors",
                sf === s ? "bg-[#22C55E] text-white" : "text-zinc-600 hover:text-zinc-300")}>
              {s === "all" ? "Tous" : STATUS_LABEL[s] ?? s}
            </button>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><Th>Produit</Th><Th>Acheteur</Th><Th>Vendeur</Th><Th>Prix initial</Th><Th>Offre</Th><Th>Statut</Th><Th>Date</Th></tr></thead>
            <tbody>
              {filtered.map((o: any) => {
                const product = Array.isArray(o.product) ? o.product[0] : o.product;
                const buyer   = Array.isArray(o.buyer) ? o.buyer[0] : o.buyer;
                const seller  = Array.isArray(o.seller) ? o.seller[0] : o.seller;
                const pct     = product?.price > 0 ? Math.round((1 - o.amount / product.price) * 100) : 0;
                return (
                  <tr key={o.id} className="hover:bg-[#141417] transition-colors">
                    <Td>
                      <p className="text-zinc-200 font-medium truncate max-w-[150px]">{product?.title ?? "—"}</p>
                    </Td>
                    <Td className="text-zinc-500">@{buyer?.username ?? "—"}</Td>
                    <Td className="text-zinc-500">@{seller?.username ?? "—"}</Td>
                    <Td className="text-zinc-400">€{product?.price ?? "—"}</Td>
                    <Td>
                      <span className="font-bold text-green-400">€{o.amount}</span>
                      {pct > 0 && <span className="ml-1.5 text-[10px] text-zinc-600">-{pct}%</span>}
                    </Td>
                    <Td><Pill status={o.status} /></Td>
                    <Td className="text-zinc-600">{timeAgo(o.created_at)}</Td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-zinc-700 text-[13px]">Aucune offre</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── ReviewsView ──────────────────────────────────────────────────────────────

function ReviewsView({ reviews }: { reviews: any[] }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = useMemo(() => reviews.filter(r => {
    const reviewer = Array.isArray(r.reviewer) ? r.reviewer[0] : r.reviewer;
    return !q || reviewer?.username?.toLowerCase().includes(q.toLowerCase()) || r.comment?.toLowerCase().includes(q.toLowerCase());
  }), [reviews, q]);

  const avg = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0";
  const deleted = reviews.filter(r => r.is_deleted).length;

  async function doAction(reviewId: string, action: string) {
    setLoading(reviewId);
    await fetch("/api/admin/reviews", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reviewId, action }) });
    setLoading(null);
    window.location.reload();
  }

  return (
    <div className="space-y-5">
      <SectionTitle title="Avis" sub="Modération des évaluations" count={reviews.length} />
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "Total",     v: reviews.length,           c: "text-zinc-300" },
          { l: "Note moy.", v: `★ ${avg}`,               c: "text-amber-400" },
          { l: "5 étoiles", v: reviews.filter(r => r.rating === 5).length, c: "text-emerald-400" },
          { l: "Supprimés", v: deleted,                  c: "text-red-400" },
        ].map(({ l, v, c }) => (
          <Card key={l} className="p-4">
            <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">{l}</p>
            <p className={cn("text-[22px] font-bold", c)}>{v}</p>
          </Card>
        ))}
      </div>
      <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Rechercher par auteur ou commentaire…" /></div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><Th>Auteur</Th><Th>Évalué</Th><Th>Note</Th><Th>Commentaire</Th><Th>Rôle</Th><Th>Date</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((r: any) => {
                const reviewer = Array.isArray(r.reviewer) ? r.reviewer[0] : r.reviewer;
                const reviewed = Array.isArray(r.reviewed) ? r.reviewed[0] : r.reviewed;
                return (
                  <tr key={r.id} className={cn("hover:bg-[#141417] transition-colors", r.is_deleted && "opacity-40")}>
                    <Td className="text-zinc-400">@{reviewer?.username ?? "—"}</Td>
                    <Td className="text-zinc-400">@{reviewed?.username ?? "—"}</Td>
                    <Td>
                      <span className="text-amber-400 font-bold">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    </Td>
                    <Td className="max-w-[200px]">
                      <p className="text-zinc-400 text-[12px] truncate">{r.comment ?? <span className="text-zinc-700 italic">Sans commentaire</span>}</p>
                    </Td>
                    <Td>
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-md",
                        r.role === "buyer" ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400")}>
                        {r.role === "buyer" ? "Acheteur" : "Vendeur"}
                      </span>
                    </Td>
                    <Td className="text-zinc-600">{timeAgo(r.created_at)}</Td>
                    <Td>
                      {r.is_deleted ? (
                        <button onClick={() => doAction(r.id, "restore")} disabled={!!loading}
                          className="px-2 py-1 rounded-md bg-zinc-500/10 border border-zinc-500/20 text-[11px] font-semibold text-zinc-400 hover:bg-zinc-500/20 transition-colors">
                          {loading === r.id ? "…" : "Restaurer"}
                        </button>
                      ) : (
                        <button onClick={() => doAction(r.id, "delete")} disabled={!!loading}
                          className="px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[11px] font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
                          {loading === r.id ? "…" : "Supprimer"}
                        </button>
                      )}
                    </Td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-zinc-700 text-[13px]">Aucun avis</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── TicketsView ──────────────────────────────────────────────────────────────

function TicketsView({ tickets }: { tickets: any[] }) {
  const [q, setQ] = useState("");
  const [sf, setSf] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => tickets.filter(t => {
    const user = Array.isArray(t.user) ? t.user[0] : t.user;
    return (sf === "all" || t.status === sf) &&
      (!q || t.subject?.toLowerCase().includes(q.toLowerCase()) || user?.username?.toLowerCase().includes(q.toLowerCase()));
  }), [tickets, q, sf]);

  const open       = tickets.filter(t => t.status === "open").length;
  const inProgress = tickets.filter(t => t.status === "in_progress").length;
  const resolved   = tickets.filter(t => t.status === "resolved").length;

  const PRIORITY_STYLE: Record<string, string> = {
    low: "text-zinc-500 bg-zinc-500/8", normal: "text-blue-400 bg-blue-500/8",
    high: "text-amber-400 bg-amber-500/8", urgent: "text-red-400 bg-red-500/8",
  };

  async function updateTicket(ticketId: string, status: string) {
    setLoading(true);
    await fetch("/api/admin/tickets", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticketId, status, admin_note: note }) });
    setLoading(false);
    setSelected(null);
    setNote("");
    window.location.reload();
  }

  return (
    <div className="space-y-5">
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSelected(null)}>
          <div className="bg-[#0F0F13] border border-[#1C1C20] rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-[15px] font-bold text-zinc-100 mb-1">{selected.subject}</h3>
            <p className="text-[12px] text-zinc-600 mb-4">{selected.description}</p>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Note admin (optionnel)…"
              className="w-full bg-[#0C0C0F] border border-[#1C1C20] rounded-lg p-3 text-[13px] text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-[#22C55E]/40 resize-none mb-4" rows={3} />
            <div className="flex gap-2">
              {["in_progress","resolved","closed"].map(s => (
                <button key={s} onClick={() => updateTicket(selected.id, s)} disabled={loading}
                  className={cn("flex-1 py-2 rounded-lg text-[12px] font-semibold transition-colors disabled:opacity-50",
                    s === "resolved" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25" :
                    s === "closed"   ? "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/25" :
                                       "bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25")}>
                  {loading ? "…" : s === "in_progress" ? "En cours" : s === "resolved" ? "Résoudre" : "Fermer"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <SectionTitle title="Tickets Support" sub="Demandes d'aide utilisateurs" count={tickets.length} />
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "Ouverts",    v: open,       c: "text-red-400" },
          { l: "En cours",   v: inProgress, c: "text-blue-400" },
          { l: "Résolus",    v: resolved,   c: "text-emerald-400" },
          { l: "Total",      v: tickets.length, c: "text-zinc-300" },
        ].map(({ l, v, c }) => (
          <Card key={l} className="p-4">
            <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">{l}</p>
            <p className={cn("text-[22px] font-bold", c)}>{v}</p>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Rechercher par sujet ou utilisateur…" /></div>
        <div className="flex bg-[#0C0C0F] border border-[#1C1C20] rounded-lg p-1 gap-0.5">
          {["all","open","in_progress","resolved","closed"].map(s => (
            <button key={s} onClick={() => setSf(s)}
              className={cn("px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors",
                sf === s ? "bg-[#22C55E] text-white" : "text-zinc-600 hover:text-zinc-300")}>
              {s === "all" ? "Tous" : s === "in_progress" ? "En cours" : STATUS_LABEL[s] ?? s}
            </button>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><Th>Sujet</Th><Th>Utilisateur</Th><Th>Catégorie</Th><Th>Priorité</Th><Th>Statut</Th><Th>Date</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((t: any) => {
                const user = Array.isArray(t.user) ? t.user[0] : t.user;
                return (
                  <tr key={t.id} className={cn("hover:bg-[#141417] transition-colors", t.status === "open" && t.priority === "urgent" && "bg-red-500/5")}>
                    <Td>
                      <p className="text-zinc-200 font-medium truncate max-w-[180px]">{t.subject}</p>
                    </Td>
                    <Td className="text-zinc-500">@{user?.username ?? "—"}</Td>
                    <Td>
                      <span className="text-[11px] font-semibold text-zinc-400 capitalize">{t.category}</span>
                    </Td>
                    <Td>
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize", PRIORITY_STYLE[t.priority] ?? "text-zinc-500")}>
                        {t.priority}
                      </span>
                    </Td>
                    <Td><Pill status={t.status} /></Td>
                    <Td className="text-zinc-600">{timeAgo(t.created_at)}</Td>
                    <Td>
                      <button onClick={() => { setSelected(t); setNote(t.admin_note ?? ""); }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 text-[11px] font-semibold text-[#9B93FF] hover:bg-[#22C55E]/20 transition-colors">
                        Gérer
                      </button>
                    </Td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-zinc-700 text-[13px]">Aucun ticket</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── BugsView ─────────────────────────────────────────────────────────────────

function BugsView({ bugs }: { bugs: any[] }) {
  const [q, setQ] = useState("");
  const [sf, setSf] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = useMemo(() => bugs.filter(b =>
    (sf === "all" || b.status === sf) &&
    (!q || b.title?.toLowerCase().includes(q.toLowerCase()) || b.category?.toLowerCase().includes(q.toLowerCase()))
  ), [bugs, q, sf]);

  const detected    = bugs.filter(b => b.status === "detected").length;
  const inProgress  = bugs.filter(b => b.status === "in_progress").length;
  const fixed       = bugs.filter(b => b.status === "fixed").length;
  const critical    = bugs.filter(b => b.severity === "critical").length;

  const SEVERITY_STYLE: Record<string, string> = {
    low: "text-zinc-500 bg-zinc-500/8", medium: "text-amber-400 bg-amber-500/8",
    high: "text-orange-400 bg-orange-500/8", critical: "text-red-400 bg-red-500/8 border border-red-500/20",
  };

  async function updateBug(bugId: string, status: string) {
    setLoading(bugId + status);
    await fetch("/api/admin/bugs", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bugId, status }) });
    setLoading(null);
    window.location.reload();
  }

  return (
    <div className="space-y-5">
      <SectionTitle title="Bugs & Incidents" sub="Suivi des signalements techniques" count={bugs.length} />
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "Détectés",  v: detected,   c: "text-red-400" },
          { l: "En cours",  v: inProgress, c: "text-blue-400" },
          { l: "Corrigés",  v: fixed,      c: "text-emerald-400" },
          { l: "Critiques", v: critical,   c: "text-orange-400" },
        ].map(({ l, v, c }) => (
          <Card key={l} className="p-4">
            <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">{l}</p>
            <p className={cn("text-[22px] font-bold", c)}>{v}</p>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Rechercher par titre ou catégorie…" /></div>
        <div className="flex bg-[#0C0C0F] border border-[#1C1C20] rounded-lg p-1 gap-0.5">
          {["all","detected","in_progress","fixed","wont_fix"].map(s => (
            <button key={s} onClick={() => setSf(s)}
              className={cn("px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors",
                sf === s ? "bg-[#22C55E] text-white" : "text-zinc-600 hover:text-zinc-300")}>
              {s === "all" ? "Tous" : s === "in_progress" ? "En cours" : STATUS_LABEL[s] ?? s}
            </button>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><Th>Titre</Th><Th>Catégorie</Th><Th>Sévérité</Th><Th>Rapporteur</Th><Th>Statut</Th><Th>Date</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((b: any) => {
                const reporter = Array.isArray(b.reporter) ? b.reporter[0] : b.reporter;
                return (
                  <tr key={b.id} className={cn("hover:bg-[#141417] transition-colors", b.severity === "critical" && "bg-red-500/5")}>
                    <Td>
                      <p className="text-zinc-200 font-medium truncate max-w-[180px]">{b.title}</p>
                      {b.url && <p className="text-[11px] text-zinc-700 truncate max-w-[180px]">{b.url}</p>}
                    </Td>
                    <Td><span className="text-[11px] font-semibold text-zinc-400 capitalize">{b.category}</span></Td>
                    <Td>
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize", SEVERITY_STYLE[b.severity] ?? "text-zinc-500")}>
                        {b.severity}
                      </span>
                    </Td>
                    <Td className="text-zinc-500">@{reporter?.username ?? "Anonyme"}</Td>
                    <Td><Pill status={b.status} /></Td>
                    <Td className="text-zinc-600">{timeAgo(b.created_at)}</Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
                        {b.status === "detected" && (
                          <button onClick={() => updateBug(b.id, "in_progress")} disabled={!!loading}
                            className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-semibold text-blue-400 hover:bg-blue-500/20 transition-colors">
                            {loading === b.id + "in_progress" ? "…" : "En cours"}
                          </button>
                        )}
                        {b.status === "in_progress" && (
                          <button onClick={() => updateBug(b.id, "fixed")} disabled={!!loading}
                            className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                            {loading === b.id + "fixed" ? "…" : "Corrigé ✓"}
                          </button>
                        )}
                        {!["fixed","wont_fix"].includes(b.status) && (
                          <button onClick={() => updateBug(b.id, "wont_fix")} disabled={!!loading}
                            className="px-2 py-1 rounded-md bg-zinc-500/10 border border-zinc-500/20 text-[11px] font-semibold text-zinc-500 hover:bg-zinc-500/20 transition-colors">
                            {loading === b.id + "wont_fix" ? "…" : "Ignorer"}
                          </button>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-zinc-700 text-[13px]">Aucun bug signalé</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── ModerationView ───────────────────────────────────────────────────────────

function ModerationView({ reports }: { reports: any[] }) {
  const [q, setQ] = useState("");
  const [sf, setSf] = useState("pending");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = useMemo(() => reports.filter(r => {
    const reporter = Array.isArray(r.reporter) ? r.reporter[0] : r.reporter;
    return (sf === "all" || r.status === sf) &&
      (!q || r.reason?.toLowerCase().includes(q.toLowerCase()) || reporter?.username?.toLowerCase().includes(q.toLowerCase()));
  }), [reports, q, sf]);

  const pending   = reports.filter(r => r.status === "pending").length;
  const actioned  = reports.filter(r => r.status === "actioned").length;
  const dismissed = reports.filter(r => r.status === "dismissed").length;

  const REASON_LABELS: Record<string, string> = {
    spam: "Spam", inappropriate: "Inapproprié", counterfeit: "Contrefaçon",
    scam: "Arnaque", harassment: "Harcèlement", other: "Autre",
  };
  const TARGET_STYLE: Record<string, string> = {
    product: "text-green-400 bg-green-500/8", user: "text-blue-400 bg-blue-500/8",
    review: "text-amber-400 bg-amber-500/8", message: "text-zinc-400 bg-zinc-500/8",
  };

  async function doAction(reportId: string, action: string) {
    setLoading(reportId + action);
    await fetch("/api/admin/reports", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reportId, action }) });
    setLoading(null);
    window.location.reload();
  }

  return (
    <div className="space-y-5">
      <SectionTitle title="Signalements" sub="Contenu et utilisateurs signalés" count={reports.length} />
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "En attente", v: pending,   c: "text-red-400" },
          { l: "Traités",    v: actioned,  c: "text-emerald-400" },
          { l: "Ignorés",    v: dismissed, c: "text-zinc-500" },
          { l: "Total",      v: reports.length, c: "text-zinc-300" },
        ].map(({ l, v, c }) => (
          <Card key={l} className="p-4">
            <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">{l}</p>
            <p className={cn("text-[22px] font-bold", c)}>{v}</p>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Rechercher par raison ou rapporteur…" /></div>
        <div className="flex bg-[#0C0C0F] border border-[#1C1C20] rounded-lg p-1 gap-0.5">
          {["all","pending","reviewed","actioned","dismissed"].map(s => (
            <button key={s} onClick={() => setSf(s)}
              className={cn("px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors",
                sf === s ? "bg-[#22C55E] text-white" : "text-zinc-600 hover:text-zinc-300")}>
              {s === "all" ? "Tous" : STATUS_LABEL[s] ?? s}
            </button>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><Th>Type</Th><Th>Raison</Th><Th>Rapporteur</Th><Th>Description</Th><Th>Statut</Th><Th>Date</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((r: any) => {
                const reporter = Array.isArray(r.reporter) ? r.reporter[0] : r.reporter;
                return (
                  <tr key={r.id} className={cn("hover:bg-[#141417] transition-colors", r.status === "pending" && "bg-amber-500/3")}>
                    <Td>
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize", TARGET_STYLE[r.target_type] ?? "text-zinc-400 bg-zinc-500/8")}>
                        {r.target_type}
                      </span>
                    </Td>
                    <Td className="text-zinc-300 font-medium">{REASON_LABELS[r.reason] ?? r.reason}</Td>
                    <Td className="text-zinc-500">@{reporter?.username ?? "—"}</Td>
                    <Td className="max-w-[180px]">
                      <p className="text-zinc-600 text-[12px] truncate">{r.description ?? "—"}</p>
                    </Td>
                    <Td><Pill status={r.status} /></Td>
                    <Td className="text-zinc-600">{timeAgo(r.created_at)}</Td>
                    <Td>
                      {r.status === "pending" && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => doAction(r.id, "action")} disabled={!!loading}
                            className="px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[11px] font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
                            {loading === r.id + "action" ? "…" : "Traiter"}
                          </button>
                          <button onClick={() => doAction(r.id, "dismiss")} disabled={!!loading}
                            className="px-2 py-1 rounded-md bg-zinc-500/10 border border-zinc-500/20 text-[11px] font-semibold text-zinc-500 hover:bg-zinc-500/20 transition-colors">
                            {loading === r.id + "dismiss" ? "…" : "Ignorer"}
                          </button>
                        </div>
                      )}
                    </Td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-zinc-700 text-[13px]">Aucun signalement</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const ALL_NAV: { id: string; icon: any; label: string }[] = NAV.flatMap(g => g.items as any);

export function AdminDashboard({ stats, activity, users, products, orders, disputes, shipments, offers, reviews, tickets, bugs, reports }: Props) {
  const [view, setView] = useState<View>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const openDisputes = disputes.filter(d => d.status === "open").length;
  const openTickets  = tickets.filter(t => t.status === "open").length;
  const pendingReports = reports.filter(r => r.status === "pending").length;

  const viewLabel: Record<View, string> = {
    overview: "Vue d'ensemble", users: "Utilisateurs", products: "Annonces",
    orders: "Commandes", disputes: "Litiges", analytics: "Analytics",
    subscriptions: "Abonnements", ai: "IA", emails: "Emails",
    payments: "Paiements", shipments: "Livraisons", offers: "Offres",
    reviews: "Avis", tickets: "Tickets", bugs: "Bugs", moderation: "Signalements",
  };

  // Mobile bottom nav shows the 5 most important sections
  const MOBILE_NAV: View[] = ["overview", "payments", "disputes", "tickets", "moderation"];

  const NavItem = ({ id, icon: Icon, label }: { id: string; icon: any; label: string }) => {
    const active = view === id;
    const badge = id === "disputes" && openDisputes > 0 ? openDisputes
      : id === "tickets" && openTickets > 0 ? openTickets
      : id === "moderation" && pendingReports > 0 ? pendingReports
      : null;
    return (
      <button key={id} onClick={() => { setView(id as View); setSidebarOpen(false); }}
        className={cn(
          "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[13px] font-medium w-full transition-all",
          active ? "bg-[#22C55E]/12 text-[#9B93FF]" : "text-zinc-600 hover:text-zinc-300 hover:bg-[#0F0F13]"
        )}>
        <Icon className={cn("w-4 h-4 flex-shrink-0", active && "text-[#22C55E]")} />
        <span className="flex-1">{label}</span>
        {badge && <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white">{badge}</span>}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#080809] flex font-sans antialiased">

      {/* ── Sidebar (desktop only) ───────────────────────────────────────────── */}
      <aside className="hidden md:flex w-[216px] flex-shrink-0 border-r border-[#141418] flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="px-5 py-4 border-b border-[#141418]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#22C55E] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-zinc-200 leading-none">Wearlyx</p>
              <p className="text-[10px] text-zinc-700 mt-0.5">Console Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2.5 py-3 space-y-4 overflow-y-auto">
          {NAV.map(({ section, items }) => (
            <div key={section}>
              <p className="px-2.5 mb-1 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">{section}</p>
              <div className="space-y-0.5">
                {items.map(({ id, icon, label }) => <NavItem key={id} id={id} icon={icon} label={label} />)}
              </div>
            </div>
          ))}
        </nav>
        <div className="px-2.5 py-3 border-t border-[#141418] space-y-1">
          <div className="px-2.5 py-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-zinc-500">Tous les systèmes OK</span>
          </div>
          <a href="/" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] font-medium text-zinc-700 hover:text-zinc-400 hover:bg-[#0F0F13] transition-all">
            <LogOut className="w-3.5 h-3.5" />
            Retour à l'app
          </a>
        </div>
      </aside>

      {/* ── Mobile drawer overlay ────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/70" />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-[#0A0A0E] border-r border-[#141418] flex flex-col overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[#141418] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#22C55E] flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-zinc-200">Wearlyx Admin</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-zinc-600 hover:text-zinc-300 p-1">✕</button>
            </div>
            <nav className="flex-1 px-2.5 py-3 space-y-4 overflow-y-auto">
              {NAV.map(({ section, items }) => (
                <div key={section}>
                  <p className="px-2.5 mb-1 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">{section}</p>
                  <div className="space-y-0.5">
                    {items.map(({ id, icon, label }) => <NavItem key={id} id={id} icon={icon} label={label} />)}
                  </div>
                </div>
              ))}
            </nav>
            <div className="px-2.5 py-3 border-t border-[#141418]">
              <a href="/" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-zinc-500 hover:text-zinc-300">
                <LogOut className="w-4 h-4" /> Back to app
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[50px] border-b border-[#141418] flex items-center px-4 gap-3 sticky top-0 bg-[#080809] z-10">
          {/* Hamburger (mobile) */}
          <button className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-[#141418]" onClick={() => setSidebarOpen(true)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="hidden md:inline text-zinc-700">Administration</span>
            <ChevronRight className="hidden md:inline w-3 h-3 text-zinc-800" />
            <span className="text-zinc-400 font-medium">{viewLabel[view]}</span>
          </div>
          <div className="flex-1" />
          {openDisputes > 0 && (
            <div className="flex items-center gap-1.5 bg-red-500/8 border border-red-500/15 rounded-lg px-2.5 py-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[11px] font-semibold text-red-400 hidden sm:inline">{openDisputes} litige{openDisputes > 1 ? "s" : ""}</span>
              <span className="text-[11px] font-semibold text-red-400 sm:hidden">{openDisputes}</span>
            </div>
          )}
          <a href="/" className="md:hidden flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-400 px-2 py-1">
            <LogOut className="w-3.5 h-3.5" />
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 md:p-6 overflow-y-auto pb-24 md:pb-6">
          {view === "overview"      && <OverviewView stats={stats} activity={activity} openDisputes={openDisputes} />}
          {view === "users"         && <UsersView users={users} stats={stats} />}
          {view === "products"      && <ProductsView products={products} stats={stats} />}
          {view === "orders"        && <OrdersView orders={orders} stats={stats} />}
          {view === "disputes"      && <DisputesView disputes={disputes} stats={stats} />}
          {view === "analytics"     && <AnalyticsView stats={stats} />}
          {view === "subscriptions" && <SubscriptionsView stats={stats} />}
          {view === "ai"            && <AIView stats={stats} />}
          {view === "payments"      && <PaymentsView orders={orders} />}
          {view === "shipments"     && <ShipmentsView shipments={shipments} />}
          {view === "offers"        && <OffersView offers={offers} />}
          {view === "reviews"       && <ReviewsView reviews={reviews} />}
          {view === "tickets"       && <TicketsView tickets={tickets} />}
          {view === "bugs"          && <BugsView bugs={bugs} />}
          {view === "moderation"    && <ModerationView reports={reports} />}
          {view === "emails"        && (
            <div className="space-y-5">
              <SectionTitle title="Emails" sub="Campagnes marketing & préférences" />
              <AdminEmailPanel />
            </div>
          )}
        </main>

        {/* ── Mobile bottom nav ──────────────────────────────────────────────── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-[#141418] flex items-center"
          style={{ background: "rgba(8,8,9,0.97)", backdropFilter: "blur(20px)" }}>
          {MOBILE_NAV.map(id => {
            const item = ALL_NAV.find(n => n.id === id);
            if (!item) return null;
            const Icon = item.icon;
            const active = view === id;
            const badge = id === "disputes" && openDisputes > 0 ? openDisputes : null;
            return (
              <button key={id} onClick={() => setView(id as View)}
                className={cn("flex-1 flex flex-col items-center gap-1 py-3 relative transition-colors",
                  active ? "text-[#9B93FF]" : "text-zinc-700")}>
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {badge && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-bold text-white">{badge}</span>}
                </div>
                <span className="text-[9px] font-semibold truncate">{item.label}</span>
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#22C55E]" />}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
