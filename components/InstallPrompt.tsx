"use client";

import { useEffect, useState } from "react";
import { Download, X, Share, ArrowUp } from "lucide-react";

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
        /* iOS instructions */
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 flex-shrink-0">
                <Download className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <p className="text-white font-black text-[13px]">Installer Wearlyx</p>
                <p className="text-white/60 text-[11px]">Ajoute l'app à ton écran d'accueil</p>
              </div>
            </div>
            <button onClick={dismiss} className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/15 flex-shrink-0">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Step 1 */}
            <div className="flex-1 rounded-xl bg-white/10 p-2.5 flex flex-col items-center gap-1.5 text-center">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <Share className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-white/80 text-[10px] font-semibold leading-tight">Appuie sur<br /><span className="text-white font-black">Partager</span></p>
            </div>

            <ArrowUp className="w-3 h-3 text-white/40 flex-shrink-0 rotate-90" />

            {/* Step 2 */}
            <div className="flex-1 rounded-xl bg-white/10 p-2.5 flex flex-col items-center gap-1.5 text-center">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <span className="text-white text-[14px] font-black leading-none">+</span>
              </div>
              <p className="text-white/80 text-[10px] font-semibold leading-tight">Puis<br /><span className="text-white font-black">Sur l'écran d'accueil</span></p>
            </div>

            <ArrowUp className="w-3 h-3 text-white/40 flex-shrink-0 rotate-90" />

            {/* Step 3 */}
            <div className="flex-1 rounded-xl bg-white/10 p-2.5 flex flex-col items-center gap-1.5 text-center">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <span className="text-white text-[11px] font-black">OK</span>
              </div>
              <p className="text-white/80 text-[10px] font-semibold leading-tight">Puis<br /><span className="text-white font-black">Ajouter</span></p>
            </div>
          </div>

          {/* Arrow pointing down to Safari share button */}
          <div className="flex justify-center mt-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <p className="text-white/50 text-[10px]">Utilise Safari pour installer</p>
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
