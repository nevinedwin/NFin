"use client";
import { getTransactions } from "@/actions/transactions";
import { useState, useRef, useEffect, useCallback } from "react";
import EachTransaction from "./recentTransactions.tsx/eachTransaction";
import useDebounceValue from "@/hooks/useDebounceValue";
import SearchInput from "../ui/searchInput";

type Cursor = { date: Date; id: string } | null;

export default function TransactionList({ initialTransaction, initialCursor }: {
    initialTransaction: any[];
    initialCursor: Cursor;
}) {

    const [transactions, setTransactions] = useState(initialTransaction);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialCursor !== null);
    const [query, setQuery] = useState<string>('');

    const debounceQuery = useDebounceValue(query, 400);

    const cursorRef = useRef<Cursor>(initialCursor);
    const loadingRef = useRef(false);
    const loaderRef = useRef<HTMLDivElement | null>(null);


    const fetchTransactions = useCallback(
        async (cursor: Cursor, search: string, replace: boolean) => {
            if (loadingRef.current) return;
            loadingRef.current = true;
            setLoading(true);

            try {
                const res = await getTransactions(cursor ?? undefined, search);

                setTransactions((prev) => {
                    if(replace) return res.data;
                    const existingIds = new Set(prev.map((t: any) => t.id));
                    return [...prev, ...res.data.filter((t: any) => !existingIds.has(t.id))]
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

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        };

        fetchTransactions(null, debounceQuery, true);

    }, [debounceQuery, fetchTransactions]);


    const loadMore = useCallback(() => {
        fetchTransactions(cursorRef.current, debounceQuery, false);
    }, [debounceQuery, fetchTransactions]);


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
        <div className="p-4">

            <div className="mb-4">
                <SearchInput
                    name="transaction-search"
                    placeholder="Search Transactions"
                    value={query}
                    onChange={setQuery}
                />
            </div>

            {!loading && transactions.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-10">
                    {debounceQuery ? `No transactions found for "${debounceQuery}"` : 'No transactions yet'}
                </p>
            )}

            {transactions.map((tx: any) => (
                <EachTransaction key={tx.id} recentTransaction={tx} recentCard={false} />
            ))}

            <div ref={loaderRef} className="h-16 flex justify-center items-center">
                {loading && <span>Loading...</span>}
                {!hasMore && !loading && transactions.length > 0 && (
                    <span className="text-gray-400 text-sm">No more transactions</span>
                )}
            </div>
        </div>
    );
}