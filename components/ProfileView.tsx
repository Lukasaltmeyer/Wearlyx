"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MoreVertical, Edit2, Share2, Star, Package, Zap, Trash2, X } from "lucide-react";
import type { Profile, Product } from "@/types/database";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

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
    if (error) {
      setDeleteError(true);
      setDeleting(false);
      return;
    }
    onDelete(product.id);
  };

  return (
    <div ref={ref} className="absolute top-2 right-2 z-20">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); setShowConfirm(false); setDeleteError(false); }}
        className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform"
      >
        <MoreVertical className="w-3.5 h-3.5 text-white" />
      </button>

      {open && (
        <div className="absolute right-0 top-9 w-44 rounded-2xl border border-white/10 bg-[#1A1A26] shadow-2xl overflow-hidden z-30">
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
              {deleting ? "Suppression..." : deleteError ? "Erreur, réessaie" : "Confirmer la suppression"}
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
    <div className="min-h-[100dvh] bg-[#08080F] pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 flex-shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-black text-white flex-1">{profile.full_name || profile.username}</h1>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60">
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 w-52 rounded-2xl border border-white/10 bg-[#1A1A26] shadow-2xl z-50 overflow-hidden">
              {isOwner && (
                <Link href="/profile/edit"
                  className="flex items-center gap-3 px-4 py-3.5 text-[14px] text-white hover:bg-white/5 transition-colors"
                  onClick={() => setMenuOpen(false)}>
                  <Edit2 className="w-4 h-4 text-white/50" />
                  Modifier mon profil
                </Link>
              )}
              <button
                className="w-full flex items-center gap-3 px-4 py-3.5 text-[14px] text-white hover:bg-white/5 transition-colors"
                onClick={() => setMenuOpen(false)}>
                <Share2 className="w-4 h-4 text-white/50" />
                Partager mon profil
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/8 px-4">
        {tabs.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-3 text-[14px] font-semibold transition-colors relative ${tab === id ? "text-white" : "text-white/35"}`}>
            {label}
            {tab === id && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6C63FF] rounded-full" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-4 pt-4">
        {tab === "annonces" && (
          <>
            {products.length > 0 && (
              <p className="text-[11px] font-black text-white/30 uppercase tracking-wider mb-3">
                {isOwner ? "MES ANNONCES ACTIVES" : "ANNONCES ACTIVES"}
              </p>
            )}
            {products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-[14px] text-white/30">Aucune annonce active</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {products.map((p) => (
                  <div key={p.id} className="relative">
                    <ProductCard product={p} currentUserId={currentUserId} />
                    {isOwner && (
                      <CardMenu product={p} isPremium={isPremium} onDelete={handleDelete} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "evaluations" && (
          <div className="text-center py-16">
            <Star className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-[14px] text-white/30">Aucun avis pour l'instant</p>
          </div>
        )}

        {tab === "apropos" && (
          <div className="p-4 rounded-2xl border border-white/8 bg-white/3">
            <p className="text-[14px] text-white/35 text-center">{profile.bio || "Aucune description"}</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
