import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/auth/login?next=/messages", req.url));

  const to = req.nextUrl.searchParams.get("to");
  if (!to || to === user.id) return NextResponse.redirect(new URL("/messages", req.url));

  // Look for an existing conversation between the two users
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .or(`and(buyer_id.eq.${user.id},seller_id.eq.${to}),and(buyer_id.eq.${to},seller_id.eq.${user.id})`)
    .maybeSingle();

  if (existing) {
    return NextResponse.redirect(new URL(`/messages?conv=${existing.id}`, req.url));
  }

  // Create new conversation — current user is buyer, target is seller by default
  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ buyer_id: user.id, seller_id: to })
    .select("id")
    .single();

  if (error || !created) {
    return NextResponse.redirect(new URL("/messages", req.url));
  }

  return NextResponse.redirect(new URL(`/messages?conv=${created.id}`, req.url));
}
