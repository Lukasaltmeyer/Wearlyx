"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Zap, Package, Percent, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductItem {
  id: string;
  title: string;
  price: number;
  images: string[] | null;
}

interface Props {
  products: ProductItem[];
}

export function PromotionToolsClient({ products }: Props) {
  const router = useRouter();
  const [boosted, setBoosted] = useState<string[]>([]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-5">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-bold text-white">Outils de promotion</h1>
      </div>

      <div className="px-4">
        {/* BOOSTER section */}
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
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.title} width={44} height={44} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-white/15" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-white line-clamp-1">{p.title}</p>
                    <p className="text-[12px] text-white/40">{formatPrice(p.price)}</p>
                  </div>
                  <button
                    onClick={() => !isBoosted && setBoosted((prev) => [...prev, p.id])}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                      isBoosted
                        ? "bg-[#3B82F6]/20 text-[#3B82F6]"
                        : "bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90"
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    {isBoosted ? "Boosté" : "Booster"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* OFFRES section */}
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
