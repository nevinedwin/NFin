'use client';

import React, { useState } from 'react'
import { Card } from '../ui/card/card'
import CardContent from '../ui/card/cardContent'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { RUPEE_SYMBOL } from '@/app/constants'
import useCountUp from '@/hooks/useCountUp';

type BalanceCardProp = {
    showBalance: boolean;
    totalBalance: number;

}

const BalanceCard = ({ showBalance: showBal = false, totalBalance = 0 }: BalanceCardProp) => {

    const [showBalance, setShowBalance] = useState<boolean>(showBal);
    const balance = useCountUp(totalBalance, 100)


    return (
        <Card className=" w-full border-none h-[160px] bg-surface p-0 
                 transition-all duration-300 ease-out 
                 hover:shadow-md hover:scale-[1.01]">
            <CardContent className="h-full animate-fade-in py-8 px-8">
                <div className='w-full h-full flex justify-between items-center flex-col'>
                    <div className='w-full flex justify-start items-center'>
                        <h2 className='text-sm font-medium text-slate-200'>TOTAL BALANCE</h2>
                    </div>
                    <div className='w-full flex justify-between items-center'>
                        <h2 className='text-3xl  font-extrabold'><span>{RUPEE_SYMBOL}</span> {showBalance ? balance.toFixed(2) : '-----'}</h2>
                        {
                            showBalance ? <EyeIcon onClick={() => setShowBalance(false)} /> : <EyeOffIcon onClick={() => setShowBalance(true)} />
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BalanceCard