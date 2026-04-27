'use client';

import React, { useEffect, useRef } from 'react';

type ScannerProp = {
    onResult: (text: string) => void;
};

const Scanner = ({ onResult }: ScannerProp) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReaderRef = useRef<any>(null);
    const isRunningRef = useRef(false);

    useEffect(() => {
        let isMounted = true;

        const startScanner = async () => {
            // prevent multiple starts
            if (isRunningRef.current) return;
            isRunningRef.current = true;

            try {
                const { BrowserMultiFormatReader } = await import('@zxing/browser');

                const codeReader = new BrowserMultiFormatReader();
                codeReaderRef.current = codeReader;

                await codeReader.decodeFromConstraints(
                    {
                        video: {
                            facingMode: { ideal: 'environment' },
                        },
                    },
                    videoRef.current!,
                    (result: any, error: any) => {
                        if (!isMounted) return;

                        if (result) {
                            // 🔥 QR detected → return result + stop camera
                            onResult(result.getText());
                            stopScanner();
                        }

                        if (error && error.name !== 'NotFoundException') {
                            console.error('Scanner error:', error);
                        }
                    }
                );
            } catch (err) {
                console.error('Camera start error:', err);
            }
        };

        const stopScanner = () => {
            isRunningRef.current = false;

            // stop video stream
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
                videoRef.current.srcObject = null;
            }

            // stop ZXing reader
            if (codeReaderRef.current?.stopContinuousDecode) {
                codeReaderRef.current.stopContinuousDecode();
            }
        };

        startScanner();

        return () => {
            isMounted = false;
            stopScanner();
        };
    }, [onResult]);

    return (
        <video
            ref={videoRef}
            className="w-full h-[300px] rounded-lg object-cover"
            playsInline
            muted
            autoPlay
        />
    );
};

export default Scanner;