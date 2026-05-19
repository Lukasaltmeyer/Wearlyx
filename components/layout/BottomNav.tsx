"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/",             icon: Home,          label: "Accueil" },
  { href: "/search",       icon: Compass,       label: "Explorer" },
  { href: "/sell",         icon: Plus,          label: "Vendre",  primary: true },
  { href: "/messages",     icon: MessageCircle, label: "Messages" },
  { href: "/profile/menu", icon: User,          label: "Profil" },
];

export function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/auth")) return null;
  if (pathname.startsWith("/products/")) return null;

  return (
    <>
      <div className="h-[80px] lg:hidden" />

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex justify-center"
        style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))", paddingLeft: 12, paddingRight: 12 }}
      >
        <div
          className="w-full flex items-center"
          style={{
            maxWidth: 520,
            height: 62,
            background: "rgba(7,7,11,0.88)",
            backdropFilter: "blur(60px) saturate(220%)",
            WebkitBackdropFilter: "blur(60px) saturate(220%)",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: [
              "0 -1px 0 rgba(255,255,255,0.04) inset",
              "0 16px 56px rgba(0,0,0,0.65)",
              "0 0 0 0.5px rgba(109,40,217,0.08)",
            ].join(", "),
          }}
        >
          {navItems.map(({ href, icon: Icon, label, primary }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

            if (primary) {
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-1 flex-1 active:scale-90 transition-transform duration-150"
                >
                  <div
                    className="w-11 h-11 rounded-[18px] flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: "linear-gradient(150deg, #9D71F8 0%, #7C3AED 50%, #6527CC 100%)",
                      boxShadow: "0 4px 18px rgba(109,40,217,0.40), 0 1px 0 rgba(255,255,255,0.18) inset",
                    }}
                  >
                    <div className="absolute inset-0 rounded-[18px] pointer-events-none"
                      style={{ background: "radial-gradient(circle at 38% 20%, rgba(255,255,255,0.18) 0%, transparent 55%)" }} />
                    <Icon className="w-[20px] h-[20px] text-white relative z-10" strokeWidth={2.5} />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-[3px] flex-1 active:scale-90 transition-transform duration-150 relative py-1"
              >
                {/* Active top indicator */}
                {isActive && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      width: 20, height: 2,
                      background: "linear-gradient(90deg, rgba(124,58,237,0.0), #9D71F8, rgba(124,58,237,0.0))",
                      boxShadow: "0 0 6px rgba(157,113,248,0.55)",
                    }}
                  />
                )}

                <div
                  className={cn(
                    "w-10 h-8 flex items-center justify-center rounded-[12px] transition-all duration-250",
                  )}
                  style={isActive ? {
                    background: "rgba(124,58,237,0.12)",
                  } : {}}
                >
                  <Icon
                    className="transition-all duration-250"
                    style={{
                      width: 20, height: 20,
                      color: isActive ? "#B09EFA" : "rgba(255,255,255,0.22)",
                    }}
                    strokeWidth={isActive ? 2.1 : 1.5}
                  />
                </div>

                <span
                  className="text-[9.5px] font-semibold transition-colors duration-250 leading-none"
                  style={{ color: isActive ? "rgba(196,181,253,0.85)" : "rgba(255,255,255,0.15)" }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
