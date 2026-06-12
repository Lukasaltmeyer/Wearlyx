"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Package, MapPin, Edit3, Zap, ShoppingBag, Heart, Crown, Shield, Calendar, ArrowRight, MessageCircle, UserCheck } from "lucide-react";
import type { Product, Profile } from "@/types/database";
import { formatPrice, timeAgo } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface Review { id: string; rating: number; comment: string | null; created_at: string; }
interface Props { profile: Profile | null; products: Product[]; reviews: Review[]; isOwnProfile?: boolean; currentUserId?: string; isFollowing?: boolean; }

type Tab = "annonces" | "evaluations" | "apropos";

function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];
  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div
        className="rounded-[18px] overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.016) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset",
        }}
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: "#0C0C18" }}>
          {img
            ? <Image src={img} alt={product.title} fill sizes="15vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.07]" />
            : <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(139,92,246,0.05)" }}>
                <Package className="w-8 h-8 text-white/10" />
              </div>
          }
          <div className="absolute inset-x-0 bottom-0 px-2.5 pb-2 pt-8"
            style={{ background: "linear-gradient(to top, rgba(7,7,15,0.95), transparent)" }}>
            <p className="text-[15px] font-black text-white leading-none">{formatPrice(product.price)}</p>
          </div>
        </div>
        <div className="px-2.5 pt-2 pb-2.5">
          <p className="text-[11px] text-white/38 truncate">{product.title}</p>
        </div>
      </div>
    </Link>
  );
}

export function DesktopProfile({ profile, products, reviews, isOwnProfile, currentUserId, isFollowing: initialFollowing }: Props) {
  const [tab, setTab] = useState<Tab>("annonces");
  const [following, setFollowing] = useState(initialFollowing ?? false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState((profile as any)?.followers_count ?? 0);
  const supabase = createClient();

  const toggleFollow = async () => {
    if (!currentUserId || !profile) return;
    setFollowLoading(true);
    if (following) {
      await supabase.from("follows").delete().match({ follower_id: currentUserId, following_id: profile.id });
      setFollowersCount((n: number) => Math.max(0, n - 1));
    } else {
      await supabase.from("follows").insert({ follower_id: currentUserId, following_id: profile.id });
      setFollowersCount((n: number) => n + 1);
    }
    setFollowing(!following);
    setFollowLoading(false);
  };
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const active = products.filter(p => p.status === "active");
  const sold = products.filter(p => p.status === "sold");
  const initials = (profile?.full_name || profile?.username || "?")[0]?.toUpperCase();
  const totalLikes = products.reduce((s, p) => s + (p.likes_count ?? 0), 0);

  return (
    <div className="min-h-[100dvh] relative overflow-hidden" style={{ background: "#07070A" }}>
      {/* Ambient */}
      <div className="absolute pointer-events-none"
        style={{ top: -160, left: "25%", width: 700, height: 500,
          background: "radial-gradient(ellipse, rgba(139,92,246,0.10) 0%, transparent 65%)", filter: "blur(80px)" }} />

      {/* ── Hero banner ── */}
      <div className="relative h-[220px] overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #080012 0%, #140830 30%, #231060 60%, #3b1595 85%, #120828 100%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 65% 40%, rgba(167,139,250,0.22) 0%, transparent 55%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 15% 80%, rgba(109,40,217,0.18) 0%, transparent 50%)" }} />
        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
        <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, #07070A, transparent)" }} />
        {isOwnProfile && (
          <Link href="/profile/edit"
            className="absolute top-4 right-6 flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(255,255,255,0.09)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(16px)",
            }}>
            <Edit3 className="w-3.5 h-3.5" /> Modifier le profil
          </Link>
        )}
      </div>

      {/* ── Profile header ── */}
      <div className="relative z-10 px-8 -mt-16">
        <div className="flex items-end gap-5 mb-6">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-[22px] overflow-hidden flex-shrink-0"
            style={{
              border: "3px solid #07070A",
              background: "linear-gradient(145deg, #9B6FF8, #7C3AED)",
              boxShadow: "0 8px 32px rgba(139,92,246,0.45)",
            }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white">{initials}</div>
            }
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-[26px] font-black text-white tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                {profile?.full_name || profile?.username || "Utilisateur"}
              </h1>
              {profile?.username && (
                <span className="text-[13px] font-medium" style={{ color: "rgba(167,139,250,0.5)" }}>
                  @{profile.username}
                </span>
              )}
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34D399" }}>
                <Shield className="w-3 h-3" /> Vérifié
              </span>
              {avgRating > 0 && (
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.18)" }}>
                  <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="text-[12px] font-bold text-[#F59E0B]">{avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            {profile?.bio && (
              <p className="text-[13px] leading-relaxed max-w-[520px]" style={{ color: "rgba(255,255,255,0.42)" }}>
                {profile.bio}
              </p>
            )}
            {((profile as any)?.city || profile?.location) && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.22)" }} />
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.32)" }}>
                  {(profile as any)?.city || profile?.location}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          {isOwnProfile ? (
            <div className="flex items-center gap-2 pb-1 flex-shrink-0">
              <Link href="/sell/ai"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                  boxShadow: "0 6px 20px rgba(139,92,246,0.38), 0 1px 0 rgba(255,255,255,0.12) inset",
                }}>
                <Zap className="w-4 h-4" /> Vendre
              </Link>
              <Link href="/premium"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
                <Crown className="w-4 h-4" /> Premium
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 pb-1 flex-shrink-0">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                  boxShadow: "0 6px 20px rgba(139,92,246,0.38)",
                }}>
                <MessageCircle className="w-4 h-4" /> Contacter
              </button>
              <button onClick={toggleFollow} disabled={followLoading || !currentUserId}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:-translate-y-0.5"
                style={{
                  background: following ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.05)",
                  border: following ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.09)",
                  color: following ? "#A78BFA" : "rgba(255,255,255,0.6)",
                  opacity: followLoading ? 0.7 : 1,
                }}>
                {following ? <><UserCheck className="w-4 h-4" /> Abonné</> : "Suivre"}
              </button>
            </div>
          )}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-3 mb-0">
          {[
            { label: "Ventes", value: profile?.sales_count ?? 0, icon: ShoppingBag, color: "#8B5CF6", glow: "rgba(139,92,246,0.15)" },
            { label: "Actives", value: active.length, icon: Package, color: "#10B981", glow: "rgba(16,185,129,0.12)" },
            { label: "Favoris reçus", value: totalLikes, icon: Heart, color: "#EF4444", glow: "rgba(239,68,68,0.12)" },
            { label: "Note", value: avgRating > 0 ? avgRating.toFixed(1) + " ★" : "—", icon: Star, color: "#F59E0B", glow: "rgba(245,158,11,0.12)" },
          ].map(({ label, value, icon: Icon, color, glow }) => (
            <div key={label}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.018))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 0.5px ${glow} inset, 0 1px 0 rgba(255,255,255,0.06) inset`,
              }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-[20px] font-black text-white leading-none" style={{ letterSpacing: "-0.02em" }}>{value}</p>
                <p className="text-[10.5px] mt-0.5 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main body: 2-column layout ── */}
      <div className="relative z-10 flex mt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Left: tabs + content */}
        <div className="flex-1 min-w-0 px-8 py-5">
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {(["annonces", "evaluations", "apropos"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-5 py-3 text-[13.5px] font-semibold capitalize transition-all relative"
                style={{ color: tab === t ? "white" : "rgba(255,255,255,0.32)" }}>
                {t === "annonces" ? `Annonces (${products.length})` : t === "evaluations" ? `Évaluations (${reviews.length})` : "À propos"}
                {tab === t && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-full"
                    style={{ background: "linear-gradient(90deg, #8B5CF6, #C4B5FD)" }} />
                )}
              </button>
            ))}
          </div>

          {tab === "annonces" && (
            <>
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-3xl"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.14)" }}>
                    <Package className="w-7 h-7" style={{ color: "rgba(139,92,246,0.45)" }} />
                  </div>
                  <p className="text-[15px] font-bold mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>Aucune annonce</p>
                  {isOwnProfile && (
                    <Link href="/sell/ai"
                      className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 16px rgba(139,92,246,0.3)" }}>
                      <Zap className="w-4 h-4" /> Publier une annonce
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  {active.length > 0 && (
                    <div className="mb-8">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-4"
                        style={{ color: "rgba(255,255,255,0.2)" }}>Actives · {active.length}</p>
                      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))" }}>
                        {active.map(p => <ProductCard key={p.id} product={p} />)}
                      </div>
                    </div>
                  )}
                  {sold.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-4"
                        style={{ color: "rgba(255,255,255,0.2)" }}>Vendus · {sold.length}</p>
                      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))" }}>
                        {sold.map(p => <div key={p.id} className="opacity-40"><ProductCard product={p} /></div>)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {tab === "evaluations" && (
            reviews.length === 0 ? (
              <div className="flex flex-col items-center py-24 rounded-3xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <Star className="w-12 h-12 mb-3" style={{ color: "rgba(255,255,255,0.1)" }} />
                <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.22)" }}>Aucune évaluation</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {reviews.map(r => (
                  <div key={r.id}
                    className="p-5 rounded-2xl"
                    style={{
                      background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.018))",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06) inset",
                    }}>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className="w-3.5 h-3.5"
                            fill={s <= r.rating ? "#F59E0B" : "transparent"}
                            style={{ color: s <= r.rating ? "#F59E0B" : "rgba(255,255,255,0.15)" }} />
                        ))}
                      </div>
                      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.22)" }}>
                        {timeAgo(r.created_at)}
                      </span>
                    </div>
                    {r.comment && (
                      <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {r.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {tab === "apropos" && (
            <div className="max-w-[560px]">
              <div className="p-6 rounded-2xl"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.018))",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06) inset",
                }}>
                <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>
                  {profile?.bio || "Aucune description."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-[280px] flex-shrink-0 py-5 px-5 flex flex-col gap-4"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>

          {/* Contact card */}
          {!isOwnProfile && (
            <div className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(145deg, rgba(139,92,246,0.10), rgba(109,40,217,0.05))",
                border: "1px solid rgba(139,92,246,0.18)",
                boxShadow: "0 4px 20px rgba(139,92,246,0.07)",
              }}>
              <p className="text-[11px] font-black uppercase tracking-widest mb-3"
                style={{ color: "rgba(255,255,255,0.28)" }}>Contacter</p>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold text-white mb-2 transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 16px rgba(139,92,246,0.38)" }}>
                <MessageCircle className="w-4 h-4" /> Envoyer un message
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:bg-white/8"
                style={{ border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.55)" }}>
                Voir les annonces <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Member info */}
          <div className="rounded-2xl p-5"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.018))",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06) inset",
            }}>
            <p className="text-[11px] font-black uppercase tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,0.25)" }}>Informations</p>
            <div className="flex flex-col gap-3">
              {[
                { icon: ShoppingBag, label: "Ventes réalisées", value: profile?.sales_count ?? 0, color: "#8B5CF6" },
                { icon: Package, label: "Annonces actives", value: active.length, color: "#10B981" },
                { icon: Heart, label: "Favoris reçus", value: totalLikes, color: "#EF4444" },
                { icon: Star, label: "Note moyenne", value: avgRating > 0 ? avgRating.toFixed(1) + " ★" : "—", color: "#F59E0B" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.28)" }} />
                    <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.38)" }}>{label}</span>
                  </div>
                  <span className="text-[12px] font-bold" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="rounded-2xl p-5"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.012))",
              border: "1px solid rgba(255,255,255,0.07)",
            }}>
            <p className="text-[11px] font-black uppercase tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,0.22)" }}>Badges</p>
            <div className="flex flex-col gap-2.5">
              {[
                { icon: Shield, label: "Identité vérifiée", color: "#10B981" },
                { icon: Star, label: "Vendeur de confiance", color: "#F59E0B" },
                { icon: Calendar, label: "Membre depuis 2024", color: "#8B5CF6" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}18`, border: `1px solid ${color}22` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.48)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {isOwnProfile && (
            <Link href="/premium"
              className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(145deg, rgba(245,158,11,0.10), rgba(217,119,6,0.05))",
                border: "1px solid rgba(245,158,11,0.18)",
              }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(245,158,11,0.15)" }}>
                <Crown className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-white">Passer Premium</p>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Boostez vos annonces</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
