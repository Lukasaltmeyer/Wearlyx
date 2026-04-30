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
      className="sticky top-0 z-40"
      style={{
        background: "#0B0F14",
        border: "none",
        boxShadow: "none",
      }}
    >
      <div className="px-4 flex items-center justify-between max-w-[560px] mx-auto" style={{ height: 48 }}>
        {/* Logo */}
        <Link href="/" className="flex items-center select-none">
          <span className="font-black text-[18px] tracking-tight text-white leading-none">
            Wearlyx
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-0.5">
          <Link
            href="/search"
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Search className="w-[18px] h-[18px]" />
          </Link>
          {userId && <NotificationBell userId={userId} />}
        </div>
      </div>
    </header>
  );
}