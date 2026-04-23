"use client";
import React, { memo, useCallback } from "react";
import { Minus, Plus } from "lucide-react";
import { RUPEE_SYMBOL } from "@/lib/constants/constants";
import { SplitTab } from "@/hooks/useSplitAllocation";

interface SplitContactRowProps {
    id: string;
    name: string;
    selected: boolean;
    tab: SplitTab;
    /** Derived obligation amount for this contact */
    amount: number;
    /** byAmount: current manual override value (undefined = auto) */
    amountOverride?: number;
    onAmountChange?: (id: string, value: number) => void;
    /** byShares: current share count */
    shareCount?: number;
    onIncrement?: (id: string) => void;
    onDecrement?: (id: string) => void;
    /** byPercentages: current percentage */
    percentage?: number;
    onPercentageChange?: (id: string, value: number) => void;
}

/** Renders the right-side split control based on the active tab.
 *  Memoised so re-renders only happen when the contact's own values change. */
const SplitContactRow = memo(function SplitContactRow({
    id,
    name,
    selected,
    tab,
    amount,
    amountOverride,
    onAmountChange,
    shareCount = 1,
    onIncrement,
    onDecrement,
    percentage,
    onPercentageChange,
}: SplitContactRowProps) {
    const handleAmountChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onAmountChange?.(id, parseFloat(e.target.value));
        },
        [id, onAmountChange]
    );

    const handlePercentChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onPercentageChange?.(id, parseFloat(e.target.value));
        },
        [id, onPercentageChange]
    );

    const handleIncrement = useCallback(() => onIncrement?.(id), [id, onIncrement]);
    const handleDecrement = useCallback(() => onDecrement?.(id), [id, onDecrement]);

    /** Right-side control rendered per tab */
    const renderRightControl = () => {
        if (!selected) return null;

        switch (tab) {
            case "byEvenly":
                return (
                    <span className="text-sm font-semibold text-green-400 whitespace-nowrap tabular-nums">
                        {RUPEE_SYMBOL}{amount.toFixed(2)}
                    </span>
                );

            case "byAmount":
                return (
                    <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-sm">{RUPEE_SYMBOL}</span>
                        <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step={0.01}
                            value={amountOverride !== undefined ? amountOverride : ""}
                            placeholder={amount.toFixed(2)}
                            onChange={handleAmountChange}
                            onClick={(e) => e.stopPropagation()}
                            className="
                                w-20 text-right text-[14px] font-medium bg-black border-none
                                rounded-lg px-2 py-1 outline-none focus:border-green-500 text-white
                                placeholder:text-slate-500 tabular-nums
                            "
                        />
                    </div>
                );

            case "byShares":
                return (
                    <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={handleDecrement}
                            onKeyDown={(e) => e.key === "Enter" && handleDecrement()}
                            className="w-6 h-6 rounded-full bg-white hover:bg-slate-600 flex items-center justify-center transition-colors cursor-pointer select-none"
                            aria-label="Decrease share"
                        >
                            <Minus size={20} />
                        </div>
                        <span className="w-5 text-center text-sm font-semibold text-white tabular-nums">
                            {shareCount}
                        </span>
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={handleIncrement}
                            onKeyDown={(e) => e.key === "Enter" && handleIncrement()}
                            className="w-6 h-6 rounded-full bg-white hover:bg-slate-600 flex items-center justify-center transition-colors cursor-pointer select-none"
                            aria-label="Increase share"
                        >
                            <Plus size={20} />
                        </div>
                        <span className="text-xs text-slate-400 ml-1 tabular-nums">
                            {RUPEE_SYMBOL}{amount.toFixed(2)}
                        </span>
                    </div>
                );

            case "byPercentages":
                return (
                    <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            max={100}
                            step={0.1}
                            value={percentage !== undefined ? percentage : ""}
                            placeholder="0"
                            onChange={handlePercentChange}
                            onClick={(e) => e.stopPropagation()}
                            className="
                                w-16 text-right text-[14px] font-medium bg-black border-none
                                rounded-lg px-2 py-1 outline-none focus:border-green-500 text-white
                                placeholder:text-slate-500 tabular-nums
                            "
                        />
                        <span className="text-slate-400 text-sm">%</span>
                        <span className="text-xs text-slate-400 ml-1 tabular-nums">
                            {RUPEE_SYMBOL}{amount.toFixed(2)}
                        </span>
                    </div>
                );
        }
    };

    return (
        <div className="w-full flex items-center justify-between gap-2">
            {/* Name */}
            <span className={`text-sm truncate ${selected ? "text-green-400" : "text-white"}`}>
                {name}
            </span>
            {/* Right control */}
            <div className="flex-shrink-0">{renderRightControl()}</div>
        </div>
    );
});

export default SplitContactRow;