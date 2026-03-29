"use client"

import { ArrowLeft, ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BackArrowButtonProps = {
    fallBackHref?: string;
    label?: string;
    className?: string;
    onBack?: () => void;
    size?: number;
    href?: string;
}

export const BackArrowButton = ({ className, href, fallBackHref = '/dashboard', label, onBack, size = 15 }: BackArrowButtonProps) => {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        setLoading(true);
        if (onBack) {
            onBack();
        } else if (href) {
            router.replace(href);
        } else if (window.history.length > 1) {
            router.back();
        } else {
            router.replace(fallBackHref!);
        }
        setLoading(false);
    }

    return (
        <button
            onClick={handleBack}
            className={`flex items-center gap-2 ${className}`}
        >
            {loading ? <Loader2 size={size} /> : <ChevronLeft size={size} className="active:text-black"/>}
            {label && <span>{label}</span>}
        </button>
    );
};

export default BackArrowButton;