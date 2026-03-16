"use client";
import { getTransactions } from "@/actions/transactions";
import { useState, useRef, useEffect, useCallback } from "react";
import EachTransaction from "./recentTransactions.tsx/eachTransaction";

type Cursor = { date: Date; id: string } | null;

export default function TransactionList({ initialTransaction, initialCursor }: {
    initialTransaction: any[];
    initialCursor: Cursor;
}) {
    const [transactions, setTransactions] = useState(initialTransaction);
    const cursorRef = useRef<Cursor>(initialCursor);
    const loadingRef = useRef(false);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialCursor !== null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const loadMore = useCallback(async () => {
        if (!cursorRef.current || loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);
        try {
            const res = await getTransactions(cursorRef.current);
            setTransactions((prev: any) => [...prev, ...res.data]);
            cursorRef.current = res.nextCursor;
            setHasMore(res.nextCursor !== null);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, []);

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
            {transactions.map((tx: any) => (
                <EachTransaction key={tx.id} recentTransaction={tx} />
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