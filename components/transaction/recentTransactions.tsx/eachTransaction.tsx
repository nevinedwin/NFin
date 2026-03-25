'use client';

import React from "react";
import AccountLogo from "@/components/wallet/accountLogo";
import { TransactionType, TransferType } from "@/generated/prisma/client";
import { formatTimeDate, formatUnderScoredStringCut } from "@/lib/utils/formats";
import { TransactionDataType } from "@/types/transaction";
import { ArrowDownUp, ArrowRight, ArrowRightLeft, BanknoteArrowUp, HandCoins } from "lucide-react";
import CategoryIcon from "@/components/ui/caetgoryIcon";

type EachTransactionProp = {
    recentTransaction: TransactionDataType;
    recentCard: boolean;
    onClickTransaction: (id: string) => void;
}


const EachTransaction = ({ recentTransaction, recentCard = false, onClickTransaction }: EachTransactionProp) => {

    const { account, category, date, description, id, updateAt, amount, type, balance, transferGroupId, transferType } = recentTransaction;

    const isExpense = type === TransactionType.EXPENSE;
    const isCashOut = type === TransactionType.TRANSFER && transferType === TransferType.TRANSFER_OUT;
    const isTransfer = type === TransactionType.TRANSFER;

    const handleClick = (id: string) => {
        onClickTransaction(id);
    }

    return (
        <div className="w-full flex items-center justify-between border-b border-border py-4" onClick={() => handleClick(id)}>

            {/* LEFT SECTION */}
            <div className="flex items-start gap-3">

                {/* ICON */}
                <div className="w-6 h-6 flex justify-center items-center font-bold" >
                    <CategoryIcon name={category?.icon ?? 'ArrowRightLeft'} className="w-full h-full" containerClassName="w-full h-full flex item-center justify-center" />
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