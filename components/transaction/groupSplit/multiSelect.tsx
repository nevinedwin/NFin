"use client";
import { useState, memo, useCallback } from "react";
import { Check, Loader2 } from "lucide-react";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import useDebounceValue from "@/hooks/useDebounceValue";
import SearchInput from "@/components/ui/searchInput";

type MultiSelectProps<T> = {
    value: T[];
    onChange: (val: T[]) => void;
    fetcher: any;
    mapOption: (item: any) => T;
    getKey: (item: T) => string;
    /** Render content inside the row button (left + right controls) */
    renderItem?: (item: T, selected: boolean) => React.ReactNode;
    searchPlaceholder?: string;
    extraParams?: any;
};

function MultiSelectInner<T>({
    value,
    onChange,
    fetcher,
    mapOption,
    getKey,
    renderItem,
    searchPlaceholder = "Search...",
    extraParams = {},
}: MultiSelectProps<T>) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounceValue(query, 400);

    const { data, loading, scrollElementRef } = useInfiniteScroll<any, any>({
        query: debouncedQuery,
        action: fetcher,
        size: 10,
        format: (prev: any[], incoming: any[]) => {
            const ids = new Set(prev.map((i) => i.id));
            return [...prev, ...incoming.filter((i) => !ids.has(i.id))];
        },
        extraParams,
    });

    const options: T[] = data.map(mapOption);

    const isSelected = useCallback(
        (item: T) => value.some((v) => getKey(v) === getKey(item)),
        [value, getKey]
    );

    const toggle = useCallback(
        (item: T) => {
            const exists = value.some((v) => getKey(v) === getKey(item));
            if (exists) {
                onChange(value.filter((v) => getKey(v) !== getKey(item)));
            } else {
                onChange([...value, item]);
            }
        },
        [value, getKey, onChange]
    );

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex-shrink-0 pt-2">
                <SearchInput
                    name="multi-search"
                    placeholder={searchPlaceholder}
                    value={query}
                    onChange={setQuery}
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                <ul className="flex flex-col gap-1 py-1">
                    {options.map((item, index) => {
                        const selected = isSelected(item);
                        return (
                            <li
                                key={getKey(item)}
                                ref={options.length - 3 === index + 1 ? scrollElementRef : null}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(item)}
                                    className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl
                    transition-colors duration-150
                    ${selected ? "bg-green-500/10" : "hover:bg-slate-800/60"}
                  `}
                                >
                                    {/* Checkbox */}
                                    <div className="flex-shrink-0 mr-3">
                                        <div
                                            className={`w-5 h-5 border-2 rounded flex items-center justify-center
                      ${selected ? "bg-green-500 border-green-500" : "border-slate-600"}`}
                                        >
                                            {selected && (
                                                <Check size={11} strokeWidth={3} className="text-black" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Custom render OR default */}
                                    <div className="flex-1 min-w-0">
                                        {renderItem ? (
                                            renderItem(item, selected)
                                        ) : (
                                            <span className={selected ? "text-green-400" : "text-white"}>
                                                {(item as any).name}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </li>
                        );
                    })}

                    {loading && (
                        <div className="flex justify-center py-4">
                            <Loader2 className="animate-spin" />
                        </div>
                    )}
                    {!loading && options.length === 0 && (
                        <div className="text-center text-slate-500 py-10">No data found</div>
                    )}
                </ul>
            </div>
        </div>
    );
}

// Generic components can't use React.memo directly with TypeScript generics,
// so we cast after memo.
const MultiSelect = MultiSelectInner as typeof MultiSelectInner;
export default MultiSelect;