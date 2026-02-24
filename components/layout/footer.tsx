"use client";

import Link from "next/link";
import { memo } from "react";
import { usePathname } from "next/navigation";
import {
    ClipboardMinus,
    HandCoins,
    Layers2,
    LayoutDashboard,
    Wallet,
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/budget", label: "Budget", icon: <HandCoins size={20} /> },
    { href: "/wallet", label: "Wallet", icon: <Wallet size={20} /> },
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/category", label: "Category", icon: <Layers2 size={20} /> },
    { href: "/report", label: "Report", icon: <ClipboardMinus size={20} /> },
];

const vibrate = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(10); // 10ms subtle tap
    }
};

const Footer = memo(() => {
    const pathname = usePathname();

    return (
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
                            className={`footer-item ${active ? "active" : ""} ${index === 2 ? "pt-9" : ""
                                }`}
                        >
                            <span className="icon">{item.icon}</span>
                            <span className="label">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <Link href="/transaction" className="fab" onClick={vibrate}>
                +
            </Link>
        </footer>
    );
});

Footer.displayName = "Footer";

export default Footer;