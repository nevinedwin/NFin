'use client';

import React from "react";
import AccountLogo from "@/components/wallet/accountLogo";
import { TransactionType } from "@/generated/prisma/client";
import { formatTimeDate } from "@/lib/utils/formats";
import { transactionDataType } from "@/types/transaction";
import { ArrowDownUp, BanknoteArrowUp, HandCoins } from "lucide-react";

type EachTransactionProp = {
    recentTransaction: transactionDataType;
}


const EachTransaction = ({ recentTransaction }: EachTransactionProp) => {

    const { account, category, date, description, id, toAccount, updateAt, amount, type } = recentTransaction;

    const isExpense = type === TransactionType.EXPENSE;

    return (
        <div className="w-full flex items-center justify-between border-b border-border py-4">

            {/* LEFT SECTION */}
            <div className="flex items-start gap-3">

                {/* ICON */}
                <div className=" rounded-xl  flex items-center justify-center text-xs font-semibold">
                    {
                        type === TransactionType.EXPENSE
                            ? <HandCoins className="text-white" />
                            : type === TransactionType.INCOME
                                ? <BanknoteArrowUp className="text-white" />
                                : <ArrowDownUp className="text-white" />
                    }
                </div>

                {/* TEXT */}
                <div className="flex flex-col space-y-1">

                    {/* CATEGORY */}
                    <p className="text-sm font-medium text-white">
                        {category.name}
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
                    className={`text-sm font-semibold `}
                >
                    {isExpense ? "-" : "+"} ₹ {amount}
                </p>

                {/* ACCOUNT */}
                <div className="text-xs text-zinc-400 flex gap-1 justify-center items-center">
                    From <AccountLogo className="w-3 h-3 text-[7px] font-bold" name={account.name} /> ··{account?.accountNumber?.slice(-4)}8989
                </div>
            </div>
        </div>
    );
};

export default EachTransaction;