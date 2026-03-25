'use client';

import React from 'react'

type AccountLogoProp = {
    name: string;
    className?: string;
}

const AccountLogo = ({ name, className }: AccountLogoProp) => {
    return (
        <span className={`rounded-full bg-white text-black flex justify-center items-center font-bold ${className}`}>{name?.slice(0, 2).toUpperCase()}</span>
    )
}

export default AccountLogo;