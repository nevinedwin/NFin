'use client';

import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { ChevronRight } from 'lucide-react'
import EachTransaction from './eachTransaction'
import { TransactionDataType } from '@/types/transaction'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoaderButton from '@/components/ui/loaderButton';
import HorizontalLine from '@/components/ui/horizontalLine';
import DashboardCard from '@/components/dashboard/dashboardCard';
import { useMainShellContext } from '@/app/(main)/context/mainShellContext';

type RecentTransactionProp = {
    recentTransaction: TransactionDataType[];
}

const RecentTransaction = ({ recentTransaction }: RecentTransactionProp) => {

    const [isPending, startTransition] = useTransition();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { startLoading } = useMainShellContext();

    const handleViewAll = () => {
        startLoading();
        startTransition(() => {
            router.push('/transaction');
        });
    };

    const handleTransactionDetails = useCallback((id: string) => {
        startLoading();
        startTransition(() => {
            router.push(`transaction/${id}`)
        });
    }, [router]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const headerContentRender = () => {
        return (
            <div className='w-full flex justify-between px-4 py-2'>
                <p className='text-md font-semibold '>Recent Transactions</p>
                <button
                    onClick={handleViewAll}
                    disabled={!mounted || isPending}
                    className='flex justify-center font-semibold text-sm items-center text-blue-500'
                >
                    View all
                    <ChevronRight size={15} />
                </button>
            </div>
        )
    };

    const contentRender = () => {
        return (
            <div className='h-full overflow-y-auto'>
                {
                    recentTransaction.length > 0
                        ? recentTransaction.map((eachTransaction) =>
                            <EachTransaction
                                recentTransaction={eachTransaction}
                                key={eachTransaction.id}
                                recentCard={true}
                                onClickTransaction={handleTransactionDetails}
                                isBorder={false}
                            />)
                        : <p className='h-full w-full flex justify-center items-center pt-[25px]'>No recent transactions.</p>
                }
            </div>
        )
    };

    return <DashboardCard content={contentRender()} headerContent={headerContentRender()} />
}

export default RecentTransaction