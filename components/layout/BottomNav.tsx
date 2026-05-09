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
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 safe-bottom lg:hidden"
      style={{
        background: "rgba(7,7,12,0.96)",
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.4), 0 -1px 0 rgba(139,92,246,0.04)",
      }}
    >
      <div className="h-[58px] flex items-center w-full px-1">
        {navItems.map(({ href, icon: Icon, label, primary }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

          if (primary) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 flex-1 py-1 active:scale-90 transition-all duration-150"
              >
                <div
                  className="w-11 h-11 rounded-[16px] flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                    boxShadow: "0 4px 16px rgba(139,92,246,0.45), 0 0 0 1px rgba(167,139,250,0.15), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  <Icon className="w-[20px] h-[20px] text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[9px] font-bold text-white/40">{label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 flex-1 py-1 active:scale-90 transition-all duration-150 relative"
            >
              {/* Active glow dot at top */}
              {isActive && (
                <span
                  className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{
                    background: "#8B5CF6",
                    boxShadow: "0 0 6px 2px rgba(139,92,246,0.6)",
                  }}
                />
              )}

              <div
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-[14px] transition-all duration-250",
                  isActive
                    ? ""
                    : "hover:bg-white/4"
                )}
                style={isActive ? {
                  background: "rgba(139,92,246,0.12)",
                  boxShadow: "0 0 16px rgba(139,92,246,0.12)",
                } : {}}
              >
                <Icon
                  className={cn(
                    "transition-all duration-250",
                    isActive ? "text-[#A78BFA]" : "text-white/28"
                  )}
                  style={{ width: 21, height: 21 }}
                  strokeWidth={isActive ? 2.2 : 1.6}
                />
              </div>

              <span
                className={cn(
                  "text-[9.5px] font-bold transition-colors duration-250",
                  isActive ? "text-[#A78BFA]" : "text-white/22"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
