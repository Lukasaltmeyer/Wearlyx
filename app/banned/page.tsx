import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function BannedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: mod } = await supabase
    .from("user_moderation")
    .select("status, last_reason")
    .eq("user_id", user.id)
    .single();

  if (!mod || mod.status !== "banned") redirect("/");

  return (
    <div className="min-h-[100dvh] bg-[#08080F] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <span className="text-3xl">🚫</span>
      </div>
      <h1 className="text-[22px] font-black text-white mb-2">Compte banni</h1>
      <p className="text-[14px] text-white/40 leading-relaxed max-w-[320px] mb-4">
        Ton compte a été banni définitivement de Wearlyx.
      </p>
      {mod.last_reason && (
        <div className="bg-red-500/8 border border-red-500/20 rounded-2xl px-5 py-4 max-w-[320px] mb-6">
          <p className="text-[12px] text-red-300/80 font-medium">Raison :</p>
          <p className="text-[13px] text-red-200 mt-1">{mod.last_reason}</p>
        </div>
      )}
      <p className="text-[12px] text-white/20">
        Pour contester, contacte{" "}
        <a href="mailto:support@wearlyx.fr" className="text-white/40 underline">
          support@wearlyx.fr
        </a>
      </p>
    </div>
  );
}
