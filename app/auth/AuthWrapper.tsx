"use client";
import { useEffect } from "react";

export default function AuthWrapper() {
  useEffect(() => { window.location.replace("/auth/login"); }, []);
  return null;
}
