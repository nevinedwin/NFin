'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const BackButton: React.FC<{ label?: string; className?: string }> = ({
    label = 'Back',
    className = '',
}) => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className={`px-4 py-2 rounded-2xl bg-surface-soft text-text-primary hover:bg-surface transition ${className}`}
        >
            {label}
        </button>
    );
};

export default BackButton;