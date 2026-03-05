import { Eye, EyeClosed, EyeClosedIcon, EyeOff, LucideEyeClosed } from 'lucide-react';
import React, { forwardRef, useState } from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    requiredLabel?: boolean;
    error?: string;
    containerClassName?: string;
    isPassword?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ isPassword, label, requiredLabel = false, error, containerClassName = '', className = '', ...props }, ref) => {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const inputId = props.id;
    const inputType = isPassword ? (showPassword ? "text" : "password") : props.type;

    return (
        <div className={`flex flex-col ${containerClassName}`}>
            {
                label && (
                    <label htmlFor={inputId} className='text-slate-400 text-sm mb-1 font-medium'>
                        {label} {requiredLabel && <span className='text-red-500'>*</span>}
                    </label>
                )
            }
            <div className='relative w-full'>
                <input
                    id={inputId}
                    ref={ref}
                    type={inputType}
                    className={`
                    rounded-xl
                    w-full
                    p-3
                    outline-none
                    bg-white
                    text-black
                    placeholder:text-gray-400
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
                {isPassword && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? <EyeOff size={17} onClick={() => setShowPassword(!showPassword)} /> : <Eye size={17} onClick={() => setShowPassword(!showPassword)} />}
                    </button>
                )}
            </div>
            {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
        </div>
    )
});

Input.displayName = 'Input';
export default Input