import { createClient } from "@/lib/supabase/client";

export type AuthProvider = "google" | "apple";

/** Sign in with OAuth provider (Google / Apple) */
export async function signInWithProvider(provider: AuthProvider) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/home`,
    },
  });
  if (error) throw error;
}

/** Sign in with email + password */
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

/** Sign up with email + password */
export async function signUpWithEmail(
  email: string,
  password: string,
  meta: { full_name: string; username: string }
) {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: meta },
  });
  if (error) throw error;
}

/** Send OTP to phone number (E.164 format: +33612345678) */
export async function signInWithPhone(phone: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw error;
}

/** Verify phone OTP */
export async function verifyPhoneOtp(phone: string, token: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  if (error) throw error;
}

/** Get current authenticated user (validates token with server, clears invalid sessions) */
export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    // Clear any stale/invalid session from localStorage to prevent redirect loops
    await supabase.auth.signOut();
    return null;
  }
  return data.user;
}
