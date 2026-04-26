'use server';

import React from 'react';
import { getCurrentUser } from '@/auth/currentUser';
import { prisma } from '@/lib/prisma';
import { TransactionType, TransferType } from '@/generated/prisma/client';
import BackArrowButton from '@/components/ui/backArrowbutton';
import ShowBalanceComp from '@/components/ui/showBalance';
import { formatDateTime, formatUnderScoredStringCut } from '@/lib/utils/formats';
import CategoryIcon from '@/components/ui/caetgoryIcon';
import { ArrowDownLeft, ArrowUpRight, CircleArrowOutDownLeft, CircleArrowOutUpRight } from 'lucide-react';
import AccountLogo from '@/components/wallet/accountLogo';
import HorizontalLine from '@/components/ui/horizontalLine';

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
                select: { name: true, accountNumber: true, type: true }
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
                amount: true,
                balance: true,
                account: {
                    select: {
                        name: true,
                        accountNumber: true,
                        type: true,
                        balance: true
                    }
                }
            }
        });
    }

    const safeTransaction = {
        ...transaction,
        balance: transaction.balance.toString(),
        amount: transaction.amount.toString(),
    };

    if (pairedTransaction) {

        pairedTransaction = {
            ...pairedTransaction,
            balance: pairedTransaction.balance.toString(),
            amount: pairedTransaction.amount.toString()
        }
    }

    const { amount, updatedAt, type, transferType, category, account } = safeTransaction;

    const isExpense = type === TransactionType.EXPENSE || transferType === TransferType.TRANSFER_OUT


    return (
        <div className='w-full h-full p-4 !pb-0 space-y-2'>
            <div className='w-full flex justify-start items-center mb-4'>
                <BackArrowButton size={30}/>
            </div>
            <div className='w-full h-fit space-y-1'>
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
                    {category?.name ?? 'Transfer'}
                </div>
            </div>

            <div className="flex items-center gap-3 w-full">

                <div className="flex-1 h-px bg-border" />

                <span className="text-sm text-slate-400 whitespace-nowrap">
                    Transaction Details
                </span>

                <div className="flex-1 h-px bg-border" />

            </div>
            <div className='flex flex-col gap-2'>
                <p className='text-sm text-text-dull'>{isExpense ? 'Paid from' : 'Paid To'}</p>
                <div className='flex justify-start items-center gap-2'>
                    <div className='w-5 h-5'><AccountLogo className='w-full h-full !text-[10px]' name={account.name} /></div>
                    <p className='text-sm font-semibold'>{account.name}</p>
                    <p className='text-sm font-semibold'>X{account.accountNumber?.slice(-4)}</p>
                </div>
            </div>
            {
                safeTransaction.type === TransactionType.TRANSFER && pairedTransaction &&
                <>
                    <HorizontalLine />
                    <div className='flex flex-col gap-2'>
                        <p className='text-sm text-text-dull'>{safeTransaction.transferType === TransferType.TRANSFER_IN ? 'Paid From' : 'Paid To'}</p>
                        <div className='flex justify-start items-center gap-2'>
                            <div className='w-5 h-5'><AccountLogo className='w-full h-full !text-[10px]' name={pairedTransaction.account.name} /></div>
                            <p className='text-sm font-semibold'>{pairedTransaction.account.name}</p>
                            <p className='text-sm font-semibold'>X{pairedTransaction.account.accountNumber?.slice(-4)}</p>
                        </div>
                    </div>
                </>
            }
            <HorizontalLine />
            <div className='flex flex-col gap-2'>
                <p className='text-sm text-text-dull'>Balance After Transaction</p>
                <ShowBalanceComp balance={Number(safeTransaction.balance)} subClass='!text-[10px]' mainClass='!text-sm' />
            </div>
            <HorizontalLine />
            <div className='flex flex-col gap-2'>
                <p className='text-sm text-text-dull'>Transaction Type</p>
                <div className='flex justify-start items-center gap-2'>
                    <p className='text-sm font-semibold'>{formatUnderScoredStringCut(safeTransaction.type)}</p>
                </div>
            </div>
            <HorizontalLine />
            <div className={`flex flex-col gap-2 ${safeTransaction.description ? '' : ' pb-16'}`}>
                <p className='text-sm text-text-dull'>Transaction Mode</p>
                <div className='flex justify-start items-center gap-2'>
                    <p className='text-sm font-semibold'>{formatUnderScoredStringCut(account.type)}</p>
                </div>
            </div>
            {safeTransaction.description &&
                <>
                    <HorizontalLine />
                    <div className='flex flex-col gap-2 pb-16'>
                        <p className='text-sm text-text-dull'>Note</p>
                        <div className='flex justify-start items-center gap-2'>
                            <p className='text-sm font-light'>{safeTransaction.description}</p>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default TransactionDetailedPage;