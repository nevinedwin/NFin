'use client';

import React, { useState } from 'react';
import Splashscreen from './components/splashscreen';

type ClientComponentType = React.PropsWithChildren;

const ClientComponent: React.FC<ClientComponentType> = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div>
      {showSplash ? (
        <Splashscreen onFinish={() => setShowSplash(false)} />
      ) : (
        <div className="fade-in h-screen flex flex-col items-center justify-center bg-color-background">
          {children}
        </div>
      )}
    </div>
  );
};

export default ClientComponent;
