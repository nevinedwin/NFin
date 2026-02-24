'use client';

import { CookingPot } from 'lucide-react';
import React from 'react';

const UnderProgress = ({ title }: { title: string }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">

            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center animate-pulse">
                    <span className="text-3xl">
                        <CookingPot size={40} className='text-white'/>
                    </span>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-500 mb-2">
                {title} is cooking...
            </h1>

            <p className="text-slate-500 max-w-md mb-6">
                We’re crafting something awesome for you.
                Stay tuned for a little surprise ✨
            </p>

            <div className="w-64 h-2 bg-black rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-white rounded-full animate-[progress_1.8s_ease-in-out_infinite]"></div>
            </div>

            <p className="text-xs text-slate-400 mt-4">
                Work in progress • Thanks for your patience 💛
            </p>

            <style jsx>{`
                @keyframes progress {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0%); }
                100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default UnderProgress;