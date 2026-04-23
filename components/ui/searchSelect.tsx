"use client";

import { TransactionType } from "@/generated/prisma/client";
import useDebounceValue from "@/hooks/useDebounceValue";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Loader2 } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

type Option = {
  label: string;
  value: string;
};

export type SearchSelectRef = {
  focus: () => void;
  clear?: () => void;
  open?: () => void;
};

type Props<T, D> = {
  name: string;
  label?: string;
  placeholder?: string;

  method: (params: {
    search: string;
    cursor: T | null;
    take: number
  }) => Promise<{
    data: D[];
    nextCursor: T | null;
  }>;
  mapOption?: (item: D) => Option;

  type?: TransactionType | null;

  onChange?: (val: string, label: string) => void;
  onSelect?: () => void;
  value?: string;
  key: string;
  displayValue: string;
};

const SearchSelect = forwardRef<SearchSelectRef, Props<any, any>>(({
  name,
  label,
  placeholder = "Search...",
  displayValue = '',

  type,
  method,
  mapOption,

  onChange,
  onSelect,
  value = '',
  key = ''
}, ref) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(value);
  const [query, setQuery] = useState(displayValue || '');

  const debouncedQuery = useDebounceValue(query, 400);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  useEffect(() => {
    setId(value || '');
    setQuery(displayValue || '');
  }, [value, displayValue]);

  const {
    data,
    loading,
    scrollElementRef,
    refetch
  } = useInfiniteScroll({
    query: debouncedQuery,
    action: method,
    size: 10,
    format: (prev, incoming) => {
      const ids = new Set(prev.map((item: any) => item.id));
      return [...prev, ...incoming.filter((item: any) => !ids.has(item.id))];
    },
    extraParams: { filters: { type } }
  });

  let options = data;
  if (mapOption) {
    options = data.map(mapOption);
  };

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full" key={key}>

      {label && (
        <label className="block text-sm mb-1 text-slate-400">
          {label}
        </label>
      )}

      <div className="relative">

        <input
          type="text"
          placeholder={placeholder}
          value={query}
          ref={inputRef}
          onFocus={() => {
            if (!open) setOpen(true);
          }}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 pr-10 bg-black border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-xs"
        />

        {/* loader */}
        {/* {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )} */}

      </div>

      {open && (
        <div className="absolute h-[110px] z-50 w-full mt-1 bg-black border border-slate-700 rounded-lg max-h-60 overflow-y-auto">

          {options.map((opt, index) => {

            if (options.length - 2 === index + 1) {
              return (
                <div
                  ref={scrollElementRef}
                  key={opt.value}
                  className="px-3 py-2 hover:bg-slate-800 cursor-pointer"
                  onClick={() => {
                    setQuery(opt.label);
                    setId(opt.value);
                    setOpen(false);
                    onChange?.(opt.value, opt.label);
                    onSelect?.();
                  }}
                >
                  {opt.label}
                </div>
              )
            } else {
              return (
                <div
                  key={opt.value}
                  className="px-3 py-2 hover:bg-slate-800 cursor-pointer"
                  onClick={() => {
                    setQuery(opt.label);
                    setId(opt.value);
                    setOpen(false);
                    onChange?.(opt.value, opt.label);
                    onSelect?.();
                  }}
                >
                  {opt.label}
                </div>
              )
            }
          })}
          {!loading && options.length === 0 && (
            <div className="p-2 text-sm text-slate-500">
              No results
            </div>
          )}
          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin" />
            </div>
          )}
        </div>
      )}

      <input type="hidden" name={name} value={id || ""} />

    </div>
  );
});

export default SearchSelect;