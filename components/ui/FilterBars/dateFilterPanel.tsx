'use client';

import React, { useEffect, useState } from 'react'
import RadioListStatic from '../radioListStatic';
import { formatDate, formatDateIST } from '@/lib/utils/formats';


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

const DateFilterPanel = ({ value, onChange, now }: { value: DateFilterValue | null; now: string; onChange: (v: DateFilterValue) => void }) => {

    const [preset, setPreset] = useState<DateFilterType | null>(value?.preset ?? null);
    const [from, setFrom] = useState(value?.from ?? "");
    const [to, setTo] = useState(value?.to ?? "");

    useEffect(() => {
        if (!preset || preset === "custom") return;

        const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

        // Work entirely in UTC ms, but representing IST wall clock
        const nowMs = new Date(now).getTime(); // UTC ms
        const nowIST = new Date(nowMs + IST_OFFSET_MS); // shifted → use UTC getters for IST values

        const istYear = nowIST.getUTCFullYear();
        const istMonth = nowIST.getUTCMonth();
        const istDay = nowIST.getUTCDate();
        const istDayOfWeek = nowIST.getUTCDay();

        let fromMs: number;

        switch (preset) {
            case "today":
                // IST midnight today = UTC midnight of shifted date
                fromMs = Date.UTC(istYear, istMonth, istDay) - IST_OFFSET_MS;
                break;
            case "week":
                // Monday of current IST week
                const daysFromMonday = istDayOfWeek === 0 ? 6 : istDayOfWeek - 1;
                fromMs = Date.UTC(istYear, istMonth, istDay - daysFromMonday) - IST_OFFSET_MS;
                break;
            case "month":
                // 1st of current IST month
                fromMs = Date.UTC(istYear, istMonth, 1) - IST_OFFSET_MS;
                break;
            case "year":
                // Jan 1 of current IST year
                fromMs = Date.UTC(istYear, 0, 1) - IST_OFFSET_MS;
                break;
            default:
                return;
        }

        // Format both as IST date strings
        const newFrom = formatDateIST(new Date(fromMs + IST_OFFSET_MS));
        const newTo = formatDateIST(nowIST); // nowIST already shifted

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