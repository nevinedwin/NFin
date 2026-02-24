"use client";

import Link from "next/link";
import { memo } from "react";
import { usePathname } from "next/navigation";
import { ClipboardMinus, HandCoins, Layers2, LayoutDashboard, Wallet } from "lucide-react";

const NAV_ITEMS = [
    { href: "/budget", label: "Buget", icon: <HandCoins/>},
    { href: "/wallet", label: "Wallet", icon: <Wallet/> },
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard/> },
    { href: "/category", label: "Category", icon: <Layers2/> },
    { href: "/report", label: "Report", icon: <ClipboardMinus/> },
];  

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
                            className={`footer-item ${active ? "active" : ""} ${index === 2 && 'pt-9'}`}
                        >
                            <span className="icon">
                                {item.icon}
                            </span>
                            <span className="label">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <Link href="/transaction" className="fab">
                +
            </Link>
        </footer>
    );
});

Footer.displayName = "Footer";

export default Footer;