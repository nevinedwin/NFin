'use client';

import React, { useState, useEffect } from 'react';
import Splashscreen from './components/splashscreen';

type ClientComponentType = React.PropsWithChildren;

const ClientComponent: React.FC<ClientComponentType> = ({ children }) => {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const splashShown = localStorage.getItem('splashShown');

    if (!splashShown) {
      setShowSplash(true);
    }
  }, []);

  const handleFinish = () => {
    localStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  return (
    <div>
      {showSplash ? (
        <Splashscreen onFinish={handleFinish} />
      ) : (
        <div className="fade-in h-screen flex flex-col items-center justify-center bg-color-background">
          {children}
        </div>
      )}
    </div>
  );
};

export default ClientComponent;
