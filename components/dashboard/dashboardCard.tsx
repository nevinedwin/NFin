import React from 'react'
import HorizontalLine from '../ui/horizontalLine';

type DashboardCardProps = {
    headerContent?: React.ReactNode;
    content: React.ReactNode;
    needHeader?: boolean;
}

const DashboardCard = ({ content, headerContent, needHeader = true }: DashboardCardProps) => {
    return (
        <div className='w-full h-full bg-surface py-2 rounded-3xl'>
            {needHeader &&
                <>
                    {headerContent}
                    <HorizontalLine isBlueLine={true} />
                </> 
            }
            <div className='flex-1 min-h-0 overflow-hidden'>
                {content}
            </div>
        </div>
    )
}

export default DashboardCard