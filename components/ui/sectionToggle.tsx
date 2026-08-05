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
            <p className="text-text-secondary">{title} (optional)</p>

            <button
                type="button"
                onClick={onToggle}
                className="text-text-muted hover:text-text-primary"
            >
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
        </div>
    );
}