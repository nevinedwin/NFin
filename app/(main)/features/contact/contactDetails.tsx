
import React from 'react';
import BackArrowButton from '@/components/ui/backArrowbutton';
import HorizontalLine from '@/components/ui/horizontalLine';

const ContactDetails = ({ data }: any) => {

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
        </div>
    )
}

export default ContactDetails