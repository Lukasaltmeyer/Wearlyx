"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Compass, Plus, MessageCircle, User, Zap, Crown, Heart, Bell, Settings, TrendingUp } from "lucide-react";

const NAV = [
  { href: "/",             icon: Home,          label: "Accueil" },
  { href: "/search",       icon: Compass,       label: "Explorer" },
  { href: "/messages",     icon: MessageCircle, label: "Messages" },
  { href: "/notifications",icon: Bell,          label: "Notifications" },
  { href: "/favorites",    icon: Heart,         label: "Favoris" },
  { href: "/profile/menu", icon: User,          label: "Profil" },
];

function LeftSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] flex flex-col z-40"
      style={{ background: "#09090f", borderRight: "1px solid rgba(255,255,255,0.05)" }}>

      {/* Logo */}
      <div className="px-6 py-5 flex-shrink-0">
        <Link href="/">
          <span className="text-[24px] font-black text-white tracking-tight leading-none">
            Wear<span style={{ color: "#8B5CF6" }}>lyx</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all group"
              style={{ background: active ? "rgba(139,92,246,0.12)" : "transparent", color: active ? "#A78BFA" : "rgba(255,255,255,0.45)" }}>
              <Icon className="w-5 h-5 flex-shrink-0 transition-colors"
                style={{ color: active ? "#8B5CF6" : "rgba(255,255,255,0.3)" }}
                strokeWidth={active ? 2.5 : 1.8} />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-3 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

        {/* Vendre */}
        <Link href="/sell/ai"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)", boxShadow: "0 4px 16px rgba(124,58,237,0.25)" }}>
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          Vendre un article
        </Link>

        {/* Premium */}
        <Link href="/premium"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all mt-1"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", color: "#F59E0B" }}>
          <Crown className="w-5 h-5 flex-shrink-0" strokeWidth={1.8} />
          Plan Premium
        </Link>
      </nav>

      {/* Bottom profile */}
      <div className="px-3 py-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/profile/menu"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">Mon profil</p>
            <p className="text-[11px] text-white/30 truncate">Voir mon compte</p>
          </div>
          <Settings className="w-4 h-4 text-white/20 flex-shrink-0" />
        </Link>
      </div>
    </aside>
  );
}

function RightPanel() {
  const TRENDING = ["Nike Air Force", "Zara 2024", "Jacquemus", "Vintage Levi's", "Jordan 1"];
  return (
    <aside className="fixed right-0 top-0 bottom-0 w-[300px] flex flex-col overflow-y-auto"
      style={{ background: "#09090f", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>

      <div className="p-5 flex flex-col gap-5">

        {/* Stats */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.12)" }}>
          <p className="text-[11px] font-bold text-[#8B5CF6] uppercase tracking-widest mb-3">Wearlyx en chiffres</p>
          {[
            { label: "Membres actifs", value: "50 000+" },
            { label: "Ventes aujourd'hui", value: "1 247" },
            { label: "Note moyenne", value: "4.8 ★" },
            { label: "Articles en ligne", value: "32 000" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-1.5">
              <span className="text-[12px] text-white/40">{label}</span>
              <span className="text-[13px] font-black text-white">{value}</span>
            </div>
          ))}
        </div>

        {/* Trending */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
            <p className="text-[13px] font-bold text-white">Tendances</p>
          </div>
          <div className="flex flex-col gap-1">
            {TRENDING.map((t, i) => (
              <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-black text-white/20 w-4">{i + 1}</span>
                  <span className="text-[13px] font-semibold text-white/70 group-hover:text-white transition-colors">{t}</span>
                </div>
                <span className="text-[10px] text-white/25">+{Math.floor(Math.random() * 200 + 50)}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Boost CTA */}
        <Link href="/promotion-tools"
          className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #1a0533, #2d1062)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(139,92,246,0.2)" }}>
            <Zap className="w-5 h-5 text-[#A78BFA]" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-white">Booster mes annonces</p>
            <p className="text-[11px] text-white/40 mt-0.5">+300% de visibilité</p>
          </div>
        </Link>

        {/* Suggestions */}
        <div>
          <p className="text-[13px] font-bold text-white mb-3">Vendeurs populaires</p>
          <div className="flex flex-col gap-2">
            {["@stylebylea", "@vintageking", "@luxmode"].map((u) => (
              <div key={u} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }} />
                  <div>
                    <p className="text-[12px] font-semibold text-white">{u}</p>
                    <p className="text-[10px] text-white/30">⭐ 4.9 · Vendeur pro</p>
                  </div>
                </div>
                <button className="text-[11px] font-bold px-3 py-1 rounded-full text-[#A78BFA] transition-all hover:bg-[#8B5CF6]/15"
                  style={{ border: "1px solid rgba(139,92,246,0.3)" }}>
                  Suivre
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function DesktopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return <>{children}</>;

  if (pathname.startsWith("/auth")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[100dvh]" style={{ background: "#07070A" }}>
      <LeftSidebar />
      <RightPanel />
      {/* Center feed — between 240px left and 300px right */}
      <main className="min-h-[100dvh] overflow-y-auto"
        style={{ marginLeft: "240px", marginRight: "300px" }}>
        {children}
      </main>
    </div>
  );
}
