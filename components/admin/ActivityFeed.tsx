import { timeAgo } from "@/lib/utils";

interface Props {
  recentUsers: any[];
  recentProducts: any[];
  recentOrders: any[];
  recentOffers: any[];
}

export function ActivityFeed({ recentUsers, recentProducts, recentOrders, recentOffers }: Props) {
  const events = [
    ...(recentUsers ?? []).map((u: any) => ({
      icon: "👤", label: `Inscription : ${u.full_name || u.username}`, date: u.created_at, color: "text-blue-400",
    })),
    ...(recentProducts ?? []).map((p: any) => ({
      icon: "👕", label: `Annonce : ${p.title} — ${p.price}€`, date: p.created_at, color: "text-purple-400",
    })),
    ...(recentOrders ?? []).map((o: any) => ({
      icon: "🛒", label: `Vente : ${(o.product as any)?.title} (${o.total}€) par ${(o.buyer as any)?.username}`, date: o.created_at, color: "text-green-400",
    })),
    ...(recentOffers ?? []).map((of: any) => ({
      icon: "💰", label: `Offre : ${of.amount}€ sur ${(of.product as any)?.title}`, date: of.created_at, color: "text-yellow-400",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20);

  return (
    <div className="flex flex-col gap-1">
      {events.length === 0 ? (
        <p className="text-white/30 text-[13px] py-4 text-center">Aucune activité récente</p>
      ) : (
        events.map((e, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/3 transition-colors">
            <span className="text-lg flex-shrink-0">{e.icon}</span>
            <p className={`text-[13px] font-medium flex-1 truncate ${e.color}`}>{e.label}</p>
            <p className="text-[11px] text-white/25 flex-shrink-0">{timeAgo(e.date)}</p>
          </div>
        ))
      )}
    </div>
  );
}
