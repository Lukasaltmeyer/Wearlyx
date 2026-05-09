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
      {/* Safe area spacer so content doesn't hide behind the nav */}
      <div className="h-[84px] lg:hidden" />

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex justify-center"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))", paddingLeft: 14, paddingRight: 14 }}
      >
        <div
          className="w-full flex items-center"
          style={{
            maxWidth: 520,
            height: 62,
            background: "rgba(10,10,16,0.88)",
            backdropFilter: "blur(48px) saturate(220%)",
            WebkitBackdropFilter: "blur(48px) saturate(220%)",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 -2px 0 rgba(255,255,255,0.04) inset, 0 8px 40px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(139,92,246,0.08)",
          }}
        >
          {navItems.map(({ href, icon: Icon, label, primary }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

            if (primary) {
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-1 flex-1 active:scale-90 transition-all duration-200"
                >
                  <div
                    className="w-11 h-11 rounded-[18px] flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: "linear-gradient(145deg, #9B6FF8 0%, #7C3AED 100%)",
                      boxShadow: "0 4px 18px rgba(139,92,246,0.55), 0 0 0 1px rgba(167,139,250,0.2), 0 1px 0 rgba(255,255,255,0.18) inset",
                    }}
                  >
                    {/* Inner shine */}
                    <div className="absolute inset-0 rounded-[18px] pointer-events-none"
                      style={{ background: "radial-gradient(circle at 40% 25%, rgba(255,255,255,0.18) 0%, transparent 55%)" }} />
                    <Icon className="w-[21px] h-[21px] text-white relative z-10" strokeWidth={2.5} />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-[3px] flex-1 active:scale-90 transition-all duration-200 relative py-1"
              >
                <div
                  className={cn(
                    "w-10 h-9 flex items-center justify-center rounded-[14px] transition-all duration-300",
                  )}
                  style={isActive ? {
                    background: "rgba(139,92,246,0.14)",
                    boxShadow: "0 0 20px rgba(139,92,246,0.18)",
                  } : {}}
                >
                  <Icon
                    className="transition-all duration-300"
                    style={{
                      width: 21, height: 21,
                      color: isActive ? "#B09EFA" : "rgba(255,255,255,0.25)",
                    }}
                    strokeWidth={isActive ? 2.2 : 1.6}
                  />
                </div>

                <span
                  className="text-[9px] font-bold transition-colors duration-300 leading-none"
                  style={{ color: isActive ? "#A78BFA" : "rgba(255,255,255,0.2)" }}
                >
                  {label}
                </span>

                {/* Active pill indicator */}
                {isActive && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      width: 20, height: 2,
                      background: "linear-gradient(90deg, #8B5CF6, #A78BFA)",
                      boxShadow: "0 0 8px rgba(139,92,246,0.7)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
