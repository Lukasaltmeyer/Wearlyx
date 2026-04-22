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
      className="sticky top-0 z-40 border-b border-white/[0.05]"
      style={{
        background: "rgba(8, 8, 15, 0.94)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
      }}
    >
      <div className="px-4 h-13 flex items-center justify-between max-w-[600px] mx-auto" style={{ height: 52 }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span
            className="font-black text-[22px] tracking-tight select-none"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 60%, #e879f9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Wearlyx
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <Link
            href="/search"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <Search className="w-[18px] h-[18px]" />
          </Link>
          {userId && <NotificationBell userId={userId} />}
        </div>
      </div>
    </header>
  );
}
