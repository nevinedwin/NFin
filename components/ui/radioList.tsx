'use client';

import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { TransactionFilterType } from "@/types/filters";
import AccountLogo from "../wallet/accountLogo";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import useDebounceValue from "@/hooks/useDebounceValue";
import SearchInput from "./searchInput";

type Cursor = { date: Date; id: string } | null;

export default function RadioList({
    selected,
    onSelect,
    type,
    method,
    filters = {}
}: {
    selected: string | null;
    onSelect: (id: string | null) => void;
    type: TransactionFilterType;
    method: any,
    filters?: any
}) {

    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounceValue(query, 400);

    const {
        loading,
        data: options,
        scrollElementRef,
    } = useInfiniteScroll<Cursor, any>({
        query: debouncedQuery,
        action: method,
        size: 10,
        format: (prev, incoming) => {
            const ids = new Set(prev.map(c => c.id));
            return [...prev, ...incoming.filter(c => !ids.has(c.id))]
        },
        extraParams: filters
    });

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex-shrink-0">
                <SearchInput
                    name="category-search"
                    placeholder="Search Category"
                    value={query}
                    onChange={(v) => setQuery(v)}
                />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
                <ul className=" flex flex-col gap-1 py-1">
                    {options.map((opt, index) => {
                        const isSelected = selected === opt.id;
                        return (
                            options.length - 3 === index + 1 ?
                                <li key={opt.id} ref={scrollElementRef}>
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
                                                    {opt.name}
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
                                : <li key={opt.id}>
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
                                                    {opt.name}
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
                    {loading && (
                        <div className="flex justify-center py-4">
                            <Loader2 className="animate-spin" />
                        </div>
                    )}
                    {!loading && options.length === 0 && (
                        <div className="text-center text-slate-500 py-10">
                            No data found
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}

