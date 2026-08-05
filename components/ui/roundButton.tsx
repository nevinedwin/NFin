'use client';

import React from 'react'

type RoundButtonProp = {
    children: React.ReactNode;
    className?: string;
}

const RoundButton = ({ children, className }: RoundButtonProp) => {
    return (
        <button className={`bg-surface-soft w-10 h-10 rounded-full flex justify-center items-center text-text-primary transition hover:bg-surface ${className}`}>
            {children}
        </button>
    )
}

export default RoundButton