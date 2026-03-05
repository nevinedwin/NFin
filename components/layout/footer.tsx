"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    ClipboardMinus,
    HandCoins,
    Layers2,
    LayoutDashboard,
    Wallet,
    X,
} from "lucide-react";
import CloseButton from "../ui/closeButton";
import TransactionCard from "../transaction/transactionCard";
import { TransactionAccountType, TransactionCategoryType } from "@/types/transaction";

const NAV_ITEMS = [
    { href: "/budget", label: "Budget", icon: <HandCoins size={20} /> },
    { href: "/wallet", label: "Wallet", icon: <Wallet size={20} /> },
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/category", label: "Category", icon: <Layers2 size={20} /> },
    { href: "/report", label: "Report", icon: <ClipboardMinus size={20} /> },
];

const vibrate = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(10);
    }
};

type FooterProp = {
    accounts: TransactionAccountType[],
    category: TransactionCategoryType[],
    open: boolean,
    toggle: () => void
}

const Footer = memo(({ accounts, category, toggle, open }: FooterProp) => {
    const pathname = usePathname();

    const handleLinkCLick = () => {
        vibrate()
        open && toggle();
    };

    return (
        <>
            {/* Backdrop */}
            

            {/* Footer */}
            <footer className="footer">
                <div className="footer-curve" />

                <nav className="footer-nav">
                    {NAV_ITEMS.map((item, index) => {
                        const active = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleLinkCLick}
                                className={`footer-item  transform transition-transform duration-300 ease-out  ${active ? "active" : ""} ${index === 2 && !open ? "translate-y-4 scale-105" : "translate-y-0"
                                    }`}
                            >
                                <span className="icon">{item.icon}</span>
                                <span className="label">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* FAB */}
                <button
                    onClick={toggle}
                    disabled={open}
                    className={`fab transition-all duration-300${open ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}>
                    +
                </button>
            </footer>
        </>
    );
});

Footer.displayName = "Footer";
export default Footer;
