'use client';

import React, { useEffect, useState } from "react";
import AccountLogo from "@/components/wallet/accountLogo";
import { TransactionType, TransferType } from "@/generated/prisma/client";
import { formatTimeDate, formatUnderScoredStringCut } from "@/lib/utils/formats";
import { TransactionDataType } from "@/types/transaction";
import CategoryIcon from "@/components/ui/caetgoryIcon";

type EachTransactionProp = {
    recentTransaction: TransactionDataType;
    recentCard: boolean;
    onClickTransaction: (id: string) => void;
    isBorder?: boolean;
}



const EachTransaction = ({ recentTransaction, recentCard = false, onClickTransaction, isBorder = true }: EachTransactionProp) => {

    const [selected, setSelected] = useState<string | null>(null);
    const [iconColors, setIconColors] = useState<string>('text-white');

    const { account, category, date, description, id, updateAt, amount, type, balance, transferGroupId, transferType } = recentTransaction;

    const isExpense = type === TransactionType.EXPENSE || type === TransactionType.LEND || type === TransactionType.GROUP_SPLIT;
    const isCashOut = type === TransactionType.TRANSFER && transferType === TransferType.TRANSFER_OUT;
    const isTransfer = type === TransactionType.TRANSFER;

    const handleClick = (id: string) => {
        setSelected(id);
        onClickTransaction(id);
    }


    useEffect(() => {
        let iconColor = 'white';
        switch (type) {
            case TransactionType.BORROW:
                iconColor = 'text-orange-800';
                break;
            case TransactionType.EXPENSE:
                iconColor = 'text-red-800';
                break;
            case TransactionType.INCOME:
                iconColor = 'text-green-800';
                break;
            case TransactionType.GROUP_SPLIT:
                iconColor = 'text-purple-800';
                break;
            case TransactionType.LEND:
                iconColor = 'text-yellow-800';
                break;
            case TransactionType.TRANSFER:
                iconColor = 'text-blue-800';
                break;
            default:
                iconColor = 'text-white';
                break;
        };
        setIconColors(iconColor);

    }, [type]);


    useEffect(() => {
        setSelected(null);
    }, []);

    return (
        <div className={`w-full flex items-center justify-between py-4 px-4 ${isBorder ? 'border-b border-border' : ''}  ${selected === id ? 'bg-surface' : 'bg-inherit'}`} onClick={() => handleClick(id)}>

            {/* LEFT SECTION */}
            <div className="flex items-start gap-3">

                {/* ICON */}
                <div className="w-6 h-6 flex justify-center items-center font-bold" >
                    <CategoryIcon name={category?.icon ?? 'ArrowRightLeft'} className={`w-full h-full ${iconColors}`} containerClassName="w-full h-full flex item-center justify-center" />
                </div>

                {/* TEXT */}
                <div className="flex flex-col space-y-1">

                    {/* CATEGORY */}
                    <p className="text-sm font-medium text-white">
                        {category?.name ?? formatUnderScoredStringCut(type)}
                    </p>

                    {/* DATE */}
                    <p className="text-[10px] text-zinc-400">
                        {formatTimeDate(date)}
                    </p>

                    {/* DESCRIPTION */}
                    {description && (
                        <div className="text-[9px] w-fit px-1 border border-border rounded-md text-zinc-500 max-w-[180px] truncate">
                            {description}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex flex-col items-end">

                {/* AMOUNT */}
                <p
                    className={`text-sm font-semibold ${!recentCard && type === TransactionType.INCOME && 'text-green-500'}`}
                >
                    {isExpense || isCashOut ? "-" : "+"} ₹ {amount}
                </p>

                {/* ACCOUNT */}
                <div className="text-[10px] text-zinc-400 flex justify-center items-center gap-3">
                    <p className="flex gap-1 justify-center items-center">
                        {!isTransfer && 'From'}<AccountLogo className="w-3 h-3 text-[7px] font-bold" name={account.name} />{account.accountNumber && `·· ${account.accountNumber?.slice(-4)}`}
                    </p>
                </div>
                {!recentCard && <div className="text-[10px] text-slate-500">
                    Balance: ₹ {balance}
                </div>}
            </div>
        </div>
    );
};

export default EachTransaction;