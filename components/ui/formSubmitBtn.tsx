import React from 'react'
import clsx from 'clsx';
import LoaderButton from './loaderButton';

type FormSubmitBtnProp = {
    className?: string;
    label: string;
    type: "button" | "submit" | "reset";
    disabled?: boolean;
    pending?: any;
}

const FormSubmitBtn = ({ className, label, type = 'button', disabled = false, pending }: FormSubmitBtnProp) => {
    return (
        <button
            type={type}
            disabled={disabled}
            className={clsx(
                "w-full h-12",
                "rounded-xl bg-slate-300 text-black",
                "transition-all duration-300 hover:scale-[1.02] active:scale-95",
                className
            )}>
            {pending ? <LoaderButton className='' /> : label}
        </button>
    )
}

export default FormSubmitBtn