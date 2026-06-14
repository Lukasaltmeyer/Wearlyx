export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ShippingSettingsClient } from "@/components/settings/ShippingSettingsClient";

export default async function ShippingSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase.from("profiles").select("full_name, location").eq("id", user.id).single();

  return <ShippingSettingsClient userId={user.id} fullName={profile?.full_name ?? ""} location={profile?.location ?? ""} />;
}
