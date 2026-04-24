'use client';

import React from 'react';
import { Plus } from 'lucide-react';

type AddButtonProps = {
    onClick: () => void;
    label: string;
}

const Addbutton = ({ onClick, label }: AddButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="
                        flex items-center gap-2
                        bg-white text-black font-semibold
                        px-3 py-2 rounded-md
                        shadow-md transition-all duration-200
                        active:scale-95
                    "
        >
            <Plus size={18} />
            <span className='text-xs'>
                {label}
            </span>
        </button>
    )
};

export default Addbutton;
Addbutton.displayName = "AddButton";