/**
 * VERSION 2 — ULTRA TIKTOK / ADDICTIVE
 *
 * Usage : remplacer <HeroBanner /> par <HeroBannerViral /> dans app/page.tsx
 *
 * Palette :
 *   background   #07070A
 *   surfaces     #111827
 *   primary      #8B5CF6  (vert néon)
 *   accent hot   #F59E0B  (ambre chaud)
 *   pop gradient #8B5CF6 → #06B6D4  (vert → cyan)
 */

import Link from "next/link";
import { Zap, Crown, TrendingUp, ArrowRight } from "lucide-react";

export function HeroBannerViral() {
  return (
    <div className="px-4 pt-4 pb-2 space-y-2.5">

      {/* ── HERO principale — Vendre avec l'IA ──────────────────────────────── */}
      <Link href="/sell/ai" className="block active:scale-[0.975] transition-transform duration-150">
        <div
          className="relative rounded-3xl overflow-hidden p-5"
          style={{
            background: "linear-gradient(135deg, #0F0A1E 0%, #2E1065 40%, #4C1D95 100%)",
            border: "1px solid rgba(139,92,246,0.3)",
            boxShadow: "0 8px 40px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Glow orbs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 65%)" }} />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%)" }} />

          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              {/* Live badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3"
                style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.35)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
                <span className="text-[10px] font-black text-[#A78BFA] tracking-wide uppercase">IA Active</span>
              </div>

              <h2 className="text-[22px] font-black text-white leading-tight mb-1">
                Vends avec l'IA
              </h2>
              <p className="text-[12.5px] text-white/55 leading-relaxed">
                Photo → annonce complète en 30 secondes
              </p>

              <div className="flex items-center gap-2 mt-3.5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                  style={{ background: "#8B5CF6", boxShadow: "0 4px 14px rgba(139,92,246,0.4)" }}>
                  <Zap className="w-3.5 h-3.5 text-white fill-white" />
                  <span className="text-[12px] font-black text-white">Essayer gratuit</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30" />
              </div>
            </div>

            {/* Right icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ml-3"
              style={{
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(139,92,246,0.3)",
                backdropFilter: "blur(8px)",
              }}>
              <Zap className="w-7 h-7 fill-[#8B5CF6] text-[#8B5CF6]" />
            </div>
          </div>
        </div>
      </Link>

      {/* ── Ligne du bas : 2 mini cartes ────────────────────────────────────── */}
      <div className="flex gap-2.5">

        {/* Premium */}
        <Link href="/premium" className="flex-1 block active:scale-[0.97] transition-transform duration-150">
          <div
            className="relative rounded-2xl overflow-hidden p-3.5 h-[88px] flex flex-col justify-between"
            style={{
              background: "linear-gradient(140deg, #1c1400 0%, #292000 100%)",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" }} />

            <div className="flex items-center justify-between relative z-10">
              <Crown className="w-5 h-5" style={{ color: "#F59E0B" }} />
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(245,158,11,0.15)", color: "#FCD34D", border: "1px solid rgba(245,158,11,0.2)" }}>
                PRO
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-[13px] font-black text-white leading-tight">Premium</p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Boosts illimités</p>
            </div>
          </div>
        </Link>

        {/* Tendances */}
        <Link href="/search" className="flex-1 block active:scale-[0.97] transition-transform duration-150">
          <div
            className="relative rounded-2xl overflow-hidden p-3.5 h-[88px] flex flex-col justify-between"
            style={{
              background: "linear-gradient(140deg, #0c1118 0%, #111827 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />

            <div className="flex items-center justify-between relative z-10">
              <TrendingUp className="w-5 h-5" style={{ color: "#8B5CF6" }} />
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse"
                style={{ background: "rgba(139,92,246,0.1)", color: "#A78BFA", border: "1px solid rgba(139,92,246,0.15)" }}>
                🔥 Hot
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-[13px] font-black text-white leading-tight">Tendances</p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Articles du moment</p>
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}