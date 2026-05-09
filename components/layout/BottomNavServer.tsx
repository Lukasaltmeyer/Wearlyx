import { getDeviceType } from "@/lib/device";
import { BottomNav } from "@/components/layout/BottomNav";

// Server Component — only renders BottomNav on mobile
export async function BottomNavServer() {
  const device = await getDeviceType();
  if (device === "desktop") return null;
  return <BottomNav />;
}
