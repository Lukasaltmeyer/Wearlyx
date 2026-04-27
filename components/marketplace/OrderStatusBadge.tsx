import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/database";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending:     { label: "En attente",    color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  paid:        { label: "Payé",          color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  shipped:     { label: "Expédié",       color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
  in_transit:  { label: "En transit",    color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20" },
  delivered:   { label: "Livré",         color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
  dispute:     { label: "Litige",        color: "bg-red-500/15 text-red-400 border-red-500/20" },
  cancelled:   { label: "Annulé",        color: "bg-white/8 text-white/40 border-white/10" },
  refunded:    { label: "Remboursé",     color: "bg-teal-500/15 text-teal-400 border-teal-500/20" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full border", cfg.color)}>
      {cfg.label}
    </span>
  );
}