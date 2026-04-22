import { cn } from "@/lib/utils";
import type { ShipmentStatus } from "@/types/database";

const STEPS: { status: ShipmentStatus; label: string; icon: string }[] = [
  { status: "pending",           label: "Commande validée",         icon: "✅" },
  { status: "prepared",          label: "Préparé par le vendeur",    icon: "📦" },
  { status: "dropped",           label: "Déposé en point relais",    icon: "🏪" },
  { status: "in_transit",        label: "En transit",                icon: "🚚" },
  { status: "out_for_delivery",  label: "En cours de livraison",     icon: "🛵" },
  { status: "delivered",         label: "Livré",                     icon: "🎉" },
];

const ORDER: ShipmentStatus[] = ["pending", "prepared", "dropped", "in_transit", "out_for_delivery", "delivered"];

interface Props {
  status: ShipmentStatus;
  trackingNumber?: string | null;
  carrier?: string | null;
  estimatedDelivery?: string | null;
}

export function TrackingTimeline({ status, trackingNumber, carrier, estimatedDelivery }: Props) {
  const currentIndex = ORDER.indexOf(status);

  return (
    <div className="flex flex-col gap-4">
      {/* Tracking info */}
      {trackingNumber && (
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/8">
          <div>
            <p className="text-[11px] text-white/40 uppercase tracking-wider">Numéro de suivi</p>
            <p className="text-[14px] font-bold text-white font-mono mt-0.5">{trackingNumber}</p>
            {carrier && <p className="text-[11px] text-white/40 mt-0.5">{carrier}</p>}
          </div>
          {estimatedDelivery && (
            <div className="text-right">
              <p className="text-[11px] text-white/40">Livraison estimée</p>
              <p className="text-[13px] font-bold text-[#4CAF50]">
                {new Date(estimatedDelivery).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className="relative">
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-white/8" />
        <div
          className="absolute left-5 top-5 w-0.5 bg-[#6C63FF] transition-all duration-500"
          style={{ height: `${Math.min(currentIndex / (STEPS.length - 1), 1) * 100}%` }}
        />
        <div className="flex flex-col gap-0">
          {STEPS.map((step, i) => {
            const done = i <= currentIndex;
            const active = i === currentIndex;
            return (
              <div key={step.status} className="flex items-center gap-4 py-3 relative">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-[16px] flex-shrink-0 z-10 border-2 transition-all",
                  done ? "border-[#6C63FF] bg-[#6C63FF]/20" : "border-white/10 bg-[#0A0A10]"
                )}>
                  {step.icon}
                </div>
                <div>
                  <p className={cn("text-[13px] font-bold", done ? "text-white" : "text-white/25")}>
                    {step.label}
                  </p>
                  {active && (
                    <p className="text-[11px] text-[#6C63FF] font-semibold">En cours</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
