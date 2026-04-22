import { createClient } from "@/lib/supabase/server";

export function isAdmin(userId: string): boolean {
  return userId === process.env.ADMIN_USER_ID;
}

export function isAdminUser(user: { id: string; email?: string }): boolean {
  const adminEmail = process.env.ADMIN_EMAIL ?? "laltmeyer493@gmail.com";
  return user.email === adminEmail;
}

export async function getAdminStats() {
  const supabase = await createClient();

  const [
    { count: usersCount },
    { count: productsCount },
    { count: ordersCount },
    { count: disputesCount },
    { count: aiCount },
    { data: orders },
    { data: subs },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("disputes").select("*", { count: "exact", head: true }),
    supabase.from("ai_generations").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total, status"),
    supabase.from("subscriptions").select("plan, status").eq("status", "active"),
  ]);

  const revenue = (orders ?? []).filter((o: any) => o.status !== "cancelled" && o.status !== "refunded")
    .reduce((sum: number, o: any) => sum + (o.total ?? 0), 0);

  const planCounts = { free: 0, starter: 0, pro: 0, premium: 0 };
  (subs ?? []).forEach((s: any) => { if (s.plan in planCounts) (planCounts as any)[s.plan]++; });
  const freeCount = Math.max(0, (usersCount ?? 0) - (subs?.length ?? 0));

  return {
    usersCount: usersCount ?? 0,
    productsCount: productsCount ?? 0,
    ordersCount: ordersCount ?? 0,
    disputesCount: disputesCount ?? 0,
    aiCount: aiCount ?? 0,
    revenue,
    planCounts: { ...planCounts, free: freeCount },
  };
}

export async function getRecentActivity() {
  const supabase = await createClient();

  const [
    { data: recentUsers },
    { data: recentProducts },
    { data: recentOrders },
    { data: recentOffers },
  ] = await Promise.all([
    supabase.from("profiles").select("id, username, full_name, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("products").select("id, title, price, created_at, seller:profiles(username)").order("created_at", { ascending: false }).limit(5),
    supabase.from("orders").select("id, total, status, created_at, product:products(title), buyer:profiles!orders_buyer_id_fkey(username)").order("created_at", { ascending: false }).limit(5),
    supabase.from("offers").select("id, amount, status, created_at, product:products(title), buyer:profiles!offers_buyer_id_fkey(username)").order("created_at", { ascending: false }).limit(5),
  ]);

  return { recentUsers, recentProducts, recentOrders, recentOffers };
}

export async function getAllUsers(page = 0, limit = 20) {
  const supabase = await createClient();
  const { data, count } = await supabase
    .from("profiles")
    .select("*, subscription:subscriptions(plan, status), moderation:user_moderation(status, warn_count, expires_at, last_reason)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  // Normalize moderation (array → object)
  const users = (data ?? []).map((u: any) => ({
    ...u,
    moderation: Array.isArray(u.moderation) ? (u.moderation[0] ?? null) : u.moderation,
  }));

  return { users, total: count ?? 0 };
}

export async function getAllProducts(page = 0, limit = 20) {
  const supabase = await createClient();
  const { data, count } = await supabase
    .from("products")
    .select("*, seller:profiles(username, full_name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);
  return { products: data ?? [], total: count ?? 0 };
}

export async function getAllOrders(page = 0, limit = 20) {
  const supabase = await createClient();
  const { data, count } = await supabase
    .from("orders")
    .select("*, product:products(title, images), buyer:profiles!orders_buyer_id_fkey(username), seller:profiles!orders_seller_id_fkey(username)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);
  return { orders: data ?? [], total: count ?? 0 };
}

export async function getAllDisputes(page = 0, limit = 20) {
  const supabase = await createClient();
  const { data, count } = await supabase
    .from("disputes")
    .select("*, order:orders(id, total, product:products(title)), opener:profiles!disputes_opened_by_fkey(username)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);
  return { disputes: data ?? [], total: count ?? 0 };
}

export async function getAllShipments(page = 0, limit = 50) {
  const supabase = await createClient();
  const { data, count } = await supabase
    .from("shipments")
    .select("*, order:orders(id, total, status, product:products(title), buyer:profiles!orders_buyer_id_fkey(username), seller:profiles!orders_seller_id_fkey(username))", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);
  return { shipments: data ?? [], total: count ?? 0 };
}

export async function getAllOffers(page = 0, limit = 50) {
  const supabase = await createClient();
  const { data, count } = await supabase
    .from("offers")
    .select("*, product:products(id, title, price), buyer:profiles!offers_buyer_id_fkey(username), seller:profiles!offers_seller_id_fkey(username)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);
  return { offers: data ?? [], total: count ?? 0 };
}

export async function getAllReviews(page = 0, limit = 50) {
  const supabase = await createClient();
  const { data, count } = await supabase
    .from("reviews")
    .select("*, reviewer:profiles!reviews_reviewer_id_fkey(username), reviewed:profiles!reviews_reviewed_id_fkey(username)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);
  return { reviews: data ?? [], total: count ?? 0 };
}

export async function getAllTickets(page = 0, limit = 50) {
  const supabase = await createClient();
  const { data, count } = await supabase
    .from("support_tickets")
    .select("*, user:profiles!support_tickets_user_id_fkey(username, full_name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);
  return { tickets: data ?? [], total: count ?? 0 };
}

export async function getAllBugs(page = 0, limit = 50) {
  const supabase = await createClient();
  const { data, count } = await supabase
    .from("bug_reports")
    .select("*, reporter:profiles!bug_reports_reporter_id_fkey(username)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);
  return { bugs: data ?? [], total: count ?? 0 };
}

export async function getAllReports(page = 0, limit = 50) {
  const supabase = await createClient();
  const { data, count } = await supabase
    .from("admin_reports")
    .select("*, reporter:profiles!admin_reports_reporter_id_fkey(username)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);
  return { reports: data ?? [], total: count ?? 0 };
}
