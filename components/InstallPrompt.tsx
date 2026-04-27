"use client";

import { useEffect, useState } from "react";
import { X, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
}

function isInStandaloneMode() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<"android" | "ios" | null>(null);

  useEffect(() => {
    if (isInStandaloneMode()) return;

    if (isIOS()) {
      const dismissed = sessionStorage.getItem("install_dismissed");
      if (!dismissed) setMode("ios");
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setMode("android");
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setMode(null));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("install_dismissed", "1");
    setMode(null);
  };

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setMode(null);
    setDeferredPrompt(null);
  };

  if (!mode) return null;

  return (
    <div className="fixed bottom-[76px] left-0 right-0 z-50 flex justify-center px-4 animate-fadeIn pointer-events-none">
      <div
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl pointer-events-auto w-full max-w-[360px]"
        style={{
          background: "rgba(17,24,39,0.97)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(34,197,94,0.2)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(34,197,94,0.15)" }}>
          {mode === "ios"
            ? <Share className="w-3.5 h-3.5 text-[#22C55E]" />
            : <span className="text-[14px]">📲</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-[12px] leading-tight">Installer Wearlyx</p>
          {mode === "ios"
            ? <p className="text-white/40 text-[10px] mt-0.5">Partager → Sur l'écran d'accueil</p>
            : <p className="text-white/40 text-[10px] mt-0.5">Accès rapide depuis ton écran</p>}
        </div>
        {mode === "android" && (
          <button
            onClick={handleAndroidInstall}
            className="px-3 py-1.5 rounded-xl text-[11px] font-black text-white flex-shrink-0 active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)", boxShadow: "0 2px 8px rgba(34,197,94,0.25)" }}
          >
            Installer
          </button>
        )}
        <button onClick={dismiss} className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.06)" }}>
          <X className="w-3 h-3 text-white/40" />
        </button>
      </div>
    </div>
  );
}
