'use client';

import React, { useEffect, useState } from 'react'
import { Card } from '../ui/card/card'
import CardContent from '../ui/card/cardContent'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { RUPEE_SYMBOL } from '@/lib/constants/constants'
import useCountUp from '@/hooks/useCountUp';
import { useMainShellContext } from '@/app/(main)/context/mainShellContext';
import ShowBalanceComp from '../ui/showBalance';

type BalanceCardProp = {
    totalBalance: number;
    label: string;

}

const BalanceCard = ({ totalBalance = 0, label }: BalanceCardProp) => {

    const { showBalance, setShowBalance } = useMainShellContext();
    const balance = useCountUp(totalBalance, 100)

    return (
        <Card className=" w-full border-none h-[160px] bg-surface p-0 
                 transition-all duration-300 ease-out 
                 hover:shadow-md hover:scale-[1.01]">
            <CardContent className="h-full animate-fade-in py-8 px-8">
                <div className='w-full h-full flex justify-between items-center flex-col'>
                    <div className='w-full flex justify-start items-center'>
                        <h2 className='text-sm font-medium text-slate-200'>{label}</h2>
                    </div>
                    <div className='w-full flex justify-between items-center'>
                        {showBalance ? <ShowBalanceComp balance={balance} /> : <span className='text-3xl'>{RUPEE_SYMBOL} ----</span>}
                        {
                            showBalance ? <EyeIcon onClick={() => setShowBalance(false)} className='cursor-pointer' /> : <EyeOffIcon onClick={() => setShowBalance(true)} className='cursor-pointer' />
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BalanceCard