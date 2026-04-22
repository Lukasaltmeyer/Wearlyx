export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { CreditsClient } from "@/components/CreditsClient";
import { isAdminUser } from "@/lib/admin";

export default async function CreditsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("sales_count, rating")
    .eq("id", user.id)
    .single();

  const { data: usageRow } = await supabase
    .from("user_usage")
    .select("ai_photos_used, plan")
    .eq("user_id", user.id)
    .single();

  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("seller_id", user.id)
    .neq("status", "deleted");

  const adminUser = isAdminUser(user);

  return (
    <>
      <Navbar />
      <main className="bg-[#08080F] min-h-[100dvh] pb-24 animate-fadeIn">
        <CreditsClient
          salesCount={adminUser ? 2495 : (profile?.sales_count ?? 0)}
          productsCount={adminUser ? 9 : (products?.length ?? 0)}
          aiPhotosUsed={0}
          rating={adminUser ? 5 : (profile?.rating ?? 0)}
          isPremium={adminUser ? true : usageRow?.plan === "premium"}
        />
      </main>
    </>
  );
}
