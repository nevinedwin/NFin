'use client';

import { ObligationStatus } from '@/generated/prisma/client';
import { Transaction } from '@/hooks/useTransactions';
import { ST } from 'next/dist/shared/lib/utils';
import React from 'react';


const STATUS_STYLE: Record<string, string> = {
    [ObligationStatus.PENDING]: 'bg-red-50 text-red-700',
    [ObligationStatus.PARTIAL]: 'bg-amber-50 text-amber-700',
    [ObligationStatus.SETTLED]: 'bg-green-50 text-green-700',
};

function StatusBadge({ status }: { status: ObligationStatus }) {
    const cls = STATUS_STYLE[status] ?? 'bg-gray-50 text-gray-700';
    return (
        <span className={`text-[10px] px-2 pt-0.5 rounded-full font-medium ${cls}`}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
};

const TransactionRow = ({ transaction }: { transaction: Transaction }) => {

    const amount = transaction.obligationAmount - transaction.paidAmount;
    const time = new Date(transaction.transactionDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3" width="14" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.2" />
                    <path d="M1 6h14" stroke="#9ca3af" strokeWidth="1.2" />
                    <rect x="3" y="9" width="3" height="1.5" rx="0.5" fill="#9ca3af" />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800 truncate">{transaction.transactionRefId}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
            </div>
            <div className="text-right shrink-0">
                <p className={`text-[13px] font-medium ${amount > 0 ? 'text-green-600' : 'text-gray-700'}`}>
                    ₹{amount.toFixed(2)}
                </p>
                <StatusBadge status={transaction.status} />
            </div>
        </div>
    )
}

export default TransactionRow