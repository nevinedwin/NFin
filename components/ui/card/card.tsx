import clsx from "clsx";
import React from "react"

type CardProps = {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export const Card = ({ children, className, hover = true }: CardProps) => {
    return (
        <div
            className={clsx(
                "rounded-2xl border border-border",
                "shadow-sm",
                "transition-all duration-300",
                hover && "hover:shadow-md hover:-translate-y-[2px]",
                "will-change-transform",
                className
            )}
        >
            {children}
        </div>
    )
}