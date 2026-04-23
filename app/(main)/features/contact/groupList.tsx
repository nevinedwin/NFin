'use client';

import useDebounceValue from '@/hooks/useDebounceValue';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import React, { useEffect, useState } from 'react';
import SearchInput from '@/components/ui/searchInput';
import AccountLogo from '@/components/wallet/accountLogo';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getGroupsWithMembers } from '@/actions/groups';


const PAGE_SIZE = 10;

type Group = {
    id: string;
    name: string;
};

type Cursor = { name: string; id: string } | null;

type GroupListProps = {
    reRender: boolean;
};

const GroupList = ({ reRender }: GroupListProps) => {

    const router = useRouter();

    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounceValue(query, 400);

    const {
        loading,
        data: groups,
        scrollElementRef,
        refetch
    } = useInfiniteScroll<Cursor, Group>({
        query: debouncedQuery,
        action: getGroupsWithMembers,
        size: PAGE_SIZE,
        format: (prev, incoming) => {
            const ids = new Set(prev.map(c => c.id));
            return [...prev, ...incoming.filter(c => !ids.has(c.id))]
        }
    });

    const toggle = (id: string) => {
        router.push(`/contact/group/${id}`);
    };

    useEffect(() => {
        if (!reRender) {
            refetch();
        }
    }, [reRender])

    return (
        <div className='w-full h-full flex flex-col'>
            <div className='flex-shrink-0'>
                <SearchInput
                    name="transaction-search"
                    placeholder="Search Transactions"
                    value={query}
                    onChange={setQuery}
                />
            </div>
            <div className='flex-1 min-h-0 overflow-y-auto mt-[20px]'>
                {groups.map((c, index) => {

                    if (groups.length - 3 === index + 1) {
                        return (
                            <button
                                key={c.id}
                                ref={scrollElementRef}
                                onClick={() => toggle(c.id)}
                                className="w-full flex items-center gap-6 px-4 py-3 active:bg-surface"
                            >
                                <AccountLogo name={c.name.slice(0, 2)} className="w-10 h-10" />
                                <div className="flex flex-col items-start">
                                    <span className="text-sm text-white">{c.name}</span>
                                    {/* <span className="text-xs text-slate-400">{c.phone}</span> */}
                                </div>
                            </button>
                        )
                    } else {
                        return (
                            <button
                                key={c.id}
                                onClick={() => toggle(c.id)}
                                className="w-full flex items-center gap-6 px-4 py-3 active:bg-surface"
                            >
                                <AccountLogo name={c.name.slice(0, 2)} className="w-10 h-10" />
                                <div className="flex flex-col items-start">
                                    <span className="text-sm text-white">{c.name}</span>
                                    {/* <span className="text-xs text-slate-400">{c.phone}</span> */}
                                </div>
                            </button>
                        )
                    }
                }
                )}
                {loading && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="animate-spin" />
                    </div>
                )}
                {!loading && groups.length === 0 && (
                    <div className="text-center text-slate-500 py-10">
                        No Groups found
                    </div>
                )}
            </div>
        </div>
    )
}

export default GroupList;