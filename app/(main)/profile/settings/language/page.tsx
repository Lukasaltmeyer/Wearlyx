export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LanguageSettingsClient } from "@/components/settings/LanguageSettingsClient";

export default async function LanguageSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  return <LanguageSettingsClient />;
}
