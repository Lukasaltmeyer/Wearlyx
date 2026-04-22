import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  sub?: string;
}

export function StatsCard({ label, value, icon, color, sub }: Props) {
  return (
    <div className={cn("rounded-2xl p-4 border flex items-center gap-4", color)}>
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">{label}</p>
        <p className="text-[22px] font-black text-white leading-tight">{value}</p>
        {sub && <p className="text-[11px] text-white/35 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
