"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus, Eye, Heart, Trash2, Edit, Zap, Package, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";
import { formatPrice, conditionLabel, timeAgo } from "@/lib/utils";

interface Props {
  products: Product[];
  userId: string;
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  active:   { label: "En ligne",  color: "#10B981", bg: "rgba(16,185,129,0.15)" },
  sold:     { label: "Vendu",     color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  reserved: { label: "Réservé",   color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
  deleted:  { label: "Supprimé",  color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
};

export function ListingsClient({ products: initial, userId }: Props) {
  const [products, setProducts] = useState(initial);
  const [filter, setFilter] = useState<"all" | "active" | "sold">("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const filtered = filter === "all" ? products : products.filter((p) => p.status === filter);

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    sold: products.filter((p) => p.status === "sold").length,
    totalLikes: products.reduce((sum, p) => sum + (p.likes_count ?? 0), 0),
    totalViews: products.reduce((sum, p) => sum + (p.views ?? 0), 0),
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette annonce ?")) return;
    setDeleting(id);
    await supabase.from("products").update({ status: "deleted" }).eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-[18px] font-black text-white">Mes annonces</h1>
          <p className="text-[12px] text-white/35">{stats.total} article{stats.total !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/sell/ai"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-white"
          style={{ background: "linear-gradient(135deg, #8B5CF6, #A855F7)" }}>
          <Plus className="w-3.5 h-3.5" />
          Publier
        </Link>
      </div>

      {/* Stats */}
      <div className="px-4 mb-4 grid grid-cols-3 gap-2">
        {[
          { label: "En ligne",  value: stats.active,     color: "#10B981", icon: Package },
          { label: "Vues",      value: stats.totalViews,  color: "#8B5CF6", icon: Eye },
          { label: "J'aime",    value: stats.totalLikes,  color: "#EF4444", icon: Heart },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-white/6 bg-white/3 px-3 py-2.5 text-center">
            <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
            <p className="text-[16px] font-black text-white">{value}</p>
            <p className="text-[10px] text-white/35 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-1 p-1 rounded-2xl bg-white/4 border border-white/6">
          {([["all", "Tout"], ["active", "En ligne"], ["sold", "Vendus"]] as const).map(([val, lbl]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                filter === val ? "bg-[#8B5CF6] text-white" : "text-white/40 hover:text-white/60"
              }`}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-white/30">Aucune annonce</p>
            <Link href="/sell/ai"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-2xl text-[13px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #A855F7)" }}>
              <Zap className="w-3.5 h-3.5" /> Créer avec l'IA
            </Link>
          </div>
        ) : (
          filtered.map((product) => {
            const status = STATUS_LABEL[product.status ?? "active"] ?? STATUS_LABEL.active;
            const firstImage = product.images?.[0];

            return (
              <div key={product.id}
                className="flex gap-3 p-3 rounded-2xl border border-white/6 bg-white/2">
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                  {firstImage ? (
                    <Image src={firstImage} alt={product.title} width={64} height={64}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-white/15" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-bold text-white line-clamp-1">{product.title}</p>
                    <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ color: status.color, background: status.bg }}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-[14px] font-black text-white mt-0.5">{formatPrice(product.price)}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[11px] text-white/30">
                      <Eye className="w-3 h-3" />{product.views ?? 0}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-white/30">
                      <Heart className="w-3 h-3" />{product.likes_count ?? 0}
                    </span>
                    <span className="text-[11px] text-white/20">
                      {timeAgo(product.created_at!)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <Link href={`/products/${product.id}`}
                    className="w-7 h-7 rounded-lg border border-white/8 bg-white/4 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                    <Eye className="w-3 h-3" />
                  </Link>
                  <button onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
                    className="w-7 h-7 rounded-lg border border-red-500/20 bg-red-500/8 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors disabled:opacity-40">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}