'use client';

import { TransactionFilterType } from "@/types/filters";
import AccountLogo from "../wallet/accountLogo";
import { Check } from "lucide-react";


export type RadioOption = { id: string; label: string; sub?: string };

export default function RadioListStatic({
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
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex-1 min-h-0 overflow-y-auto">
                <ul className="flex flex-col gap-1 py-1">
                    {options.map((opt, index) => {
                        const isSelected = selected === opt.id;
                        return (
                            <li key={opt.id}>
                                <button
                                    onClick={() => onSelect(isSelected ? null : opt.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors duration-150
                                ${isSelected ? "bg-primary/10" : "hover:bg-surface-soft"}`}
                                >
                                    {type === "bank"
                                        ? <div className="flex items-start gap-2">
                                            <div>
                                                <div className="text-text-muted flex gap-1 justify-center items-center">
                                                    <AccountLogo className="w-6 h-6 text-[12px] font-bold bg-surface-soft" name={opt.label} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-text-secondary"}`}>
                                                    {opt.label}
                                                </span>
                                                {opt.sub && (
                                                    <span className="text-sm text-text-secondary mt-0.5 font-semibold">{opt.sub && `·· ${opt.sub?.slice(-4)}`}</span>
                                                )}
                                            </div>
                                        </div>
                                        :
                                        <div className="flex flex-col items-start">
                                            <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-text-secondary"}`}>
                                                {opt.label}
                                            </span>
                                            {opt.sub && (
                                                <span className="text-xs text-text-muted mt-0.5">{opt.sub}</span>
                                            )}
                                        </div>}

                                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                                ${isSelected ? "border-primary bg-primary/10" : "border-border"}`}
                                    >
                                        {isSelected && <Check size={11} strokeWidth={3} className="text-text-primary" />}
                                    </span>
                                </button>
                            </li>
                        )
                    })
                    }
                </ul>
            </div>
        </div>
    );
}