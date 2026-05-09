export const dynamic = "force-dynamic";
import { getDeviceType } from "@/lib/device";
import { DesktopPremiumPage } from "@/components/desktop/DesktopPremiumPage";
import PremiumClientPage from "./_client";

export default async function PremiumPage() {
  const device = await getDeviceType();
  if (device === "desktop") {
    return <DesktopPremiumPage />;
  }
  return <PremiumClientPage />;
}
