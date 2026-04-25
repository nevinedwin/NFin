'use client';

import React from 'react';

type HorizontalLineProps = {
    isBlueLine?: boolean;
};

const HorizontalLine = ({ isBlueLine = false }: HorizontalLineProps) => {
    return (
        <div className='w-full relative h-[6px] flex items-center'>
            <div className="w-full h-px bg-border" />
            {isBlueLine && (
                <div className='absolute left-4 bg-blue-700 h-[4px] w-20 rounded-t-lg' />
            )}
        </div>
    );
};

export default HorizontalLine;