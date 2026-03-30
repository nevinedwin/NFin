'use client';

import React, { useEffect, useState } from 'react'
import RadioListStatic from '../radioListStatic';
import { formatDate } from '@/lib/utils/formats';


export type DateFilterType = "today" | "week" | "month" | "year" | "custom";

const DATE_OPTIONS: { id: DateFilterType, label: string }[] = [
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "year", label: "This Year" },
    { id: "custom", label: 'Custom Date Range' }
]

export type DateFilterValue = {
    preset: DateFilterType | null;
    from: string;
    to: string;
};

const DateFilterPanel = ({ value, onChange }: { value: DateFilterValue | null, onChange: (v: DateFilterValue) => void }) => {

    const [preset, setPreset] = useState<DateFilterType | null>(value?.preset ?? null);
    const [from, setFrom] = useState(value?.from ?? "");
    const [to, setTo] = useState(value?.to ?? "");

    useEffect(() => {
        if (!preset || preset === "custom") return;
        const now = new Date();
        let f = new Date();

        switch (preset) {
            case "today":
                f = new Date(now); f.setHours(0, 0, 0, 0);
                break;
            case "week":
                f = new Date(now);
                const day = f.getDay();
                f.setDate(f.getDate() - day + (day === 0 ? -6 : 1));
                f.setHours(0, 0, 0, 0);
                break;
            case "month":
                f = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "year":
                f = new Date(now.getFullYear(), 0, 1);
                break;
        }

        const newFrom = formatDate(f);
        const newTo = formatDate(now);
        setFrom(newFrom);
        setTo(newTo);
        onChange({ preset, from: newFrom, to: newTo });
    }, [preset]);

    // When custom dates change, notify parent
    useEffect(() => {
        if (preset !== "custom" || !from || !to) return;
        onChange({ preset, from, to });
    }, [from, to]);


    return (
        <div className="w-full h-full flex flex-col gap-4 overflow-y-auto">
            <RadioListStatic
                options={DATE_OPTIONS}
                selected={preset}
                onSelect={(v) => setPreset(v as DateFilterType)}
                type="date"
            />
            {/* Custom Inputs */}
            {preset === "custom" && (
                <>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs text-slate-400">From</span>
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="bg-border border border-border rounded-lg px-3 py-2 text-md text-slate-200 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs text-slate-400">To</span>
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="bg-border border border-border rounded-lg px-3 py-2 text-md text-slate-200 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </label>
                </>
            )}
        </div>
    )
}

export default DateFilterPanel;