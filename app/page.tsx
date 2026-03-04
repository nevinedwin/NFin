import { getCurrentUser } from "@/auth/currentUser";
import Splashscreen from "@/components/layout/splashscreen";

export default async function Home() {
  const user = await getCurrentUser();
  const target = user ? "/dashboard" : "/sign-up";

  return <Splashscreen target={target} />;
}