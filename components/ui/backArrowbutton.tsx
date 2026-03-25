"use client"

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type BackArrowButtonProps = {
    fallBackHref?: string;
    label?: string;
    className?: string;
    onBack?: () => void;
    size?: number;
}

export const BackArrowButton = ({ className, fallBackHref = '/dashboard', label, onBack, size = 15 }: BackArrowButtonProps) => {

    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (window.history.length > 1) {
            router.back();
        } else {
            router.push(fallBackHref!);
        }
    }

    return (
        <button
            onClick={handleBack}
            className={`flex items-center gap-2 ${className}`}
        >
            <ArrowLeft size={size} />
            {label && <span>{label}</span>}
        </button>
    );
};

export default BackArrowButton;