"use client";

import React from 'react'
import { Card } from '../ui/card/card'
import CardContent from '../ui/card/cardContent'
import { ArrowDown, ArrowUp, Wallet2 } from 'lucide-react'
import { RUPEE_SYMBOL } from '@/app/constants'
import useCountUp from '@/hooks/useCountUp';

const HeaderCard = () => {

    const balance = useCountUp(200);
    const income = useCountUp(1000);
    const expense = useCountUp(550);

    return (
        <Card className="rounded-none rounded-b-3xl w-full border-none h-[160px] bg-bar p-0 
                 transition-all duration-300 ease-out 
                 hover:shadow-md hover:scale-[1.01]">
            <CardContent className="bg-bar h-[110px] animate-fade-in">
                <div className="h-full flex justify-between items-center">
                    <div>
                        <h2 className="text-sm font-light text-slate-500">Total Balance</h2>
                        <h1 className="text-3xl  font-extrabold"><span>{RUPEE_SYMBOL}</span>{balance.toFixed(2)}</h1>
                    </div>
                    <div className='h-full flex justify-between items-center group'>
                        <Wallet2 width={40} height={40} className="text-text-dull transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                </div>
                <div className='h-px bg-text-dull'></div>
                <div className="flex justify-start items-center pt-3 gap-16">
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex justify-center items-center bg-green-100">
                            <ArrowDown className="text-green-600" size={16} />
                        </div>
                        <div className="flex flex-col justify-center items-start">
                            <h2 className="text-xs text-slate-500">Income</h2>
                            <h3 className="text-sm font-semibold text-green-600"><span>{RUPEE_SYMBOL}</span>{income.toFixed(2)}</h3>
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex justify-center items-center bg-red-100">
                            <ArrowUp className="text-red-600" size={16} />
                        </div>
                        <div className="flex flex-col justify-center items-start">
                            <h2 className="text-xs text-slate-500">Expense</h2>
                            <h3 className="text-sm font-semibold text-red-500"><span>{RUPEE_SYMBOL}</span>{expense.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default HeaderCard