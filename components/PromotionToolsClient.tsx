"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Zap, Package, Percent, ChevronRight, TrendingUp, Crown, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getUsage, type UsageData } from "@/lib/usage";

interface ProductItem {
  id: string;
  title: string;
  price: number;
  images: string[] | null;
  is_boosted?: boolean;
}

interface Props {
  products: ProductItem[];
  isDesktop?: boolean;
}

export function PromotionToolsClient({ products, isDesktop }: Props) {
  const router = useRouter();
  const [boosted, setBoosted] = useState<Record<string, boolean>>(
    Object.fromEntries(products.filter(p => p.is_boosted).map(p => [p.id, true]))
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => { getUsage().then(setUsage); }, []);

  const handleBoost = async (productId: string) => {
    if (boosted[productId] || loadingId) return;
    setLimitReached(false);
    setLoadingId(productId);
    const res = await fetch("/api/boost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
    });
    const data = await res.json();
    if (res.ok) {
      setBoosted(prev => ({ ...prev, [productId]: true }));
      setUsage(prev => {
        if (!prev) return prev;
        const newRemaining = prev.boost_remaining !== null ? prev.boost_remaining - 1 : null;
        return { ...prev, boost_used: prev.boost_used + 1, boost_remaining: newRemaining };
      });
    } else if (data.error === "boost_limit_reached") {
      setLimitReached(true);
    }
    setLoadingId(null);
  };

  const boostRemaining = usage?.boost_remaining ?? null;
  const boostLimit = usage?.boost_limit ?? null;
  const canBoostMore = boostLimit === null || (boostRemaining !== null && boostRemaining > 0);

  const BoostBadge = () => (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
      style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
      <TrendingUp className="w-3 h-3 text-blue-400" />
      <span className="text-[11px] font-bold text-blue-400">
        {boostLimit === null ? "Illimités" : `${boostRemaining ?? "…"} / ${boostLimit} boosts`}
      </span>
    </div>
  );

  const LimitBanner = () => limitReached ? (
    <div className="flex items-center gap-3 px-4 py-3 rounded-[12px] mb-3"
      style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
      <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-amber-300">Limite de boosts atteinte</p>
        <p className="text-[11px] text-amber-400/60 mt-0.5">Passe au plan supérieur pour plus de boosts.</p>
      </div>
      <button onClick={() => router.push("/premium")}
        className="px-3 py-1.5 rounded-[8px] text-[11px] font-bold text-amber-300 flex-shrink-0"
        style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
        Upgrader
      </button>
    </div>
  ) : null;

  if (isDesktop) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28, alignItems: "start" }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.22)", letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 4px" }}>Booster une annonce</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>Mets ton article en tête des résultats pendant 24h</p>
              </div>
              <BoostBadge />
            </div>
            <LimitBanner />
            {products.length === 0 ? (
              <div style={{ padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 16, background: "rgba(255,255,255,0.015)", border: "1px dashed rgba(255,255,255,0.06)" }}>
                <Package style={{ width: 32, height: 32, color: "rgba(255,255,255,0.1)", marginBottom: 12 }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.25)", margin: "0 0 4px" }}>Aucune annonce active</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.15)", margin: 0 }}>Publie un article pour le booster</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {products.map((p) => {
                  const isBoosted = !!boosted[p.id];
                  const isLoading = loadingId === p.id;
                  const blocked = !canBoostMore && !isBoosted;
                  return (
                    <div key={p.id} style={{
                      display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", borderRadius: 14,
                      background: isBoosted ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.025)",
                      border: isBoosted ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <div style={{ width: 52, height: 52, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {p.images?.[0]
                          ? <Image src={p.images[0]} alt={p.title} width={52} height={52} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <Package style={{ width: 20, height: 20, color: "rgba(255,255,255,0.15)" }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>{formatPrice(p.price)}</p>
                      </div>
                      {isBoosted && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 8 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60A5FA" }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#60A5FA" }}>Boosté · 24h</span>
                        </div>
                      )}
                      <button onClick={() => handleBoost(p.id)} disabled={isBoosted || isLoading || blocked}
                        style={{
                          display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10,
                          fontSize: 13, fontWeight: 700, flexShrink: 0, border: "none",
                          background: isBoosted ? "rgba(59,130,246,0.15)" : blocked ? "rgba(255,255,255,0.05)" : "rgba(59,130,246,0.85)",
                          color: isBoosted ? "#93C5FD" : blocked ? "rgba(255,255,255,0.25)" : "white",
                          boxShadow: isBoosted || blocked ? "none" : "0 4px 14px rgba(59,130,246,0.3)",
                          cursor: isBoosted || blocked ? "not-allowed" : "pointer",
                        }}>
                        <Zap style={{ width: 14, height: 14 }} />
                        {isLoading ? "…" : isBoosted ? "Actif" : blocked ? "Limite" : "Booster"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.22)", letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 14px" }}>Offres groupées</p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderRadius: 14, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(16,185,129,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "rgba(16,185,129,0.12)" }}>
                <Percent style={{ width: 20, height: 20, color: "#10B981" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: "0 0 3px" }}>Réduction sur les lots</p>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.32)", margin: 0 }}>Offre un rabais si l'acheteur prend plusieurs articles</p>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: "rgba(255,255,255,0.2)" }} />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "24px", borderRadius: 18, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(59,130,246,0.8)", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>Pourquoi booster ?</p>
            {[
              { label: "+300% de visibilité", icon: TrendingUp, color: "#3B82F6" },
              { label: "Tête des résultats 24h", icon: Zap, color: "#F59E0B" },
              { label: "Plus de messages reçus", icon: Crown, color: "#10B981" },
            ].map(({ label, icon: Icon, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${color}18` }}>
                  <Icon style={{ width: 14, height: 14, color }} />
                </div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "20px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", margin: "0 0 8px" }}>Conseil</p>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.32)", margin: 0, lineHeight: 1.6 }}>Booste tes articles avec de belles photos et un prix compétitif pour maximiser l'impact.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 px-4 pt-5 pb-5">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-bold text-white flex-1">Outils de promotion</h1>
        <BoostBadge />
      </div>
      <div className="px-4">
        <LimitBanner />
        <p className="text-[11px] font-black text-white/30 uppercase tracking-wider mb-3">Booster</p>
        <div className="flex flex-col gap-1.5 mb-5">
          {products.length === 0 ? (
            <div className="py-8 text-center border border-white/6 rounded-2xl bg-white/2">
              <Package className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-[13px] text-white/25">Aucune annonce active</p>
            </div>
          ) : products.map((p) => {
            const isBoosted = !!boosted[p.id];
            const isLoading = loadingId === p.id;
            const blocked = !canBoostMore && !isBoosted;
            return (
              <div key={p.id} className="flex items-center gap-3 px-3 py-3 rounded-2xl border border-white/6 bg-white/2">
                <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                  {p.images?.[0]
                    ? <Image src={p.images[0]} alt={p.title} width={44} height={44} className="w-full h-full object-cover" />
                    : <Package className="w-5 h-5 text-white/15 m-auto" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white line-clamp-1">{p.title}</p>
                  <p className="text-[12px] text-white/40">{formatPrice(p.price)}</p>
                </div>
                <button
                  onClick={() => handleBoost(p.id)}
                  disabled={isBoosted || isLoading || blocked}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                    isBoosted ? "bg-[#3B82F6]/20 text-[#3B82F6]" : blocked ? "bg-white/5 text-white/20" : "bg-[#3B82F6] text-white"
                  }`}>
                  <Zap className="w-3 h-3" />
                  {isLoading ? "…" : isBoosted ? "Boosté" : blocked ? "Limite" : "Booster"}
                </button>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] font-black text-white/30 uppercase tracking-wider mb-3">Offres</p>
        <div className="flex items-center gap-3 px-3 py-3.5 rounded-2xl border border-white/6 bg-white/2">
          <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/15 flex items-center justify-center flex-shrink-0">
            <Percent className="w-5 h-5 text-[#4CAF50]" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-white">Réduction sur les lots</p>
            <p className="text-[12px] text-white/35 mt-0.5">Offre un rabais si l'acheteur prend plusieurs articles</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/20" />
        </div>
      </div>
    </div>
  );
}
