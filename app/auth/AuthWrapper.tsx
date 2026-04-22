"use client";

import dynamic from "next/dynamic";

const AuthClient = dynamic(() => import("./AuthClient"), { ssr: false });

export default function AuthWrapper() {
  return <AuthClient />;
}
