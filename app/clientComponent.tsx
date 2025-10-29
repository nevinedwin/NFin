'use client';

import React from 'react';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Splashscreen from "./components/splashscreen";

type ClientComponentType = React.PropsWithChildren<{}>;

const ClientComponent: React.FC<ClientComponentType> = ({ children }) => {

  const [showSplash, setShowSplash] = useState(true);

  // useEffect(() => {
  //   if (showSplash) {
  //     const timer = setTimeout(() => {
  //       setShowSplash(true);
  //       localStorage.setItem('splashShown', 'false');
  //     }, 2000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [showSplash]);

  return (
    <div>
      {
        showSplash ? (
          <Splashscreen onFinish={() => setShowSplash(false)} />
        ) : (
          <div className="fade-in h-screen flex flex-col items-center justify-center bg-[var(--color-background)]">

            {children}
            {/* <h1 className="text-3xl font-bold">Welcome to Nevin Finance App 💸</h1>
            <p className="text-sm mt-2 opacity-90">Your smart finance companion.</p> */}
          </div>
        )
      }
    </div>
  )
}

export default ClientComponent
