export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SecuritySettingsClient } from "@/components/settings/SecuritySettingsClient";

export default async function SecuritySettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  return <SecuritySettingsClient email={user.email ?? ""} createdAt={user.created_at} />;
}
