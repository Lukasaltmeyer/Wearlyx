import { createClient } from "@/lib/supabase/server";

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; url?: string }
) {
  const vapidEmail = process.env.VAPID_EMAIL;
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  if (!vapidEmail || !vapidPublic || !vapidPrivate) return;

  const webpush = (await import("web-push")).default;
  webpush.setVapidDetails(vapidEmail, vapidPublic, vapidPrivate);

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("push_subscriptions")
    .select("subscription")
    .eq("user_id", userId);

  if (!rows?.length) return;

  await Promise.allSettled(
    rows.map((row) =>
      webpush.sendNotification(row.subscription as any, JSON.stringify(payload)).catch(() => {})
    )
  );
}
