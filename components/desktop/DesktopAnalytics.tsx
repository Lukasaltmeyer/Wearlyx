"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp, TrendingDown, Eye, Heart, ShoppingBag, Star,
  Users, Package, ArrowLeft, BarChart2, Zap, ChevronRight,
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[] | null;
  status: string;
  created_at: string;
  views_count?: number;
  likes?: { count: number }[];
}

interface Order {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  product_id: string;
}

interface Props {
  userId: string;
  products: Product[];
  orders: Order[];
  salesCount: number;
  followersCount: number;
}

function fmtEur(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

type Period = "7j" | "30j" | "90j";

const PERIOD_DAYS: Record<Period, number> = { "7j": 7, "30j": 30, "90j": 90 };

function StatCard({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; color: string; trend?: number;
}) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, padding: "20px 22px",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}28` }}>
          <Icon style={{ width: 18, height: 18, color }} />
        </div>
        {trend !== undefined && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: trend >= 0 ? "#10B981" : "#EF4444" }}>
            {trend >= 0 ? <TrendingUp style={{ width: 13, height: 13 }} /> : <TrendingDown style={{ width: 13, height: 13 }} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p style={{ fontSize: 24, fontWeight: 800, color: "rgba(255,255,255,0.92)", margin: "0 0 3px" }}>{value}</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", margin: 0 }}>{label}</p>
        {sub && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.24)", margin: "3px 0 0" }}>{sub}</p>}
      </div>
    </div>
  );
}

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.07)", flex: 1 }}>
      <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: "linear-gradient(90deg,#8B5CF6,#7C3AED)", transition: "width 0.4s" }} />
    </div>
  );
}

export function DesktopAnalytics({ products, orders, salesCount, followersCount }: Props) {
  const [period, setPeriod] = useState<Period>("30j");

  const periodDays = PERIOD_DAYS[period];
  const cutoff = new Date(Date.now() - periodDays * 86400 * 1000);

  const recentOrders = useMemo(
    () => orders.filter(o => new Date(o.created_at) >= cutoff),
    [orders, period]
  );

  const totalRevenue = recentOrders
    .filter(o => ["delivered", "paid", "shipped", "in_transit"].includes(o.status))
    .reduce((sum, o) => sum + (o.total_price ?? 0), 0);

  const totalViews = products.reduce((sum, p) => sum + (p.views_count ?? 0), 0);
  const totalLikes = products.reduce((sum, p) => sum + (p.likes?.[0]?.count ?? 0), 0);
  const activeListings = products.filter(p => p.status === "active").length;

  // Top products by views
  const topByViews = [...products]
    .sort((a, b) => (b.views_count ?? 0) - (a.views_count ?? 0))
    .slice(0, 8);

  const maxViews = topByViews[0]?.views_count ?? 1;

  // Revenue by week bucket for mini sparkline bars
  const weekBuckets = useMemo(() => {
    const buckets: number[] = Array(periodDays).fill(0);
    recentOrders
      .filter(o => ["delivered", "paid", "shipped", "in_transit"].includes(o.status))
      .forEach(o => {
        const dayAgo = Math.floor((Date.now() - new Date(o.created_at).getTime()) / 86400000);
        if (dayAgo < periodDays) buckets[periodDays - 1 - dayAgo] += o.total_price ?? 0;
      });
    // Collapse into ~7 bars
    const step = Math.max(1, Math.floor(periodDays / 7));
    const bars: number[] = [];
    for (let i = 0; i < periodDays; i += step) {
      bars.push(buckets.slice(i, i + step).reduce((a, b) => a + b, 0));
    }
    return bars;
  }, [recentOrders, periodDays]);

  const maxBar = Math.max(...weekBuckets, 1);

  // Sold product ids
  const soldProductIds = new Set(orders.filter(o => o.status !== "cancelled").map(o => o.product_id));

  // Conversion rate (sold / total active + sold)
  const conversionRate = products.length > 0 ? Math.round((soldProductIds.size / products.length) * 100) : 0;

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#0A0A0F", minHeight: "100vh", padding: "0 0 60px" }}>
      {/* Header */}
      <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/profile/menu" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
          <ArrowLeft style={{ width: 16, height: 16 }} />
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "white", margin: 0 }}>Analytiques</h1>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", margin: "2px 0 0" }}>Performance de ta boutique</p>
        </div>
        {/* Period selector */}
        <div style={{ display: "flex", gap: 4, padding: "4px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {(["7j", "30j", "90j"] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "6px 14px", borderRadius: 7, fontSize: 12.5, fontWeight: 700, cursor: "pointer", border: "none",
              background: period === p ? "rgba(139,92,246,0.18)" : "transparent",
              color: period === p ? "#A78BFA" : "rgba(255,255,255,0.38)",
              transition: "all 0.12s",
            }}>{p}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
          <StatCard label="Revenus" value={fmtEur(totalRevenue)} sub={`sur ${period}`} icon={TrendingUp} color="#10B981" trend={12} />
          <StatCard label="Vues" value={totalViews.toLocaleString("fr-FR")} sub="tous articles" icon={Eye} color="#8B5CF6" />
          <StatCard label="Favoris" value={totalLikes.toLocaleString("fr-FR")} sub="j'aime reçus" icon={Heart} color="#EC4899" />
          <StatCard label="Ventes" value={salesCount.toString()} sub={`${conversionRate}% conversion`} icon={ShoppingBag} color="#F59E0B" />
        </div>

        {/* Secondary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <StatCard label="Abonnés" value={followersCount.toString()} icon={Users} color="#06B6D4" />
          <StatCard label="Annonces actives" value={activeListings.toString()} icon={Package} color="#8B5CF6" />
          <StatCard label="Taux de conversion" value={`${conversionRate}%`} icon={BarChart2} color="#10B981" />
        </div>

        {/* Revenue bars */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 24px" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", margin: "0 0 18px" }}>Revenus sur {period}</p>
          {weekBuckets.every(b => b === 0) ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
              Aucune vente sur cette période
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
              {weekBuckets.map((val, i) => {
                const pct = val / maxBar;
                return (
                  <div key={i} title={fmtEur(val)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", gap: 4 }}>
                    <div style={{
                      width: "100%", borderRadius: "4px 4px 0 0",
                      height: `${Math.max(pct * 100, val > 0 ? 6 : 0)}%`,
                      background: val > 0 ? "linear-gradient(180deg,#8B5CF6,#6D28D9)" : "rgba(255,255,255,0.05)",
                      transition: "height 0.4s",
                    }} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top listings */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", margin: 0 }}>Top annonces par vues</p>
            <Link href="/listings" style={{ fontSize: 12, color: "#A78BFA", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Voir tout <ChevronRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>

          {topByViews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
              Aucune annonce
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topByViews.map((product, idx) => {
                const views = product.views_count ?? 0;
                const likes = product.likes?.[0]?.count ?? 0;
                const sold = soldProductIds.has(product.id);
                const img = product.images?.[0];
                return (
                  <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                      borderRadius: 11, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                      transition: "border-color 0.12s", cursor: "pointer",
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: idx < 3 ? "#8B5CF6" : "rgba(255,255,255,0.2)", width: 18, textAlign: "center" }}>
                        {idx + 1}
                      </span>
                      <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.06)" }}>
                        {img && <Image src={img} alt={product.title} width={40} height={40} style={{ objectFit: "cover", width: "100%", height: "100%" }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {product.title}
                        </p>
                        <MiniBar value={views} max={maxViews} />
                      </div>
                      <div style={{ display: "flex", gap: 14, flexShrink: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.38)" }}>
                          <Eye style={{ width: 12, height: 12 }} /> {views}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.38)" }}>
                          <Heart style={{ width: 12, height: 12 }} /> {likes}
                        </div>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                          background: sold ? "rgba(16,185,129,0.1)" : product.status === "active" ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.05)",
                          color: sold ? "#10B981" : product.status === "active" ? "#A78BFA" : "rgba(255,255,255,0.3)",
                        }}>
                          {sold ? "Vendu" : product.status === "active" ? "Actif" : product.status}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#10B981" }}>{fmtEur(product.price / 100)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Link href="/sell/manual" style={{ textDecoration: "none" }}>
            <div style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap style={{ width: 18, height: 18, color: "#A78BFA" }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.8)", margin: "0 0 2px" }}>Nouvelle annonce</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>Publie un article</p>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: "rgba(255,255,255,0.2)", marginLeft: "auto" }} />
            </div>
          </Link>
          <Link href="/sales" style={{ textDecoration: "none" }}>
            <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.13)", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(16,185,129,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingBag style={{ width: 18, height: 18, color: "#10B981" }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.8)", margin: "0 0 2px" }}>Gérer les ventes</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>Commandes & livraisons</p>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: "rgba(255,255,255,0.2)", marginLeft: "auto" }} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
