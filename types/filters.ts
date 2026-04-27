import { DateFilterType, DateFilterValue } from "@/components/ui/FilterBars/dateFilterPanel";
import { TransactionType } from "@/generated/prisma/client";

export type TransactionFilterType = 'bank' | 'date' | 'type' | 'category';
export type CategoryFilterType = 'type' | 'parent';

export type DateRange = { from: string, to: string } | null;

export type ActiveFilters = {
    bank: string | null;
    category: string | null;
    date: DateFilterValue | null;
    type: TransactionType | null;
};

export const EMPTY_FILTERS: ActiveFilters = {
    bank: null,
    category: null,
    date: null,
    type: null,
};

export type CategoryActiveFilters = {
    type: TransactionType | null;
    parent: String | null;
};

export const EMPTY_CATEGORY_FILTERS: CategoryActiveFilters = {
    type: null,
    parent: null
};