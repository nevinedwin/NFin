'use client';

import React, { useEffect, useState } from 'react'
import { Card } from '../ui/card/card'
import CardContent from '../ui/card/cardContent'
import { RUPEE_SYMBOL } from '@/lib/constants/constants'
import useCountUp from '@/hooks/useCountUp'
import { formatDateTime } from '@/lib/utils/formats';
import { useMainShellContext } from '@/app/(main)/context/mainShellContext';
import ShowBalanceComp from '../ui/showBalance';

type AccountCardProps = {
    balance: number;
    name: string;
    lastUpdated: Date;
    accountNumber: string;
}

const AccountCard = ({ accountNumber = '0000', balance = 0, lastUpdated, name = 'unKnown' }: AccountCardProps) => {

    const { showBalance } = useMainShellContext();

    const accountBalance = useCountUp(balance, 100);


    return (
        <Card className=" w-full border-none bg-surface h-[60px] p-0 py-2
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
                        <h3 className='!text-sm flex items-center justify-center gap-1 font-normal '>
                            {showBalance ? <ShowBalanceComp balance={accountBalance} mainClass="!text-sm !font-normal" subClass='!text-[11px]' /> : <span className='text-sm'>{RUPEE_SYMBOL} ----</span>}
                        </h3>

                        <h3 className='text-[10px] text-slate-300 truncate'>{formatDateTime(lastUpdated)}</h3>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default AccountCard