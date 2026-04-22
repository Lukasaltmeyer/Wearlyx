import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyUnsubscribeToken } from "@/lib/email";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse("Lien invalide.", { status: 400 });
  }

  const userId = verifyUnsubscribeToken(token);
  if (!userId) {
    return new NextResponse("Lien invalide ou expiré.", { status: 400 });
  }

  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({ marketing_consent: false })
    .eq("id", userId);

  return new NextResponse(
    `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Désinscription</title>
    <style>body{font-family:system-ui,sans-serif;background:#08080F;color:white;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;}
    .card{background:#0f0f1a;border:1px solid #1a1a2e;border-radius:20px;padding:40px;max-width:400px;}
    h1{font-size:22px;font-weight:900;margin:0 0 12px;}p{color:#a0a0c0;font-size:14px;margin:0 0 20px;}
    a{display:inline-block;background:linear-gradient(135deg,#6C3AED,#C026D3);color:white;text-decoration:none;padding:12px 24px;border-radius:12px;font-weight:700;font-size:14px;}</style>
    </head><body>
    <div class="card">
      <h1>Désinscription confirmée ✓</h1>
      <p>Tu ne recevras plus d'emails marketing de Wearlyx.<br/>Les emails transactionnels (commandes, sécurité) restent actifs.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://wearlyx.vercel.app"}/profile/settings/notifications">Gérer mes préférences</a>
    </div></body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
