import React from 'react'
import clsx from 'clsx';
import LoaderButton from './loaderButton';
import { useFormStatus } from 'react-dom';

type FormSubmitBtnProp = {
    className?: string;
    label: string;
    type: "button" | "submit" | "reset";
}

const FormSubmitBtn = ({ className, label, type = 'button' }: FormSubmitBtnProp) => {

    const { pending } = useFormStatus();

    return (
        <button
            type={type}
            disabled={pending}
            className={clsx(
                "w-full h-12",
                "rounded-xl bg-slate-300 text-black",
                "transition-all duration-300 hover:scale-[1.02] active:scale-95",
                "flex justify-center items-center",
                className
            )}>
            {pending ? <LoaderButton className='w-8 h-8' /> : label}
        </button>
    )
}

export default FormSubmitBtn