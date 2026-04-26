'use client';

import React from 'react';
import DashboardCard from './dashboardCard';
import { RUPEE_SYMBOL } from '@/lib/constants/constants';
import { TransactionType } from '@/generated/prisma/client';


export type OverviewType = {
    id: string;
    label: string;
    amount: number;
    subHeading: string;
};

type OverViewProps = {
    overviewData: OverviewType[]
};

const Overview = ({ overviewData }: OverViewProps) => {

    const income = overviewData.find(t => t.id === TransactionType.INCOME.toLowerCase())?.amount || 0;
    const expense = overviewData.find(t => t.id === TransactionType.EXPENSE.toLowerCase())?.amount || 0;
    const isHighExpense = income < expense;

    return (
        <div className='w-full h-full grid grid-cols-2 grid-rows-2 gap-4'>
            {overviewData.map((k: OverviewType, i: number) => (
                <div key={i} className="bg-surface rounded-xl shadow-sm p-4 flex flex-col justify-center items-start">
                    <p className='text-[12px] text-slate-400 tracking-wide'>{k.label}</p>
                    <p
                        className={
                            `text-2xl font-semibold tracking-wide 
                            ${k.id === 'owe' ? 'text-green-500' : ''}`
                        }>
                        <span className='!text-[15px]'>
                            {RUPEE_SYMBOL}
                        </span>
                        {Math.abs(k?.amount)?.toFixed(2)}
                    </p>
                    <div className='flex flex-col'>
                        {isHighExpense && k.id === 'expense' && <p className='text-[12px] font-normal tracking-wider text-red-500'>{RUPEE_SYMBOL}{Math.abs(income - expense)} overspent</p>}
                        <p className='text-[12px] text-text-dull tracking-wide' >{k.subHeading}</p>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default Overview;