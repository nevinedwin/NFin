"use client";

import { icons } from "lucide-react";
import { LucideProps } from "lucide-react";

type CategoryIconProp = {
    name: string;
    className: string;
    containerClassName: string;
    disabled?: boolean;
}

export default function CategoryIcon({ name, className, containerClassName, disabled = true }: CategoryIconProp) {
    if (!name) return null;

    const Icon = icons[name as keyof typeof icons] as React.ComponentType<LucideProps>;

    if (!Icon) return null;

    return (
        <button type="button" disabled={disabled} className={`${containerClassName}`}><Icon size={10} className={`${className}`} /></button>
    )
}