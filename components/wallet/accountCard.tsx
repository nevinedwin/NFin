'use client';

import React, { useEffect, useState } from 'react'
import { Card } from '../ui/card/card'
import CardContent from '../ui/card/cardContent'
import { RUPEE_SYMBOL } from '@/lib/constants/constants'
import useCountUp from '@/hooks/useCountUp'
import { formatDateTime } from '@/lib/utils/formats';
import { useMainShellContext } from '@/app/(main)/context/mainShellContext';

type AccountCardProps = {
    balance: number;
    name: string;
    lastUpdated: string;
    accountNumber: string;
}

const AccountCard = ({ accountNumber = '0000', balance = 0, lastUpdated = "21 Jan '26", name = 'unKnown' }: AccountCardProps) => {

    const { showBalance } = useMainShellContext();

    const accountBalance = useCountUp(balance);


    return (
        <Card className=" w-full border-none h-[60px] p-0 py-2
                 transition-all duration-300 ease-out 
                 hover:shadow-md hover:scale-[1.01]">
            <CardContent className="h-full animate-fade-in">
                <div className='w-full h-full flex justify-between items-center'>
                    <div className='w-full flex justify-start items-center gap-4'>
                        <div className='w-7 h-7 rounded-full bg-white text-black flex justify-center items-center font-bold'>{name?.slice(0, 2).toUpperCase()}</div>
                        <div className='flex flex-col items-start justify-center'>
                            <h3 className='text-sm text-slate-300 truncate w-40'>{name}</h3>
                            {accountNumber && <h3 className='text-sm flex items-center justify-center gap-1 font-medium text-slate-300'> <span className="text-center">··</span>{accountNumber.slice(-4)}</h3>}
                        </div>
                    </div>
                    <div className='w-full flex justify-center items-end flex-col'>
                        <h3 className='text-sm flex items-center justify-center gap-1 font-medium '>
                            <span className="text-center">{RUPEE_SYMBOL}</span>
                            {showBalance ? Math.abs(accountBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : '-----'}
                        </h3>

                        <h3 className='text-[10px] text-slate-300 truncate'>{lastUpdated}</h3>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default AccountCard