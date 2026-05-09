import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const MOBILE_UA_RE = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;
// iPad and tablets with small width → desktop experience
// We rely solely on UA for SSR — client resize is handled by DesktopShell/MobileShell

function detectDevice(request: NextRequest): "mobile" | "desktop" {
  const ua = request.headers.get("user-agent") ?? "";
  return MOBILE_UA_RE.test(ua) ? "mobile" : "desktop";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always detect device and inject header — even for /auth routes
  const device = detectDevice(request);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-device", device);

  // Skip Supabase session refresh for static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    res.cookies.set("x-device", device, { path: "/", sameSite: "lax", httpOnly: false, maxAge: 60 * 60 * 24 * 30 });
    return res;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    res.cookies.set("x-device", device, { path: "/", sameSite: "lax", httpOnly: false, maxAge: 60 * 60 * 24 * 30 });
    return res;
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set("x-device", device, { path: "/", sameSite: "lax", httpOnly: false, maxAge: 60 * 60 * 24 * 30 });

  // Skip Supabase session refresh for auth pages (public routes)
  if (!pathname.startsWith("/auth")) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    });
    await supabase.auth.getUser();
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
