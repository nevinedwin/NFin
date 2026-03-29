'use client';

import React, { useEffect, useState } from 'react'
import Input from '@/components/ui/input'
import useDebounceValue from '@/hooks/useDebounceValue';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { getContacts } from '@/actions/contacts';
import AccountLogo from '@/components/wallet/accountLogo';
import { Loader2 } from 'lucide-react';

const PAGE_SIZE = 10;

type Contact = {
    id: string;
    name: string;
    phone: string;
};

type Cursor = { name: string; id: string } | null;

type ContactListProps = {
    reRender: boolean;
};


const ContactList = ({ reRender }: ContactListProps) => {

    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounceValue(query, 400);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const {
        error,
        loading,
        data: contacts,
        hasMore,
        scrollElementRef,
        refetch
    } = useInfiniteScroll<Cursor, Contact>({
        query: debouncedQuery,
        action: getContacts,
        size: PAGE_SIZE,
        format: (prev, incoming) => {
            const ids = new Set(prev.map(c => c.id));
            return [...prev, ...incoming.filter(c => !ids.has(c.id))]
        }
    });

    useEffect(() => {
        if (!reRender) {
            refetch();
        }
    }, [reRender])

    return (
        <div className='w-full h-full flex flex-col'>
            <div className='flex-shrink-0'>
                <Input
                    placeholder="Search contacts..."
                    value={query}
                    showIcon
                    onChange={handleSearch}
                    className='!bg-transparent !text-white placeholder:!text-slate-400 !border border-border !shadow-none'
                    iconClass='!left-6'
                />
            </div>
            <div className='flex-1 min-h-0 overflow-y-auto mt-[20px]'>
                {contacts.map((c, index) => {

                    if (contacts.length - 3 === index + 1) {
                        return (
                            <button
                                key={c.id}
                                ref={scrollElementRef}
                                // onClick={() => toggle(c.id)}
                                className="w-full flex items-center gap-6 px-4 py-3 active:bg-surface"
                            >
                                <AccountLogo name={c.name.slice(0, 2)} className="w-10 h-10" />
                                <div className="flex flex-col items-start">
                                    <span className="text-sm text-white">{c.name}</span>
                                    <span className="text-xs text-slate-400">{c.phone}</span>
                                </div>
                            </button>
                        )
                    } else {
                        return (
                            <button
                                key={c.id}
                                // onClick={() => toggle(c.id)}
                                className="w-full flex items-center gap-6 px-4 py-3 active:bg-surface"
                            >
                                <AccountLogo name={c.name.slice(0, 2)} className="w-10 h-10" />
                                <div className="flex flex-col items-start">
                                    <span className="text-sm text-white">{c.name}</span>
                                    <span className="text-xs text-slate-400">{c.phone}</span>
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
                {!loading && contacts.length === 0 && (
                    <div className="text-center text-slate-500 py-10">
                        No contacts found
                    </div>
                )}
            </div>
        </div>
    )
}

export default ContactList