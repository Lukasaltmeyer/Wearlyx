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
        background: "rgba(11,15,20,0.96)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="px-4 flex items-center justify-between max-w-[560px] mx-auto" style={{ height: 48 }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          {/* W mark */}
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#8B5CF6" }}>
            <span className="text-[13px] font-black text-white leading-none">W</span>
          </div>
          <span className="font-black text-[20px] tracking-tight text-white leading-none">
            wearlyx
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