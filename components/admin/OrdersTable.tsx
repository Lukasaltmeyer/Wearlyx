import { timeAgo } from "@/lib/utils";

const STATUS_BADGE: Record<string, string> = {
  pending:    "bg-yellow-500/15 text-yellow-400",
  paid:       "bg-blue-500/15 text-blue-400",
  shipped:    "bg-green-500/15 text-green-400",
  in_transit: "bg-indigo-500/15 text-indigo-400",
  delivered:  "bg-green-500/15 text-green-400",
  dispute:    "bg-red-500/15 text-red-400",
  cancelled:  "bg-white/8 text-white/30",
  refunded:   "bg-teal-500/15 text-teal-400",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente", paid: "Payé", shipped: "Expédié",
  in_transit: "En transit", delivered: "Livré", dispute: "Litige",
  cancelled: "Annulé", refunded: "Remboursé",
};

export function OrdersTable({ orders }: { orders: any[] }) {
  if (!orders.length) return <p className="text-white/30 text-[13px] py-6 text-center">Aucune commande</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-white/8">
            {["Article", "Acheteur", "Total", "Statut", "Date"].map((h) => (
              <th key={h} className="text-left py-2.5 px-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o: any) => {
            const product = Array.isArray(o.product) ? o.product[0] : o.product;
            const buyer = Array.isArray(o.buyer) ? o.buyer[0] : o.buyer;
            const badge = STATUS_BADGE[o.status] ?? STATUS_BADGE.pending;
            return (
              <tr key={o.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="py-3 px-3">
                  <p className="font-semibold text-white truncate max-w-[150px]">{product?.title ?? "—"}</p>
                  <p className="text-[11px] text-white/30 font-mono">#{o.id.slice(0,8)}</p>
                </td>
                <td className="py-3 px-3 text-white/60">@{buyer?.username ?? "—"}</td>
                <td className="py-3 px-3 font-bold text-white">{o.total?.toFixed(2)} €</td>
                <td className="py-3 px-3">
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${badge}`}>
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-white/40">{timeAgo(o.created_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
