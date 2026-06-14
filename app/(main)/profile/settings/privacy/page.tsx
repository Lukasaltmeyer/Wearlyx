export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrivacySettingsClient } from "@/components/settings/PrivacySettingsClient";

export default async function PrivacySettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  return <PrivacySettingsClient userId={user.id} email={user.email ?? ""} />;
}
