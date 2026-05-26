import { getDeviceType } from "@/lib/device";
import { DesktopLoginPage } from "./DesktopLoginPage";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  const device = await getDeviceType();
  if (device === "mobile") return <LoginClient />;
  return <DesktopLoginPage />;
}
