import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  console.log("[OAuth callback] received, code:", !!code);

  if (!code) {
    console.log("[OAuth callback] no code — redirecting to login");
    return NextResponse.redirect(new URL("/auth/login", origin));
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.log("[OAuth callback] exchange failed:", error?.message);
    return NextResponse.redirect(new URL("/auth/login", origin));
  }

  console.log("[OAuth callback] user found:", data.user.id);

  // Check if profile is complete
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", data.user.id)
    .single();

  console.log("[OAuth callback] profile username:", profile?.username ?? "none");

  if (!profile?.username) {
    console.log("[OAuth callback] profile incomplete → /auth/complete-profile");
    return NextResponse.redirect(new URL("/auth/complete-profile", origin));
  }

  console.log("[OAuth callback] profile complete → /");
  return NextResponse.redirect(new URL("/", origin));
}
