'use client';

import React, { useState } from 'react'
import useDebounceValue from '@/hooks/useDebounceValue';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';
import SearchInput from '@/components/ui/searchInput';
import { TransactionType } from '@/generated/prisma/client';
import { COLOR_BUTTON } from '../transaction/transactionCard';
import { colorPallet } from './typeButton';
import CategoryIcon from './caetgoryIcon';

const PAGE_SIZE = 10;

type Option = {
    label: string;
    value: string;
};

type GroupedOption = {
    parent: {
        id: string;
        name: string;
        icon?: string | null;
    } | null;
    categories: any[];
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
    grouped?: boolean;
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
    name,
    grouped
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
            if (grouped) {
                return incoming;
            }

            const ids = new Set(prev.map((item: any) => item.id));

            return [
                ...prev,
                ...incoming.filter((item: any) => !ids.has(item.id))
            ];
        },
        extraParams: { filters: { type } }
    });

    const isGrouped = grouped && Array.isArray(data);

    let options = data;

    if (!grouped && mapOption) {
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
            <div className="flex-1 min-h-0 overflow-y-auto pb-11 pt-6 px-4">

                {isGrouped ? (

                    <div className="flex flex-col gap-6">

                        {data.map((group: GroupedOption, index: number) => (

                            <div key={index}>

                                <div className=" bg-black py-2 mb-3">
                                    <p className="text-sm font-semibold text-slate-400">
                                        {group.parent?.name || "Main Categories"}
                                    </p>
                                </div>

                                <div className="w-full grid grid-cols-3 gap-y-4">

                                    {group.categories.map((item: any, index: number) => {

                                        const opt = mapOption
                                            ? mapOption(item)
                                            : item;

                                        return (
                                            <div
                                                key={opt.value}
                                                onClick={() => {
                                                    setId(opt.value);
                                                    onChange?.(opt.value, opt.label);
                                                    onSelect?.();
                                                }}
                                                className={`
                                                    h-20 w-full
                                                    rounded-xl
                                                    bg-inherit
                                                    flex flex-col justify-center items-center
                                                    text-white text-xs font-medium cursor-pointer
                                                    transition-all duration-200

                                                    ${id === opt.value
                                                        ? colorPallet[COLOR_BUTTON[type as TransactionType]]
                                                        : 'bg-border'
                                                    }
                                                `}
                                            >
                                                {opt.icon && <CategoryIcon disabled={false} name={opt.icon} className="w-7 h-7" containerClassName="w-10 h-10 flex text-black justify-center items-center bg-white rounded-xl" />}
                                                {opt.label}
                                            </div>
                                        );
                                    })}

                                </div>

                            </div>
                        ))}

                    </div>

                ) : (

                    <div className="grid grid-cols-2 gap-4 place-items-center content-start">

                        {options.map((opt, index) => {

                            const isLastOddItem =
                                options.length % 2 === 1 &&
                                index === options.length - 1;

                            const isTriggerItem =
                                index === options.length - 2;

                            return (
                                <div
                                    ref={isTriggerItem ? scrollElementRef : undefined}
                                    key={index}
                                    onClick={() => {
                                        setId(opt.value);
                                        onChange?.(opt.value, opt.label);
                                        onSelect?.();
                                    }}
                                    className={`
                            h-20 w-full max-w-[140px]
                            rounded-xl flex justify-center items-center
                            text-black font-medium cursor-pointer

                            ${id === opt.value
                                            ? colorPallet[COLOR_BUTTON[type as TransactionType]]
                                            : 'bg-border'
                                        }

                            ${isLastOddItem
                                            ? 'col-span-2 justify-self-center'
                                            : 'justify-self-center'
                                        }
                        `}
                                >
                                    {opt.label}
                                </div>
                            );
                        })}

                    </div>
                )}

                {!loading && options.length === 0 && (
                    <div className="p-2 text-sm text-slate-500 flex justify-center items-center">
                        No results
                    </div>
                )}

                {loading && (
                    <div className="py-4 flex justify-center items-center">
                        <Loader2 className="animate-spin" />
                    </div>
                )}

            </div>
            <input type="hidden" name={name} value={id || ""} />
        </div>
    )
}

export default TransactionOptions;