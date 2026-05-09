"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Compass, Plus, MessageCircle, User, Zap, Crown, Heart, Bell, Settings, TrendingUp, Star } from "lucide-react";

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
      style={{ background: "#08080e", borderRight: "1px solid rgba(255,255,255,0.04)" }}>

      {/* Logo */}
      <div className="px-5 py-5 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
            <Star className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="text-[20px] font-black text-white tracking-tight">
            Wear<span style={{ color: "#8B5CF6" }}>lyx</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-150 group relative"
              style={{
                background: active ? "rgba(139,92,246,0.14)" : "transparent",
                color: active ? "#C4B5FD" : "rgba(255,255,255,0.4)",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; } }}>
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[#8B5CF6]" />}
              <Icon className="w-[18px] h-[18px] flex-shrink-0"
                style={{ color: active ? "#8B5CF6" : "inherit" }}
                strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}

        <div className="my-2.5 h-px mx-2" style={{ background: "rgba(255,255,255,0.05)" }} />

        <Link href="/sell/ai"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-[13.5px] font-bold text-white transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #7C3AED, #5b21b6)", boxShadow: "0 4px 20px rgba(124,58,237,0.2)" }}>
          <Plus className="w-[18px] h-[18px]" strokeWidth={2.5} />
          Vendre un article
        </Link>

        <Link href="/premium"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all mt-1 hover:brightness-110"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.12)", color: "#F59E0B" }}>
          <Crown className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.8} />
          Plan Premium
        </Link>
      </nav>

      {/* Bottom */}
      <div className="px-2.5 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <Link href="/profile/menu"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all hover:bg-white/5">
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}>
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white/70 truncate">Mon compte</p>
          </div>
          <Settings className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
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
      style={{ background: "#08080e", borderLeft: "1px solid rgba(255,255,255,0.04)", scrollbarWidth: "none" }}>
      <div className="p-4 flex flex-col gap-4">

        {/* Stats card */}
        <div className="rounded-2xl p-4"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(124,58,237,0.04))", border: "1px solid rgba(139,92,246,0.1)" }}>
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
          className="flex items-center gap-3 p-3.5 rounded-2xl transition-all hover:scale-[1.02] group"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(109,40,217,0.08))", border: "1px solid rgba(139,92,246,0.15)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(139,92,246,0.18)" }}>
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

  // Full-bleed pages (messages uses own layout)
  const isFullBleed = pathname.startsWith("/messages");

  return (
    <div className="min-h-[100dvh]" style={{ background: "#07070A" }}>
      <LeftSidebar />
      {!isFullBleed && <RightPanel />}
      <main
        className="min-h-[100dvh]"
        style={{
          marginLeft: "220px",
          marginRight: isFullBleed ? "0" : "280px",
        }}>
        {children}
      </main>
    </div>
  );
}
