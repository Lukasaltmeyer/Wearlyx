import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPushToUser } from "@/lib/push";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { toUserId, title, body, url } = await req.json();
  if (!toUserId || !title) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  await sendPushToUser(toUserId, { title, body, url: url ?? "/" });
  return NextResponse.json({ ok: true });
}
