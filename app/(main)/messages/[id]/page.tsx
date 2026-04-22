export const dynamic = "force-dynamic";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatView } from "@/components/ChatView";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: conversation } = await supabase
    .from("conversations")
    .select(`
      *,
      product:products(id, title, images, price),
      buyer:profiles!conversations_buyer_id_fkey(id, username, full_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(id, username, full_name, avatar_url)
    `)
    .eq("id", id)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .single();

  if (!conversation) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("*, sender:profiles(id, username, full_name, avatar_url)")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  // Mark messages as read
  await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", id)
    .neq("sender_id", user.id);

  return (
    <ChatView
      conversation={conversation}
      initialMessages={messages ?? []}
      currentUserId={user.id}
    />
  );
}
