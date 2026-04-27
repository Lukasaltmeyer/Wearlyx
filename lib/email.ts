import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");
  return _resend;
}
const FROM = "Wearlyx <noreply@wearlyx.fr>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://wearlyx.vercel.app";

// ── HTML base template ───────────────────────────────────────────────────────

function baseTemplate(content: string, unsubscribeToken?: string) {
  const unsubscribeBlock = unsubscribeToken
    ? `<tr><td style="padding:24px 32px;text-align:center;border-top:1px solid #1a1a2e;">
        <p style="color:#555;font-size:11px;margin:0;">
          Tu reçois cet email car tu as accepté nos communications marketing.<br/>
          <a href="${APP_URL}/api/emails/unsubscribe?token=${unsubscribeToken}" style="color:#22C55E;">Se désinscrire</a>
          &nbsp;·&nbsp;
          <a href="${APP_URL}/profile/settings/notifications" style="color:#22C55E;">Gérer mes préférences</a>
        </p>
       </td></tr>`
    : `<tr><td style="padding:16px 32px;text-align:center;border-top:1px solid #1a1a2e;">
        <p style="color:#555;font-size:11px;margin:0;">Email transactionnel — <a href="${APP_URL}/profile/settings/notifications" style="color:#22C55E;">Gérer mes notifications</a></p>
       </td></tr>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0a0a15;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a15;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#0f0f1a;border-radius:20px;overflow:hidden;border:1px solid #1a1a2e;">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#22C55E,#16A34A);padding:28px 32px;">
          <h1 style="margin:0;color:white;font-size:22px;font-weight:900;letter-spacing:-0.5px;">Wearlyx</h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">Mode seconde main, prix imbattables</p>
        </td></tr>
        <!-- Content -->
        <tr><td style="padding:32px;">${content}</td></tr>
        <!-- Footer -->
        ${unsubscribeBlock}
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ── Email types ──────────────────────────────────────────────────────────────

export type EmailType =
  | "welcome"
  | "order_confirmation"
  | "order_shipped"
  | "offer_received"
  | "offer_accepted"
  | "offer_refused"
  | "security_login"
  | "marketing_newsletter"
  | "marketing_promo";

interface SendEmailOptions {
  to: string;
  type: EmailType;
  data?: Record<string, string | number>;
  unsubscribeToken?: string; // required for marketing emails
}

// ── Templates ────────────────────────────────────────────────────────────────

function buildContent(type: EmailType, data: Record<string, string | number> = {}): { subject: string; html: string } {
  const h2 = (t: string) => `<h2 style="margin:0 0 16px;color:white;font-size:20px;font-weight:800;">${t}</h2>`;
  const p = (t: string) => `<p style="margin:0 0 12px;color:#a0a0c0;font-size:14px;line-height:1.6;">${t}</p>`;
  const btn = (url: string, label: string) =>
    `<div style="margin:24px 0 0;"><a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#22C55E,#16A34A);color:white;font-weight:800;font-size:14px;text-decoration:none;padding:14px 28px;border-radius:12px;">${label}</a></div>`;
  const divider = `<div style="height:1px;background:#1a1a2e;margin:20px 0;"></div>`;
  const infoRow = (label: string, value: string | number) =>
    `<tr><td style="padding:8px 0;color:#555;font-size:13px;">${label}</td><td style="padding:8px 0;color:white;font-size:13px;font-weight:600;text-align:right;">${value}</td></tr>`;

  switch (type) {
    case "welcome":
      return {
        subject: "Bienvenue sur Wearlyx 👋",
        html: baseTemplate(
          h2("Bienvenue sur Wearlyx !") +
          p(`Salut <strong style="color:white;">${data.username ?? "toi"}</strong> 👋<br/>Ton compte est prêt. Commence à acheter et vendre des vêtements maintenant.`) +
          `<div style="background:#1a1a2e;border-radius:12px;padding:16px;margin:16px 0;">
            <p style="margin:0 0 8px;color:#a0a0c0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Premiers pas</p>
            <p style="margin:4px 0;color:white;font-size:13px;">✅ Complète ton profil</p>
            <p style="margin:4px 0;color:white;font-size:13px;">📸 Publie ta première annonce avec l'IA</p>
            <p style="margin:4px 0;color:white;font-size:13px;">🛍️ Explore les articles disponibles</p>
          </div>` +
          btn(`${APP_URL}/`, "Explorer Wearlyx")
        ),
      };

    case "order_confirmation":
      return {
        subject: `Commande confirmée — ${data.product_title}`,
        html: baseTemplate(
          h2("Commande confirmée !") +
          p(`Ta commande a bien été reçue. Le vendeur va préparer ton colis.`) +
          divider +
          `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
            ${infoRow("Article", String(data.product_title ?? ""))}
            ${infoRow("Montant", `${data.amount ?? 0} €`)}
            ${infoRow("Frais de port", `${data.shipping_fee ?? 0} €`)}
            ${infoRow("Total", `<strong>${data.total ?? 0} €</strong>`)}
            ${infoRow("Réf. commande", String(data.order_id ?? ""))}
          </table>` +
          divider +
          `<div style="background:#0d2a1f;border:1px solid #10b98133;border-radius:12px;padding:14px;margin:16px 0;">
            <p style="margin:0;color:#10b981;font-size:13px;font-weight:700;">🛡️ Protection acheteur active</p>
            <p style="margin:4px 0 0;color:#10b98199;font-size:12px;">Paiement sécurisé · Remboursement garanti si problème</p>
          </div>` +
          btn(`${APP_URL}/orders/${data.order_id}`, "Suivre ma commande")
        ),
      };

    case "order_shipped":
      return {
        subject: `Ton colis est en route ! 📦`,
        html: baseTemplate(
          h2("Ton colis est parti !") +
          p(`<strong style="color:white;">${data.product_title}</strong> a été expédié par le vendeur.`) +
          (data.tracking_number ? `<div style="background:#1a1a2e;border-radius:12px;padding:16px;margin:16px 0;text-align:center;">
            <p style="margin:0 0 4px;color:#555;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Numéro de suivi</p>
            <p style="margin:0;color:white;font-size:18px;font-weight:800;letter-spacing:2px;">${data.tracking_number}</p>
          </div>` : "") +
          btn(`${APP_URL}/orders/${data.order_id}`, "Suivre la livraison")
        ),
      };

    case "offer_received":
      return {
        subject: `Nouvelle offre sur "${data.product_title}"`,
        html: baseTemplate(
          h2("Tu as reçu une offre !") +
          p(`<strong style="color:white;">${data.buyer_name}</strong> t'a fait une offre pour <strong style="color:white;">${data.product_title}</strong>.`) +
          `<div style="background:#1a1a2e;border-radius:12px;padding:20px;margin:16px 0;text-align:center;">
            <p style="margin:0 0 4px;color:#555;font-size:12px;">Offre proposée</p>
            <p style="margin:0;color:#4ADE80;font-size:28px;font-weight:900;">${data.offer_amount} €</p>
            <p style="margin:4px 0 0;color:#555;font-size:12px;">Prix initial : ${data.product_price} €</p>
          </div>` +
          btn(`${APP_URL}/orders`, "Voir l'offre")
        ),
      };

    case "offer_accepted":
      return {
        subject: `Offre acceptée ! 🎉 "${data.product_title}"`,
        html: baseTemplate(
          h2("Ton offre a été acceptée !") +
          p(`Félicitations ! Le vendeur a accepté ton offre de <strong style="color:#4ADE80;">${data.offer_amount} €</strong> pour <strong style="color:white;">${data.product_title}</strong>.`) +
          p("Finalise ton achat maintenant avant que l'offre expire.") +
          btn(`${APP_URL}/orders`, "Finaliser l'achat")
        ),
      };

    case "offer_refused":
      return {
        subject: `Offre refusée — "${data.product_title}"`,
        html: baseTemplate(
          h2("Offre non retenue") +
          p(`Le vendeur n'a pas pu accepter ton offre pour <strong style="color:white;">${data.product_title}</strong>.`) +
          p("Tu peux toujours acheter l'article au prix normal ou chercher d'autres articles similaires.") +
          btn(`${APP_URL}/`, "Explorer d'autres articles")
        ),
      };

    case "security_login":
      return {
        subject: "Nouvelle connexion à ton compte Wearlyx",
        html: baseTemplate(
          h2("Nouvelle connexion détectée") +
          p("Une connexion à ton compte vient d'être effectuée.") +
          `<div style="background:#1a1a2e;border-radius:12px;padding:16px;margin:16px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${infoRow("Appareil", String(data.device ?? "Inconnu"))}
              ${infoRow("Date", String(data.date ?? new Date().toLocaleDateString("fr-FR")))}
            </table>
          </div>` +
          p("Si ce n'était pas toi, change immédiatement ton mot de passe.") +
          btn(`${APP_URL}/profile/settings/security`, "Sécuriser mon compte")
        ),
      };

    case "marketing_newsletter":
      return {
        subject: data.subject ? String(data.subject) : "Les nouveautés Wearlyx 🛍️",
        html: baseTemplate(
          h2(String(data.headline ?? "Les dernières nouveautés")) +
          p(String(data.body ?? "Découvre les nouvelles annonces et les meilleures affaires du moment.")) +
          btn(`${APP_URL}/`, "Voir les nouveautés"),
          String(data.unsubscribeToken ?? "")
        ),
      };

    case "marketing_promo":
      return {
        subject: data.subject ? String(data.subject) : "Offre spéciale Wearlyx 🎁",
        html: baseTemplate(
          `<div style="background:linear-gradient(135deg,#22C55E22,#16A34A22);border:1px solid #22C55E44;border-radius:16px;padding:24px;margin:0 0 20px;text-align:center;">
            <p style="margin:0 0 4px;color:#4ADE80;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Offre exclusive</p>
            <h2 style="margin:8px 0;color:white;font-size:28px;font-weight:900;">${data.promo_label ?? "Bonne affaire"}</h2>
            <p style="margin:0;color:#a0a0c0;font-size:14px;">${data.promo_description ?? ""}</p>
          </div>` +
          p(String(data.body ?? "")) +
          btn(`${APP_URL}/`, "En profiter maintenant"),
          String(data.unsubscribeToken ?? "")
        ),
      };

    default:
      return { subject: "Wearlyx", html: baseTemplate(p("Un message de Wearlyx.")) };
  }
}

// ── Secure unsubscribe token (HMAC-SHA256) ────────────────────────────────────

export function generateUnsubscribeToken(userId: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET ?? "fallback-secret-change-in-prod";
  const payload = Buffer.from(userId).toString("base64url");
  const hmac = require("crypto").createHmac("sha256", secret).update(userId).digest("base64url");
  return `${payload}.${hmac}`;
}

export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;
    const userId = Buffer.from(payload, "base64url").toString();
    const expected = generateUnsubscribeToken(userId).split(".")[1];
    // Constant-time comparison to prevent timing attacks
    const sigBuf = Buffer.from(signature, "base64url");
    const expBuf = Buffer.from(expected, "base64url");
    if (sigBuf.length !== expBuf.length) return null;
    if (!require("crypto").timingSafeEqual(sigBuf, expBuf)) return null;
    return userId;
  } catch {
    return null;
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function sendEmail({ to, type, data = {}, unsubscribeToken }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY manquante, email non envoyé");
    return { error: "RESEND_API_KEY manquante" };
  }

  const { subject, html } = buildContent(type, { ...data, unsubscribeToken: unsubscribeToken ?? "" });

  try {
    const result = await getResend().emails.send({ from: FROM, to, subject, html });
    return result;
  } catch (e: any) {
    console.error("[email] Erreur envoi:", e.message);
    return { error: e.message };
  }
}
