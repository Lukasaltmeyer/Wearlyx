import { getDeviceType } from "@/lib/device";
import { MobileShell } from "@/components/layout/shells/MobileShell";
import { DesktopShell } from "@/components/layout/shells/DesktopShell";

// Server Component — reads device cookie set by middleware, no client JS needed
export async function AppShell({ children }: { children: React.ReactNode }) {
  const device = await getDeviceType();

  if (device === "desktop") {
    return <DesktopShell>{children}</DesktopShell>;
  }

  return <MobileShell>{children}</MobileShell>;
}
