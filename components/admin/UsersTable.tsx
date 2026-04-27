import { timeAgo } from "@/lib/utils";

const PLAN_BADGE: Record<string, string> = {
  premium: "bg-yellow-500/20 text-yellow-400",
  pro:     "bg-green-500/20 text-green-400",
  starter: "bg-blue-500/20 text-blue-400",
  free:    "bg-white/8 text-white/30",
};

export function UsersTable({ users }: { users: any[] }) {
  if (!users.length) return <p className="text-white/30 text-[13px] py-6 text-center">Aucun utilisateur</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-white/8">
            {["Utilisateur", "Abonnement", "Inscription"].map((h) => (
              <th key={h} className="text-left py-2.5 px-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => {
            const plan = Array.isArray(u.subscription) ? u.subscription[0]?.plan : u.subscription?.plan;
            const badge = PLAN_BADGE[plan ?? "free"] ?? PLAN_BADGE.free;
            return (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-black text-[#4CAF50]">
                        {(u.full_name || u.username || "?")[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{u.full_name || u.username}</p>
                      <p className="text-[11px] text-white/30">@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${badge}`}>
                    {plan ?? "free"}
                  </span>
                </td>
                <td className="py-3 px-3 text-white/40">{timeAgo(u.created_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
