import React, { forwardRef } from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    requiredLabel?: boolean;
    error?: string;
    containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, requiredLabel = false, error, containerClassName = '', className = '', ...props }, ref) => {

    const inputId = props.id;

    return (
        <div className={`flex flex-col ${containerClassName}`}>
            {
                label && (
                    <label htmlFor={inputId} className='text-slate-400 text-sm mb-1 font-medium'>
                        {label} {requiredLabel && <span className='text-red-500'>*</span>}
                    </label>
                )
            }
            <input
                id={inputId}
                ref={ref}
                className={`
                    rounded-xl
                    p-3
                    outline-none
                    bg-gray-50
                    text-gray-800
                    placeholder:text-gray-400
                    border border-gray-300
                    focus:border-gray-500
                    focus:ring-1 focus:ring-gray-500
                    transition-colors
                    duration-200 disabled:opacity-50
                    disabled:cursor-not-allowed
                    ${className}
                `}
                {...props}
            />
            {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
        </div>
    )
});

Input.displayName = 'Input';
export default Input