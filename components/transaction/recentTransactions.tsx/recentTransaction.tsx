'use client';

import React from 'react'
import { ChevronRight } from 'lucide-react'
import EachTransaction from './eachTransaction'
import { transactionDataType } from '@/types/transaction'

type RecentTransactionProp = {
    recentTransaction: transactionDataType[];
}

const RecentTransaction = ({ recentTransaction }: RecentTransactionProp) => {
    return (
        <div className='w-full h-full space-y-2'>
            <div className='w-full flex justify-between'>
                <p className='text-sm font-semibold'>Recent Transactions</p>
                <button className='flex justify-center font-semibold text-sm items-center text-blue-500'>View all <ChevronRight size={15} /></button>
            </div>
            <div className='w-full h-[270px] bg-surface rounded-xl px-4'>
                {
                    recentTransaction.length > 0
                        ? recentTransaction.map((eachTransaction) =>
                            <EachTransaction recentTransaction={eachTransaction} key={eachTransaction.id} />)
                        : <p>No recent transactions.</p>
                }
            </div>
        </div>
    )
}

export default RecentTransaction