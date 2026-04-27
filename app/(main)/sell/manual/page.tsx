export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SellForm } from "@/components/SellForm";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SellManualPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24 animate-fadeIn">
        <div className="px-4 pt-5 pb-4 flex items-center gap-3">
          <Link href="/sell"
            className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-[20px] font-black text-white">Nouvelle annonce</h1>
            <p className="text-[12px] text-white/35">Remplis les informations de l'article</p>
          </div>
        </div>
        <SellForm userId={user.id} />
      </main>
    </>
  );
}