'use client';

import { ObligationStatus } from "@/generated/prisma/client";
import { useMemo, useState } from "react";
import useDebounceValue from "./useDebounceValue";
import useInfiniteScroll from "./useInfiniteScroll";
import { Cursor } from "@/actions/contacts";

export type Transaction = {
    id: string;
    obligationAmount: number;
    sharedAmount: number;
    transactionDate: string;
    paidAmount: number;
    status: ObligationStatus;
    transactionRefId: string;
};

export type TransactionGroup = {
    dateKey: string;
    label: string;
    items: Transaction[];
};

type useTransactionsParams = {
    action: any;
    id: string;
    query?: string;
    size?: number;
};

function getDateLabel(dateStr: string): string {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export function groupTransactionsByDate(transactions: Transaction[]): TransactionGroup[] {
    return transactions.reduce<TransactionGroup[]>((acc, tx) => {
        const key = new Date(tx.transactionDate).toDateString();
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
    size = 10
}: useTransactionsParams) {

    const debouncedQuery = useDebounceValue(query, 400);

    const { loading, data, scrollElementRef, refetch } = useInfiniteScroll<Cursor, Transaction>({
        query: debouncedQuery,
        action,
        extraParams: { id },
        size,
        format: (prev, incoming) => {
            const ids = new Set(prev.map(c => c.id));
            return [...prev, ...incoming.filter(c => !ids.has(c.id))]
        }
    });

    const groups = useMemo(() => groupTransactionsByDate(data ?? []), [data]);

    return { loading, transactions: groups, scrollElementRef, refetch };
};