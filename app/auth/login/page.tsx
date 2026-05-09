import { getDeviceType } from "@/lib/device";
import dynamic from "next/dynamic";
import { DesktopLoginPage } from "./DesktopLoginPage";

const LoginClient = dynamic(() => import("./LoginClient"), { ssr: false });

export default async function LoginPage() {
  const device = await getDeviceType();
  if (device === "desktop") return <DesktopLoginPage />;
  return <LoginClient />;
}
