import clsx from 'clsx';
import React from 'react'

type CardContentProps = {
    children: React.ReactNode;
    className?: string
}

const CardContent = ({ children, className }: CardContentProps) => {
    return (
        <div className={clsx("px-4 py-2", className)}>
            {children}
        </div>
    )
}

export default CardContent;