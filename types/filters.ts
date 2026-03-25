import { DateFilterType } from "@/components/transaction/filterSheet";
import { TransactionType } from "@/generated/prisma/client";

export type TransactionFilterType = 'bank' | 'date' | 'type' | 'category';

export type DateRange = { from: string, to: string } | null;

export type ActiveFilters = {
    bankId: string | null;
    categoryId: string | null;
    date: DateRange;
    type: TransactionType | null;
    dateFilter: DateFilterType | null; 
};

export const EMPTY_FILTERS: ActiveFilters = {
    bankId: null,
    categoryId: null,
    date: null,
    type: null,
    dateFilter: null
};

export const hasActiveFilter = (filters: ActiveFilters): boolean => {
    return (
        filters.bankId !== null ||
        filters.categoryId !== null ||
        filters.date !== null ||
        filters.type !== null
    );
};