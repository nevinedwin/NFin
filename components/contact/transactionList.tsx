'use client';

import { TransactionGroup } from '@/hooks/useTransactions';
import React from 'react'
import TransactionRow from './transactionRow';

type TransactionListProps = {
    transactions: TransactionGroup[];
    loading: boolean;
    scrollElementRef: (node: HTMLElement | null) => void;
};

const TransactionList = ({ transactions, loading, scrollElementRef }: TransactionListProps) => {
    return (
        <div className='flex-1 overflow-y-auto' ref={scrollElementRef}>
            {transactions.length === 0 && !loading && (
                <p className='text-center text-sm text-gray-400 mt-12'>No transactions found</p>
            )}

            <div className='flex flex-col gap-3 px-4 py-4'>
                {
                    transactions.map(group => (
                        <div key={group.dateKey} className='text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-2 px-1'>
                            <p>{group.label}</p>
                            <div className='rounded-xl border border-gray-100 overflow-hidden bg-white'>
                                {
                                    group.items.map(tx => (
                                        <TransactionRow key={tx.id} transaction={tx} />
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default TransactionList