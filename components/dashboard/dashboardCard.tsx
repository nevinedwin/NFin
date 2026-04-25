import React from 'react'
import HorizontalLine from '../ui/horizontalLine';

type DashboardCardProps = {
    headerContent: React.ReactNode;
    content: React.ReactNode;
}

const DashboardCard = ({ content, headerContent }: DashboardCardProps) => {
    return (
        <div className='w-full h-full bg-surface py-2 rounded-3xl'>
            {headerContent}
            <HorizontalLine isBlueLine={true} />
            <div className='flex-1 min-h-0 overflow-hidden'>
                {content}
            </div>
        </div>
    )
}

export default DashboardCard