"use client";

import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  if (isAuthPage) {
    return (
      <div className="w-full min-h-[100dvh] bg-[#08080F] flex justify-center">
        <div className="w-full max-w-[600px] relative overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] bg-[#08080F] flex justify-center">
      <div className="w-full max-w-[600px] min-h-[100dvh] bg-[#08080F] relative">
        {children}
      </div>
    </div>
  );
}
