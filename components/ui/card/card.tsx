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
                "rounded-[28px] border border-border bg-surface shadow-card",
                "transition-all duration-300",
                hover && "hover:shadow-[0_30px_70px_rgba(0,0,0,0.28)] hover:-translate-y-[1px]",
                "will-change-transform",
                className
            )}
        >
            {children}
        </div>
    )
}