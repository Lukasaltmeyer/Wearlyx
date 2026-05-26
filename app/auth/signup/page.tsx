import { getDeviceType } from "@/lib/device";
import SignupClient from "./SignupClient";
import SignupForm from "./SignupForm";

export default async function SignupPage() {
  const device = await getDeviceType();
  if (device === "mobile") return <SignupForm />;
  return <SignupClient />;
}
