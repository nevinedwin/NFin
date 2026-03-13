"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import { TransactionAccountType, TransactionCategoryType } from "@/types/transaction";
import { MainShellProvider } from "@/app/(main)/context/mainShellContext";
import TopLoader from "../ui/topLoader";
import { usePathname } from "next/navigation";
import TransactionCard from "../transaction/transactionCard";
import CloseButton from "../ui/closeButton";
import { User } from "@/generated/prisma/client";

const FOOTER_HEIGHT = 80;
const FOOTER_PEEK = 30;
const SCROLL_THRESHOLD = 10;

type MainShellProp = {
    children: React.ReactNode;
    accounts: TransactionAccountType[],
    category: TransactionCategoryType[],
    userData: User | null
};

const MainShell = ({ children, accounts, category, userData }: MainShellProp) => {
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
        userData,
        loading,
        startLoading,
        stopLoading

    }), [
        openTransactionCard,
        toggleTransactionCard,
        closeTransactionCard,
        accounts,
        category,
        userData,
        loading,
        startLoading,
        stopLoading
    ])

    return (
        <MainShellProvider value={contextValue}>

            <div className="h-dvh flex flex-col overflow-hidden relative">

                {/* Header */}
                <header className="h-[50px] shrink-0 z-10" >
                    <Header loading={loading}/>
                </header>

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
                {!openTransactionCard && <footer
                    style={{
                        height: FOOTER_HEIGHT,
                        transform: hideFooter
                            ? `translateY(${FOOTER_HEIGHT - FOOTER_PEEK}px)`
                            : "translateY(0px)",
                    }}
                    className={`absolute bottom-0 left-0 right-0 bg-bar shadow-inner
                    transition-transform duration-500
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    will-change-transform`}
                >
                    <Footer
                        accounts={accounts}
                        category={category}
                        toggle={toggleTransactionCard}
                        open={openTransactionCard}
                    />
                </footer>}
                {openTransactionCard && <div>
                    <div
                        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
                    transition-opacity duration-300
                    ${openTransactionCard ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                        onClick={toggleTransactionCard}
                    />

                    {/* Expanding Panel */}
                    {
                        openTransactionCard && (
                            <div className={`fixed bottom-0 z-50 transition-all duration-300 ease-out`}>
                                <div className="flex justify-end items-center pr-6 bg-transparent">
                                    <CloseButton size={20} onClick={toggleTransactionCard} className="bg-black p-2 flex justify-center items-center rounded-full mb-1" />
                                </div>
                                <div className="w-[100vw]  h-[80vh] max-h-[650px] rounded-t-3xl bg-black shadow-2xl p-5 text-slate-500">
                                    <div className="flex justify-between items-center mb-4 bg-transparent">
                                        <h3 className="text-md font-semibold">New Transaction</h3>
                                        {/* <CloseButton size={20} onClick={toggle} /> */}
                                    </div>

                                    <TransactionCard
                                        accounts={accounts}
                                        category={category}
                                        closeFn={toggleTransactionCard}
                                    />
                                </div>
                            </div>
                        )
                    }
                </div>}
            </div>
        </MainShellProvider>

    );
}

export default MainShell