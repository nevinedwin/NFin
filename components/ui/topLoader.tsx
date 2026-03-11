"use client";

import React, { useEffect, useState } from 'react'

type TopLoaderProp = {
    loading: boolean;
};

const TopLoader = ({ loading }: TopLoaderProp) => {

    const [visible, setVisible] = useState<boolean>(true);

    useEffect(() => {
        if (loading) {
            setVisible(true);
        } else {
            const timeOut = setTimeout(() => {
                setVisible(false)
            }, 300);
            return () => clearTimeout(timeOut);
        }

    }, [loading]);

    return (
        visible && <div className="absolute top-[0px] right-0 left-0 w-full overflow-hidden pointer-events-none z-100">
            <div className="w-full h-[0.5] bg-black overflow-hidden">
                <div className="h-full w-full bg-white rounded-full animate-[progress_1.8s_ease-in-out_infinite]"></div>
            </div>


            <style jsx>{`
                @keyframes progress {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0%); }
                100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    )
}

export default TopLoader