import { ActiveFilters, TransactionFilterType } from "@/types/filters";
import { ArrowLeft, ArrowLeftRight, Building2, CalendarDays, Tag } from "lucide-react";

export type FilterButtonType = { key: TransactionFilterType; label: string; icon: React.ReactNode }[]

export const FILTER_BUTTONS: FilterButtonType = [
    { key: "bank", label: "Bank", icon: <Building2 size={13} /> },
    { key: "date", label: "Date", icon: <CalendarDays size={13} /> },
    { key: "type", label: "Type", icon: <ArrowLeftRight size={13} /> },
    { key: "category", label: "Category", icon: <Tag size={13} /> },
];

export function isFilterActive(key: TransactionFilterType, filters: ActiveFilters): boolean {
    if (key === "bank") return filters.bankId !== null;
    if (key === "date") return filters.date !== null;
    if (key === "type") return filters.type !== null;
    if (key === "category") return filters.categoryId !== null;
    return false;
};

export function filterLabel(key: TransactionFilterType, filters: ActiveFilters): string {
    if (key === "type" && filters.type) return filters.type;
    return FILTER_BUTTONS.find((b) => b.key === key)!.label;
}