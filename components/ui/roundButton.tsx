'use client';

import React from 'react'

type RoundButtonProp = {
    children: React.ReactNode;
    className?: string;
}

const RoundButton = ({ children, className }: RoundButtonProp) => {
    return (
        <button className={`bg-black w-10 h-10 rounded-full flex justify-center items-center ${className}`}>
            {children}
        </button>
    )
}

export default RoundButton