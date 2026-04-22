import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getValidUrl(raw: string | undefined): string {
  if (raw && raw.startsWith("https://") && !raw.includes("your_supabase")) {
    return raw;
  }
  return "https://supabase.co";
}

function getValidKey(raw: string | undefined): string {
  if (raw && raw.length > 20 && !raw.includes("your_supabase")) {
    return raw;
  }
  return "demo-key";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<any>(
    getValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    getValidKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
