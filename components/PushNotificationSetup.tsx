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
    <div className="fixed bottom-[76px] left-3 right-3 z-50 max-w-[560px] mx-auto animate-slideUp">
      <div className="rounded-2xl border border-white/8 bg-[#13131f]/95 backdrop-blur-xl px-4 py-3 shadow-2xl flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
          <Bell className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-white">Activer les notifications</p>
          <p className="text-[10px] text-white/40">Offres et messages en temps réel</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={requestAndSubscribe}
            className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
            Activer
          </button>
          <button onClick={() => setShown(false)} className="text-white/25 hover:text-white/50 transition-colors">
            <BellOff className="w-4 h-4" />
          </button>
        </div>
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