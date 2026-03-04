import Splashscreen from "@/components/layout/splashscreen";
import { getServerUser } from "@/lib/auth.server";

export default async function Home() {
  const user = await getServerUser();

  console.log('page');

  const target = user ? "/dashboard" : "/sign-up";

  return <Splashscreen target={target} />;
}