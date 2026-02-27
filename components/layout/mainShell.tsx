"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import { TransactionAccountType, TransactionCategoryType } from "@/types/transaction";
import { MainShellProvider } from "@/app/(main)/context/mainShellContext";
import TopLoader from "../ui/topLoader";
import { usePathname } from "next/navigation";

const FOOTER_HEIGHT = 80;
const FOOTER_PEEK = 30;
const SCROLL_THRESHOLD = 10;

type MainShellProp = {
    children: React.ReactNode;
    accounts: TransactionAccountType[],
    category: TransactionCategoryType[]
};

const MainShell = ({ children, accounts, category }: MainShellProp) => {
    const pathname = usePathname();

    const mainRef = useRef<HTMLElement | null>(null);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const hideFooterRef = useRef(false);

    const [hideFooter, setHideFooter] = useState<boolean>(false);
    const [openTransactionCard, setOpenTransactionCard] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const vibrate = useCallback(() => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(10);
        }
    }, []);

    const toggleTransactionCard = useCallback(() => {
        vibrate();
        setOpenTransactionCard(prev => !prev);
    }, [vibrate]);

    const closeTransactionCard = useCallback(() => {
        setOpenTransactionCard(false);
    }, []);

    const startLoading = () => {
        setLoading(true);
    };

    const stopLoading = () => {
        setLoading(false);
    };

    
    useEffect(() => {
        startLoading()
        const timeout = setTimeout(() => {
            stopLoading()
        }, 400);
        return () => clearTimeout(timeout);
    }, [pathname]);

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

    const contextValue = useMemo(() => ({
        openTransactionCard,
        toggleTransactionCard,
        closeTransactionCard,
        accounts,
        category,
        loading,
        startLoading,
        stopLoading

    }), [
        openTransactionCard,
        toggleTransactionCard,
        closeTransactionCard,
        accounts,
        category,
        loading,
        startLoading,
        stopLoading
    ])

    return (
        <MainShellProvider value={contextValue}>

            <div className="h-dvh flex flex-col overflow-hidden relative">

                {/* Header */}
                <header className="h-[50px] shrink-0 z-10">
                    <Header />
                </header>
                <TopLoader loading={loading} />

                {/* Main */}
                <main
                    ref={mainRef}
                    className="flex-1 overflow-y-auto overscroll-none"
                    style={{ paddingBottom: FOOTER_HEIGHT }}
                    onClick={() => openTransactionCard && closeTransactionCard()}
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
                    className="absolute bottom-0 left-0 right-0 bg-bar shadow-inner
                   transition-transform duration-500
                   ease-[cubic-bezier(0.22,1,0.36,1)]
                   will-change-transform"
                >
                    <Footer
                        accounts={accounts}
                        category={category}
                        toggle={toggleTransactionCard}
                        open={openTransactionCard}
                    />
                </footer>
            </div>
        </MainShellProvider>

    );
}

export default MainShell