import clsx from "clsx";
import React from "react";


type CardFooterProps = {
    children: React.ReactNode;
    className?: string
}


const CardFooter = ({ children, className }: CardFooterProps) => {
    return (
        <div
            className={clsx(
                "px-4 pt-2 pb-4 flex items-center justify-between",
                className
            )}
        >
            {children}
        </div>
    );
}

export default CardFooter;