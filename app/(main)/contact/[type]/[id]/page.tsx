'use server';

import React from 'react';
import BackArrowButton from '@/components/ui/backArrowbutton';
import { getContactTransactions, getData } from '@/actions/contacts';
import ContactDetails from '@/app/(main)/features/contact/contactDetails';
import GroupDetails from '@/app/(main)/features/contact/groupDetails';

const DetailPage = async ({ params
}: {
    params: Promise<{ id: string; type: 'contact' | 'group' }>;
}) => {

    const { id, type } = await params;

    const { data }: any = await getData({ id, type })

    const initalTransactions = await getContactTransactions({ cursor: null, id: data.id, take: 10 });

    return (
        <div className='w-full h-full flex flex-col'>
            {
                type === 'contact'
                    ? <ContactDetails
                        data={data}
                        initalTransactions={initalTransactions.data}
                        initialCursor={initalTransactions.nextCursor}
                    />
                    : <GroupDetails />
            }
        </div>
    )
}

export default DetailPage;