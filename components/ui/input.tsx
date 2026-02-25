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
                    bg-border
                    text-gray-50
                    placeholder:text-gray-700
                    border border-gray-900

                    shadow-inner
                    shadow-black/60

                    active:shadow-sm              
                    active:translate-y-[1px]

                    transition-all duration-200
                    disabled:opacity-50
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