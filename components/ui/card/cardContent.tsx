import clsx from 'clsx';
import React from 'react'

type CardContentProps = {
    children: React.ReactNode;
    className?: string
}

const CardContent = ({ children, className }: CardContentProps) => {
    return (
        <div className={clsx("px-5 py-5", className)}>
            {children}
        </div>
    )
}

export default CardContent;