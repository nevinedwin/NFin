"use client";
import { memo, useEffect, useTransition, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    ClipboardMinus,
    HandCoins,
    Layers2,
    LayoutDashboard,
    Wallet,
} from "lucide-react";
import { AccountSafeType, TransactionCategoryType } from "@/types/transaction";
import LoaderButton from "../ui/loaderButton";

const NAV_ITEMS = [
    { href: "/budget", label: "Budget", icon: <HandCoins size={20} /> },
    { href: "/wallet", label: "Wallet", icon: <Wallet size={20} /> },
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/category", label: "Category", icon: <Layers2 size={20} /> },
    { href: "/report", label: "Report", icon: <ClipboardMinus size={20} /> },
] as const;

const PREFETCH_PATHS = ["/dashboard", "/wallet", "/category", "/budget", "/report"] as const;

const vibrate = () => navigator?.vibrate?.(10);

type FooterProps = {
    accounts: AccountSafeType[];
    category: TransactionCategoryType[];
    open: boolean;
    toggle: () => void;
};

const Footer = memo(({ toggle, open }: FooterProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [loadingPath, setLoadingPath] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!isPending) {
            setLoadingPath(null);
        }
    }, [isPending]);

    useEffect(() => {
        PREFETCH_PATHS.forEach((path) => router.prefetch(path));
    }, [router]);

    const handleLinkClick = (href: string) => {
        if (href === pathname || href === loadingPath) return;
        vibrate();
        setLoadingPath(href);
        if (open) toggle();
        startTransition(() => {
            router.push(href);
        });
    };

    if (!hydrated) return null;

    return (
        <footer className="footer">
            <div className="footer-curve" />
            <nav className="footer-nav">
                {NAV_ITEMS.map((item, index) => {
                    const isActive = pathname === item.href;
                    const isLoading = isPending && loadingPath === item.href;

                    return (
                        <button
                            key={item.href}
                            onClick={() => handleLinkClick(item.href)}
                            disabled={isPending}
                            className={[
                                "footer-item transform transition-transform duration-300 ease-out",
                                isActive ? "active" : "",
                                index === 2 && !open ? "translate-y-4 scale-105" : "translate-y-0",
                            ].join(" ")}
                        >
                            <span className="icon">
                                {isLoading
                                    ? <LoaderButton className="w-5 h-5" />
                                    : item.icon
                                }
                            </span>
                            <span className="label">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <button
                onClick={toggle}
                disabled={open}
                className={`fab transition-all duration-300 ${open ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
            >
                +
            </button>
        </footer>
    );
});

Footer.displayName = "Footer";
export default Footer;