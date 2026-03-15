'use client';

import React from 'react'

type AccountLogoProp = {
    name: string;
    className?: string;
}

const AccountLogo = ({ name, className }: AccountLogoProp) => {
    return (
        <div className={`rounded-full bg-white text-black flex justify-center items-center font-bold ${className}`}>{name?.slice(0, 2).toUpperCase()}</div>
    )
}

export default AccountLogo