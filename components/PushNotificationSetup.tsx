"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";

export function PushNotificationSetup() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    setPermission(Notification.permission);
    if (Notification.permission === "default") {
      const timer = setTimeout(() => setShown(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const subscribe = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      setPermission("granted");
      setShown(false);
    } catch {
      setPermission("denied");
      setShown(false);
    }
  };

  const requestAndSubscribe = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") await subscribe();
    setShown(false);
  };

  if (!shown || permission !== "default") return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-[560px] mx-auto animate-slideUp">
      <div className="rounded-2xl border border-white/10 bg-[#1A1A2E] p-4 shadow-2xl flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6C3AED, #C026D3)" }}>
          <Bell className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-white">Activer les notifications</p>
          <p className="text-[11px] text-white/45 mt-0.5">Reçois les offres et messages en temps réel</p>
          <div className="flex gap-2 mt-3">
            <button onClick={requestAndSubscribe}
              className="flex-1 py-2 rounded-xl text-[12px] font-bold text-white active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #6C3AED, #C026D3)" }}>
              Activer
            </button>
            <button onClick={() => setShown(false)}
              className="px-3 py-2 rounded-xl text-[12px] font-semibold text-white/40 bg-white/6 active:scale-95 transition-transform">
              Plus tard
            </button>
          </div>
        </div>
        <button onClick={() => setShown(false)} className="text-white/25 mt-0.5">
          <BellOff className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
