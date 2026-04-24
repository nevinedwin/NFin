'use client';

import React from 'react';
import { useMainShellContext } from '@/app/(main)/context/mainShellContext';
import { AccountType } from '@/generated/prisma/client';
import { RUPEE_SYMBOL } from '@/lib/constants/constants';
import { formatType } from '@/lib/utils/formats';
import ShowBalanceComp from '../ui/showBalance';
import useCountUp from '@/hooks/useCountUp';

const BalanceTotalGroup = ({ type, groupTotal }: { type: AccountType, groupTotal: number }) => {

    const { showBalance } = useMainShellContext();

    const accountBalance = useCountUp(groupTotal, 100);

    return (
        <div className='flex justify-between'>
            <h2 className='text-md font-light tracking-wide'>{formatType(type)}</h2>
            <h2 className='text-lg font-light flex '>
                 {showBalance ? <ShowBalanceComp balance={accountBalance} mainClass="!text-lg !font-light" subClass='!text-[11px]' /> : <span className='text-lg font-light !text-white'>{RUPEE_SYMBOL} ----</span>}
            </h2>
        </div>
    );
};

export default BalanceTotalGroup;