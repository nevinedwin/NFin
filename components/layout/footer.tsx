"use client";

import { memo, useState, useCallback } from "react";
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
import TransactionCard from "../transaction/transactionCard";

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

const Footer = memo(() => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const toggle = useCallback(() => {
        vibrate();
        setOpen(prev => !prev);
    }, []);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
                    transition-opacity duration-300
                    ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={toggle}
            />

            {/* Expanding Panel */}
            <div
                className={`fixed bottom-20 z-50
                    transition-all duration-300 ease-out
                    ${open
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-90 translate-y-6 pointer-events-none"
                    }`}
            >
                <div className="w-[100vw] h-[480px] rounded-t-3xl bg-black  shadow-2xl p-5 text-slate-500">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-md font-semibold">New Transaction</h3>
                        <button onClick={toggle}>
                            <X size={20} />
                        </button>
                    </div>

                    <div >
                        <TransactionCard />
                    </div>
                </div>
            </div>

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
                                onClick={vibrate}
                                className={`footer-item  transform transition-transform duration-300 ease-out  ${active ? "active" : ""} ${index === 2 && !open ?  "translate-y-4 scale-105" : "translate-y-0"
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
