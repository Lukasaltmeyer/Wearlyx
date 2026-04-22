export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import AuthWrapper from "./AuthWrapper";

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase") &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

export default async function AuthPage() {
  if (isSupabaseConfigured) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/home");
  }

  return <AuthWrapper />;
}
