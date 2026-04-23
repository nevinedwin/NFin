'use server';

import React from 'react';
import BackArrowButton from '@/components/ui/backArrowbutton';
import { getData } from '@/actions/contacts';
import ContactDetails from '@/app/(main)/features/contact/contactDetails';
import GroupDetails from '@/app/(main)/features/contact/groupDetails';

const DetailPage = async ({ params
}: {
    params: Promise<{ id: string; type: 'contact' | 'group' }>;
}) => {

    const { id, type } = await params;

    const { data }: any = await getData({ id, type })

    return (
        <div className='w-full h-full flex flex-col'>
            {
                type === 'contact'
                    ? <ContactDetails data={data}/>
                    : <GroupDetails />
            }
        </div>
    )
}

export default DetailPage;