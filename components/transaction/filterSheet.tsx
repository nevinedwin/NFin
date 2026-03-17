"use client";

import { useEffect, useRef, useState } from "react";
import { X, Check } from "lucide-react";
import { TransactionFilterType, ActiveFilters } from "@/types/filters";
import { TransactionType } from "@/generated/prisma/client";
import AccountLogo from "../wallet/accountLogo";

type RadioOption = { id: string; label: string; sub?: string };

type Props = {
    open: boolean;
    filterType: TransactionFilterType | null;
    filters: ActiveFilters;
    // Data passed in from parent (fetched server-side or via action)
    accounts: RadioOption[];
    categories: RadioOption[];
    onClose: () => void;
    onApply: (filters: Partial<ActiveFilters>) => void;
};

const TYPE_OPTIONS: RadioOption[] = [
    { id: TransactionType.INCOME, label: "Income", sub: "Money coming in" },
    { id: TransactionType.EXPENSE, label: "Expense", sub: "Money going out" },
    { id: TransactionType.TRANSFER, label: "Transfer", sub: "Between accounts" },
    { id: TransactionType.GROUP_SPLIT, label: "Group", sub: "Money Split in Group" },
    { id: TransactionType.LEND, label: "Lend", sub: "Owed to you" },
    { id: TransactionType.BORROW, label: "Borrow", sub: "Owed by you" },
];

const SHEET_TITLES: Record<TransactionFilterType, string> = {
    bank: "Select Account",
    date: "Select Date Range",
    type: "Transaction Type",
    category: "Select Category",
};

export default function FilterSheet({
    open, filterType, filters, accounts, categories, onClose, onApply,
}: Props) {
    const [visible, setVisible] = useState(false);

    const [selectedBank, setSelectedBank] = useState<string | null>(filters.bankId);
    const [selectedType, setSelectedType] = useState<string | null>(filters.type);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(filters.categoryId);
    const [dateFrom, setDateFrom] = useState(filters.date?.from ?? "");
    const [dateTo, setDateTo] = useState(filters.date?.to ?? "");

    useEffect(() => {
        if (open) {
            setSelectedBank(filters.bankId);
            setSelectedType(filters.type);
            setSelectedCategory(filters.categoryId);
            setDateFrom(filters.date?.from ?? "");
            setDateTo(filters.date?.to ?? "");
            setVisible(true);
        } else {
            const t = setTimeout(() => setVisible(false), 320);
            return () => clearTimeout(t);
        }
    }, [open, filters]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    if (!visible || !filterType) return null;

    const handleApply = () => {
        if (filterType === "bank") onApply({ bankId: selectedBank });
        if (filterType === "type") onApply({ type: selectedType as TransactionType | null });
        if (filterType === "category") onApply({ categoryId: selectedCategory });
        if (filterType === "date") {
            onApply({ date: dateFrom && dateTo ? { from: dateFrom, to: dateTo } : null });
        }
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-end transition-colors duration-300 ${open ? "bg-black/50 backdrop-blur-sm" : "bg-transparent pointer-events-none"
                }`}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className={`w-full bg-surface rounded-t-2xl flex flex-col
          transition-transform duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)]
          ${open ? "translate-y-0" : "translate-y-full"}`}
                style={{ maxHeight: "60vh" }}
            >
                <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mt-3 mb-1 flex-shrink-0" />
                <div className="w-full h-full px-4">
                    <div className="flex items-center justify-between px-5 py-3 flex-shrink-0 border-b border-border">
                        <h2 className="text-lg font-semibold text-slate-200">
                            {SHEET_TITLES[filterType]}
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-slate-200"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-2">
                    {filterType === "bank" && (
                        <RadioList
                            options={accounts}
                            selected={selectedBank}
                            onSelect={setSelectedBank}
                            type="bank"
                        />
                    )}
                    {filterType === "type" && (
                        <RadioList
                            options={TYPE_OPTIONS}
                            selected={selectedType}
                            onSelect={setSelectedType}
                            type="type"
                        />
                    )}
                    {filterType === "category" && (
                        <RadioList
                            options={categories}
                            selected={selectedCategory}
                            onSelect={setSelectedCategory}
                            type="category"
                        />
                    )}
                    {filterType === "date" && (
                        <div className="flex flex-col gap-4 py-2">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs text-slate-400">From</span>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="bg-border border border-border rounded-lg px-3 py-2 text-md text-slate-200 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs text-slate-400">To</span>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="bg-border border border-border rounded-lg px-3 py-2 text-md text-slate-200 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </label>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 px-4 py-3 border-t border-slate-800 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-medium hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 py-2.5 rounded-xl bg-green-500 text-black text-sm font-semibold hover:bg-green-400 active:scale-95 transition-all"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}

function RadioList({
    options,
    selected,
    onSelect,
    type,
}: {
    options: RadioOption[];
    selected: string | null;
    onSelect: (id: string | null) => void;
    type: TransactionFilterType;
}) {
    return (
        <ul className="flex flex-col gap-1 py-1">
            {options.map((opt) => {
                const isSelected = selected === opt.id;
                return (
                    <li key={opt.id}>
                        <button
                            onClick={() => onSelect(isSelected ? null : opt.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors duration-150
                                ${isSelected ? "bg-green-500/10" : "hover:bg-slate-800/60"}`}
                        >
                            {type === "bank"
                                ? <div className="flex items-start gap-2">
                                    <div>
                                        <div className="text-zinc-400 flex gap-1 justify-center items-center">
                                            <AccountLogo className="w-6 h-6 text-[12px] font-bold bg-slate-200" name={opt.label} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className={`text-sm font-medium ${isSelected ? "text-green-400" : "text-slate-200"}`}>
                                            {opt.label}
                                        </span>
                                        {opt.sub && (
                                            <span className="text-sm text-slate-200 mt-0.5 font-semibold">{opt.sub && `·· ${opt.sub?.slice(-4)}`}</span>
                                        )}
                                    </div>
                                </div>
                                :
                                <div className="flex flex-col items-start">
                                    <span className={`text-sm font-medium ${isSelected ? "text-green-400" : "text-slate-200"}`}>
                                        {opt.label}
                                    </span>
                                    {opt.sub && (
                                        <span className="text-xs text-slate-500 mt-0.5">{opt.sub}</span>
                                    )}
                                </div>}

                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                                ${isSelected ? "border-green-500 bg-green-500" : "border-slate-600"}`}
                            >
                                {isSelected && <Check size={11} strokeWidth={3} className="text-black" />}
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}