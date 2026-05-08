"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MoreHorizontal, Plus, Star, Package, Zap, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Product, Profile } from "@/types/database";
import { formatPrice, timeAgo } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface Props {
  products: Product[];
  reviews: Review[];
  profile: Profile | null;
  userId: string;
}

type Tab = "annonces" | "evaluations" | "apropos";

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  active:   { label: "En ligne",  color: "#10B981", bg: "rgba(16,185,129,0.15)" },
  sold:     { label: "Vendu",     color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  reserved: { label: "Réservé",   color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
};

export function ListingsClient({ products: initial, reviews, profile }: Props) {
  const [products, setProducts] = useState(initial);
  const [tab, setTab] = useState<Tab>("annonces");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleShare = async () => {
    setShowMenu(false);
    const url = `${window.location.origin}/profile/${profile?.id}`;
    if (navigator.share) {
      await navigator.share({ title: profile?.username ?? "Wearlyx", url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Lien copié !");
    }
  };

  const active = products.filter((p) => p.status === "active");
  const sold   = products.filter((p) => p.status === "sold");
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette annonce ?")) return;
    setDeleting(id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { alert("Erreur : " + error.message); setDeleting(null); return; }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "annonces",    label: "Annonces" },
    { id: "evaluations", label: "Évaluations" },
    { id: "apropos",     label: "À propos" },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center px-4 pt-5 pb-3 gap-3">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-black text-white">
          {profile?.username || profile?.full_name || "Mon profil"}
        </h1>
        <div className="relative">
          <button onClick={() => setShowMenu(v => !v)}
            className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-11 z-50 w-48 rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                style={{ background: "#1a1a2e" }}>
                <Link href="/profile/edit" onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-3.5 text-[14px] text-white hover:bg-white/5 transition-colors border-b border-white/6">
                  Modifier le profil
                </Link>
                <button onClick={handleShare}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-[14px] text-white hover:bg-white/5 transition-colors text-left">
                  Partager
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/8 px-4">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-3 text-[14px] font-semibold transition-colors relative ${tab === t.id ? "text-white" : "text-white/35"}`}>
            {t.label}
            {tab === t.id && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-[#8B5CF6]" />}
          </button>
        ))}
      </div>

      {/* ── ANNONCES ── */}
      {tab === "annonces" && (
        <div className="px-4 pt-4">

          {/* Booste ta visibilité */}
          <Link href="/promotion-tools"
            className="flex items-center gap-3 mb-4 px-4 py-3.5 rounded-2xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/8 active:scale-[0.98] transition-transform">
            <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-[#A78BFA]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white">Booste ta visibilité</p>
              <p className="text-[11px] text-white/40">Mets tes articles en valeur · Multiplie tes chances de vendre</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
          </Link>

          {active.length > 0 && (
            <>
              <p className="text-[10px] font-bold text-white/25 tracking-widest uppercase mb-3">Mes annonces actives</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {active.map((p) => <ProductTile key={p.id} product={p} onDelete={handleDelete} deleting={deleting} />)}
              </div>
            </>
          )}

          {sold.length > 0 && (
            <>
              <p className="text-[10px] font-bold text-white/25 tracking-widest uppercase mb-3">Vendus</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {sold.map((p) => <ProductTile key={p.id} product={p} onDelete={handleDelete} deleting={deleting} />)}
              </div>
            </>
          )}

          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-3xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mb-4">
                <Package className="w-9 h-9 text-[#8B5CF6]/50" />
              </div>
              <p className="text-[17px] font-black text-white mb-1">Ajoute des articles pour commencer à vendre</p>
              <p className="text-[13px] text-white/35 mb-6 leading-relaxed">Fais du tri ! Vends ce que tu n'utilises plus.</p>
              <Link href="/sell/ai"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[14px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.35)" }}>
                <Plus className="w-4 h-4" /> Ajouter un article
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── ÉVALUATIONS ── */}
      {tab === "evaluations" && (
        <div className="px-4 pt-4">
          {reviews.length > 0 && (
            <div className="flex items-center gap-4 mb-5 p-4 rounded-2xl border border-white/8 bg-white/3">
              <div className="text-center">
                <p className="text-[36px] font-black text-white leading-none">{avgRating.toFixed(1)}</p>
                <div className="flex gap-0.5 mt-1 justify-center">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5" fill={s <= Math.round(avgRating) ? "#F59E0B" : "transparent"}
                      style={{ color: s <= Math.round(avgRating) ? "#F59E0B" : "rgba(255,255,255,0.15)" }} />
                  ))}
                </div>
                <p className="text-[11px] text-white/35 mt-1">{reviews.length} avis</p>
              </div>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Star className="w-12 h-12 text-white/10 mb-3" />
              <p className="text-[14px] font-semibold text-white/30">Aucune évaluation</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl border border-white/8 bg-white/3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5" fill={s <= r.rating ? "#F59E0B" : "transparent"}
                          style={{ color: s <= r.rating ? "#F59E0B" : "rgba(255,255,255,0.15)" }} />
                      ))}
                    </div>
                    <span className="text-[11px] text-white/25">{timeAgo(r.created_at)}</span>
                  </div>
                  {r.comment && <p className="text-[13px] text-white/70 leading-relaxed">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── À PROPOS ── */}
      {tab === "apropos" && (
        <div className="px-4 pt-4 flex flex-col gap-3">
          {[
            { label: "Nom",      value: profile?.full_name },
            { label: "Pseudo",   value: profile?.username ? `@${profile.username}` : null },
            { label: "Ville",    value: (profile as any)?.city || profile?.location },
            { label: "Pays",     value: (profile as any)?.country },
            { label: "À propos", value: profile?.bio },
          ].filter((r) => r.value).map((row) => (
            <div key={row.label} className="flex items-center justify-between px-4 py-3.5 rounded-2xl border border-white/8 bg-white/3">
              <span className="text-[13px] text-white/40">{row.label}</span>
              <span className="text-[13px] font-semibold text-white text-right max-w-[60%]">{row.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl border border-white/8 bg-white/3">
            <span className="text-[13px] text-white/40">Ventes</span>
            <span className="text-[13px] font-semibold text-white">{profile?.sales_count ?? 0}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl border border-white/8 bg-white/3">
            <span className="text-[13px] text-white/40">Note moyenne</span>
            <span className="text-[13px] font-semibold text-white flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />{(profile?.rating ?? 0).toFixed(1)}
            </span>
          </div>
          <Link href="/profile/edit"
            className="mt-2 w-full flex items-center justify-center py-3.5 rounded-2xl border border-[#8B5CF6]/30 text-[13px] font-semibold text-[#A78BFA]">
            Modifier mon profil
          </Link>
        </div>
      )}
    </div>
  );
}

function ProductTile({ product, onDelete, deleting }: {
  product: Product; onDelete: (id: string) => void; deleting: string | null;
}) {
  const status = STATUS_LABEL[product.status ?? "active"] ?? STATUS_LABEL.active;
  const img = product.images?.[0];

  return (
    <div className="rounded-2xl overflow-hidden border border-white/6 bg-white/2">
      <div className="relative aspect-square bg-white/5">
        {img
          ? <Image src={img} alt={product.title} fill className="object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-white/10" /></div>}
        <button onClick={() => onDelete(product.id)} disabled={deleting === product.id}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-red-400 transition-colors">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
        <span className="absolute bottom-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{ color: status.color, background: status.bg }}>{status.label}</span>
      </div>
      <div className="p-2.5">
        <p className="text-[13px] font-black text-white">{formatPrice(product.price)}</p>
        <p className="text-[11px] text-white/40 truncate mt-0.5">{product.title}</p>
        {(product.size || product.brand || product.condition) && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {product.size && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">{product.size}</span>}
            {product.brand && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{product.brand}</span>}
            {product.condition && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">{product.condition}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
