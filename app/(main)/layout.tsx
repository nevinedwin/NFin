"use client";

import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";

const FOOTER_HEIGHT = 80;
const FOOTER_PEEK = 30;
const SCROLL_THRESHOLD = 20;

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const mainRef = useRef<HTMLElement | null>(null);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const hideFooterRef = useRef(false);

    const [hideFooter, setHideFooter] = useState(false);

    useEffect(() => {
        const el = mainRef.current;
        if (!el) return;

        const update = () => {
            const current = el.scrollTop;
            const diff = current - lastScrollY.current;

            if (Math.abs(diff) > SCROLL_THRESHOLD) {
                const shouldHide = diff > 0;

                if (hideFooterRef.current !== shouldHide) {
                    hideFooterRef.current = shouldHide;
                    setHideFooter(shouldHide);
                }

                lastScrollY.current = current;
            }

            ticking.current = false;
        };

        const onScroll = () => {
            if (!ticking.current) {
                requestAnimationFrame(update);
                ticking.current = true;
            }
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="h-dvh flex flex-col overflow-hidden relative">

            {/* Header */}
            <header className="h-[50px] shrink-0 shadow z-10">
                <Header />
            </header>

            {/* Main */}
            <main
                ref={mainRef}
                className="flex-1 overflow-y-auto py-1 overscroll-contain"
                style={{ paddingBottom: FOOTER_HEIGHT }}
            >
                {children}
            </main>

            {/* Footer */}
            <footer
                style={{
                    height: FOOTER_HEIGHT,
                    transform: hideFooter
                        ? `translateY(${FOOTER_HEIGHT - FOOTER_PEEK}px)`
                        : "translateY(0px)",
                }}
                className="absolute bottom-0 left-0 right-0 bg-surface shadow-inner
                   transition-transform duration-500
                   ease-[cubic-bezier(0.22,1,0.36,1)]
                   will-change-transform"
            >
                <Footer />
            </footer>
        </div>
    );
}