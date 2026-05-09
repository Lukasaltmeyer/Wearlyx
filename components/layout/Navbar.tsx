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
      className="relative z-10 lg:hidden"
      style={{ background: "#07070A" }}
    >
      <div className="px-4 flex items-center justify-between max-w-[560px] mx-auto" style={{ height: 48 }}>
        {/* Spacer to balance right icons */}
        <div className="w-9" />

        {/* Logo — centered */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 select-none">
          <span
            className="font-black text-[19px] tracking-tight text-white leading-none"
            style={{ letterSpacing: "-0.02em" }}
          >
            Wear<span style={{ color: "#A78BFA" }}>lyx</span>
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-0.5">
          <Link
            href="/search"
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <Search className="w-[18px] h-[18px]" />
          </Link>
          {userId && <NotificationBell userId={userId} />}
        </div>
      </div>
    </header>
  );
}
