import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const from = searchParams.get("from") ?? "login"; // "login" | "signup"

  console.log("[OAuth callback] code:", !!code, "from:", from);

  if (!code) {
    console.log("[OAuth callback] no code → login");
    return NextResponse.redirect(new URL("/auth/login", origin));
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.log("[OAuth callback] exchange failed:", error?.message);
    return NextResponse.redirect(new URL("/auth/login", origin));
  }

  const userId = data.user.id;
  console.log("[OAuth callback] user:", userId);

  // Check profile completeness
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  const hasProfile = !!profile?.username;
  console.log("[OAuth callback] hasProfile:", hasProfile, "from:", from);

  // Signup flow — existing account → redirect to login with error
  if (from === "signup" && hasProfile) {
    console.log("[OAuth callback] signup but account exists → login?error=already_exists");
    return NextResponse.redirect(new URL("/auth/login?error=already_exists", origin));
  }

  // No profile yet → complete profile page
  if (!hasProfile) {
    console.log("[OAuth callback] no profile → /auth/complete-profile");
    return NextResponse.redirect(new URL("/auth/complete-profile", origin));
  }

  console.log("[OAuth callback] all good → /");
  return NextResponse.redirect(new URL("/", origin));
}
