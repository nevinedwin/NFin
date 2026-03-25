'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { memo } from 'react';

type ChipProps = {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    selected?: boolean;
    disabled?: boolean;
    href: string;
};

const Chip = memo(
    ({ children, className = '', href = '', hover = true, selected = false, disabled = false }: ChipProps) => {

        const router = useRouter();

        const handleChipNavigation = () => {
            router.replace(href);
        };
        
        return (
            <button onClick={handleChipNavigation}
                className={`
                    inline-flex items-center justify-center
                    rounded-lg px-3 py-1
                    text-sm font-medium
                    transition-colors duration-200
                    border
                    ${selected ? 'bg-white text-black border-gray-100' : 'bg-border text-white border-border'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${className}
                    `}
            >
                {children}
            </button>
        );
    }
);

Chip.displayName = 'Chip';

export default Chip;