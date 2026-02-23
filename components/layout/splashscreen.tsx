'use client';

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type SplashscreenProps = {
  target: string;
};

export default function Splashscreen({ target }: SplashscreenProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(target);
    }, 1800);

    return () => clearTimeout(timer);
  }, [router, target]);

  return (
    <div className="relative flex h-dvh items-center justify-center bg-background overflow-hidden">

      <div className="absolute h-[200vmax] w-[200vmax] rounded-full bg-surface animate-splash-expand" />

      <Image
        src="/icons/nfin-icon-main.png"
        alt="NFin"
        width={80}
        height={80}
        priority
        className="z-10 rounded-2xl animate-splash-logo"
      />
    </div>
  );
}