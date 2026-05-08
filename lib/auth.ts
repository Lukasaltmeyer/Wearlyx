import { createClient } from "@/lib/supabase/client";

export type AuthProvider = "google";

/** Sign in with OAuth provider — pass from="login"|"signup" to distinguish flows */
export async function signInWithProvider(provider: AuthProvider, from: "login" | "signup" = "login") {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback?from=${from}`,
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

/** Send OTP to email for verification (signup only) */
export async function signInWithEmailOtp(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) throw error;
}

/** Verify email OTP — creates session immediately */
export async function verifyEmailOtp(email: string, token: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) throw error;
  return data.user;
}

/** Set password on the current authenticated user (call after OTP signup) */
export async function setPassword(password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

/** Send password reset email */
export async function sendPasswordReset(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
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
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  if (error) throw error;
  return data.user;
}

/** Update user profile in the profiles table */
export async function updateProfile(userId: string, profile: {
  full_name?: string;
  username?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/** Get current authenticated user */
export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

/** Check if user has completed their profile (has username) */
export async function hasCompletedProfile(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();
  return !!(data?.username);
}

/** Sign out and clear session */
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
