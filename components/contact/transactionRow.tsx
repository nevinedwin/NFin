'use client';

import React from 'react';
import { ObligationStatus, TransactionType } from '@/generated/prisma/client';
import { Transaction } from '@/hooks/useTransactions';
import { CENETER_DOT } from '@/lib/constants/constants';
import { CircleCheck } from 'lucide-react';

export type TransactionContactTypes = Exclude<TransactionType, 'EXPENSE' | 'INCOME' | 'TRANSFER'>;

const STATUS_STYLE: Record<string, string> = {
    [ObligationStatus.PENDING]: 'bg-border text-red-700',
    [ObligationStatus.PARTIAL]: 'bg-amber-50 text-amber-700',
    [ObligationStatus.SETTLED]: 'bg-green-50 text-green-700',
};


const heading = (name: string, type: TransactionContactTypes) => {

    const TYPE_DATA: Record<TransactionContactTypes, string> = {
        [TransactionType.BORROW]: `Payment to you`,
        [TransactionType.LEND]: `Payment to ${name}`,
        [TransactionType.GROUP_SPLIT]: `Payment to ${name}`,
    }

    return TYPE_DATA[type]
}

function StatusBadge({ status }: { status: ObligationStatus }) {
    const cls = STATUS_STYLE[status] ?? 'bg-border text-slate-400';
    return (
        <span className={`text-[10px] px-2 pt-0.5 rounded-full font-medium ${cls}`}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
};

const TransactionRow = ({ transaction, ref }: { transaction: Transaction, ref: React.Ref<HTMLDivElement> | undefined }) => {

    const amount = transaction.obligationAmount - transaction.paidAmount;
    const time = new Date(transaction.transactionDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const isBorrow = transaction.transaction.type === TransactionType.BORROW;

    return (
        <div ref={ref} className={`w-full h-full flex ${isBorrow ? 'justify-start' : 'justify-end'}`}>
            <div className={`min-w-[60%] min-h-[120px] flex flex-col bg-surface p-4 rounded-2xl gap-2`}>
                <div className="!text-[15px] text-white truncate capitalize font-normal">{heading(transaction.contact.name, transaction.transaction.type)}</div>
                <p className={`text-2xl font-light text-white`}>
                    ₹ {Math.abs(amount).toFixed(2)}
                </p>
                <div className='flex justify-start items-center gap-2'>
                    <CircleCheck className='text-green-500' size={15} />
                    <p className="!text-xs text-white mt-0.5 font-normal">Paid {CENETER_DOT} {time}</p>
                </div>
                {/* <div className="flex-1 mx-w-[50%] h-full flex flex-col justify-center items-start">
            </div> */}
            </div>
        </div>
    )
}

export default TransactionRow