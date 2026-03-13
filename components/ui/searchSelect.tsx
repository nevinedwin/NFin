"use client";

import { TransactionType } from "@/generated/prisma/client";
import { useEffect, useRef, useState } from "react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  fetchUrl: string;
  label?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
  type?: TransactionType | null
};

export default function SearchSelect({
  name,
  fetchUrl,
  label,
  placeholder = "Search...",
  onChange,
  type
}: Props) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchOptions = async (type?: TransactionType | null, q?: string) => {

    setLoading(true);


    const params = new URLSearchParams();

    if (q) params.append("q", q);
    if (type) params.append("type", type);

    const url = `${fetchUrl}?${params.toString()}`;

    const res = await fetch(url);
    const data = await res.json();

    setOptions(data);
    setLoading(false);
  };

  // debounce search
  useEffect(() => {
    if (!open) return;

    const delay = setTimeout(() => {
      fetchOptions(type, query);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

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
    <div ref={wrapperRef} className="relative w-full">

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
          onFocus={() => {
            setOpen(true);
            fetchOptions(type); // load all
          }}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 pr-10 bg-black border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-xs"
        />

        {/* loader */}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

      </div>

      {open && (
        <div className="absolute h-[110px] z-50 w-full mt-1 bg-black border border-slate-700 rounded-lg max-h-60 overflow-y-auto">

          {loading && (
            <div className="p-2 text-sm text-slate-500">
              Loading...
            </div>
          )}

          {!loading && options.length === 0 && (
            <div className="p-2 text-sm text-slate-500">
              No results
            </div>
          )}

          {!loading && options.map((opt) => (
            <div
              key={opt.value}
              className="px-3 py-2 hover:bg-slate-800 cursor-pointer"
              onClick={() => {
                setQuery(opt.label);
                setOpen(false);
                onChange?.(opt.value);
              }}
            >
              {opt.label}
            </div>
          ))}

        </div>
      )}

      <input type="hidden" name={name} value={query} />

    </div>
  );
}