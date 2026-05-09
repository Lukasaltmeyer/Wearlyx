import { headers } from "next/headers";

export type DeviceType = "mobile" | "desktop";

export async function getDeviceType(): Promise<DeviceType> {
  const h = await headers();
  const val = h.get("x-device");
  return val === "desktop" ? "desktop" : "mobile";
}
