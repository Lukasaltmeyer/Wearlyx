export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { DonationModeClient } from "@/components/DonationModeClient";

export default async function DonationModePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  return (
    <>
      <Navbar />
      <main className="bg-[#08080F] min-h-[100dvh] pb-24 animate-fadeIn">
        <DonationModeClient />
      </main>
    </>
  );
}
