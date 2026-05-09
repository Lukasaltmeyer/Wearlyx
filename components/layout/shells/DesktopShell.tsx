"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Search, Bell, Plus, User, Compass, Home, MessageCircle, Zap, Crown, LogOut } from "lucide-react";

const CATEGORIES = [
  "Tout", "Femme", "Homme", "Enfant", "Luxe", "Sneakers", "Robes", "Manteaux", "Accessoires", "Sport",
];

function DesktopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { href: "/",        icon: Home,          label: "Accueil" },
    { href: "/search",  icon: Compass,       label: "Explorer" },
    { href: "/messages",icon: MessageCircle, label: "Messages" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(7,7,10,0.95)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-[64px] flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="text-[22px] font-black text-white tracking-tight">
            Wear<span style={{ color: "#8B5CF6" }}>lyx</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, icon: Icon, label }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[14px] font-semibold transition-all"
                style={{ color: isActive ? "#A78BFA" : "rgba(255,255,255,0.4)", background: isActive ? "rgba(139,92,246,0.1)" : "transparent" }}>
                <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Search bar */}
        <div className="flex-1 max-w-[560px]">
          <form onSubmit={(e) => { e.preventDefault(); if (search.trim()) router.push(`/search?q=${encodeURIComponent(search)}`); }}>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(139,92,246,0.4)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.07)"; }}
              onBlur={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)"; }}>
              <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher marques, vêtements, styles…"
                className="flex-1 bg-transparent text-[14px] text-white placeholder-white/25 outline-none"
              />
            </div>
          </form>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Vendre CTA */}
          <Link href="/sell/ai"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 2px 12px rgba(139,92,246,0.35)" }}>
            <Plus className="w-4 h-4" />
            Vendre
          </Link>

          {/* Notifications */}
          <Link href="/notifications"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/5 transition-all relative">
            <Bell className="w-5 h-5" />
          </Link>

          {/* User menu */}
          <div className="relative">
            <button onClick={() => setShowUserMenu(v => !v)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
              <User className="w-5 h-5" />
            </button>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-12 z-50 w-[200px] rounded-2xl overflow-hidden shadow-2xl py-1"
                  style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Link href="/profile/menu" onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[14px] text-white/70 hover:bg-white/5 hover:text-white transition-all">
                    <User className="w-4 h-4" /> Mon profil
                  </Link>
                  <Link href="/listings" onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[14px] text-white/70 hover:bg-white/5 hover:text-white transition-all">
                    <Zap className="w-4 h-4" /> Mes annonces
                  </Link>
                  <Link href="/premium" onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[14px] text-[#F59E0B] hover:bg-white/5 transition-all">
                    <Crown className="w-4 h-4" /> Premium
                  </Link>
                  <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                  <Link href="/auth/logout" onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[14px] text-white/40 hover:bg-white/5 hover:text-red-400 transition-all">
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Categories strip */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-[1400px] mx-auto px-6 h-[44px] flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((cat) => (
            <Link key={cat} href={cat === "Tout" ? "/search" : `/search?category=${encodeURIComponent(cat.toLowerCase())}`}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all hover:bg-white/8"
              style={{ color: cat === "Tout" ? "#A78BFA" : "rgba(255,255,255,0.4)", background: cat === "Tout" ? "rgba(139,92,246,0.12)" : "transparent" }}>
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export function DesktopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return <>{children}</>;

  if (pathname.startsWith("/auth")) {
    // Auth pages manage their own layout (DesktopLoginPage is full-screen split)
    return <>{children}</>;
  }

  return (
    <div className="min-h-[100dvh]" style={{ background: "#07070A" }}>
      <DesktopHeader />
      {/* Offset for fixed header (64px nav + 44px categories = 108px) */}
      <main className="pt-[108px]">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
