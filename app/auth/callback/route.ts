import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Check if profile is complete (has username)
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .single();

      if (!profile?.username) {
        // New user — needs to complete profile
        return NextResponse.redirect(new URL("/auth/complete-profile", origin));
      }

      return NextResponse.redirect(new URL("/", origin));
    }
  }

  return NextResponse.redirect(new URL("/auth", origin));
}
