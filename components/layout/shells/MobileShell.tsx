"use client";

import { usePathname } from "next/navigation";

export function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return <>{children}</>;

  if (pathname.startsWith("/auth")) {
    return (
      <div className="w-full min-h-[100dvh] bg-[#0A0A0A] flex justify-center">
        <div className="w-full max-w-[600px] relative overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] flex justify-center" style={{ background: "#0A0A0A" }}>
      <div className="w-full max-w-[560px] min-h-[100dvh] relative" style={{ background: "#0A0A0A" }}>
        {children}
      </div>
    </div>
  );
}
