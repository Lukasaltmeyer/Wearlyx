"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Home, Compass, Plus, MessageCircle, User, Zap, Crown,
  Heart, Bell, Settings, TrendingUp, Search,
} from "lucide-react";
import { CommandPalette } from "@/components/desktop/CommandPalette";

const NAV = [
  { href: "/",              icon: Home,          label: "Accueil",        shortcut: "G H" },
  { href: "/search",        icon: Compass,       label: "Explorer",       shortcut: "G E" },
  { href: "/messages",      icon: MessageCircle, label: "Messages",       shortcut: "G M",  badge: 3 },
  { href: "/notifications", icon: Bell,          label: "Notifications",  shortcut: "G N",  badge: 7 },
  { href: "/favorites",     icon: Heart,         label: "Favoris",        shortcut: "G F" },
  { href: "/profile/menu",  icon: User,          label: "Profil",         shortcut: "G P" },
];

function Logo() {
  return (
    <span className="text-[16px] font-black tracking-tight select-none" style={{ letterSpacing: "-0.035em" }}>
      <span className="text-white/90">Wear</span>
      <span style={{
        background: "linear-gradient(135deg, #C4B5FD, #8B5CF6)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>lyx</span>
    </span>
  );
}

function LeftSidebar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] flex flex-col z-40"
      style={{
        background: "rgba(6,6,9,0.96)",
        backdropFilter: "blur(48px) saturate(180%)",
        WebkitBackdropFilter: "blur(48px) saturate(180%)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "1px 0 0 rgba(255,255,255,0.02)",
      }}>

      {/* Logo + search shortcut */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0">
        <Link href="/" className="block mb-4">
          <Logo />
        </Link>
        {/* Search shortcut pill */}
        <button
          onClick={onOpenPalette}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] transition-all text-left group"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.2)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
          }}>
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} />
          <span className="flex-1 text-[12px]" style={{ color: "rgba(255,255,255,0.28)" }}>Rechercher…</span>
          <kbd className="text-[9px] font-semibold px-1.5 py-0.5 rounded-[4px] flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.08)" }}>
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 flex flex-col gap-px overflow-y-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-[7px] rounded-[7px] text-[13px] transition-colors duration-100 relative"
              style={{
                background: active ? "rgba(139,92,246,0.12)" : "transparent",
                color: active ? "rgba(196,181,253,0.95)" : "rgba(255,255,255,0.30)",
                fontWeight: active ? 500 : 400,
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.045)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.60)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.30)";
                }
              }}>
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-4 rounded-r-full"
                  style={{ background: "linear-gradient(180deg, #A78BFA, #7C3AED)" }} />
              )}
              <div className="relative flex-shrink-0">
                <Icon style={{ width: 15, height: 15, color: active ? "#A78BFA" : "inherit" }}
                  strokeWidth={active ? 2 : 1.6} />
                {badge != null && badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-black text-white flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", boxShadow: "0 0 0 1.5px rgba(6,6,9,1)" }}>
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </div>
              <span className="flex-1">{label}</span>
            </Link>
          );
        })}

        <div className="my-3 h-px mx-1" style={{ background: "rgba(255,255,255,0.05)" }} />

        {/* Sell CTA */}
        <Link href="/sell/ai"
          className="flex items-center gap-2.5 px-3 py-[7.5px] rounded-[8px] text-[12.5px] font-semibold text-white transition-all hover:brightness-115 hover:-translate-y-px"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #5b21b6)",
            boxShadow: "0 3px 16px rgba(124,58,237,0.28), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}>
          <Plus style={{ width: 14, height: 14, flexShrink: 0 }} strokeWidth={2.5} />
          Vendre un article
          <span className="ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>
            IA
          </span>
        </Link>

        {/* Premium */}
        <Link href="/premium"
          className="flex items-center gap-2.5 px-3 py-[7px] rounded-[7px] text-[12.5px] font-medium transition-all mt-px hover:brightness-110"
          style={{
            background: "rgba(245,158,11,0.07)",
            border: "1px solid rgba(245,158,11,0.12)",
            color: "rgba(245,158,11,0.80)",
          }}>
          <Crown style={{ width: 13, height: 13, flexShrink: 0 }} strokeWidth={2} />
          Plan Premium
        </Link>
      </nav>

      {/* Bottom profile */}
      <div className="px-2.5 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <Link href="/profile/menu"
          className="flex items-center gap-2.5 px-3 py-[7px] rounded-[7px] transition-colors"
          style={{ color: "rgba(255,255,255,0.32)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.045)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.32)"; }}>
          <div className="w-[24px] h-[24px] rounded-[7px] flex-shrink-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}>
            <User style={{ width: 12, height: 12, color: "white" }} />
          </div>
          <span className="text-[12.5px] font-medium truncate flex-1">Mon compte</span>
          <Settings style={{ width: 11, height: 11, flexShrink: 0, color: "rgba(255,255,255,0.16)" }} />
        </Link>
      </div>
    </aside>
  );
}

function LiveDot() {
  return (
    <span className="relative inline-flex w-2 h-2 flex-shrink-0">
      <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
        style={{ background: "#10B981" }} />
      <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: "#10B981" }} />
    </span>
  );
}

function RightPanel() {
  const TRENDING = ["Nike Air Force 1", "Zara 2024", "Jacquemus", "Vintage Levi's", "Jordan 1 Retro"];
  const [tick, setTick] = useState(0);

  // Simulate live sales ticking up
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 4200);
    return () => clearInterval(id);
  }, []);

  const sales = 1247 + tick;

  return (
    <aside className="fixed right-0 top-0 bottom-0 w-[272px] overflow-y-auto"
      style={{
        background: "rgba(6,6,10,0.88)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        borderLeft: "1px solid rgba(255,255,255,0.04)",
        scrollbarWidth: "none",
      }}>
      <div className="p-4 flex flex-col gap-5">

        {/* Live stats */}
        <div>
          <div className="flex items-center gap-2 mb-2.5 px-1">
            <LiveDot />
            <p className="text-[9.5px] font-bold uppercase tracking-widest" style={{ color: "rgba(16,185,129,0.7)" }}>
              Live · Wearlyx
            </p>
          </div>
          <div className="rounded-[12px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { label: "Membres",           value: "50 K+",          stable: true },
              { label: "Ventes aujourd'hui", value: sales.toLocaleString("fr"), stable: false },
              { label: "Articles en ligne",  value: "32 K",           stable: true },
              { label: "Note moyenne",       value: "4.8 ★",          stable: true },
            ].map(({ label, value, stable }, i, arr) => (
              <div key={label} className="flex items-center justify-between px-3.5 py-2.5"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                <span className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.26)" }}>{label}</span>
                <span className="text-[11.5px] font-semibold flex items-center gap-1.5"
                  style={{ color: stable ? "rgba(255,255,255,0.72)" : "#10B981" }}>
                  {!stable && <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: "#10B981" }} />}
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div>
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <TrendingUp style={{ width: 11, height: 11, color: "#8B5CF6" }} />
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.20)" }}>Tendances</p>
          </div>
          <div className="flex flex-col gap-px">
            {TRENDING.map((t, i) => (
              <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
                className="flex items-center gap-2.5 px-2.5 py-2 transition-colors rounded-[7px]"
                style={{ color: "rgba(255,255,255,0.36)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.72)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.36)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <span className="text-[9.5px] font-black w-4 flex-shrink-0 text-center"
                  style={{ color: i < 3 ? "rgba(139,92,246,0.55)" : "rgba(255,255,255,0.14)" }}>
                  {i + 1}
                </span>
                <span className="text-[12px] flex-1 truncate">{t}</span>
                <span className="text-[9.5px] font-semibold flex-shrink-0"
                  style={{ color: i < 3 ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.14)" }}>
                  {["↑12%", "↑8%", "↑5%", "", ""][i]}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Boost CTA */}
        <Link href="/promotion-tools"
          className="flex items-center gap-3 px-3.5 py-3.5 rounded-[12px] transition-all"
          style={{
            background: "rgba(124,58,237,0.07)",
            border: "1px solid rgba(139,92,246,0.13)",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.24)"; (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.12)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.13)"; (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.07)"; }}>
          <div className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)", boxShadow: "0 3px 10px rgba(124,58,237,0.3)" }}>
            <Zap style={{ width: 14, height: 14, color: "white" }} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-white/75">Booster mes annonces</p>
            <p className="text-[10.5px] mt-px" style={{ color: "rgba(255,255,255,0.26)" }}>+300% de visibilité</p>
          </div>
        </Link>

        {/* Popular sellers */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2 px-1" style={{ color: "rgba(255,255,255,0.16)" }}>
            Vendeurs actifs
          </p>
          {[
            { handle: "@stylebylea",    gradient: "#8B5CF6,#7C3AED" },
            { handle: "@vintageking",   gradient: "#EC4899,#DB2777" },
            { handle: "@luxmode_paris", gradient: "#F59E0B,#D97706" },
          ].map(({ handle, gradient }) => (
            <div key={handle} className="flex items-center justify-between px-1 py-[6px] rounded-[6px] transition-colors cursor-pointer"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <div className="flex items-center gap-2.5">
                <div className="w-[22px] h-[22px] rounded-full flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${gradient})` }} />
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.48)" }}>{handle}</span>
              </div>
              <button className="text-[10px] font-semibold px-2 py-0.5 rounded-[5px] transition-colors"
                style={{ border: "1px solid rgba(139,92,246,0.2)", color: "rgba(167,139,250,0.65)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                + Suivre
              </button>
            </div>
          ))}
        </div>

        {/* App version */}
        <div className="text-center pt-1">
          <span className="text-[10px] font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.08)" }}>
            WEARLYX v2.0
          </span>
        </div>
      </div>
    </aside>
  );
}

export function DesktopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);

  // ⌘K / Ctrl+K to open palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(v => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (pathname.startsWith("/admin")) return <>{children}</>;
  if (pathname.startsWith("/auth")) return <>{children}</>;

  const isFullBleed = pathname.startsWith("/messages") || pathname.startsWith("/profile/menu") || pathname.startsWith("/notifications");

  return (
    <div className="min-h-[100dvh] relative overflow-x-hidden"
      style={{ background: "radial-gradient(ellipse at 52% 0%, #0e0820 0%, #080612 38%, #050409 100%)" }}>
      {/* Ambient orbs */}
      <div className="fixed pointer-events-none"
        style={{ top: -160, left: "50%", transform: "translateX(-50%)", width: 900, height: 700,
          background: "radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 62%)", filter: "blur(90px)", zIndex: 0 }} />
      <div className="fixed pointer-events-none"
        style={{ top: -200, left: "15%", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(109,40,217,0.04) 0%, transparent 65%)", filter: "blur(110px)", zIndex: 0 }} />
      <div className="fixed pointer-events-none"
        style={{ bottom: -80, right: "18%", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(109,40,217,0.03) 0%, transparent 70%)", filter: "blur(120px)", zIndex: 0 }} />

      <LeftSidebar onOpenPalette={() => setPaletteOpen(true)} />
      {!isFullBleed && <RightPanel />}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <main
        className="relative min-h-[100dvh]"
        style={{
          marginLeft: "220px",
          marginRight: isFullBleed ? "0" : "272px",
          zIndex: 1,
        }}>
        {children}
      </main>
    </div>
  );
}
