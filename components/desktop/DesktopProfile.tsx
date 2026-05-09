"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Package, MapPin, Edit3, Zap, ShoppingBag, Heart, TrendingUp, Crown } from "lucide-react";
import type { Product, Profile } from "@/types/database";
import { formatPrice, timeAgo } from "@/lib/utils";

interface Review { id: string; rating: number; comment: string | null; created_at: string; }
interface Props { profile: Profile | null; products: Product[]; reviews: Review[]; isOwnProfile?: boolean; }

type Tab = "annonces" | "evaluations" | "apropos";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <p className="text-[18px] font-black text-white leading-none">{value}</p>
        <p className="text-[11px] text-white/35 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];
  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div className="rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_32px_rgba(0,0,0,0.5)]"
        style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
          {img
            ? <Image src={img} alt={product.title} fill sizes="15vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
            : <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(139,92,246,0.05)" }}>
                <Package className="w-8 h-8 text-white/10" />
              </div>
          }
          <div className="absolute inset-x-0 bottom-0 px-2.5 pb-2 pt-6"
            style={{ background: "linear-gradient(to top, rgba(15,15,26,0.95), transparent)" }}>
            <p className="text-[14px] font-black text-white">{formatPrice(product.price)}</p>
          </div>
        </div>
        <div className="px-2.5 pt-1.5 pb-2.5">
          <p className="text-[11px] text-white/40 truncate">{product.title}</p>
        </div>
      </div>
    </Link>
  );
}

export function DesktopProfile({ profile, products, reviews, isOwnProfile }: Props) {
  const [tab, setTab] = useState<Tab>("annonces");
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const active = products.filter(p => p.status === "active");
  const sold = products.filter(p => p.status === "sold");
  const initials = (profile?.full_name || profile?.username || "?")[0]?.toUpperCase();

  return (
    <div className="min-h-[100dvh]" style={{ background: "#07070A" }}>

      {/* ── Hero banner ── */}
      <div className="relative h-[200px] overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0014, #1a0533 40%, #2d1062 70%, #4c1d95)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(167,139,250,0.2) 0%, transparent 60%)" }} />
        {isOwnProfile && (
          <Link href="/profile/edit"
            className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-all hover:scale-[1.02]"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}>
            <Edit3 className="w-3.5 h-3.5" /> Modifier le profil
          </Link>
        )}
      </div>

      {/* ── Profile header ── */}
      <div className="px-8 pb-0">
        <div className="flex items-end gap-6 -mt-14 mb-5">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 flex-shrink-0"
            style={{ borderColor: "#07070A", background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white">{initials}</div>
            }
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[24px] font-black text-white">{profile?.full_name || profile?.username || "Utilisateur"}</h1>
              {profile?.username && <span className="text-[14px] text-white/35">@{profile.username}</span>}
              {avgRating > 0 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="text-[12px] font-bold text-[#F59E0B]">{avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            {profile?.bio && <p className="text-[13px] text-white/45 mt-1 max-w-[500px]">{profile.bio}</p>}
            {((profile as any)?.city || profile?.location) && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-white/25" />
                <span className="text-[12px] text-white/35">{(profile as any)?.city || profile?.location}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 pb-1 flex-shrink-0">
            {isOwnProfile ? (
              <>
                <Link href="/sell/ai"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 16px rgba(139,92,246,0.3)" }}>
                  <Zap className="w-4 h-4" /> Vendre
                </Link>
                <Link href="/premium"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
                  <Crown className="w-4 h-4" /> Premium
                </Link>
              </>
            ) : (
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
                Contacter
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <StatCard label="Ventes" value={profile?.sales_count ?? 0} icon={ShoppingBag} color="#8B5CF6" />
          <StatCard label="Articles actifs" value={active.length} icon={Package} color="#10B981" />
          <StatCard label="Favoris reçus" value={products.reduce((s, p) => s + (p.likes_count ?? 0), 0)} icon={Heart} color="#EF4444" />
          <StatCard label="Note moyenne" value={avgRating > 0 ? avgRating.toFixed(1) : "—"} icon={Star} color="#F59E0B" />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {(["annonces", "evaluations", "apropos"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-3 text-[13.5px] font-semibold capitalize transition-colors relative"
              style={{ color: tab === t ? "white" : "rgba(255,255,255,0.35)" }}>
              {t === "annonces" ? `Annonces (${products.length})` : t === "evaluations" ? `Évaluations (${reviews.length})` : "À propos"}
              {tab === t && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-[#8B5CF6]" />}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="px-8 py-6">

        {tab === "annonces" && (
          <>
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Package className="w-12 h-12 text-white/10 mb-3" />
                <p className="text-[15px] font-bold text-white/25">Aucune annonce</p>
              </div>
            ) : (
              <>
                {active.length > 0 && (
                  <>
                    <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-4">Actives</p>
                    <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
                      {active.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                  </>
                )}
                {sold.length > 0 && (
                  <>
                    <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-4">Vendus</p>
                    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
                      {sold.map(p => <div key={p.id} className="opacity-50"><ProductCard product={p} /></div>)}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {tab === "evaluations" && (
          reviews.length === 0 ? (
            <div className="flex flex-col items-center py-20">
              <Star className="w-12 h-12 text-white/10 mb-3" />
              <p className="text-[14px] text-white/25">Aucune évaluation</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-w-[800px]">
              {reviews.map(r => (
                <div key={r.id} className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="w-3.5 h-3.5" fill={s <= r.rating ? "#F59E0B" : "transparent"}
                          style={{ color: s <= r.rating ? "#F59E0B" : "rgba(255,255,255,0.15)" }} />
                      ))}
                    </div>
                    <span className="text-[11px] text-white/25">{timeAgo(r.created_at)}</span>
                  </div>
                  {r.comment && <p className="text-[13px] text-white/60 leading-relaxed">{r.comment}</p>}
                </div>
              ))}
            </div>
          )
        )}

        {tab === "apropos" && (
          <div className="max-w-[500px] flex flex-col gap-3">
            {[
              { label: "Nom complet", value: profile?.full_name },
              { label: "Pseudo", value: profile?.username ? `@${profile.username}` : null },
              { label: "Ville", value: (profile as any)?.city || profile?.location },
              { label: "Pays", value: (profile as any)?.country },
              { label: "Bio", value: profile?.bio },
            ].filter(r => r.value).map(row => (
              <div key={row.label} className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[13px] text-white/35">{row.label}</span>
                <span className="text-[13px] font-semibold text-white">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
