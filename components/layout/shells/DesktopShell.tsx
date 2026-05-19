"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Compass, Plus, MessageCircle, User, Zap, Crown, Heart, Bell, Settings, TrendingUp } from "lucide-react";

const NAV = [
  { href: "/",              icon: Home,          label: "Accueil" },
  { href: "/search",        icon: Compass,       label: "Explorer" },
  { href: "/messages",      icon: MessageCircle, label: "Messages" },
  { href: "/notifications", icon: Bell,          label: "Notifications" },
  { href: "/favorites",     icon: Heart,         label: "Favoris" },
  { href: "/profile/menu",  icon: User,          label: "Profil" },
];

function LeftSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] flex flex-col z-40"
      style={{
        background: "rgba(6,6,9,0.94)",
        backdropFilter: "blur(44px) saturate(170%)",
        WebkitBackdropFilter: "blur(44px) saturate(170%)",
        borderRight: "1px solid rgba(255,255,255,0.045)",
      }}>

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 flex-shrink-0">
        <Link href="/">
          <span className="text-[16px] font-black tracking-tight select-none" style={{ letterSpacing: "-0.03em" }}>
            <span className="text-white/90">Wear</span><span style={{
              background: "linear-gradient(135deg, #C4B5FD, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>lyx</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 flex flex-col gap-px overflow-y-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-[7px] rounded-[7px] text-[13px] transition-colors duration-100 relative"
              style={{
                background: active ? "rgba(139,92,246,0.10)" : "transparent",
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
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full"
                  style={{ background: "#8B5CF6" }} />
              )}
              <Icon style={{ width: 15, height: 15, flexShrink: 0, color: active ? "#A78BFA" : "inherit" }}
                strokeWidth={active ? 2 : 1.6} />
              <span>{label}</span>
            </Link>
          );
        })}

        <div className="my-2.5 h-px mx-1" style={{ background: "rgba(255,255,255,0.05)" }} />

        {/* Sell CTA */}
        <Link href="/sell/ai"
          className="flex items-center gap-2.5 px-3 py-[7px] rounded-[7px] text-[13px] font-medium text-white transition-all hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #5b21b6)",
            boxShadow: "0 2px 14px rgba(124,58,237,0.22), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}>
          <Plus style={{ width: 14, height: 14, flexShrink: 0 }} strokeWidth={2.5} />
          Vendre un article
        </Link>

        {/* Premium */}
        <Link href="/premium"
          className="flex items-center gap-2.5 px-3 py-[7px] rounded-[7px] text-[12.5px] font-medium transition-all mt-px hover:brightness-110"
          style={{
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.11)",
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

function RightPanel() {
  const TRENDING = ["Nike Air Force 1", "Zara 2024", "Jacquemus", "Vintage Levi's", "Jordan 1 Retro"];

  return (
    <aside className="fixed right-0 top-0 bottom-0 w-[272px] overflow-y-auto"
      style={{
        background: "rgba(6,6,10,0.85)",
        backdropFilter: "blur(36px) saturate(170%)",
        WebkitBackdropFilter: "blur(36px) saturate(170%)",
        borderLeft: "1px solid rgba(255,255,255,0.04)",
        scrollbarWidth: "none",
      }}>
      <div className="p-4 flex flex-col gap-4">

        {/* Stats */}
        <div>
          <p className="text-[9.5px] font-semibold uppercase tracking-widest mb-2.5 px-1" style={{ color: "rgba(139,92,246,0.55)" }}>Live · Wearlyx</p>
          {[
            { label: "Membres", value: "50 K+" },
            { label: "Ventes aujourd'hui", value: "1 247" },
            { label: "Articles en ligne", value: "32 K" },
            { label: "Note moyenne", value: "4.8 ★" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-1 py-[6px]"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.26)" }}>{label}</span>
              <span className="text-[11.5px] font-semibold text-white/72">{value}</span>
            </div>
          ))}
        </div>

        {/* Trending */}
        <div>
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <TrendingUp style={{ width: 11, height: 11, color: "#8B5CF6" }} />
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.20)" }}>Tendances</p>
          </div>
          {TRENDING.map((t, i) => (
            <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
              className="flex items-center gap-2.5 px-1 py-[6px] transition-colors rounded-[5px]"
              style={{ color: "rgba(255,255,255,0.36)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.70)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.36)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <span className="text-[9.5px] font-bold w-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.14)" }}>{i + 1}</span>
              <span className="text-[12px] truncate">{t}</span>
            </Link>
          ))}
        </div>

        {/* Boost CTA */}
        <Link href="/promotion-tools"
          className="flex items-center gap-3 px-3.5 py-3 rounded-[9px] transition-all"
          style={{
            background: "rgba(124,58,237,0.07)",
            border: "1px solid rgba(139,92,246,0.11)",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.22)"; (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.11)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.11)"; (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.07)"; }}>
          <Zap style={{ width: 14, height: 14, color: "#A78BFA", flexShrink: 0 }} />
          <div>
            <p className="text-[12px] font-medium text-white/72">Booster mes annonces</p>
            <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.26)" }}>+300% de visibilité</p>
          </div>
        </Link>

        {/* Popular sellers */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2 px-1" style={{ color: "rgba(255,255,255,0.16)" }}>Vendeurs actifs</p>
          {["@stylebylea", "@vintageking", "@luxmode_paris"].map((u, i) => (
            <div key={u} className="flex items-center justify-between px-1 py-[6px] rounded-[6px] transition-colors cursor-pointer"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <div className="flex items-center gap-2.5">
                <div className="w-[22px] h-[22px] rounded-full flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${["#8B5CF6,#7C3AED", "#EC4899,#DB2777", "#F59E0B,#D97706"][i]})` }} />
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.48)" }}>{u}</span>
              </div>
              <button className="text-[10px] font-medium px-2 py-0.5 rounded-[4px]"
                style={{ border: "1px solid rgba(139,92,246,0.18)", color: "rgba(167,139,250,0.65)" }}>
                + Suivre
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function DesktopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
      <LeftSidebar />
      {!isFullBleed && <RightPanel />}
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
