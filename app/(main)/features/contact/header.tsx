'use Client';

import BackArrowButton from '@/components/ui/backArrowbutton';
import React from 'react'

const Header = () => {
    return (
        <div className='flex items-center gap-3'>
            <BackArrowButton href='/dashboard' size={26} />
            <div className='flex flex-col'>
                <h3 className='text-lg font-semibold text-white'>
                    Contacts
                </h3>
                <p className='text-xs text-slate-400'>
                    Manage your contacts & groups
                </p>
            </div>
        </div>
    )
}

export default Header