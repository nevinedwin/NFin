'use server';

import React from 'react';
import { getCurrentUser } from '@/auth/currentUser';
import { prisma } from '@/lib/prisma';
import { TransactionType, TransferType } from '@/generated/prisma/client';
import BackArrowButton from '@/components/ui/backArrowbutton';
import ShowBalanceComp from '@/components/ui/showBalance';
import { formatDateTime } from '@/lib/utils/formats';
import CategoryIcon from '@/components/ui/caetgoryIcon';
import { ArrowDownLeft, ArrowUpRight, CircleArrowOutDownLeft, CircleArrowOutUpRight } from 'lucide-react';
import AccountLogo from '@/components/wallet/accountLogo';

type TransactionDetailedPageProps = {
    params: Promise<{ transactionId: string }>
}

const TransactionDetailedPage = async ({ params }: TransactionDetailedPageProps) => {
    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>

    const { transactionId } = await params;

    const transaction = await prisma.transaction.findFirst({
        where: {
            id: transactionId,
            userId: user.id
        },
        include: {
            category: {
                select: { name: true, icon: true }
            },
            account: {
                select: { name: true }
            }
        }
    });

    if (!transaction) return <div>Account Not Found</div>;

    let pairedTransaction = null;

    if (transaction.transferGroupId) {
        pairedTransaction = await prisma.transaction.findFirst({
            where: {
                userId: user.id,
                transferGroupId: transaction.transferGroupId,
                NOT: { id: transaction.id }
            },
            select: {
                id: true,
                account: { select: { name: true } }
            }
        });
    }

    const safeTransaction = {
        ...transaction,
        balance: transaction.balance.toString(),
        amount: transaction.amount.toString(),
    };

    const { amount, updatedAt, type, transferType, category, account } = safeTransaction;

    const isExpense = type === TransactionType.EXPENSE || transferType === TransferType.TRANSFER_OUT


    return (
        <div className='w-full h-full p-4'>
            <div className='w-full flex justify-start items-center mb-8'>
                <BackArrowButton size={30} href="/transaction" />
            </div>
            <div className='w-full h-[300px] space-y-1'>
                <div className='flex w-full relative'>
                    <div className={`w-12 h-12 rounded-full flex justify-center items-center ${isExpense ? 'bg-red-500' : 'bg-green-500'}`}>
                        {isExpense ? <ArrowUpRight size={40} /> : <ArrowDownLeft size={40} />}
                    </div>
                    <div className='w-12 h-12 absolute left-10 right-0 z-0'>
                        <AccountLogo name={account?.name || ''} className='w-full h-full' />
                    </div>
                </div>
                <h4>Transaction Successfull</h4>
                <ShowBalanceComp balance={Number(amount)} />
                <h3 className='text-[12px] text-slate-300 truncate'>{formatDateTime(updatedAt)}</h3>
                <div className='w-fit px-4 border border-border py-1 bg-surface text-[10px] rounded-md flex items-center justify-start gap-1'>
                    <span>
                        <CategoryIcon
                            name={category?.icon ?? 'ArrowRightLeft'}
                            className="w-5 h-5"
                            containerClassName="flex item-center justify-start"
                        />
                    </span>
                    {category?.name ?? ''}
                </div>
            </div>

        </div>
    )
}

export default TransactionDetailedPage;