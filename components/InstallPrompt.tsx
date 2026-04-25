"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !(window as any).MSStream
  );
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

    // iOS: no beforeinstallprompt — show manual instructions
    if (isIOS()) {
      // Only show once per session
      const dismissed = sessionStorage.getItem("install_dismissed");
      if (!dismissed) setMode("ios");
      return;
    }

    // Android/Chrome: use native prompt
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
    <div
      className="fixed bottom-[76px] left-4 right-4 z-50 rounded-2xl animate-fadeIn"
      style={{
        background: "linear-gradient(135deg, rgba(108,58,237,0.97) 0%, rgba(192,38,211,0.97) 100%)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(108,58,237,0.5)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {mode === "android" ? (
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/15">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-[13px] leading-tight">Installer Wearlyx</p>
            <p className="text-white/70 text-[11px] mt-0.5">Accès rapide depuis ton écran d'accueil</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleAndroidInstall}
              className="px-3 py-1.5 rounded-xl bg-white text-[#6C3AED] text-[12px] font-black active:scale-95 transition-transform"
            >
              Installer
            </button>
            <button onClick={dismiss} className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/15">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      ) : (
        /* iOS — compact one-line */
        <div className="flex items-center gap-3 p-3.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/15">
            <Share className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-[12px] leading-tight">Installer Wearlyx</p>
            <p className="text-white/60 text-[10px] mt-0.5">
              Partager <span className="text-white/40">→</span> Sur l'écran d'accueil
            </p>
          </div>
          <button onClick={dismiss} className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/15 flex-shrink-0">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
