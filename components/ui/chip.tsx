'use client';

import React, { memo } from 'react';

type ChipProps = {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
    selected?: boolean;
    disabled?: boolean;
};

const Chip = memo(
    ({ children, className = '', hover = true, onClick, selected = false, disabled = false }: ChipProps) => {
        return (
            <button
                type="button"
                disabled={disabled}
                onClick={onClick}
                className={`
                    inline-flex items-center justify-center
                    rounded-lg px-3 py-1
                    text-sm font-medium
                    transition-colors duration-200
                    border
                    ${selected ? 'bg-white text-black border-gray-100' : 'bg-border text-white border-border'}
                    ${hover && !disabled ? 'hover:bg-white hover:border-gray-100 hover:text-black' : ''}
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