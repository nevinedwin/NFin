"use client";

import { useState, useCallback, useEffect } from "react";
import { RUPEE_SYMBOL } from "@/app/constants";
import TypeButton from "../ui/typeButton";
import SelectField from "./selectField";

type TxType = "expense" | "income" | "transfer";

export default function TransactionCard() {
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<TxType>("expense");
    const [repeat, setRepeat] = useState(false);
    const [description, setDescription] = useState("");
    const [formattedDate, setFormattedDate] = useState("");

    const handleTypeChange = useCallback((value: TxType) => {
        setType(value);
    }, []);

    useEffect(() => {
        const now = new Date();
        const formatted = now.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
        setFormattedDate(formatted);
    }, []);

    return (
        <div className="w-full max-w-md mx-auto rounded-3xl shadow-xl px-2 space-y-[-10] animate-fade-in">

            {/* Amount */}
            <div className="grid grid-cols-2 mb-2">
                <div>
                    <label className="text-sm text-slate-500">Amount</label>
                    <div className="flex items-center border border-border rounded-xl px-3 h-14">
                        <span className="text-xl font-semibold mr-2">{RUPEE_SYMBOL}</span>
                        <input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            type="number"
                            placeholder="0.00"
                            inputMode="decimal"
                            className="w-full outline-none text-2xl font-bold bg-black"
                        />
                    </div>
                    {/* Date & Time */}
                    <div className="text-xs text-slate-500 pt-3">
                        {formattedDate}
                    </div>
                </div>
                <div className="grid gap-2 px-6 rounded-xl justify-center items-center">
                    <TypeButton active={type === "expense"} onClick={() => handleTypeChange("expense")} label="Expense" color="red" />
                    <TypeButton active={type === "income"} onClick={() => handleTypeChange("income")} label="Income" color="green" />
                    <TypeButton active={type === "transfer"} onClick={() => handleTypeChange("transfer")} label="Transfer" color="blue" />
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
                <SelectField label="Category">
                    <option>Food</option>
                    <option>Shopping</option>
                    <option>Salary</option>
                </SelectField>
                {/* Account */}
                <SelectField label="Account">
                    <option>Cash</option>
                    <option>Bank</option>
                    <option>Wallet</option>
                </SelectField>
            </div>

            {/* Description */}
            <div>
                <label className="text-sm text-slate-500">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add note..."
                    className="w-full mt-1 mb-4 border border-border rounded-xl p-3 outline-none bg-black text-base"
                    rows={2}
                />
            </div>

            {/* Submit */}
            <button
                className="w-full h-12 rounded-xl bg-slate-300 text-black font-medium
                   transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
                Save
            </button>
        </div>
    );
}
