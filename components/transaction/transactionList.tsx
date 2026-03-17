"use client";

import { getMonthlyTotals, getTransactions, MonthSummary } from "@/actions/transactions";
import { useState, useRef, useEffect, useCallback, useMemo, useTransition } from "react";
import EachTransaction from "./recentTransactions.tsx/eachTransaction";
import useDebounceValue from "@/hooks/useDebounceValue";
import SearchInput from "../ui/searchInput";
import { ActiveFilters, EMPTY_FILTERS, TransactionFilterType } from "@/types/filters";
import FilterBars from "./filterBars";
import { FILTER_BUTTONS } from "./FilteKeys";
import FilterSheet from "./filterSheet";
import MonthHeader from "./monthHeader";

type Cursor = { date: Date; id: string } | null;

export default function TransactionList({
    initialTransaction,
    initialCursor,
    initialMonthlyTotals,
    accounts,
    categories,
}: {
    initialTransaction: any[];
    initialCursor: Cursor;
    initialMonthlyTotals: MonthSummary[];
    accounts: { id: string; label: string; sub?: string }[];
    categories: { id: string; label: string }[];
}) {
    const [transactions, setTransactions] = useState(initialTransaction);
    const [monthlyTotals, setMonthlyTotals] = useState<MonthSummary[]>(initialMonthlyTotals);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialCursor !== null);
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<ActiveFilters>(EMPTY_FILTERS);
    const [openSheet, setOpenSheet] = useState<TransactionFilterType | null>(null);
    const [, startTotalsTransition] = useTransition();

    const debounceQuery = useDebounceValue(query, 400);
    const cursorRef = useRef<Cursor>(initialCursor);
    const loadingRef = useRef(false);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const isFirstRender = useRef(true);

    const totalsMap = useMemo(
        () => new Map(monthlyTotals.map((s) => [s.key, s])),
        [monthlyTotals]
    );

    const monthGroups = useMemo(() => {
        const map = new Map<string, { key: string; transactions: any[] }>();
        for (const tx of transactions) {
            const date = new Date(tx.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (!map.has(key)) map.set(key, { key, transactions: [] });
            map.get(key)!.transactions.push(tx);
        }
        return Array.from(map.values());
    }, [transactions]);

    const refreshTotals = useCallback((search: string, activeFilters: ActiveFilters) => {
        startTotalsTransition(async () => {
            const totals = await getMonthlyTotals(search, activeFilters);
            setMonthlyTotals(totals);
        });
    }, []);

    const fetchTransactions = useCallback(
        async (cursor: Cursor, search: string, activeFilters: ActiveFilters, replace: boolean) => {
            if (loadingRef.current) return;
            loadingRef.current = true;
            setLoading(true);
            try {
                const res = await getTransactions(cursor ?? undefined, search, activeFilters);
                setTransactions((prev) => {
                    if (replace) return res.data;
                    const existingIds = new Set(prev.map((t: any) => t.id));
                    return [...prev, ...res.data.filter((t: any) => !existingIds.has(t.id))];
                });
                cursorRef.current = res.nextCursor;
                setHasMore(res.nextCursor !== null);
            } finally {
                loadingRef.current = false;
                setLoading(false);
            }
        },
        []
    );

    const loadMore = useCallback(() => {
        fetchTransactions(cursorRef.current, debounceQuery, filters, false);
    }, [debounceQuery, filters, fetchTransactions]);

    const handleApplyFilter = useCallback((partial: Partial<ActiveFilters>) => {
        setFilters((prev) => ({ ...prev, ...partial }));
    }, []);

    const handleClearAll = useCallback(() => {
        setFilters(EMPTY_FILTERS);
    }, []);

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        fetchTransactions(null, debounceQuery, filters, true);
        refreshTotals(debounceQuery, filters);
    }, [debounceQuery, filters, fetchTransactions, refreshTotals]);

    useEffect(() => {
        if (!loaderRef.current || !cursorRef.current) return;
        const rect = loaderRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight) loadMore();
    }, [transactions, loadMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) loadMore(); },
            { rootMargin: "200px" }
        );
        const current = loaderRef.current;
        if (current) observer.observe(current);
        return () => { if (current) observer.unobserve(current); };
    }, [loadMore]);

    return (
        <div className="py-4 flex flex-col gap-3">
            <div className="w-full px-4">
                <SearchInput
                    name="transaction-search"
                    placeholder="Search Transactions"
                    value={query}
                    onChange={setQuery}
                />
            </div>
            <div className="w-full px-4">
                <FilterBars
                    filters={filters}
                    onFilterClick={(type) => setOpenSheet(type)}
                    onClearAll={handleClearAll}
                    filterButtons={FILTER_BUTTONS}
                />
            </div>

            {!loading && transactions.length === 0 && (
                <div className="w-full px-4">
                    <p className="text-center text-slate-400 text-sm py-10">
                        {debounceQuery ? `No transactions found for "${debounceQuery}"` : "No transactions yet"}
                    </p>
                </div>
            )}

            {monthGroups.map((group) => (
                <div key={group.key}>
                    <MonthHeader
                        group={{
                            ...group,
                            ...totalsMap.get(group.key) ?? {
                                label: group.key,
                                count: group.transactions.length,
                                totalIncome: 0,
                                totalExpense: 0,
                            },
                        }}
                    />
                    {group.transactions.map((tx: any) => (
                        <div key={tx.id} className="w-full px-4">
                            <EachTransaction recentTransaction={tx} recentCard={false} />
                        </div>
                    ))}
                </div>
            ))}

            <div ref={loaderRef} className="h-16 w-full px-4 flex justify-center items-center">
                {loading && <span className="text-slate-400 text-sm">Loading...</span>}
                {!hasMore && !loading && transactions.length > 0 && (
                    <span className="text-gray-400 text-sm">No more transactions</span>
                )}
            </div>

            <FilterSheet
                open={openSheet !== null}
                filterType={openSheet}
                filters={filters}
                accounts={accounts}
                categories={categories}
                onClose={() => setOpenSheet(null)}
                onApply={handleApplyFilter}
            />
        </div>
    );
}