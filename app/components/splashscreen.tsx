'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

type SplashscreenProps = {
  onFinish: () => void;
};

const Splashscreen: React.FC<SplashscreenProps> = ({ onFinish }) => {
  const [expandBg, setExpandBg] = useState(false);

  useEffect(() => {
    const expandTimer = setTimeout(() => setExpandBg(true), 3000);
    const finishTimer = setTimeout(() => onFinish(), 6000);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-white">
      <div
        className={clsx(
          'absolute rounded-full bg-color-background transition-all duration-[1000ms] ease-in-out flex',
          expandBg
            ? 'w-[300vw] h-[300vw] opacity-100'
            : 'w-0 h-0 opacity-0'
        )}
        style={{
          transitionProperty: 'width, height, opacity',
        }}
      />

      <Image
        src="/icons/icon-96x96.png"
        alt="App Icon"
        width={60}
        height={60}
        className={clsx(
          'z-10 rounded-xl transform transition-all duration-[2000ms] ease-in-out motion-preset-slide-down-lg motion-duration-1500 motion-ease-bounce',
          expandBg ? 'motion-opacity-out-0 scale-110 duration-200' : 'motion-opacity-in-100 scale-100'
        )}
      />
    </div>
  );
};

export default Splashscreen;
