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
        background: "rgba(7,7,10,0.92)",
        backdropFilter: "blur(32px) saturate(200%)",
        WebkitBackdropFilter: "blur(32px) saturate(200%)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "1px 0 0 rgba(255,255,255,0.03)",
      }}>

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-[19px] font-black tracking-tight select-none" style={{ letterSpacing: "-0.03em" }}>
            <span className="text-white">Wear</span><span style={{
              background: "linear-gradient(135deg, #A78BFA, #7C3AED)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>lyx</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-[2px] overflow-y-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-[9px] rounded-[11px] text-[13px] font-medium transition-all duration-150 relative overflow-hidden group"
              style={{
                background: active ? "rgba(139,92,246,0.12)" : "transparent",
                color: active ? "#C4B5FD" : "rgba(255,255,255,0.38)",
                boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(139,92,246,0.15)" : "none",
              }}
              onMouseEnter={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.04)";
                  el.style.color = "rgba(255,255,255,0.72)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "transparent";
                  el.style.color = "rgba(255,255,255,0.38)";
                }
              }}>
              {/* Active left accent */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r-full"
                  style={{ background: "linear-gradient(180deg, #A78BFA, #7C3AED)", boxShadow: "2px 0 8px rgba(139,92,246,0.5)" }} />
              )}
              {/* Icon container */}
              <span className="flex-shrink-0 w-[26px] h-[26px] flex items-center justify-center rounded-[8px]"
                style={{
                  background: active ? "rgba(139,92,246,0.22)" : "transparent",
                  transition: "background 0.15s",
                }}>
                <Icon className="w-[15px] h-[15px]"
                  style={{ color: active ? "#A78BFA" : "inherit" }}
                  strokeWidth={active ? 2.2 : 1.8} />
              </span>
              <span className="font-semibold">{label}</span>
            </Link>
          );
        })}

        <div className="my-3 h-px mx-1" style={{ background: "rgba(255,255,255,0.04)" }} />

        {/* Sell CTA */}
        <Link href="/sell/ai"
          className="flex items-center gap-2.5 px-3 py-[10px] rounded-[11px] text-[13px] font-bold text-white transition-all duration-150 relative overflow-hidden hover:brightness-110 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #5b21b6 100%)",
            boxShadow: "0 4px 24px rgba(124,58,237,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}>
          <span className="w-[26px] h-[26px] flex items-center justify-center rounded-[8px] flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.12)" }}>
            <Plus className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </span>
          Vendre un article
        </Link>

        {/* Premium */}
        <Link href="/premium"
          className="flex items-center gap-2.5 px-3 py-[9px] rounded-[11px] text-[12.5px] font-semibold transition-all mt-0.5 hover:brightness-110"
          style={{
            background: "rgba(245,158,11,0.07)",
            border: "1px solid rgba(245,158,11,0.14)",
            color: "#F59E0B",
            boxShadow: "inset 0 1px 0 rgba(245,158,11,0.08)",
          }}>
          <span className="w-[26px] h-[26px] flex items-center justify-center rounded-[8px] flex-shrink-0"
            style={{ background: "rgba(245,158,11,0.1)" }}>
            <Crown className="w-[14px] h-[14px]" strokeWidth={2} />
          </span>
          Plan Premium
        </Link>
      </nav>

      {/* Bottom profile */}
      <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <Link href="/profile/menu"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-[11px] transition-all duration-150 group"
          style={{ background: "transparent" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          <div className="w-[30px] h-[30px] rounded-[10px] flex-shrink-0 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
              boxShadow: "0 2px 8px rgba(139,92,246,0.35)",
            }}>
            <User className="w-[14px] h-[14px] text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold truncate" style={{ color: "rgba(255,255,255,0.65)" }}>Mon compte</p>
          </div>
          <Settings className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(255,255,255,0.18)" }} />
        </Link>
      </div>
    </aside>
  );
}

// Dynamic right panel per page
function RightPanel() {
  const TRENDING = ["Nike Air Force 1", "Zara 2024", "Jacquemus", "Vintage Levi's", "Jordan 1 Retro"];

  return (
    <aside className="fixed right-0 top-0 bottom-0 w-[280px] overflow-y-auto"
      style={{
        background: "rgba(7,7,12,0.88)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        scrollbarWidth: "none",
      }}>
      <div className="p-4 flex flex-col gap-4">

        {/* Stats card */}
        <div className="rounded-2xl p-4"
          style={{
            background: "linear-gradient(145deg, rgba(139,92,246,0.10), rgba(109,40,217,0.05))",
            border: "1px solid rgba(139,92,246,0.14)",
            boxShadow: "0 4px 20px rgba(139,92,246,0.06), 0 1px 0 rgba(255,255,255,0.06) inset",
          }}>
          <p className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest mb-3">Live · Wearlyx</p>
          {[
            { label: "Membres", value: "50 K+" },
            { label: "Ventes aujourd'hui", value: "1 247" },
            { label: "Articles en ligne", value: "32 K" },
            { label: "Note moyenne", value: "4.8 ★" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-1">
              <span className="text-[11px] text-white/35">{label}</span>
              <span className="text-[12px] font-black text-white">{value}</span>
            </div>
          ))}
        </div>

        {/* Trending */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <p className="text-[12px] font-bold text-white">Tendances</p>
          </div>
          {TRENDING.map((t, i) => (
            <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/4 transition-all group">
              <span className="text-[10px] font-black text-white/15 w-3.5">{i + 1}</span>
              <span className="text-[12px] font-medium text-white/55 group-hover:text-white/80 transition-colors">{t}</span>
            </Link>
          ))}
        </div>

        {/* Boost CTA */}
        <Link href="/promotion-tools"
          className="flex items-center gap-3 p-3.5 rounded-2xl transition-all hover:-translate-y-0.5 group"
          style={{
            background: "linear-gradient(145deg, rgba(124,58,237,0.14), rgba(109,40,217,0.07))",
            border: "1px solid rgba(139,92,246,0.18)",
            boxShadow: "0 4px 16px rgba(139,92,246,0.07)",
          }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.22)" }}>
            <Zap className="w-4 h-4 text-[#A78BFA]" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white">Booster mes annonces</p>
            <p className="text-[10px] text-white/35 mt-0.5">+300% de visibilité</p>
          </div>
        </Link>

        {/* Popular sellers */}
        <div>
          <p className="text-[12px] font-bold text-white mb-2.5">Vendeurs populaires</p>
          {["@stylebylea", "@vintageking", "@luxmode_paris"].map((u, i) => (
            <div key={u} className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-white/4 transition-all">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${["#8B5CF6,#7C3AED", "#EC4899,#DB2777", "#F59E0B,#D97706"][i]})` }} />
                <div>
                  <p className="text-[11px] font-semibold text-white/70">{u}</p>
                  <p className="text-[9px] text-white/25">⭐ 4.{8 + i} · Pro</p>
                </div>
              </div>
              <button className="text-[10px] font-bold px-2.5 py-1 rounded-full text-[#A78BFA] hover:bg-[#8B5CF6]/15 transition-all"
                style={{ border: "1px solid rgba(139,92,246,0.25)" }}>
                Suivre
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

  // Full-bleed pages (messages uses own layout, profile/menu needs full width)
  const isFullBleed = pathname.startsWith("/messages") || pathname.startsWith("/profile/menu");

  return (
    <div className="min-h-[100dvh] relative overflow-x-hidden" style={{ background: "#07070A" }}>
      {/* Global ambient orbs */}
      <div className="fixed pointer-events-none"
        style={{ top: -200, left: "30%", width: 800, height: 800,
          background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)", filter: "blur(100px)", zIndex: 0 }} />
      <div className="fixed pointer-events-none"
        style={{ bottom: -100, right: "20%", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(109,40,217,0.04) 0%, transparent 70%)", filter: "blur(120px)", zIndex: 0 }} />
      <LeftSidebar />
      {!isFullBleed && <RightPanel />}
      <main
        className="relative min-h-[100dvh]"
        style={{
          marginLeft: "220px",
          marginRight: isFullBleed ? "0" : "280px",
          zIndex: 1,
        }}>
        {children}
      </main>
    </div>
  );
}
