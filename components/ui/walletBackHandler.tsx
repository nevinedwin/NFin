'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WalletBackHandler() {
    const router = useRouter();

    useEffect(() => {
        const handlePopState = () => {
            router.push('/dashboard');
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return null;
}