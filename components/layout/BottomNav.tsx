"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/",              icon: Home,          label: "Accueil" },
  { href: "/search",        icon: Compass,       label: "Explorer" },
  { href: "/sell",          icon: Plus,          label: "Vendre",  primary: true },
  { href: "/messages",      icon: MessageCircle, label: "Messages" },
  { href: "/profile/menu",  icon: User,          label: "Profil" },
];

export function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/auth")) return null;
  if (pathname.startsWith("/products/")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 safe-bottom"
      style={{
        background: "rgba(8, 8, 12, 0.97)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="h-[60px] flex items-center w-full max-w-[600px] mx-auto px-1">
        {navItems.map(({ href, icon: Icon, label, primary }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

          if (primary) {
            return (
              <Link key={href} href={href} className="flex flex-col items-center gap-1 flex-1 py-1 active:scale-95 transition-transform duration-100">
                <div
                  className="w-10 h-10 rounded-[14px] flex items-center justify-center shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                    boxShadow: "0 4px 14px rgba(139,92,246,0.35)",
                  }}
                >
                  <Icon className="w-[19px] h-[19px] text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[9.5px] font-semibold text-white/50">{label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 flex-1 py-1 active:scale-90 transition-all duration-100 relative"
            >
              <div className={cn(
                "w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200",
                isActive ? "bg-[#8B5CF6]/15" : "hover:bg-white/5"
              )}>
                <Icon
                  className={cn(
                    "w-[20px] h-[20px] transition-all duration-200",
                    isActive ? "text-[#8B5CF6]" : "text-white/30"
                  )}
                  strokeWidth={isActive ? 2.5 : 1.6}
                />
              </div>
              <span className={cn(
                "text-[9.5px] font-bold transition-colors duration-200",
                isActive ? "text-[#8B5CF6]" : "text-white/25"
              )}>
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full animate-scaleX"
                  style={{ background: "#8B5CF6" }} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}