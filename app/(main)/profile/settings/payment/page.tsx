export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PaymentSettingsClient } from "@/components/settings/PaymentSettingsClient";

export default async function PaymentSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase.from("profiles").select("username, full_name").eq("id", user.id).single();

  return <PaymentSettingsClient userId={user.id} email={user.email ?? ""} fullName={profile?.full_name ?? ""} />;
}
