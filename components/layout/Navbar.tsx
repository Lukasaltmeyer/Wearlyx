"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NotificationBell } from "@/components/marketplace/NotificationBell";

export function Navbar() {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  if (pathname.startsWith("/auth")) return null;

  return (
    <header
      className="fixed top-0 inset-x-0 z-30 lg:hidden"
      style={{
        background: "rgba(6,6,10,0.82)",
        backdropFilter: "blur(44px) saturate(180%)",
        WebkitBackdropFilter: "blur(44px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.045)",
      }}
    >
      <div className="px-4 flex items-center justify-between max-w-[560px] mx-auto" style={{ height: 50 }}>
        {/* Spacer */}
        <div className="w-9" />

        {/* Logo — centered */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 select-none">
          <span
            className="font-black text-[18px] leading-none"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="text-white/90">Wear</span>
            <span style={{
              background: "linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 60%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>lyx</span>
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-0.5">
          <Link
            href="/search"
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90"
            style={{ color: "rgba(255,255,255,0.32)" }}
          >
            <Search className="w-[17px] h-[17px]" strokeWidth={1.8} />
          </Link>
          {userId && <NotificationBell userId={userId} />}
        </div>
      </div>
    </header>
  );
}
