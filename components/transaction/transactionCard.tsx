"use client";

import { RUPEE_SYMBOL } from "@/app/constants";
import TypeButton from "../ui/typeButton";
import SelectField from "./selectField";
import { createTransaction } from "@/app/actions/transactions";
import FormSubmitBtn from "../ui/formSubmitBtn";
import { TransactionType } from "@/generated/prisma/client";
import { useTransactionForm } from "@/app/(main)/features/transaction/useTransactionForm";
import { TransactionAccountType, TransactionCategoryType } from "@/types/transaction";
import { useEffect } from "react";



type TransactionCardProp = {
    accounts: TransactionAccountType[],
    category: TransactionCategoryType[],
    closeFn: () => void
}


export default function TransactionCard({ accounts, category, closeFn }: TransactionCardProp) {

    const { state, setField, reset } = useTransactionForm();
    const { accountId, amount, categoryId, description, repeat, type } = state;

    useEffect(() => {
        return () => {
            reset();
        };
    }, [])

    return (
        <form
            action={createTransaction}
            onSubmit={() => closeFn()}
            className="w-full max-w-md mx-auto rounded-3xl shadow-xl px-2 space-y-[-10] animate-fade-in"
        >

            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="repeat" value={String(repeat)} />

            {/* Amount */}
            <div className="grid grid-cols-2 mb-2">
                <div>
                    <label className="text-sm text-slate-500">Amount</label>
                    <div className="flex items-center border border-border rounded-xl px-3 h-14">
                        <span className="text-xl font-semibold mr-2">{RUPEE_SYMBOL}</span>
                        <input
                            name="amount"
                            type="number"
                            value={amount}
                            onChange={e => setField('amount', e.target.value)}
                            placeholder="0.00"
                            inputMode="decimal"
                            required
                            className="w-full outline-none text-2xl font-bold bg-black"
                        />
                    </div>
                    {/* Date & Time */}
                    <div className="text-xs text-slate-500 pt-3">
                        {/* {formattedDate} */}
                    </div>
                </div>
                <div className="grid gap-2 px-6 rounded-xl justify-center items-center">
                    <TypeButton active={type === TransactionType.EXPENSE} onClick={() => setField("type", TransactionType.EXPENSE)} label="Expense" color="red" />
                    <TypeButton active={type === TransactionType.INCOME} onClick={() => setField("type", TransactionType.INCOME)} label="Income" color="green" />
                    <TypeButton active={type === TransactionType.TRANSFER} onClick={() => setField("type", TransactionType.TRANSFER)} label="Transfer" color="blue" />
                </div>
                {/* Repeat Toggle */}
                <div className="flex justify-start items-center gap-3 mt-1">
                    <span className="text-sm text-slate-600">Repeat</span>
                    <button
                        onClick={() => setField("repeat", !repeat)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${repeat ? "bg-slate-500" : "bg-bar"}`}
                    >
                        <span
                            className={`w-4 h-4 bg-black rounded-full shadow-md transform transition ${repeat ? "translate-x-6" : ""}`}
                        />
                    </button>
                </div>
            </div>

            {/* Category */}
            <div className="grid grid-cols-2 gap-3">
                <SelectField
                    label="Category"
                    name="categoryId"
                    value={categoryId}
                    onChange={(e) => setField("categoryId", e.target.value)}
                    required
                >
                    <option value="" disabled>
                        Select category
                    </option>
                    {
                        category.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))
                    }
                </SelectField>
                {/* Account */}
                <SelectField
                    label="Account"
                    name="accountId"
                    value={accountId}
                    onChange={(e) => setField("accountId", e.target.value)}
                    required
                >
                    <option value="" disabled>
                        Select account
                    </option>
                    {
                        accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))
                    }
                </SelectField>
            </div>

            {/* Description */}
            <div>
                <label className="text-sm text-slate-500">Description</label>
                <textarea
                    name="description"
                    value={description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Add note..."
                    className="w-full mt-1 mb-4 border border-border rounded-xl p-3 outline-none bg-black text-base"
                    rows={2}
                />
            </div>

            {/* Submit */}
            <FormSubmitBtn
                label="Save Transaction"
                type="submit"
                disabled={!accountId}
                className="font-semibold"
            />
        </form>
    );
}
