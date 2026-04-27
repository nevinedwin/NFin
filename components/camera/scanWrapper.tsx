'use client';

import dynamic from 'next/dynamic';
import React, { useCallback, useState } from 'react';

const QrScanner = dynamic(() => import('./scanner'), {
    ssr: false,
    loading: () => <p>Opening camera...</p>
});

type ScanWrapperProp = {
    setManual: () => void;
};

const ScanWrapper = ({ setManual }: ScanWrapperProp) => {
    const [result, setResult] = useState('');
    const [scanning, setScanning] = useState(true);

    const handleResult = useCallback((text: string) => {
        setResult(text);
        setScanning(false); // 🔥 unmount scanner → stops camera
    }, []);

    return (
        <div className="w-full h-full flex flex-col gap-8 p-4">
            <h3 className='text-lg font-semibold text-white'>
                Scan any QR code
            </h3>

            {scanning && (
                <QrScanner onResult={handleResult} />
            )}

            {result && (
                <p className="text-green-600">Scanned: {result}</p>
            )}

            <button
                onClick={setManual}
                className='bottom-0 text-black font-semibold bg-white w-fit self-center rounded-lg px-4 py-2'
            >
                Enter data manually
            </button>
        </div>
    );
};

export default ScanWrapper;