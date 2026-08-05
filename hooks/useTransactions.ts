'use client';

import { ObligationStatus } from "@/generated/prisma/client";
import { useMemo } from "react";
import useDebounceValue from "./useDebounceValue";
import { formatDateShort, formatDate } from '@/lib/utils/dates';
import useInfiniteScroll from "./useInfiniteScroll";
import { Cursor } from "@/actions/contacts";
import { TransactionContactTypes } from "@/components/contact/transactionRow";

export type Transaction = {
    id: string;
    obligationAmount: number;
    sharedAmount: number;
    transactionDate: string;
    paidAmount: number;
    status: ObligationStatus;
    transactionRefId: string;
    transaction: {
        type: TransactionContactTypes;
        id: string;
    };
    contact: {
        name: string;
    };
};

export type TransactionGroup = {
    dateKey: string;
    label: string;
    items: Transaction[];
};

type useTransactionsParams = {
    // action can accept a params object; use rest any to remain compatible
    // with differing action signatures across callers.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: (...args: any[]) => Promise<any>;
    id: string;
    query?: string;
    size?: number;
    initialData?: Transaction[];
    initialCursor?: Cursor | null;
};

function getDateLabel(dateStr: string): string {
    const todayKey = formatDate(new Date(), 'yyyy-MM-dd');
    const yesterdayKey = formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
    const key = formatDate(dateStr, 'yyyy-MM-dd');

    if (key === todayKey) return 'Today';
    if (key === yesterdayKey) return 'Yesterday';
    return formatDateShort(dateStr);
};

export function groupTransactionsByDate(transactions: Transaction[]): TransactionGroup[] {
    return transactions.reduce<TransactionGroup[]>((acc, tx) => {
        const key = formatDate(tx.transactionDate, 'yyyy-MM-dd');
        const existingGroup = acc.find(g => g.dateKey === key);
        if (existingGroup) {
            existingGroup.items.push(tx);
        } else {
            acc.push({
                dateKey: key,
                label: getDateLabel(tx.transactionDate),
                items: [tx]
            });
        }
        return acc;
    }, []);
};

export function useTransactions({
    action,
    id,
    query = '',
    size = 10,
    initialData = [],
    initialCursor = null
}: useTransactionsParams) {

    const debouncedQuery = useDebounceValue(query, 400);

    const { loading, data, scrollElementRef, refetch } = useInfiniteScroll<Cursor, Transaction>({
        query: debouncedQuery,
        // action implementations across the codebase have differing signatures
        // so cast to any here to avoid strict type mismatch while keeping
        // the downstream typing for `Transaction` for callers.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        action: action as any,
        initialCursor: initialCursor,
        initialData: initialData,
        extraParams: { id },
        size,
        format: (prev, incoming) => {
            const ids = new Set(prev.map(c => c.id));
            return [...prev, ...incoming.filter(c => !ids.has(c.id))]
        }
        ,
        cacheTTL: 60_000 // cache pages for 60 seconds in-memory
    });

    const groups = useMemo(() => groupTransactionsByDate(data ?? []), [data]);

    return { loading, transactions: groups, scrollElementRef, refetch };
};