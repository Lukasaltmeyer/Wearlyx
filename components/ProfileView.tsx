"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MoreVertical, Edit2, Share2, Star, Package, Zap } from "lucide-react";
import type { Profile, Product } from "@/types/database";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/layout/BottomNav";

interface Props {
  profile: Profile;
  products: Product[];
  savedProducts: Product[];
  isOwner: boolean;
  currentUserId?: string;
}

type Tab = "annonces" | "evaluations" | "apropos";

export function ProfileView({ profile, products, isOwner, currentUserId }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("annonces");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "annonces", label: "Annonces" },
    { id: "evaluations", label: "Évaluations" },
    { id: "apropos", label: "À propos" },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#08080F] pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-black text-white flex-1">
          {profile.full_name || profile.username}
        </h1>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 w-52 rounded-2xl border border-white/10 bg-[#1A1A26] shadow-2xl z-50 overflow-hidden">
              {isOwner && (
                <Link
                  href="/profile/edit"
                  className="flex items-center gap-3 px-4 py-3.5 text-[14px] text-white hover:bg-white/5 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Edit2 className="w-4 h-4 text-white/50" />
                  Modifier mon profil
                </Link>
              )}
              <button
                className="w-full flex items-center gap-3 px-4 py-3.5 text-[14px] text-white hover:bg-white/5 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
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
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 py-3 text-[14px] font-semibold transition-colors relative ${
              tab === id ? "text-white" : "text-white/35"
            }`}
          >
            {label}
            {tab === id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6C63FF] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-4 pt-4">
        {tab === "annonces" && (
          <>
            {products.length > 0 && (
              <p className="text-[11px] font-black text-white/30 uppercase tracking-wider mb-3">
                MES ANNONCES ACTIVES
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
                    <Link
                      href="/promotion-tools"
                      className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold text-white"
                      style={{ background: "rgba(76,175,80,0.9)" }}
                    >
                      <Zap className="w-3 h-3" />
                      BOOSTER
                    </Link>
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
            <p className="text-[14px] text-white/35 text-center">
              {profile.bio || "Aucune description"}
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
