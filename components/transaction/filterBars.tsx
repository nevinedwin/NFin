'use client';
import React, { useEffect, useRef, useState } from 'react'
import { ActiveFilters, hasActiveFilter, TransactionFilterType } from "@/types/filters";
import { X } from 'lucide-react';
import { FilterButtonType, filterLabel, isFilterActive } from './FilteKeys';

type FilterBarProps = {
    filters: ActiveFilters;
    onFilterClick: (type: TransactionFilterType) => void;
    onClearAll: () => void;
    filterButtons: FilterButtonType;
};

const FilterBars = ({ filters, onClearAll, onFilterClick, filterButtons }: FilterBarProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const anyActive = hasActiveFilter(filters);

    // Track PAGE scroll — shrinks Clear All when user scrolls down
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <div className='flex items-center gap-2'>

            {}
            {anyActive && (
                <button
                    onClick={onClearAll}
                    className='flex flex-shrink-0 items-center gap-1.5 px-2 py-1.5
                        bg-surface border border-red-500 text-red-500
                        rounded-lg transition-all duration-300 ease-in-out overflow-hidden
                        hover:bg-red-400/20 active:scale-95'
                        
                >
                    <X size={13} className='flex-shrink-0' />
                    <span
                        className={`text-xs font-bold whitespace-nowrap transition-all duration-300 overflow-hidden
                            ${scrolled ? "max-w-0 opacity-0" : "max-w-[60px] opacity-100"}`}
                    >
                        Clear All
                    </span>
                </button>
            )}

            {/* Scrollable filter buttons */}
            <div
                ref={scrollRef}
                className='flex items-center gap-2 overflow-x-auto scrollbar-hide py-1'
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {filterButtons.map(({ key, icon }) => {
                    const active = isFilterActive(key, filters);
                    const label = filterLabel(key, filters);
                    return (
                        <button
                            key={key}
                            onClick={() => onFilterClick(key)}
                            className={`
                                flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5
                                rounded-lg border text-xs font-medium
                                transition-all duration-200 active:scale-95
                                ${active
                                    ? "bg-blue-500 border-none text-white"
                                    : "bg-surface border-border text-slate-400 hover:border-slate-700 hover:text-slate-300"
                                }
                            `}
                        >
                            {icon}
                            <span>{label}</span>
                            {active && (
                                <X size={11} onClick={(e) => {
                                    e.stopPropagation();
                                    onClearAll();
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FilterBars;