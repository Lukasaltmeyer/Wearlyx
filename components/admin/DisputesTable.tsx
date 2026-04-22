import { timeAgo } from "@/lib/utils";

const STATUS_BADGE: Record<string, string> = {
  open:         "bg-red-500/15 text-red-400",
  under_review: "bg-yellow-500/15 text-yellow-400",
  resolved:     "bg-green-500/15 text-green-400",
  refunded:     "bg-teal-500/15 text-teal-400",
  rejected:     "bg-white/8 text-white/30",
};

const REASON_LABEL: Record<string, string> = {
  not_received:     "Non reçu",
  not_as_described: "Non conforme",
  wrong_item:       "Mauvais article",
  damaged:          "Endommagé",
  seller_inactive:  "Vendeur inactif",
  delivery_issue:   "Problème livraison",
  other:            "Autre",
};

export function DisputesTable({ disputes }: { disputes: any[] }) {
  if (!disputes.length) return <p className="text-white/30 text-[13px] py-6 text-center">Aucun litige ✅</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-white/8">
            {["Commande", "Motif", "Ouvert par", "Statut", "Date"].map((h) => (
              <th key={h} className="text-left py-2.5 px-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {disputes.map((d: any) => {
            const order = Array.isArray(d.order) ? d.order[0] : d.order;
            const product = Array.isArray(order?.product) ? order.product[0] : order?.product;
            const opener = Array.isArray(d.opener) ? d.opener[0] : d.opener;
            const badge = STATUS_BADGE[d.status] ?? STATUS_BADGE.open;
            return (
              <tr key={d.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="py-3 px-3">
                  <p className="font-semibold text-white truncate max-w-[130px]">{product?.title ?? "—"}</p>
                  <p className="text-[11px] text-white/30">{order?.total?.toFixed(2)} €</p>
                </td>
                <td className="py-3 px-3 text-white/60">{REASON_LABEL[d.reason] ?? d.reason}</td>
                <td className="py-3 px-3 text-white/60">@{opener?.username ?? "—"}</td>
                <td className="py-3 px-3">
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${badge}`}>
                    {d.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-white/40">{timeAgo(d.created_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
