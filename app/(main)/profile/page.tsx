export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  redirect("/profile/menu");
}
