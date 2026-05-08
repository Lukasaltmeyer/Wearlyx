import { createClient } from "@/lib/supabase/server";
import { sendPushToUser } from "@/lib/push";
import { sendEmail } from "@/lib/email";
import type { NotificationType } from "@/types/database";

interface NotifPayload {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  url?: string;
  // Email fields (optional)
  email?: string;
  emailData?: Record<string, string | number>;
}

const PUSH_ICON: Record<NotificationType, string> = {
  offer_received:   "🔥",
  offer_accepted:   "🎉",
  offer_refused:    "😔",
  offer_countered:  "↩️",
  order_confirmed:  "💸",
  order_shipped:    "📦",
  order_delivered:  "✅",
  dispute_opened:   "⚠️",
  dispute_resolved: "✅",
  new_message:      "💬",
};

const EMAIL_TYPE_MAP: Partial<Record<NotificationType, string>> = {
  offer_received:  "offer_received",
  offer_accepted:  "offer_accepted",
  offer_refused:   "offer_refused",
  order_confirmed: "order_confirmation",
  order_shipped:   "order_shipped",
};

/**
 * Send a notification through all channels:
 * 1. In-app (Supabase DB)
 * 2. Push (Web Push via VAPID)
 * 3. Email (Resend, only if email provided)
 */
export async function sendNotification(payload: NotifPayload) {
  const supabase = await createClient();
  const icon = PUSH_ICON[payload.type] ?? "🔔";

  // 1. In-app notification (DB)
  await supabase.from("notifications").insert({
    user_id: payload.userId,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    read: false,
  });

  // 2. Push notification
  await sendPushToUser(payload.userId, {
    title: `${icon} ${payload.title}`,
    body: payload.body,
    url: payload.url ?? "/",
  }).catch(() => {});

  // 3. Email (if address provided and type has a template)
  const emailType = EMAIL_TYPE_MAP[payload.type];
  if (payload.email && emailType && payload.emailData) {
    await sendEmail({
      to: payload.email,
      type: emailType as any,
      data: payload.emailData,
    }).catch(() => {});
  }
}

/**
 * Helpers for common events
 */
export const Notif = {
  offerReceived: (opts: {
    sellerId: string; sellerEmail?: string;
    buyerName: string; productTitle: string; productPrice: number;
    offerAmount: number; orderId: string;
  }) => sendNotification({
    userId: opts.sellerId,
    type: "offer_received",
    title: "Nouvelle offre reçue",
    body: `${opts.buyerName} t'a fait une offre de ${opts.offerAmount} € sur "${opts.productTitle}"`,
    url: `/orders`,
    email: opts.sellerEmail,
    emailData: {
      buyer_name: opts.buyerName,
      product_title: opts.productTitle,
      product_price: opts.productPrice,
      offer_amount: opts.offerAmount,
      order_id: opts.orderId,
    },
  }),

  offerAccepted: (opts: {
    buyerId: string; buyerEmail?: string;
    productTitle: string; offerAmount: number; orderId: string;
  }) => sendNotification({
    userId: opts.buyerId,
    type: "offer_accepted",
    title: "Offre acceptée ! 🎉",
    body: `Ton offre de ${opts.offerAmount} € pour "${opts.productTitle}" a été acceptée`,
    url: `/orders/${opts.orderId}`,
    email: opts.buyerEmail,
    emailData: {
      product_title: opts.productTitle,
      offer_amount: opts.offerAmount,
      order_id: opts.orderId,
    },
  }),

  offerRefused: (opts: {
    buyerId: string; buyerEmail?: string;
    productTitle: string; offerAmount: number;
  }) => sendNotification({
    userId: opts.buyerId,
    type: "offer_refused",
    title: "Offre refusée",
    body: `Ton offre de ${opts.offerAmount} € pour "${opts.productTitle}" n'a pas été retenue`,
    url: `/orders`,
    email: opts.buyerEmail,
    emailData: {
      product_title: opts.productTitle,
      offer_amount: opts.offerAmount,
    },
  }),

  orderConfirmed: (opts: {
    buyerId: string; buyerEmail?: string;
    sellerId: string; sellerEmail?: string;
    productTitle: string; amount: number; orderId: string;
  }) => Promise.all([
    sendNotification({
      userId: opts.buyerId,
      type: "order_confirmed",
      title: "Achat confirmé 💸",
      body: `Ton achat de "${opts.productTitle}" est confirmé`,
      url: `/orders/${opts.orderId}`,
      email: opts.buyerEmail,
      emailData: {
        product_title: opts.productTitle,
        amount: opts.amount,
        shipping_fee: 0,
        total: opts.amount,
        order_id: opts.orderId,
      },
    }),
    sendNotification({
      userId: opts.sellerId,
      type: "order_confirmed",
      title: "Article vendu 🛍️",
      body: `"${opts.productTitle}" a été vendu pour ${opts.amount} €`,
      url: `/orders/${opts.orderId}`,
    }),
  ]),

  orderShipped: (opts: {
    buyerId: string; buyerEmail?: string;
    productTitle: string; orderId: string; trackingNumber?: string;
  }) => sendNotification({
    userId: opts.buyerId,
    type: "order_shipped",
    title: "Colis expédié 📦",
    body: `"${opts.productTitle}" est en route vers chez toi`,
    url: `/orders/${opts.orderId}`,
    email: opts.buyerEmail,
    emailData: {
      product_title: opts.productTitle,
      order_id: opts.orderId,
      tracking_number: opts.trackingNumber ?? "",
    },
  }),

  orderDelivered: (opts: {
    buyerId: string; productTitle: string; orderId: string;
  }) => sendNotification({
    userId: opts.buyerId,
    type: "order_delivered",
    title: "Colis livré ✅",
    body: `"${opts.productTitle}" a été livré. N'oublie pas de laisser un avis !`,
    url: `/orders/${opts.orderId}`,
  }),

  newMessage: (opts: {
    recipientId: string; senderName: string; conversationId: string;
  }) => sendNotification({
    userId: opts.recipientId,
    type: "new_message",
    title: "Nouveau message 💬",
    body: `${opts.senderName} t'a envoyé un message`,
    url: `/messages/${opts.conversationId}`,
  }),
};
