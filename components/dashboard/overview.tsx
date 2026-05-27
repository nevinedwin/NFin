'use client';

import React, { useState, useTransition } from 'react';
import DashboardCard from './dashboardCard';
import { RUPEE_SYMBOL } from '@/lib/constants/constants';
import { TransactionType } from '@/generated/prisma/client';
import { useMainShellContext } from '@/app/(main)/context/mainShellContext';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils/formats';
import ShowBalanceComp from '../ui/showBalance';
import { EyeIcon, EyeOffIcon } from 'lucide-react';


export type OverviewType = {
    id: string;
    label: string;
    amount: number;
    subHeading: string;
};

type OverViewProps = {
    overviewData: OverviewType[],
};

const Overview = ({ overviewData }: OverViewProps) => {

    const router = useRouter();

    const [showBalance, setShowBalance] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { startLoading } = useMainShellContext();

    const income = overviewData.find(t => t.id === TransactionType.INCOME.toLowerCase())?.amount || 0;
    const expense = overviewData.find(t => t.id === TransactionType.EXPENSE.toLowerCase())?.amount || 0;
    const isHighExpense = income < expense;


    const handleClick = (overview: OverviewType) => {
        if (overview.id === "iowe" || overview.id === "owe") return;
        startLoading();

        // Use current date on client when server doesn't provide it
        const nowDate = new Date();
        const start = formatDate(new Date(nowDate.getFullYear(), nowDate.getMonth(), 1));
        const end = formatDate(nowDate);
        const dateQuery = `dateFrom=${start}&dateTo=${end}`;
        let query = `${dateQuery}`;

        if (overview.id === TransactionType.EXPENSE.toLowerCase()) query += `&type=${TransactionType.EXPENSE}`;
        if (overview.id === TransactionType.INCOME.toLowerCase()) query += `&type=${TransactionType.INCOME}`;
        startTransition(() => {
            router.push(`/transaction?${query}`)
        });
    };

    const handleEyeClick = (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        setShowBalance(!showBalance);
    }

    return (
        <div className='w-full h-fit grid grid-cols-2 grid-rows-2 gap-4'>
            {overviewData.map((k: OverviewType, i: number) => (
                <div key={i} className="bg-surface rounded-xl shadow-sm p-4 flex flex-col justify-center items-start" onClick={() => handleClick(k)}>
                    <p className='text-[12px] text-slate-400 tracking-wide'>{k.label}</p>
                    <p
                        className={
                            `text-2xl font-semibold tracking-wide 
                            ${k.id === 'owe' ? 'text-green-500' : ''}`
                        }>
                        {
                            k.id === 'income' ? (
                                showBalance ? <ShowBalanceComp balance={Math.abs(k?.amount)} /> : <span className='text-2xl'>{RUPEE_SYMBOL} ----</span>

                            ) : <ShowBalanceComp balance={Math.abs(k?.amount)} />
                        }
                    </p>
                    <div className='w-full flex flex-col'>
                        {isHighExpense && k.id === 'expense' && <p className='text-[12px] font-normal tracking-wider text-red-500'>{RUPEE_SYMBOL}{Math.abs(income - expense)} overspent</p>}
                        <div className='w-full flex items-between justify-between gap-2'>
                            <p className='text-[12px] text-text-dull tracking-wide' >{k.subHeading}</p>
                            {
                                k.id === 'income' && (showBalance ? <EyeIcon onClick={(e) => handleEyeClick(e)} /> : <EyeOffIcon onClick={(e) => handleEyeClick(e)} />)
                            }
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default Overview;