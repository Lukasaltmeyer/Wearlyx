"use client";

import { Home, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShippingMode } from "@/types/database";

const MODES = [
  {
    id: "home" as ShippingMode,
    icon: Home,
    label: "À domicile",
    desc: "Livraison à votre adresse",
    fee: 4.99,
  },
  {
    id: "relay" as ShippingMode,
    icon: MapPin,
    label: "Point relais",
    desc: "Retrait en bureau de tabac / relais",
    fee: 3.49,
  },
  {
    id: "locker" as ShippingMode,
    icon: Package,
    label: "Locker",
    desc: "Casier automatique 24h/24",
    fee: 2.99,
  },
];

interface Props {
  selected: ShippingMode;
  onChange: (mode: ShippingMode) => void;
}

export function ShippingSelector({ selected, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1">Mode de livraison</p>
      {MODES.map((m) => {
        const Icon = m.icon;
        const active = selected === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all",
              active ? "border-[#8B5CF6] bg-[#8B5CF6]/10" : "border-white/8 bg-white/3 hover:border-white/20"
            )}
          >
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
              active ? "bg-[#8B5CF6]" : "bg-white/8")}>
              <Icon className={cn("w-4 h-4", active ? "text-white" : "text-white/50")} />
            </div>
            <div className="flex-1">
              <p className={cn("text-[14px] font-bold", active ? "text-white" : "text-white/70")}>{m.label}</p>
              <p className="text-[11px] text-white/35">{m.desc}</p>
            </div>
            <span className={cn("text-[13px] font-bold flex-shrink-0", active ? "text-[#8B5CF6]" : "text-white/40")}>
              {m.fee.toFixed(2)} €
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function getShippingFee(mode: ShippingMode): number {
  return MODES.find((m) => m.id === mode)?.fee ?? 4.99;
}