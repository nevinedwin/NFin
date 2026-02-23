import clsx from 'clsx';
import React from 'react'

type CardHeaderProps = {
    children: React.ReactNode;
    className?: string
}

const CardHeader = ({ children, className }: CardHeaderProps) => {
    return (
        <div className={clsx("px-4 pt-4 pb-2", className)}>
            {children}
        </div>
    )
}

export default CardHeader;