'use client';

import React from 'react';
import { useMainShellContext } from '@/app/(main)/context/mainShellContext';
import { AccountType } from '@/generated/prisma/client';
import { RUPEE_SYMBOL } from '@/lib/constants/constants';
import { formatType } from '@/lib/utils/formats';

const BalanceTotalGroup = ({ type, groupTotal }: { type: AccountType, groupTotal: number }) => {

    const { showBalance } = useMainShellContext();

    return (
        <div className='flex justify-between bg-surface p-4'>
            <h2 className='text-lg font-medium'>{formatType(type)}</h2>
            <h2 className='text-lg font-light'>
                {RUPEE_SYMBOL}
                {showBalance ? Math.abs(groupTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : '-----'}

            </h2>
        </div>
    );
};

export default BalanceTotalGroup;