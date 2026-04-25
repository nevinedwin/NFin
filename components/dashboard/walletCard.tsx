'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import DashboardCard from './dashboardCard';
import ShowBalanceComp from '../ui/showBalance';
import useCountUp from '@/hooks/useCountUp';
import { ChevronRightCircle } from 'lucide-react';
import BuildingPanel, { animStyles } from './buildings';

const dummyData = [
    { balance: 2000, name: "total", updatedAt: 'Last Updated on 25 Apr, 11:49 PM', accountNumber: '123453232' },
    { balance: 100, name: "SBI", updatedAt: 'Last Updated on 25 Apr, 11:49 PM', accountNumber: '123453232' },
    { balance: 1000, name: "Federal Bank", updatedAt: 'Last Updated on 25 Apr, 11:49 PM', accountNumber: '123453232' },
    { balance: 900, name: "HDFC Bank", updatedAt: 'Last Updated on 25 Apr, 11:49 PM', accountNumber: '123453232' },
    { balance: 500, name: "Axis Bank", updatedAt: 'Last Updated on 25 Apr, 11:49 PM', accountNumber: '123453232' },
];

// RenderItem — NO building inside, just text
const RenderItem = ({ item }: { item: typeof dummyData[0] }) => {
    const balance = useCountUp(item.balance, 1000);
    const isTotal = item.name.toLowerCase() === 'total';

    return (
        <div
            className='flex flex-col flex-shrink-0 p-4'
            style={{ width: '100%', scrollSnapAlign: 'start' }}
        >
            <p className='text-sm capitalize'>
                {isTotal ? 'Total Balance' : item.name}
                {!isTotal && (
                    <span className='text-blue-600 text-sm ml-1'>
                        ··{item.accountNumber.slice(-4)}
                    </span>
                )}
            </p>
            <ShowBalanceComp balance={balance} />
            <p className='text-[10px] text-slate-400'>
                {isTotal ? `Across ${dummyData.length - 1} accounts` : item.updatedAt}
            </p>
            <div className='pt-4'>
                <button
                    onClick={() => { }}
                    className='flex gap-1 justify-center font-semibold text-sm items-center text-blue-500'
                >
                    View
                    <ChevronRightCircle size={20} />
                </button>
            </div>
        </div>
    );
};

// WalletCard — building lives in the header row, outside scroll
const WalletCard = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setActiveIndex(Math.round(el.scrollLeft / el.clientWidth));
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => el.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollToIndex = (i: number) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    };

    const activeItem = dummyData[activeIndex];

    return (
        <DashboardCard
            headerContent={
                <div className='w-full h-fit px-4 py-2'>
                    <p>Bank Balance</p>
                </div>
            }
            content={
                <div className='w-full h-full flex flex-col'>
                    <style>{animStyles}</style>

                    {/* Content row: scroll area + building side by side */}
                    <div className='flex flex-1 flex-row overflow-hidden'>
                        {/* Scrollable text slides */}
                        <div
                            ref={scrollRef}
                            className='flex flex-1 overflow-x-auto snap-x snap-mandatory'
                            style={{
                                scrollbarWidth: 'none',
                                WebkitOverflowScrolling: 'touch',
                                scrollSnapType: 'x mandatory',
                            } as React.CSSProperties}
                        >
                            {dummyData.map((item, i) => (
                                <RenderItem item={item} key={i} />
                            ))}
                        </div>

                        {/* Building panel — fixed on the right, swaps on activeIndex change */}
                        <div className='flex items-center'>
                            <BuildingPanel
                                name={activeItem.name}
                                isTotal={activeItem.name.toLowerCase() === 'total'}
                            />
                        </div>
                    </div>

                    {/* Dot indicators */}
                    <div className='flex gap-1.5 justify-start pb-4 px-4'>
                        {dummyData.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollToIndex(i)}
                                className='h-1 rounded-full transition-all duration-300'
                                style={{
                                    width: activeIndex === i ? '24px' : '12px',
                                    backgroundColor: activeIndex === i ? '#3b82f6' : '#cbd5e1',
                                }}
                            />
                        ))}
                    </div>
                </div>
            }
        />
    );
};

export default WalletCard;