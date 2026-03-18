'use client';

import React, { useState } from 'react'
import Link from 'next/link';

import { useMainShellContext } from '@/app/(main)/context/mainShellContext';
import { RUPEE_SYMBOL } from '@/lib/constants/constants'
import { formatDateTime } from '@/lib/utils/formats';
import useCountUp from '@/hooks/useCountUp';

import { Account } from '@/generated/prisma/client';

import { Card } from '../ui/card/card'
import CardContent from '../ui/card/cardContent'

import AccountLogo from './accountLogo';
import {
    ChevronRight,
    EyeIcon,
    EyeOffIcon,
} from 'lucide-react'

type BalanceIndCardProp = {
    account: Account;
}

const BalanceIndCard = ({ account }: BalanceIndCardProp) => {

    const { showBalance, setShowBalance } = useMainShellContext();
    const balanceInd = useCountUp(Number(account.balance), 100)

    return (
        <Card className=" w-full border-none h-[160px] bg-surface p-0 
                 transition-all duration-300 ease-out 
                 hover:shadow-md hover:scale-[1.01]">
            <CardContent className="h-full animate-fade-in py-6 px-3">
                <div className='w-full h-full flex justify-between items-center flex-col'>
                    <div className='w-full flex justify-between items-start'>
                        <div className='w-full flex justify-center items-start gap-2 '>
                            <AccountLogo name={account.name} className='w-5 h-5 min-w-5 min-h-5 text-xs font-extrabold' />
                            <h2 className='text-sm font-normal text-slate-200'>{account.name}</h2>
                            <h2 className='text-sm font-normal text-slate-200'><span className="text-center">··</span> {account?.accountNumber?.slice(-4)}</h2>
                        </div>
                        <div className='w-full flex justify-end items-start'>
                            <Link href={`/account/${account.id}`}>
                                <button
                                    className='px-4 py-1 text-xs flex items-center justify-center gap-2 text-blue-500 border rounded-2xl font-semibold border-border'
                                >
                                    <p>Edit</p>
                                    <ChevronRight size={15} />
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className='w-full flex justify-between items-center'>
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-3xl  font-medium'><span>{RUPEE_SYMBOL}</span> {showBalance ? Math.abs(balanceInd).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : '-----'}</h2>
                            <p className='text-xs text-slate-400'>Last Updated {formatDateTime(account.updatedAt)}</p>
                        </div>
                        {
                            showBalance ? <EyeIcon onClick={() => setShowBalance(false)} className='cursor-pointer' /> : <EyeOffIcon onClick={() => setShowBalance(true)} className='cursor-pointer' />
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BalanceIndCard;