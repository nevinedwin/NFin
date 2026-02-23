import React from "react";
import clsx from "clsx";

type CardSkeletonProps = {
    className?: string;
    lines?: number;
    showAvatar?: boolean;
};

export function CardSkeleton({
    className,
    lines = 3,
    showAvatar = false,
}: CardSkeletonProps) {
    return (
        <div
            className={clsx(
                "rounded-2xl bg-surface border border-border shadow-sm p-4",
                className
            )}
        >
            <div className="flex items-center gap-3 mb-4">
                {showAvatar && (
                    <div className="w-10 h-10 rounded-full skeleton shrink-0" />
                )}

                <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded-md skeleton" />
                    <div className="h-3 w-1/4 rounded-md skeleton" />
                </div>
            </div>

            <div className="space-y-2">
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "h-3 rounded-md skeleton",
                            i === lines - 1 ? "w-2/3" : "w-full"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}