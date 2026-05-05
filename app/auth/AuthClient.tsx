"use client";
import { useEffect } from "react";

// Legacy — redirected to /auth/login
export default function AuthClient() {
  useEffect(() => { window.location.replace("/auth/login"); }, []);
  return null;
}
