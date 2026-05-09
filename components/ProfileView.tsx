"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MoreVertical, Edit2, Share2, Star, Package, Zap, Trash2, X, MapPin, Shield } from "lucide-react";
import type { Profile, Product } from "@/types/database";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { createClient } from "@/lib/supabase/client";

interface Props {
  profile: Profile;
  products: Product[];
  savedProducts: Product[];
  isOwner: boolean;
  currentUserId?: string;
  isAdmin?: boolean;
}

type Tab = "annonces" | "evaluations" | "apropos";

function CardMenu({ product, isPremium, onDelete }: {
  product: Product;
  isPremium: boolean;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowConfirm(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);
    setDeleteError(false);
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) { setDeleteError(true); setDeleting(false); return; }
    onDelete(product.id);
  };

  return (
    <div ref={ref} className="absolute top-2 right-2 z-20">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); setShowConfirm(false); setDeleteError(false); }}
        className="w-7 h-7 rounded-full flex items-center justify-center active:scale-95 transition-transform"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <MoreVertical className="w-3.5 h-3.5 text-white" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-9 w-44 rounded-2xl overflow-hidden z-30"
          style={{
            background: "rgba(14,14,22,0.96)",
            backdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 48px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(139,92,246,0.1)",
          }}
        >
          {isPremium && (
            <Link
              href="/promotion-tools"
              className="flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold border-b border-white/6 active:bg-white/5"
              style={{ color: "#F59E0B" }}
              onClick={() => setOpen(false)}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Booster l'annonce
            </Link>
          )}
          {!showConfirm ? (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConfirm(true); }}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-white/70 active:bg-white/5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />Supprimer l'annonce
            </button>
          ) : (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-red-400 bg-red-500/8 active:bg-red-500/15 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleting ? "Suppression..." : deleteError ? "Erreur, réessaie" : "Confirmer"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function ProfileView({ profile, products: initialProducts, isOwner, currentUserId, isAdmin = false }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("annonces");
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const menuRef = useRef<HTMLDivElement>(null);

  const isPremium = isAdmin;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleDelete = (id: string) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const tabs: { id: Tab; label: string }[] = [
    { id: "annonces", label: "Annonces" },
    { id: "evaluations", label: "Évaluations" },
    { id: "apropos", label: "À propos" },
  ];

  return (
    <div
      className="min-h-[100dvh] pb-8 relative overflow-hidden"
      style={{ background: "#07070A" }}
    >
      {/* Ambient orbs */}
      <div className="absolute pointer-events-none"
        style={{ top: -80, left: "50%", transform: "translateX(-50%)", width: 400, height: 400,
          background: "radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%)", filter: "blur(40px)" }} />
      <div className="absolute pointer-events-none animate-orb-r"
        style={{ bottom: 160, right: -60, width: 280, height: 280,
          background: "radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 70%)", filter: "blur(50px)" }} />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 pt-5 pb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60 flex-shrink-0 transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-black text-white flex-1 truncate">
          {profile.full_name || profile.username}
        </h1>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60 transition-all active:scale-90"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-11 w-52 rounded-2xl overflow-hidden z-50"
              style={{
                background: "rgba(14,14,22,0.96)",
                backdropFilter: "blur(28px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 20px 48px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(139,92,246,0.1)",
              }}
            >
              {isOwner && (
                <Link href="/profile/edit"
                  className="flex items-center gap-3 px-4 py-3.5 text-[14px] text-white active:bg-white/5 transition-colors"
                  onClick={() => setMenuOpen(false)}>
                  <Edit2 className="w-4 h-4 text-white/40" />
                  Modifier mon profil
                </Link>
              )}
              <button
                className="w-full flex items-center gap-3 px-4 py-3.5 text-[14px] text-white active:bg-white/5 transition-colors"
                onClick={() => setMenuOpen(false)}>
                <Share2 className="w-4 h-4 text-white/40" />
                Partager mon profil
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile hero */}
      <div className="relative z-10 px-4 pb-5">
        <div
          className="rounded-[28px] p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.08) inset",
          }}
        >
          {/* Card orb */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)", filter: "blur(20px)" }} />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 70%)", filter: "blur(20px)" }} />

          <div className="relative z-10 flex items-start gap-4">
            {/* Avatar */}
            <div
              className="w-[68px] h-[68px] rounded-[22px] flex items-center justify-center text-[30px] font-black text-white flex-shrink-0 overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #9B6FF8, #7C3AED)",
                boxShadow: "0 8px 28px rgba(139,92,246,0.45), 0 1px 0 rgba(255,255,255,0.15) inset",
              }}
            >
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                (profile.full_name || profile.username || "?")[0].toUpperCase()
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[19px] font-black text-white tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                  {profile.full_name || profile.username}
                </h2>
                {isPremium && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#fff",
                      boxShadow: "0 2px 8px rgba(245,158,11,0.3)" }}>
                    ✦ PRO
                  </span>
                )}
              </div>
              <p className="text-[12px] font-medium mt-0.5" style={{ color: "rgba(167,139,250,0.5)" }}>
                @{profile.username}
              </p>

              {(profile as any).city && (
                <div className="flex items-center gap-1 mt-1.5">
                  <MapPin className="w-3 h-3" style={{ color: "rgba(255,255,255,0.2)" }} />
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}>{(profile as any).city}</span>
                </div>
              )}

              {/* Stats row */}
              <div className="flex items-center gap-0 mt-3">
                <div className="flex-1 text-center">
                  <p className="text-[20px] font-black text-white leading-none" style={{ letterSpacing: "-0.02em" }}>
                    {products.length}
                  </p>
                  <p className="text-[9.5px] font-semibold mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>annonces</p>
                </div>
                <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.07)" }} />
                <div className="flex-1 text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <p className="text-[20px] font-black text-white leading-none" style={{ letterSpacing: "-0.02em" }}>5.0</p>
                  </div>
                  <p className="text-[9.5px] font-semibold mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>note</p>
                </div>
                <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.07)" }} />
                <div className="flex-1 text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <p className="text-[20px] font-black text-white leading-none">✓</p>
                  </div>
                  <p className="text-[9.5px] font-semibold mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>vérifié</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="relative z-10 text-[12.5px] leading-relaxed mt-4 pt-4"
              style={{ color: "rgba(255,255,255,0.42)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="relative z-10 flex mx-4 mb-1"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        {tabs.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-3 text-[13.5px] font-bold transition-all duration-200 relative ${tab === id ? "text-white" : "text-white/28"}`}>
            {label}
            {tab === id && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-[2.5px] rounded-full animate-tab-in"
                style={{ background: "linear-gradient(90deg, #8B5CF6, #C4B5FD)" }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="relative z-10 px-3 pt-4">
        {tab === "annonces" && (
          <>
            {products.length > 0 && (
              <p className="text-[10px] font-black uppercase tracking-widest mb-3 px-1"
                style={{ color: "rgba(255,255,255,0.2)" }}>
                {isOwner ? "MES ANNONCES" : "ANNONCES"} · {products.length}
              </p>
            )}
            {products.length === 0 ? (
              <div
                className="py-16 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 60%)" }} />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                  style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.14)" }}>
                  <Package className="w-6 h-6" style={{ color: "rgba(139,92,246,0.5)" }} />
                </div>
                <p className="relative z-10 text-[14px] font-bold" style={{ color: "rgba(255,255,255,0.32)" }}>
                  Aucune annonce active
                </p>
                {isOwner && (
                  <Link href="/sell"
                    className="relative z-10 mt-4 px-5 py-2.5 rounded-xl text-[12.5px] font-bold text-white active:scale-95 transition-transform"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                      boxShadow: "0 4px 18px rgba(139,92,246,0.35), 0 1px 0 rgba(255,255,255,0.12) inset" }}>
                    Publier une annonce
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {products.map((p) => (
                  <div key={p.id} className="relative">
                    <ProductCard product={p} currentUserId={currentUserId} />
                    {isOwner && <CardMenu product={p} isPremium={isPremium} onDelete={handleDelete} />}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "evaluations" && (
          <div
            className="py-16 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.05) 0%, transparent 60%)" }} />
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 relative z-10"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.12)" }}>
              <Star className="w-6 h-6" style={{ color: "rgba(245,158,11,0.45)" }} />
            </div>
            <p className="relative z-10 text-[14px] font-bold" style={{ color: "rgba(255,255,255,0.32)" }}>
              Aucun avis pour l'instant
            </p>
          </div>
        )}

        {tab === "apropos" && (
          <div
            className="p-5 rounded-2xl"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05) inset",
            }}
          >
            <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
              {profile.bio || "Aucune description"}
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
