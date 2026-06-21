"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Home, Compass, Plus, MessageCircle, User, Crown,
  Heart, Bell, Settings, Search,
} from "lucide-react";
import { CommandPalette } from "@/components/desktop/CommandPalette";
import { createClient } from "@/lib/supabase/client";

const BASE_NAV: { href: string; icon: React.ElementType; label: string; badgeKey?: string }[] = [
  { href: "/",              icon: Home,          label: "Accueil"       },
  { href: "/search",        icon: Compass,       label: "Explorer"      },
  { href: "/messages",      icon: MessageCircle, label: "Messages",      badgeKey: "messages"      },
  { href: "/notifications", icon: Bell,          label: "Notifications", badgeKey: "notifications" },
  { href: "/favorites",     icon: Heart,         label: "Favoris"       },
  { href: "/profile/menu",  icon: User,          label: "Profil"        },
];

function useNavBadges() {
  const [badges, setBadges] = useState<Record<string, number>>({ messages: 0, notifications: 0 });

  useEffect(() => {
    const supabase = createClient();
    let userId: string | null = null;

    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      userId = user.id;

      const [notifRes, msgRes] = await Promise.all([
        supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("read", false),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false)
          .neq("sender_id", user.id)
          .in("conversation_id",
            (await supabase.from("conversations").select("id").or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`))
              .data?.map((c: any) => c.id) ?? []
          ),
      ]);
      setBadges({ notifications: notifRes.count ?? 0, messages: msgRes.count ?? 0 });
    };
    load();

    const channel = supabase.channel("nav-badges")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, load)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, load)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return badges;
}

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
  const badges = useNavBadges();
  const NAV = BASE_NAV.map(n => ({ ...n, badge: n.badgeKey ? badges[n.badgeKey] ?? 0 : 0 }));

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] flex flex-col z-40"
      style={{
        background: "rgba(6,6,9,0.96)",
        backdropFilter: "blur(48px) saturate(180%)",
        WebkitBackdropFilter: "blur(48px) saturate(180%)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "1px 0 0 rgba(255,255,255,0.02)",
      }}>

      {/* Logo + search */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0">
        <Link href="/" className="block mb-4">
          <Logo />
        </Link>
        <button
          onClick={onOpenPalette}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] transition-all text-left"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.2)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}>
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} />
          <span className="flex-1 text-[12px]" style={{ color: "rgba(255,255,255,0.28)" }}>Rechercher…</span>
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

export function DesktopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);

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
  if (pathname.startsWith("/landing")) return <>{children}</>;

  return (
    <div className="min-h-[100dvh] relative overflow-x-hidden"
      style={{ background: "radial-gradient(ellipse at 52% 0%, #0e0820 0%, #080612 38%, #050409 100%)" }}>
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
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <main
        className="relative min-h-[100dvh]"
        style={{ marginLeft: "220px", zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}
