"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Zap, Package, Percent, ChevronRight, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductItem {
  id: string;
  title: string;
  price: number;
  images: string[] | null;
}

interface Props {
  products: ProductItem[];
  isDesktop?: boolean;
}

export function PromotionToolsClient({ products, isDesktop }: Props) {
  const router = useRouter();
  const [boosted, setBoosted] = useState<string[]>([]);

  if (isDesktop) {
    return (
      <div className="flex flex-col gap-8">

        {/* Boost section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-0.5" style={{ color: "rgba(255,255,255,0.22)" }}>Booster une annonce</p>
              <p className="text-[13px] text-white/35">Mets ton article en tête des résultats pendant 24h</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.18)" }}>
              <TrendingUp className="w-3 h-3 text-blue-400" />
              <span className="text-[11px] font-bold text-blue-400">+300% visibilité</span>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="py-14 flex flex-col items-center justify-center rounded-[16px]"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderStyle: "dashed" }}>
              <div className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                <Package className="w-6 h-6 text-white/15" />
              </div>
              <p className="text-[14px] font-semibold text-white/25">Aucune annonce active</p>
              <p className="text-[12px] text-white/15 mt-1">Publie un article pour le booster</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {products.map((p) => {
                const isBoosted = boosted.includes(p.id);
                return (
                  <div key={p.id}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-[14px] transition-all"
                    style={{ background: isBoosted ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.025)", border: isBoosted ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-12 h-12 rounded-[10px] overflow-hidden flex-shrink-0 bg-white/5">
                      {p.images?.[0]
                        ? <Image src={p.images[0]} alt={p.title} width={48} height={48} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-white/15" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-white/85 truncate">{p.title}</p>
                      <p className="text-[12px] text-white/35 mt-0.5">{formatPrice(p.price)}</p>
                    </div>
                    {isBoosted && (
                      <div className="flex items-center gap-1.5 mr-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-[11px] font-bold text-blue-400">Booosté · 24h</span>
                      </div>
                    )}
                    <button
                      onClick={() => !isBoosted && setBoosted((prev) => [...prev, p.id])}
                      disabled={isBoosted}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-[9px] text-[12.5px] font-bold transition-all flex-shrink-0"
                      style={{
                        background: isBoosted ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.85)",
                        color: isBoosted ? "#93C5FD" : "white",
                        boxShadow: isBoosted ? "none" : "0 4px 14px rgba(59,130,246,0.3)",
                        cursor: isBoosted ? "default" : "pointer",
                      }}>
                      <Zap className="w-3.5 h-3.5" />
                      {isBoosted ? "Actif" : "Booster"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        {/* Offres section */}
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: "rgba(255,255,255,0.22)" }}>Offres groupées</p>
          <div className="flex items-center gap-4 px-5 py-4 rounded-[14px] transition-all group cursor-pointer"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(16,185,129,0.18)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.12)" }}>
              <Percent className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-white/85">Réduction sur les lots</p>
              <p className="text-[12px] text-white/30 mt-0.5">Offre un rabais si l'acheteur prend plusieurs articles</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-white/35 transition-colors" />
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
        <h1 className="text-[17px] font-bold text-white">Outils de promotion</h1>
      </div>
      <div className="px-4">
        <p className="text-[11px] font-black text-white/30 uppercase tracking-wider mb-3">Booster</p>
        <div className="flex flex-col gap-1.5 mb-5">
          {products.length === 0 ? (
            <div className="py-8 text-center border border-white/6 rounded-2xl bg-white/2">
              <Package className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-[13px] text-white/25">Aucune annonce active</p>
            </div>
          ) : (
            products.map((p) => {
              const isBoosted = boosted.includes(p.id);
              return (
                <div key={p.id} className="flex items-center gap-3 px-3 py-3 rounded-2xl border border-white/6 bg-white/2">
                  <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                    {p.images?.[0]
                      ? <Image src={p.images[0]} alt={p.title} width={44} height={44} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-white/15" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-white line-clamp-1">{p.title}</p>
                    <p className="text-[12px] text-white/40">{formatPrice(p.price)}</p>
                  </div>
                  <button onClick={() => !isBoosted && setBoosted((prev) => [...prev, p.id])}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${isBoosted ? "bg-[#3B82F6]/20 text-[#3B82F6]" : "bg-[#3B82F6] text-white"}`}>
                    <Zap className="w-3 h-3" />
                    {isBoosted ? "Boosté" : "Booster"}
                  </button>
                </div>
              );
            })
          )}
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
