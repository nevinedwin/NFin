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
            className={`px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition ${className}`}
        >
            {label}
        </button>
    );
};

export default BackButton;