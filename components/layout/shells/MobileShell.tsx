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
    <div className="w-full min-h-[100dvh] flex justify-center"
      style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(109,40,217,0.11) 0%, #07070A 48%, #06060A 100%)" }}>
      {/* Global ambient orb */}
      <div className="fixed pointer-events-none" style={{
        top: -180, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(109,40,217,0.07) 0%, transparent 65%)",
        filter: "blur(90px)", zIndex: 0,
      }} />
      <div className="w-full max-w-[560px] min-h-[100dvh] relative" style={{ zIndex: 1 }}>
        {/* Spacer for fixed Navbar */}
        <div className="h-[50px] lg:hidden" />
        {children}
      </div>
    </div>
  );
}
