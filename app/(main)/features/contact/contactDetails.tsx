
'use client';

import React, { useState } from 'react';
import BackArrowButton from '@/components/ui/backArrowbutton';
import HorizontalLine from '@/components/ui/horizontalLine';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { Cursor, getContactTransactions } from '@/actions/contacts';
import useDebounceValue from '@/hooks/useDebounceValue';
import { useTransactions } from '@/hooks/useTransactions';
import TransactionList from '@/components/contact/transactionList';

export type ContactTransactions = {
    id: string;
    obligationAmount: number;
    sharedAmount: number;
    paidAmount: number;
    transactionDate: Date;
    status: string;
    transactionRefId: string;
};

const PAGE_SIZE = 10;

const ContactDetails = ({ data }: any) => {

    const [query, setQuery] = useState('');

    const { loading, transactions, scrollElementRef, refetch } = useTransactions({
        action: getContactTransactions,
        id: data?.id,
        query,
        size: PAGE_SIZE
    });

    return (
        <div className='w-full h-full flex flex-col'>
            <div className='px-2 w-full py-4 flex gap-5'>
                <BackArrowButton href="/contact" size={30} />
                <div className='flex flex-col'>
                    <h2 className='text-md'>{data?.name || ''}</h2>
                    <h2 className='text-[12px] text-slate-300'>+91 {data?.phone || ''}</h2>
                </div>
            </div>
            <HorizontalLine />
            <TransactionList loading={loading} transactions={transactions} scrollElementRef={scrollElementRef}/>
        </div>
    )
}

export default ContactDetails