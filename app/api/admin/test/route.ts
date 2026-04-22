import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check user_moderation table
  const { data: rows, error: tableError } = await supabase
    .from("user_moderation").select("*").limit(5);

  return NextResponse.json({
    user_email: user?.email ?? null,
    user_id: user?.id ?? null,
    is_admin: user ? isAdminUser(user) : false,
    moderation_rows: rows,
    moderation_error: tableError?.message ?? null,
  });
}
