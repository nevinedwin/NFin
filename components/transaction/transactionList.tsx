"use client";

import { useRouter } from "next/navigation";
import { getMonthlyTotals, getTransactions, MonthSummary } from "@/actions/transactions";
import { useState, useRef, useEffect, useCallback, useMemo, useTransition } from "react";
import EachTransaction from "./recentTransactions.tsx/eachTransaction";
import useDebounceValue from "@/hooks/useDebounceValue";
import SearchInput from "../ui/searchInput";
import { ActiveFilters, EMPTY_FILTERS, TransactionFilterType } from "@/types/filters";
import FilterBars from "../ui/FilterBars/filterBars";
import { FILTER_BUTTONS, getTransactionPanel } from "./filterKeys";
import MonthHeader from "./monthHeader";
import BackArrowButton from "../ui/backArrowbutton";
import FilterSheet from "../ui/FilterBars/filterSheet";
import { Cursor } from "@/types/general";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { TransactionDataSafeType, TransactionDataType } from "@/types/transaction";
import { Loader2 } from "lucide-react";

const PAGE_SIZE = 10;

export default function TransactionList({
    initialMonthlyTotals,
    accounts,
    initialFilters,
    initialTransaction,
    initialCursor,
    now
}: {
    initialMonthlyTotals: MonthSummary[];
    accounts: { id: string; label: string; sub?: string }[];
    initialFilters?: Partial<ActiveFilters>;
    initialTransaction: TransactionDataSafeType[];
    initialCursor: Cursor;
    now: string;
}) {

    const router = useRouter();

    const [monthlyTotals, setMonthlyTotals] = useState<MonthSummary[]>(initialMonthlyTotals);
    const [filters, setFilters] = useState<ActiveFilters>({ ...EMPTY_FILTERS, ...initialFilters });
    const [openSheet, setOpenSheet] = useState<TransactionFilterType | null>(null);
    const [, startTotalsTransition] = useTransition();

    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounceValue(query, 400);

    const {
        loading,
        data: transactions,
        scrollElementRef,
        refetch
    } = useInfiniteScroll<Cursor, TransactionDataSafeType>({
        query: debouncedQuery,
        action: getTransactions,
        size: PAGE_SIZE,
        format: (prev, incoming) => {
            const ids = new Set(prev.map(c => c.id));
            return [...prev, ...incoming.filter(c => !ids.has(c.id))]
        },
        extraParams: { filters },
        initialCursor,
        initialData: initialTransaction
    });

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

    const handleClearAll = useCallback(() => {
        setFilters(EMPTY_FILTERS);
    }, []);

    const handleTransactionDetails = useCallback((id: string) => {
        router.push(`transaction/${id}`)
    }, []);

    const clearFilter = (key: TransactionFilterType) => {
        setFilters(prev => ({ ...prev, [key]: null }));
    };

    return (
        <div className="py-4 flex flex-col gap-3">
            <div className="flex pl-4 gap-2 justify-start items-center">
                <div>
                    <BackArrowButton href="/dashboard" size={30} />
                </div>
                <div className='flex flex-col justify-center items-start'>
                    <p className='font-semibold tracking-wide'>Transaction History</p>
                    <p className='text-text-secondary text-xs'>Every move, tracked</p>
                </div>
            </div>
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
                    filterButtons={FILTER_BUTTONS}
                    isActive={(key, f) => !!f[key]}
                    onFilterClick={(type) => setOpenSheet(type)}
                    onClearFilter={(key) => clearFilter(key)}
                    onClearAll={handleClearAll}
                />
            </div>

            {monthGroups.map((group, bigIndex) => (
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
                    {group.transactions.map((tx: any, index) => {
                        if ((monthGroups.length - (bigIndex + 1) === 0) && group.transactions.length - 3 === index + 1) {
                            return (
                                <div key={tx.id} className="w-full" ref={scrollElementRef}>
                                    <EachTransaction recentTransaction={tx} recentCard={false} onClickTransaction={handleTransactionDetails} />
                                </div>
                            )
                        } else {
                            return (
                                <div key={tx.id} className="w-full">
                                    <EachTransaction recentTransaction={tx} recentCard={false} onClickTransaction={handleTransactionDetails} />
                                </div>
                            )
                        }
                    })}
                </div>
            ))}

            {loading && (
                <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin" />
                </div>
            )}
            {!loading && transactions.length === 0 && (
                <div className="text-center text-slate-500 py-10">
                    No Transaction found
                </div>
            )}

            <FilterSheet
                open={!!openSheet}
                activeKey={openSheet}
                filters={filters}
                panels={getTransactionPanel({ account: accounts, now})}
                onClose={() => setOpenSheet(null)}
                onApply={(patch) => setFilters(prev => ({ ...prev, ...patch }))}
                refetch={refetch}
            />
        </div>
    );
}