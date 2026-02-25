"use client";

import { useState, useCallback, useEffect } from "react";
import { RUPEE_SYMBOL } from "@/app/constants";
import TypeButton from "../ui/typeButton";
import SelectField from "./selectField";
import { createTransaction } from "@/app/actions/transactions";
import FormSubmitBtn from "../ui/formSubmitBtn";

type TxType = "EXPENSE" | "INCOME" | "TRANSFER";

export default function TransactionCard() {

    const [type, setType] = useState<TxType>("EXPENSE");
    const [repeat, setRepeat] = useState<boolean>(false);

    return (
        <form action={createTransaction} className="w-full max-w-md mx-auto rounded-3xl shadow-xl px-2 space-y-[-10] animate-fade-in">

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
                    <TypeButton active={type === "EXPENSE"} onClick={() => setType("EXPENSE")} label="Expense" color="red" />
                    <TypeButton active={type === "INCOME"} onClick={() => setType("INCOME")} label="Income" color="green" />
                    <TypeButton active={type === "TRANSFER"} onClick={() => setType("TRANSFER")} label="Transfer" color="blue" />
                </div>
                {/* Repeat Toggle */}
                <div className="flex justify-start items-center gap-3 mt-1">
                    <span className="text-sm text-slate-600">Repeat</span>
                    <button
                        onClick={() => setRepeat(!repeat)}
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
                <SelectField label="Category" name="categoryId">
                    <option>Food</option>
                    <option>Shopping</option>
                    <option>Salary</option>
                </SelectField>
                {/* Account */}
                <SelectField label="Account" name="accountId">
                    <option>Cash</option>
                    <option>Bank</option>
                    <option>Wallet</option>
                </SelectField>
            </div>

            {/* Description */}
            <div>
                <label className="text-sm text-slate-500">Description</label>
                <textarea
                    name="description"
                    placeholder="Add note..."
                    className="w-full mt-1 mb-4 border border-border rounded-xl p-3 outline-none bg-black text-base"
                    rows={2}
                />
            </div>

            {/* Submit */}
            <FormSubmitBtn label="Save Transaction" type="submit" className="font-semibold"/>
        </form>
    );
}
