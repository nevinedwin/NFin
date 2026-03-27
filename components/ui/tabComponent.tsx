"use client";

import React, { memo, useCallback } from "react";

export type TabItem<T extends string> = {
    id: T;
    label: string;
};

type TabsProps<T extends string> = {
    tabs: TabItem<T>[];
    value: T;
    onChange: (val: T) => void;
    className?: string;
};

function TabsComponent<T extends string>({
    tabs,
    value,
    onChange,
    className = "",
}: TabsProps<T>) {

    const handleClick = useCallback(
        (tab: T) => {
            if (tab !== value) onChange(tab);
        },
        [value, onChange]
    );

    return (
        <div className={`w-full flex relative ${className}`} role="tablist">
            {tabs.map((tab) => {
                const isActive = tab.id === value;

                return (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleClick(tab.id)}
                        className={`
                            flex-1 py-2 text-sm font-semibold transition-all duration-200
                            ${isActive ? "text-white" : "text-slate-400"}
                        `}
                    >
                        {tab.label}
                    </button>
                );
            })}

            {/* Animated underline */}
            <div
                className="absolute bottom-0 h-[3px] bg-white transition-all duration-300"
                style={{
                    width: `${100 / tabs.length}%`,
                    left: `${tabs.findIndex(t => t.id === value) * (100 / tabs.length)}%`,
                }}
            />
        </div>
    );
}

export const Tabs = memo(TabsComponent) as typeof TabsComponent;