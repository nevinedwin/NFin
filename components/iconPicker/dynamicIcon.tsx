"use client";

import { icons } from "lucide-react";
import { LucideProps } from "lucide-react";

export default function DynamicIcon({ name }: { name?: string }) {
    if (!name) return null;

    const Icon = icons[name as keyof typeof icons] as React.ComponentType<LucideProps>;

    if (!Icon) return null;

    return (
        <div className="w-full flex">
            <button type="button" disabled className="flex gap-3">Selected Icon: <Icon size={25} className="w-10 h-10" /></button>
        </div>
    )
}