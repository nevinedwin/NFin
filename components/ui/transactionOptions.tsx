'use client';

import React, { useState } from 'react'
import useDebounceValue from '@/hooks/useDebounceValue';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';
import SearchInput from '@/components/ui/searchInput';
import { TransactionType } from '@/generated/prisma/client';
import { COLOR_BUTTON } from '../transaction/transactionCard';
import { colorPallet } from './typeButton';

const PAGE_SIZE = 10;

type Option = {
    label: string;
    value: string;
};


type TransactionOptionsProps<T, D> = {
    method: (params: {
        search: string;
        cursor: T | null;
        take: number
    }) => Promise<{
        data: D[];
        nextCursor: T | null;
    }>;
    onChange?: (val: string, label: string) => void;
    onSelect?: () => void;
    value?: string;
    type?: TransactionType | null;
    mapOption?: (item: D) => Option;
    name: string;

};


const TransactionOptions = ({
    method,
    onChange,
    onSelect,
    value = '',
    type,
    mapOption,
    name
}: TransactionOptionsProps<any, any>) => {

    const [id, setId] = useState(value);
    const [query, setQuery] = useState('');

    const debouncedQuery = useDebounceValue(query, 400);


    const {
        data,
        loading,
        scrollElementRef,
        refetch
    } = useInfiniteScroll({
        query: debouncedQuery,
        action: method,
        size: PAGE_SIZE,
        format: (prev, incoming) => {
            const ids = new Set(prev.map((item: any) => item.id));
            return [...prev, ...incoming.filter((item: any) => !ids.has(item.id))];
        },
        extraParams: { filters: { type } }
    });

    let options = data;
    if (mapOption) {
        options = data.map(mapOption);
    };

    return (
        <div className='w-full h-full flex flex-col'>
            <div className='flex-shrink-0'>
                <SearchInput
                    name="transactions-search"
                    placeholder={`Search`}
                    value={query}
                    onChange={setQuery}
                />
            </div>
            <div className=" flex-1 min-h-0 overflow-y-auto pb-11 pt-6 px-4 grid grid-cols-2 gap-4   place-items-center content-start">
                {options.map((opt, index) => {
                    const isLastOddItem =
                        options.length % 2 === 1 && index === options.length - 1;

                    const isTriggerItem = index === options.length - 2;

                    return (
                        <div
                            ref={isTriggerItem ? scrollElementRef : undefined}
                            key={opt.value}
                            onClick={() => {
                                setId(opt.value);
                                onChange?.(opt.value, opt.label);
                                onSelect?.();
                            }}
                            className={`
                                h-20 w-full max-w-[140px]
                                rounded-xl flex justify-center items-center text-white cursor-pointer
                                ${id === opt.value ? colorPallet[COLOR_BUTTON[type as TransactionType]] : 'bg-border'}
                                ${isLastOddItem ? 'col-span-2 justify-self-center' : 'justify-self-center'}
                            `}
                        >
                            {opt.label}
                        </div>
                    );
                })}
                {!loading && options.length === 0 && (
                    <div className="p-2 text-sm text-slate-500 col-span-2 flex justify-center items-center">
                        No results
                    </div>
                )}
                {loading && (
                    <div className="py-4 col-span-2 flex justify-center items-center">
                        <Loader2 className="animate-spin" />
                    </div>
                )}
            </div>
            <input type="hidden" name={name} value={id || ""} />
        </div>
    )
}

export default TransactionOptions;