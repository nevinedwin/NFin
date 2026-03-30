import { Search, X } from 'lucide-react';
import React, { useState } from 'react'

type SearchInputProp = {
    name: string;
    label?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    value: string;
    disabled?: boolean;
    className?: string
};

const SearchInput = ({ name, label, onChange, placeholder, value, disabled, className }: SearchInputProp) => {

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm mb-1 text-slate-400"
                >
                    {label}
                </label>
            )}
            <div className='w-full relative'>
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={15}
                />
                <input
                    id={name}
                    name={name}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange?.(e.target.value)}
                    className={`
                        w-full 
                        px-3 pl-8 py-2 pr-10 
                        bg-surface  rounded-3xl text-white 
                        focus:outline-none focus:ring-1 focus:ring-blue-500 
                        placeholder:text-md placeholder:font-semibold placeholder:text-slate-400
                        disabled:opacity-50 disabled:cursor-not-allowed 
                        ${className}
                    `}
                />
                {value && <div
                    className='z-50 absolute right-3 top-1/2 -translate-y-1/2'
                    onClick={() => {
                        onChange?.('')
                    }}
                >
                    <X
                        size={25}
                        className=' text-slate-400 pointer-events-none'
                    />
                </div>}
            </div>
        </div >
    );
};

SearchInput.displayName = 'SearchInput';

export default SearchInput;