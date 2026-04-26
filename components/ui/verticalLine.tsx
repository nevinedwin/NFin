'use client';
import React from 'react';

type VerticalLineProps = {
    isBlueLine?: boolean;
};

const VerticalLine = ({ isBlueLine = false }: VerticalLineProps) => {
    return (
        <div className='h-full relative w-[6px] flex justify-center'>
            <div className="h-full w-px bg-gray-700" />
            {isBlueLine && (
                <div className='absolute top-0 left-1/2 -translate-x-1/2 bg-blue-700 h-20 w-[4px] rounded-b-lg' />
            )}
        </div>
    );
};

export default VerticalLine;