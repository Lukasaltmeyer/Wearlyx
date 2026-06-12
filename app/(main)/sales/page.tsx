export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/device";
import { Navbar } from "@/components/layout/Navbar";
import { SalesClient } from "@/components/SalesClient";

export default async function SalesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const device = await getDeviceType();

  if (device === "desktop") {
    const { DesktopSales } = await import("@/components/desktop/DesktopSales");
    return <DesktopSales userId={user.id} />;
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#07070A] min-h-[100dvh] pb-24 animate-fadeIn">
        <SalesClient userId={user.id} />
      </main>
    </>
  );
}
