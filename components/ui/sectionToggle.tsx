'use client';

import { ChevronDown, ChevronUp } from "lucide-react";

export default function SectionToggle({
    title,
    open,
    onToggle
}: {
    title: string;
    open: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="flex items-center justify-between pt-4">
            <p className="text-slate-300">{title} (optional)</p>

            <button
                type="button"
                onClick={onToggle}
                className="text-slate-400 hover:text-white"
            >
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
        </div>
    );
}