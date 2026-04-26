'use client';
import { useEffect, useRef, useState } from "react";
import { getContactTransactions } from "@/actions/contacts";
import TransactionList from "@/components/contact/transactionList";
import BackArrowButton from "@/components/ui/backArrowbutton";
import HorizontalLine from "@/components/ui/horizontalLine";
import VerticalLine from "@/components/ui/verticalLine";
import { useTransactions } from "@/hooks/useTransactions";
import { RUPEE_SYMBOL } from "@/lib/constants/constants";
import AccountLogo from "@/components/wallet/accountLogo";

const PAGE_SIZE = 10;
const SCROLL_THRESHOLD = 10;

const ContactDetails = ({ data, initalTransactions, initialCursor }: any) => {
    const [query, setQuery] = useState('');
    const [showSettlement, setShowSettlement] = useState(true);

    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const hideHeaderRef = useRef(false);

    const { loading, transactions, scrollElementRef, refetch } = useTransactions({
        action: getContactTransactions,
        initialData: initalTransactions,
        initialCursor: initialCursor,
        id: data?.id,
        query,
        size: PAGE_SIZE

    });

    const setMainRef = (node: HTMLDivElement | null) => {
        if (!node) return;

        const update = () => {
            const current = node.scrollTop;
            const diff = current - lastScrollY.current;
            if (Math.abs(diff) > SCROLL_THRESHOLD) {
                const shouldHide = diff > 0;
                if (hideHeaderRef.current !== shouldHide) {
                    hideHeaderRef.current = shouldHide;
                    setShowSettlement(!shouldHide);
                }
                lastScrollY.current = current;
            }
            ticking.current = false;
        };

        const onScroll = () => {
            if (!ticking.current) {
                requestAnimationFrame(update);
                ticking.current = true;
            }
        };

        node.addEventListener('scroll', onScroll, { passive: true });
    };


    const renderSettlement = () => {
        return (
            <div
                className='w-full px-4 pt-4 overflow-hidden transition-all duration-300 absolute ease-in-out'
                style={{
                    height: showSettlement ? '120px' : '0px',
                    transform: showSettlement ? 'translateY(0px)' : '-translateY(120px)',
                    paddingTop: showSettlement ? undefined : '0px',
                }}
            >
                <div className='h-fit w-full flex justify-between items-center bg-surface py-2 rounded-xl'>
                    <div className='flex-1 flex flex-col items-center justify-center'>
                        <p className='text-2xl font-extralight'>
                            <span className='text-lg'>{RUPEE_SYMBOL}</span> {Math.abs(data?.balance?.netAmount < 0 ? data?.balance?.netAmount : 0).toFixed(2)}
                        </p>
                        <p className='text-xs font-normal text-text-dull'>Owed by you</p>
                    </div>
                    <div className='h-[45px]'>
                        <VerticalLine />
                    </div>
                    <div className='flex-1 flex flex-col items-center justify-center'>
                        <p className='text-2xl font-extralight text-green-500'>
                            <span className='text-lg'>{RUPEE_SYMBOL}</span> {Math.abs(data?.balance?.netAmount > 0 ? data?.balance?.netAmount : 0).toFixed(2)}
                        </p>
                        <p className='text-xs font-normal text-text-dull'>Owed to you</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='w-full h-full flex flex-col'>
            <div className='px-2 w-full py-4 flex gap-2'>
                <BackArrowButton href="/contact" size={30} />
                <AccountLogo name={data.name.slice(0, 2)} className="w-10 h-10" />
                <div className='flex flex-col'>
                    <h2 className='text-md'>{data?.name || ''}</h2>
                    <h2 className='text-[12px] text-slate-300'>+91 {data?.phone || ''}</h2>
                </div>
            </div>
            <HorizontalLine />
            <div className="w-full relative">
                {renderSettlement()}
            </div>
            <TransactionList
                loading={loading}
                transactions={transactions}
                scrollElementRef={scrollElementRef}
                reference={setMainRef}
            />
        </div>
    );
};

export default ContactDetails;