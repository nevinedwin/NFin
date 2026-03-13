"use client";

import { RUPEE_SYMBOL } from "@/lib/constants/constants";
import TypeButton, { ButtonColors } from "../ui/typeButton";
import { createTransaction } from "@/actions/transactions";
import FormSubmitBtn from "../ui/formSubmitBtn";
import { TransactionType } from "@/generated/prisma/client";
import { TransactionAccountType, TransactionCategoryType } from "@/types/transaction";
import { useEffect } from "react";
import { useForm } from "@/hooks/form/useForm";
import { transactionFormInitalState } from "@/app/(main)/features/transaction/transaction.state";
import SearchSelect from "../ui/searchSelect";
import { formatUnderScoredString, formatUnderScoredStringCut } from "@/lib/utils/formats";
import YesNoToggle from "../ui/toggleButton";

type TransactionCardProp = {
    accounts: TransactionAccountType[];
    category: TransactionCategoryType[];
    closeFn: () => void;
};

const colorButton: Record<TransactionType, string> = {
    EXPENSE: "red",
    INCOME: "green",
    TRANSFER: "blue",
    GROUP_SPLIT: "purple",
    LEND: "yellow",
    BORROW: "orange",
};

export default function TransactionCard({
    accounts,
    category,
    closeFn,
}: TransactionCardProp) {

    const { state, setField, reset } = useForm(transactionFormInitalState);
    const { amount, description, repeat, type } = state;

    useEffect(() => {
        return () => reset();
    }, []);

    return (
        <form
            action={createTransaction}
            onSubmit={() => closeFn()}
            className="flex flex-col h-[75vh] w-full max-w-md mx-auto bg-black rounded-3xl shadow-xl"
        >

            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="repeat" value={String(repeat)} />

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-6 pb-24">

                {/* Amount + Type */}
                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <label className="text-sm text-slate-500">Amount</label>

                        <div className="flex items-center border border-border rounded-xl px-3 h-14">
                            <span className="text-xl font-semibold mr-2">{RUPEE_SYMBOL}</span>

                            <input
                                name="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setField("amount", e.target.value)}
                                placeholder="0.00"
                                inputMode="decimal"
                                required
                                className="w-full outline-none text-2xl font-bold bg-black"
                            />
                        </div>
                    </div>

                    {/* Type Buttons */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 w-full pr-3">
                        {Object.keys(TransactionType).map((t) => (
                            <div className="w-full flex" key={t}>
                                <TypeButton
                                    key={t}
                                    active={type === t}
                                    onClick={() => setField("type", t as TransactionType)}
                                    label={formatUnderScoredStringCut(t)}
                                    color={colorButton[t as TransactionType] as ButtonColors}
                                />
                            </div>
                        ))}
                    </div>

                </div>

                {/* Category + Account */}
                {(type === TransactionType.EXPENSE || type === TransactionType.INCOME) && <div className="grid grid-cols-2 gap-3">

                    <SearchSelect
                        fetchUrl="/api/category"
                        type={type}
                        name="categoryId"
                        label="Category"
                        placeholder="Search Category"
                    />

                    <SearchSelect
                        fetchUrl="/api/account"
                        name="accountId"
                        label="Account"
                        placeholder="Search Account"
                    />

                </div>}

                {type === TransactionType.TRANSFER && <div className="grid grid-cols-2 gap-3">

                    <SearchSelect
                        fetchUrl="/api/account"
                        name="accountId"
                        label="From Account"
                        placeholder="Search.."
                    />

                    <SearchSelect
                        fetchUrl="/api/account"
                        name="toAccountId"
                        label="To Account"
                        placeholder="Search.."
                    />

                </div>}

                {/* Description */}
                <div>
                    <label className="text-sm text-slate-500">Description</label>

                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setField("description", e.target.value)}
                        placeholder="Add note..."
                        className="w-full mt-1 border border-border rounded-xl p-3 outline-none bg-black text-base"
                        rows={3}
                    />
                </div>

                {/* Repeat Toggle */}
                <YesNoToggle
                    label={`Mark as repeated ${formatUnderScoredString(type)}`}
                    value={repeat ?? true}
                    onChange={() => setField("repeat", !repeat)}
                    name="repeat"
                />

            </div>

            {/* Fixed Footer */}
            <div className="border-t border-border p-4 flex justify-end gap-4 bg-black sticky bottom-0">

                <button
                    type="button"
                    onClick={closeFn}
                    className="text-zinc-400"
                >
                    Cancel
                </button>

                <FormSubmitBtn
                    label="Save Transaction"
                    type="submit"
                    className="font-semibold px-4 py-2"
                />

            </div>

        </form>
    );
}