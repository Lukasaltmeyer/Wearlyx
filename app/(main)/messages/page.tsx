export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessagesPageClient } from "@/components/MessagesPageClient";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/messages");

  const { data: conversations } = await supabase
    .from("conversations")
    .select(`
      *,
      product:products(id, title, images),
      buyer:profiles!conversations_buyer_id_fkey(id, username, full_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(id, username, full_name, avatar_url)
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false });

  return <MessagesPageClient conversations={conversations ?? []} currentUserId={user.id} />;
}
