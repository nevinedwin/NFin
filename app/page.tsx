import Splashscreen from "@/components/layout/splashscreen";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  const target = userId ? "/dashboard" : "/sign-up";

  return <Splashscreen target={target} />;
}