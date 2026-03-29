"use client";

import BackArrowButton from '@/components/ui/backArrowbutton';
import { TabItem, Tabs } from '@/components/ui/tabComponent';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import Header from './header';
import CreateContactSheet from '@/components/contact/createEntitySheet';
import CreateEntitySheet from '@/components/contact/createEntitySheet';
import ContactList from './contactList';

export type TabsType = "contact" | "group";

export const tabLabel = {
    contact: "Contacts",
    group: "Groups"
}

const TAB_ITEMS: TabItem<TabsType>[] = [
    { id: "contact", label: "Contacts" },
    { id: "group", label: "Groups" },
];

const ContactPage = () => {

    const [tab, setTab] = useState<TabsType>('contact');
    const [openSheet, setOpenSheet] = useState(false);

    return (
        <div className='w-full h-full flex flex-col bg-background'>

            <div className='flex-shrink-0 px-4 pt-4 pb-6 flex items-center justify-between'>
                <Header tab={tab} />

                <button
                    onClick={() => setOpenSheet(true)}
                    className="
                        flex items-center gap-2
                        bg-white text-black font-semibold
                        px-3 py-2 rounded-md
                        shadow-md transition-all duration-200
                        active:scale-95
                    "
                >
                    <Plus size={18} />
                    <span className='text-sm'>
                        {tab === "contact" ? "Contact" : "Group"}
                    </span>
                </button>
            </div>

            {/* TABS */}
            <div className='flex-shrink-0 px-4'>
                <div className='bg-surface rounded-xl p-1 shadow-inner'>
                    <Tabs
                        tabs={TAB_ITEMS}
                        value={tab}
                        onChange={setTab}
                        className="relative"
                    />
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className='flex-1 min-h-0 px-4 py-6'>
                <div className='
                    w-full h-full
                    text-slate-400
                    text-sm
                '>
                    {tab === "contact"
                        ? <ContactList reRender={openSheet} />
                        : "No groups yet 👥"}
                </div>
            </div>

            {openSheet && <CreateEntitySheet
                open={openSheet}
                type={tab}
                onClose={() => setOpenSheet(false)}
            />}

        </div>
    );
};

export default ContactPage;