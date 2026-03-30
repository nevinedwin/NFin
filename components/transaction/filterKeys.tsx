'use client';

import { ActiveFilters, TransactionFilterType } from "@/types/filters";
import { ArrowLeftRight, Building2, CalendarDays, Tag } from "lucide-react";
import { FilterButtonConfig } from "../ui/FilterBars/filterBars";
import { FilterPanelConfig } from "../ui/FilterBars/filterSheet";
import RadioListStatic, { RadioOption } from "../ui/radioListStatic";
import RadioList from "../ui/radioList";
import { TransactionType } from "@/generated/prisma/client";
import DateFilterPanel, { DateFilterValue } from "../ui/FilterBars/dateFilterPanel";
import { getCategories } from "@/actions/category";

export type FilterButtonType = { key: TransactionFilterType; label: string; icon: React.ReactNode }[]

type GetPanelProps = {
    account: { id: string; label: string; sub?: string }[]
}

export const TYPE_OPTIONS: RadioOption[] = [
    { id: TransactionType.INCOME, label: "Income", sub: "Money coming in" },
    { id: TransactionType.EXPENSE, label: "Expense", sub: "Money going out" },
    { id: TransactionType.TRANSFER, label: "Transfer", sub: "Between accounts" },
    { id: TransactionType.GROUP_SPLIT, label: "Group", sub: "Money Split in Group" },
    { id: TransactionType.LEND, label: "Lend", sub: "Owed to you" },
    { id: TransactionType.BORROW, label: "Borrow", sub: "Owed by you" }
]

export const FILTER_BUTTONS: FilterButtonConfig<TransactionFilterType>[] = [
    { key: "bank", label: "Bank", icon: <Building2 size={13} /> },
    { key: "date", label: "Date", icon: <CalendarDays size={13} /> },
    { key: "type", label: "Type", icon: <ArrowLeftRight size={13} /> },
    { key: "category", label: "Category", icon: <Tag size={13} /> },
];

export function filterLabel(key: TransactionFilterType, filters: ActiveFilters): string {
    if (key === "type" && filters.type) return filters.type;
    return FILTER_BUTTONS.find((b) => b.key === key)!.label;
};


export const getTransactionPanel = ({ account }: GetPanelProps) => {
    const PANELS: FilterPanelConfig<ActiveFilters>[] = [
        {
            key: "bank",
            title: "Select Bank",
            render: (value, onChange) => (
                <RadioListStatic
                    options={account}
                    selected={value as string | null}
                    onSelect={onChange}
                    type="bank"
                />
            )
        },
        {
            key: "type",
            title: "Transaction Type",
            render: (value, onChange) => (
                <RadioListStatic
                    options={TYPE_OPTIONS}
                    selected={value as string | null}
                    onSelect={onChange}
                    type="type"
                />
            ),
        },
        {
            key: "category",
            title: "Select Category",
            render: (value, onChange) => (
                <RadioList
                    selected={value as string | null}
                    onSelect={onChange}
                    type="category"
                    method={getCategories}
                />
            ),
        },
        {
            key: "date",
            title: "Select Date Range",
            render: (value, onChange) => (
                <DateFilterPanel
                    value={value as DateFilterValue | null}
                    onChange={onChange as (v: DateFilterValue) => void}
                />
            ),
        },
    ];

    return PANELS;
} 