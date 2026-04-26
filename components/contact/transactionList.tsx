'use client';

import { TransactionGroup } from '@/hooks/useTransactions';
import React from 'react'
import TransactionRow from './transactionRow';

type TransactionListProps = {
    transactions: TransactionGroup[];
    loading: boolean;
    scrollElementRef: (node: HTMLElement | null) => void;
    reference: (node: HTMLDivElement | null) => void;
};

const TransactionList = ({ transactions, loading, scrollElementRef, reference }: TransactionListProps) => {
    return (
        <div className='flex-1 min-h-0 pt-[100px] overflow-y-auto overscroll-none' ref={reference}>  {/* single scroll container */}
            {transactions.length === 0 && !loading && (
                <p className='text-center text-sm text-gray-400 mt-12'>No transactions found</p>
            )}
            <div className='flex flex-col gap-3 px-4 py-4'>
                {transactions.map(group => (
                    <div key={group.dateKey} className='text-[11px] font-medium text-white tracking-wide mb-2 px-1'>
                        <div className="flex items-center gap-2 pb-4">
                            <div className="flex-1 mt-4 h-4 border-t border-l border-border rounded-tl-xl" />
                            <span className="text-xs text-text-dull capitalize">{group.label}</span>
                            <div className="flex-1 mb-2 h-4 border-b border-r border-border rounded-br-xl" />
                        </div>
                        <div className='overflow-hidden flex flex-col gap-4'>
                            {group.items.map((tx, index) => (
                                <TransactionRow
                                    key={tx.id}
                                    transaction={tx}
                                    ref={group.items.length - 3 === index ? scrollElementRef : undefined}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionList