"use client"

import { useMainShellContext } from "@/app/(main)/context/mainShellContext";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

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

    const [isPending, startTransition] = useTransition();
    const { startLoading } = useMainShellContext();

    const handleBack = () => {
        startLoading();
        startTransition(() => {
            if (onBack) {
                onBack();
            } else if (href) {
                router.replace(href);
            } else if (window.history.length > 1) {
                router.back();
            } else {
                router.replace(fallBackHref!);
            }
        })
    }

    return (
        <button
            onClick={handleBack}
            className={`flex items-center gap-2 ${className}`}
        >
            <ChevronLeft size={size} className="active:text-black" />
            {label && <span>{label}</span>}
        </button>
    );
};

export default BackArrowButton;