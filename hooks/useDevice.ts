"use client";

import { useState, useEffect } from "react";

export type DeviceType = "mobile" | "desktop";

export function useDevice(): DeviceType {
  const [device, setDevice] = useState<DeviceType>("mobile");

  useEffect(() => {
    const check = () => setDevice(window.innerWidth >= 1024 ? "desktop" : "mobile");
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return device;
}
