"use client";

import React from "react";
import clsx from "clsx";

type TooltipProps = {
    label: string;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    className?: string;
};

export default function Tooltip({
    label,
    children,
    side = "bottom",
    className,
}: TooltipProps) {
    const positionStyles = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    return (
        <div className={clsx("relative inline-flex group", className)}>
            {children}

            <span
                className={clsx(
                    "absolute z-50 whitespace-nowrap",
                    positionStyles[side],
                    "opacity-0 scale-95 translate-y-1",
                    "group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0",
                    "transition-all duration-200 ease-out",
                    "pointer-events-none",
                    "bg-surface border border-border",
                    "text-text-primary text-xs",
                    "px-2 py-1 rounded-md shadow-xl"
                )}
                role="tooltip"
            >
                {label}
            </span>
        </div>
    );
}