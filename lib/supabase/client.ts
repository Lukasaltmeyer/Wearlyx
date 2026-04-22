import { createBrowserClient } from "@supabase/ssr";

function getValidUrl(raw: string | undefined): string {
  if (raw && raw.startsWith("https://") && !raw.includes("your_supabase")) {
    return raw;
  }
  // URL de démo — les requêtes échoueront silencieusement
  return "https://supabase.co";
}

function getValidKey(raw: string | undefined): string {
  if (raw && raw.length > 20 && !raw.includes("your_supabase")) {
    return raw;
  }
  return "demo-key";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient() {
  return createBrowserClient<any>(
    getValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    getValidKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}
