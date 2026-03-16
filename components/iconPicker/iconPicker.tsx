"use client";

import { useEffect, useRef, useState } from "react";
import { icons } from "lucide-react";
import { LucideProps } from "lucide-react";
import Input from "../ui/input";
import DynamicIcon from "./dynamicIcon";

type iconPickerProp = {
  onSelect: (icon: string) => void;
  name: string;
}

const PAGE_SIZE = 20;

export default function IconPicker({ onSelect, name }: iconPickerProp) {

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [icon, setIcon] = useState('');

  const iconEntries = Object.entries(icons)
    .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()));

  const visibleIcons = iconEntries.slice(0, visibleCount);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      const bottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 20;

      if (bottom) {
        setVisibleCount((prev) => prev + PAGE_SIZE);
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search]);

  return (
    <div className="w-full flex flex-col gap-4">

      <div className="space-y-4 border border-border p-4 rounded-lg">
        <Input
          type="text"
          name="icons"
          label="Category Icon"
          required
          requiredLabel
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search.."
          className="!bg-black !text-slate-400 h-8"
        />
        <div
          ref={containerRef}
          className="grid grid-cols-[repeat(auto-fill,40px)] justify-center gap-3 max-h-80 overflow-y-auto"
        >
          {visibleIcons.map(([name, Icon]) => {
            const LucideIcon = Icon as React.ComponentType<LucideProps>;

            return (
              <button
                key={name}
                type="button"
                onClick={(e) => { onSelect(name); setIcon(name) }}
                className="p-1 w-10 h-10 border border-border rounded-lg hover:bg-zinc-800 flex items-center justify-center"
              >
                <LucideIcon size={25} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex items-center gap-3">
          {icon && <DynamicIcon name={icon} />}
        </div>
      </div>
      {name && <input type="hidden" name={name} value={icon} />}
    </div>
  );
}