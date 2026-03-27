'use client';

import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { ChevronRight } from 'lucide-react'
import EachTransaction from './eachTransaction'
import { TransactionDataType } from '@/types/transaction'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoaderButton from '@/components/ui/loaderButton';

type RecentTransactionProp = {
    recentTransaction: TransactionDataType[];
}

const RecentTransaction = ({ recentTransaction }: RecentTransactionProp) => {

    const [isPending, startTransition] = useTransition();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const handleViewAll = () => {
        if (!mounted) return;
        startTransition(() => {
            router.push('/transaction');
        });
    };

    const handleTransactionDetails = useCallback((id: string) => {
        router.push(`transaction/${id}`)
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className='w-full h-full space-y-4'>
            <div className='w-full flex justify-between'>
                <p className='text-sm font-semibold'>Recent Transactions</p>
                <button
                    onClick={handleViewAll}
                    disabled={!mounted || isPending}
                    className='flex justify-center font-semibold text-sm items-center text-blue-500'
                >
                    {isPending ? <LoaderButton className='w-5 h-5' /> : 'View all'}
                    <ChevronRight size={15} />
                </button>
            </div>
            <div className='w-full h-fit bg-surface rounded-xl'>
                {
                    recentTransaction.length > 0
                        ? recentTransaction.map((eachTransaction) =>
                            <EachTransaction recentTransaction={eachTransaction} key={eachTransaction.id} recentCard={true} onClickTransaction={handleTransactionDetails} />)
                        : <p className='h-full w-full flex justify-center items-center'>No recent transactions.</p>
                }
            </div>
        </div>
    )
}

export default RecentTransaction