"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

const FLAG = "wlx_just_authed";

export function StayLoggedInBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(FLAG) === "1") {
      sessionStorage.removeItem(FLAG);
      // Small delay so the page has time to render first
      setTimeout(() => setVisible(true), 600);
    }
  }, []);

  const dismiss = (persist: boolean) => {
    if (!persist) {
      // Remove Supabase session from localStorage so the session doesn't survive a page reload
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
          localStorage.removeItem(key);
        }
      });
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed top-3 left-3 right-3 z-[200] animate-slideUp max-w-[540px] mx-auto">
      <div
        className="rounded-2xl border border-white/10 px-4 py-3.5 flex items-center gap-3"
        style={{
          background: "rgba(16,16,24,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(139,92,246,0.15)" }}
        >
          <Check className="w-4 h-4 text-[#A78BFA]" />
        </div>

        <p className="flex-1 text-[13px] text-white/80 font-medium leading-snug">
          Rester connecté sur cet appareil ?
        </p>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => dismiss(false)}
            className="px-3 py-1.5 rounded-xl text-[12px] font-semibold text-white/40 border border-white/10 active:scale-95 transition-all"
          >
            Non
          </button>
          <button
            onClick={() => dismiss(true)}
            className="px-3 py-1.5 rounded-xl text-[12px] font-semibold text-white active:scale-95 transition-all"
            style={{ background: "#8B5CF6" }}
          >
            Oui
          </button>
        </div>
      </div>
    </div>
  );
}
