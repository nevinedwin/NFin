'use client';

import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { X } from "lucide-react";

export type SheetFilterKey = string;

export type FilterPanelConfig<
    TFilter extends Record<string, unknown>,
    TKey extends keyof TFilter & SheetFilterKey = keyof TFilter & SheetFilterKey
> = {
    key: TKey;
    title: String;
    render: (
        value: TFilter[TKey],
        onChange: (value: TFilter[TKey]) => void,
        from?: any,
        to?: any,
        setFrom?: any,
        setTo?: any
    ) => React.ReactNode;
};

export type FilterSheetProps<TFilters extends Record<string, unknown>> = {
    open: boolean;
    activeKey: (keyof TFilters & SheetFilterKey) | null;
    filters: TFilters;
    panels: FilterPanelConfig<TFilters, any>[];
    onClose: () => void;
    onApply: (patch: Partial<TFilters>) => void;
    refetch: () => void;
};

export type DraftAction<TFilters> =
    | { type: "RESET"; payload: TFilters }
    | { type: "SET"; key: keyof TFilters; value: TFilters[keyof TFilters] };

const draftReducer = <TFilters extends Record<string, unknown>>(
    state: TFilters,
    action: DraftAction<TFilters>
): TFilters => {
    switch (action.type) {
        case "RESET": return action.payload;
        case "SET": return { ...state, [action.key]: action.value }
    };
};

const FilterSheet = <TFilters extends Record<string, unknown>,>({
    open,
    activeKey,
    filters,
    panels,
    onClose,
    onApply,
    refetch
}: FilterSheetProps<TFilters>) => {

    const [visible, setVisible] = useState(false);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [draft, dispatch] = useReducer(
        draftReducer as React.Reducer<TFilters, DraftAction<TFilters>>,
        filters
    );

    const activePanel = useMemo(
        () => panels.find(p => p.key === activeKey) ?? null,
        [panels, activeKey]
    );

    const handleChange = useCallback(
        (key: keyof TFilters, value: TFilters[keyof TFilters]) => {
            dispatch({ type: "SET", key, value });
        }, []
    );

    const handleApply = useCallback(() => {
        if (!activeKey) return;

        onApply({ [activeKey]: draft[activeKey] } as Partial<TFilters>);
        onClose();
        refetch();
    }, [activeKey, draft, onApply, onClose]);

    const handleCancel = useCallback(() => {
        dispatch({ type: "RESET", payload: filters });
        onClose();
    }, [filters, onClose]);

    useEffect(() => {
        if (open) {
            dispatch({ type: "RESET", payload: filters });
            setVisible(true);
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        } else {
            closeTimerRef.current = setTimeout(() => setVisible(false), 320);
        }

        return () => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, [open]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    if (!visible || !activePanel) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-end transition-colors duration-300
                ${open ? "bg-black/50 backdrop-blur-sm" : "bg-transparent pointer-events-none"}`}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className={`w-full bg-surface rounded-t-2xl flex flex-col
                    transition-transform duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)]
                    ${open ? "translate-y-0" : "translate-y-full"}`}
                style={{ height: "80vh" }}
            >
                {/* Drag handle */}
                <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mt-3 mb-1 flex-shrink-0" />

                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-border">
                    <h2 className="text-lg font-semibold text-slate-200">
                        {activePanel.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-slate-200"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-h-0 px-4 py-2">
                    {activePanel.render(
                        draft[activePanel.key] as any,
                        (value) => handleChange(activePanel.key, value)
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 flex gap-3 px-4 py-3 border-t border-slate-800">
                    <button
                        onClick={handleCancel}
                        className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-medium hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 py-2.5 rounded-xl bg-green-500 text-black text-sm font-semibold hover:bg-green-400 active:scale-95 transition-all"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    )
};

export default FilterSheet;