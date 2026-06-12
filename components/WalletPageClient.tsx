"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowDownToLine, Plus, Heart, TrendingUp, ShoppingBag, ArrowUpRight, Sparkles, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/utils";

interface WalletData {
  pending: number;
  available: number;
  salesCount: number;
  purchasesCount: number;
  recentSales: any[];
  recentPurchases: any[];
}

interface Props {
  userId?: string;
  isDesktop?: boolean;
}

export function WalletPageClient({ userId, isDesktop }: Props) {
  const router = useRouter();
  const [data, setData] = useState<WalletData>({ pending: 0, available: 0, salesCount: 0, purchasesCount: 0, recentSales: [], recentPurchases: [] });
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const [salesRes, purchasesRes] = await Promise.all([
        supabase.from("orders").select("amount, status, created_at, product:products(title,images)").eq("seller_id", userId).order("created_at", { ascending: false }).limit(20),
        supabase.from("orders").select("total, status, created_at, product:products(title,images)").eq("buyer_id", userId).order("created_at", { ascending: false }).limit(10),
      ]);
      const sales = salesRes.data ?? [];
      const purchases = purchasesRes.data ?? [];
      const pending = sales.filter((o: any) => ["paid", "shipped", "in_transit"].includes(o.status)).reduce((s: number, o: any) => s + (o.amount ?? 0), 0);
      const available = sales.filter((o: any) => o.status === "delivered").reduce((s: number, o: any) => s + (o.amount ?? 0), 0);
      setData({ pending, available, salesCount: sales.length, purchasesCount: purchases.length, recentSales: sales.slice(0, 5), recentPurchases: purchases.slice(0, 5) });
    };
    load();
  }, [userId]);

  if (isDesktop) {
    const fmtEur = (n: number) => n.toFixed(2).replace(".", ",");
    return (
      <div className="flex flex-col gap-8">

        {/* Hero balance cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-[20px] p-7"
            style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(37,99,235,0.06) 100%)", border: "1px solid rgba(59,130,246,0.18)" }}>
            <div className="absolute pointer-events-none" style={{ top: -60, right: -40, width: 200, height: 200, background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%)", filter: "blur(30px)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: "rgba(147,197,253,0.6)" }}>Montant en attente</p>
            <p className="text-[48px] font-black text-white leading-none tracking-tight">{fmtEur(data.pending).split(",")[0]}<span className="text-[28px] text-white/50">,{fmtEur(data.pending).split(",")[1]}</span></p>
            <p className="text-[13px] mt-2" style={{ color: "rgba(147,197,253,0.45)" }}>€ · En cours de traitement</p>
            <div className="absolute bottom-5 right-5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.2)" }}>
                <span className="text-[13px] font-black text-blue-300/70">ℹ</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[20px] p-7"
            style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.06) 100%)", border: "1px solid rgba(16,185,129,0.18)" }}>
            <div className="absolute pointer-events-none" style={{ top: -60, right: -40, width: 200, height: 200, background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 65%)", filter: "blur(30px)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: "rgba(110,231,183,0.6)" }}>Solde disponible</p>
            <p className="text-[48px] font-black text-white leading-none tracking-tight">{fmtEur(data.available).split(",")[0]}<span className="text-[28px] text-white/50">,{fmtEur(data.available).split(",")[1]}</span></p>
            <p className="text-[13px] mt-2" style={{ color: "rgba(110,231,183,0.45)" }}>€ · {data.salesCount} vente{data.salesCount > 1 ? "s" : ""} réalisée{data.salesCount > 1 ? "s" : ""}</p>
            <div className="absolute bottom-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <TrendingUp className="w-3 h-3" style={{ color: "rgba(110,231,183,0.7)" }} />
              <span className="text-[10px] font-bold" style={{ color: "rgba(110,231,183,0.7)" }}>{data.salesCount} ventes</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: "rgba(255,255,255,0.22)" }}>Actions rapides</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: ArrowDownToLine, label: "Transférer", desc: "Vers ton compte bancaire", color: "#10B981" },
              { icon: Plus,            label: "Ajouter",    desc: "Recharger le portefeuille", color: "rgba(255,255,255,0.85)" },
              { icon: Heart,           label: "Donner",     desc: "Reverser à une association", color: "#F87171" },
            ].map(({ icon: Icon, label, desc, color }) => (
              <button key={label}
                className="flex flex-col items-start gap-4 p-5 rounded-[16px] transition-all hover:-translate-y-0.5 group text-left"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}30`; (e.currentTarget as HTMLElement).style.background = `${color}08`; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px rgba(0,0,0,0.35)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}14`, border: `1px solid ${color}22` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-white/85">{label}</p>
                  <p className="text-[11.5px] text-white/30 mt-0.5 leading-snug">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="grid grid-cols-2 gap-4">
          {([
            { icon: TrendingUp, label: "Ventes récentes", color: "#10B981", items: data.recentSales, amountKey: "amount" },
            { icon: ShoppingBag, label: "Achats récents", color: "#3B82F6", items: data.recentPurchases, amountKey: "total" },
          ] as const).map(({ icon: Icon, label, color, items, amountKey }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.28)" }}>{label}</p>
                </div>
                <button className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Tout voir <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <div className="rounded-[14px] overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
                {items.length === 0 ? (
                  <div className="py-10 flex flex-col items-center justify-center">
                    <Package className="w-8 h-8 mb-2" style={{ color: "rgba(255,255,255,0.1)" }} />
                    <p className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.2)" }}>Aucune transaction</p>
                  </div>
                ) : items.map((order: any, i: number) => {
                  const product = Array.isArray(order.product) ? order.product[0] : order.product;
                  return (
                    <div key={i} className="flex items-center gap-3 px-3.5 py-2.5" style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <div className="w-8 h-8 rounded-[8px] overflow-hidden flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                        {product?.images?.[0] ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" /> : <Package className="w-full h-full p-1.5" style={{ color: "rgba(255,255,255,0.2)" }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-white/70 truncate">{product?.title ?? "Article"}</p>
                        <p className="text-[10px] text-white/25">{timeAgo(order.created_at)}</p>
                      </div>
                      <span className="text-[13px] font-bold flex-shrink-0" style={{ color }}>{(order[amountKey] ?? 0).toFixed(2)}€</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Upsell */}
        <div className="flex items-center gap-5 px-6 py-5 rounded-[16px] transition-all hover:-translate-y-0.5 cursor-pointer group"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.07), rgba(109,40,217,0.03))", border: "1px solid rgba(139,92,246,0.14)" }}>
          <div className="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: "rgba(139,92,246,0.16)" }}>
            <Sparkles className="w-5 h-5 text-[#A78BFA]" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-white/80">Vends plus, gagne plus</p>
            <p className="text-[12px] text-white/30 mt-0.5">Publie ta première annonce pour commencer à encaisser</p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-[#A78BFA]/50 transition-colors flex-shrink-0" />
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
        <h1 className="text-[17px] font-bold text-white">Mon portefeuille</h1>
      </div>
      <div className="px-4 flex flex-col gap-3">
        <div className="p-4 rounded-2xl border border-white/8 bg-white/3">
          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">Montant en attente</p>
          <div className="flex items-center justify-between">
            <p className="text-[26px] font-black text-white">0.00 €</p>
            <button className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/40">
              <span className="text-[12px] font-bold">ℹ</span>
            </button>
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-white/8 bg-white/3">
          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">Solde disponible</p>
          <p className="text-[36px] font-black text-white leading-none">0.00 <span className="text-[22px]">€</span></p>
          <p className="text-[12px] text-white/30 mt-1 mb-4">0 ventes réalisées</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: ArrowDownToLine, label: "Transférer", color: "#4CAF50" },
              { icon: Plus, label: "Ajouter", color: "white" },
              { icon: Heart, label: "Donner", color: "#EF4444" },
            ].map(({ icon: Icon, label, color }) => (
              <button key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/8 bg-white/4 hover:bg-white/6 transition-all">
                <Icon className="w-4.5 h-4.5" style={{ color }} />
                <p className="text-[12px] font-semibold text-white">{label}</p>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#4CAF50]" />
            <p className="text-[12px] font-black text-white/40 uppercase tracking-wider">Mes ventes</p>
          </div>
          <div className="p-6 rounded-2xl border border-white/6 bg-white/2 flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">📦</span>
            <p className="text-[13px] text-white/30">Aucune vente pour l'instant</p>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-[#3B82F6]" />
            <p className="text-[12px] font-black text-white/40 uppercase tracking-wider">Mes achats</p>
          </div>
          <div className="p-6 rounded-2xl border border-white/6 bg-white/2 flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">🛍️</span>
            <p className="text-[13px] text-white/30">Aucun achat pour l'instant</p>
          </div>
        </div>
      </div>
    </div>
  );
}
