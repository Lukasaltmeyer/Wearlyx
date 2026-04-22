export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  isAdminUser, getAdminStats, getRecentActivity,
  getAllUsers, getAllProducts, getAllOrders, getAllDisputes,
  getAllShipments, getAllOffers, getAllReviews, getAllTickets, getAllBugs, getAllReports,
} from "@/lib/admin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) redirect("/");

  const [
    stats, activity,
    usersData, productsData, ordersData, disputesData,
    shipmentsData, offersData, reviewsData, ticketsData, bugsData, reportsData,
  ] = await Promise.all([
    getAdminStats(), getRecentActivity(),
    getAllUsers(), getAllProducts(), getAllOrders(), getAllDisputes(),
    getAllShipments(), getAllOffers(), getAllReviews(), getAllTickets(), getAllBugs(), getAllReports(),
  ]);

  return (
    <AdminDashboard
      stats={stats}
      activity={activity}
      users={usersData.users}
      products={productsData.products}
      orders={ordersData.orders}
      disputes={disputesData.disputes}
      shipments={shipmentsData.shipments}
      offers={offersData.offers}
      reviews={reviewsData.reviews}
      tickets={ticketsData.tickets}
      bugs={bugsData.bugs}
      reports={reportsData.reports}
      adminId={user.id}
    />
  );
}
