'use client';

import React from 'react'
import { RUPEE_SYMBOL } from '@/lib/constants/constants';
import { balanceFormating } from '@/lib/utils/formats';

type ShowBalanceProp = {
    balance: number;
    mainClass?: string;
    subClass?: string;
};

const ShowBalanceComp = ({ balance, mainClass, subClass }: ShowBalanceProp) => {

    const balanceValue = balanceFormating(balance);

    return (
        <span className="flex items-end gap-[2px]">
            <span className={`text-3xl font-bold ${mainClass}`}>
                {RUPEE_SYMBOL} {balanceValue[0]}
            </span>
            <span className={`text-sm text-slate-400 ${subClass}`}>
                .{balanceValue[1]}
            </span>
        </span>
    )
}

export default ShowBalanceComp;