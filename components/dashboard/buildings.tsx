'use client';

import { useEffect, useState } from "react";

// Deterministic hash from string → number
const hashStr = (s: string): number =>
    s.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0xffffffff, 0);

// Pick from array deterministically
const pick = <T,>(arr: T[], seed: number): T => arr[Math.abs(seed) % arr.length];

const PALETTES = [
    { primary: '#60a5fa', secondary: '#bfdbfe', accent: '#1d4ed8', window: '#1e3a5f' },
    { primary: '#f87171', secondary: '#fecaca', accent: '#dc2626', window: '#7f1d1d' },
    { primary: '#34d399', secondary: '#6ee7b7', accent: '#059669', window: '#064e3b' },
    { primary: '#a78bfa', secondary: '#ddd6fe', accent: '#7c3aed', window: '#2e1065' },
    { primary: '#fbbf24', secondary: '#fde68a', accent: '#d97706', window: '#78350f' },
    { primary: '#fb7185', secondary: '#fecdd3', accent: '#be123c', window: '#4c0519' },
    { primary: '#38bdf8', secondary: '#bae6fd', accent: '#0284c7', window: '#0c4a6e' }
];

const BankBuilding = ({ name, isTotal }: { name: string; isTotal: boolean }) => {
    const seed = hashStr(name);
    const p: any = pick(PALETTES, seed);
    const style = isTotal ? 99 : Math.abs(seed >> 6) % 5;

    const W = 160, H = 220;

    <svg viewBox="0 0 90 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* City skyline for total */}
        <rect x="5" y="50" width="18" height="60" rx="1" fill="#bfdbfe" opacity="0.7" />
        <rect x="8" y="40" width="12" height="10" rx="1" fill="#93c5fd" opacity="0.8" />
        <rect x="30" y="30" width="28" height="80" rx="2" fill="#93c5fd" opacity="0.8" />
        <rect x="36" y="20" width="16" height="12" rx="1" fill="#60a5fa" opacity="0.9" />
        <rect x="43" y="12" width="2" height="10" fill="#3b82f6" />
        <rect x="62" y="45" width="22" height="65" rx="1" fill="#bfdbfe" opacity="0.7" />
        <rect x="65" y="35" width="16" height="12" rx="1" fill="#93c5fd" opacity="0.8" />
        {/* Windows */}
        {[0, 1, 2, 3].map(r => [0, 1, 2].map(c => (
            <rect key={`${r}-${c}`} x={33 + c * 8} y={35 + r * 12} width="4" height="6" rx="0.5" fill="#1d4ed8" opacity="0.3" />
        )))}
        {[0, 1, 2].map(r => [0, 1].map(c => (
            <rect key={`t${r}-${c}`} x={65 + c * 7} y={50 + r * 12} width="4" height="5" rx="0.5" fill="#1d4ed8" opacity="0.3" />
        )))}
        <rect x="0" y="108" width="90" height="2" rx="1" fill="#bfdbfe" opacity="0.5" />
    </svg>

    // Skyline (total)
    return (
        <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
                <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={p.accent} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={p.primary} stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={p.glow} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={p.secondary} stopOpacity="0.4" />
                </linearGradient>
            </defs>
            {/* Back buildings */}
            <rect x="0" y="80" width="30" height="140" fill="url(#sg2)" rx="2" />
            <rect x="130" y="60" width="30" height="160" fill="url(#sg2)" rx="2" />
            {/* Mid buildings */}
            <rect x="25" y="100" width="25" height="120" fill="url(#sg1)" rx="2" opacity="0.7" />
            <rect x="110" y="90" width="28" height="130" fill="url(#sg1)" rx="2" opacity="0.7" />
            {/* Main tall center */}
            <rect x="55" y="30" width="50" height="190" fill="url(#sg1)" rx="3" />
            <rect x="62" y="18" width="36" height="16" rx="2" fill={p.accent} opacity="0.9" />
            <rect x="78" y="4" width="4" height="16" fill={p.accent} />
            <circle cx="80" cy="4" r="3" fill={p.glow} />
            {/* Windows */}
            {[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => (
                <rect key={`cw${r}${c}`} x={65 + c * 8} y={65 + r * 12} width="4" height="6" rx="0.5" fill="#000" opacity="0.3" />
            )))}
            {[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => (
                <rect key={`cw${r}${c}`} x={65 + c * 8} y={115 + r * 12} width="4" height="6" rx="0.5" fill="#000" opacity="0.3" />
            )))}
            {[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => (
                <rect key={`cw${r}${c}`} x={65 + c * 8} y={165 + r * 12} width="4" height="6" rx="0.5" fill="#000" opacity="0.3" />
            )))}
            

            {[0, 1, 2, 3].map(r => [0, 1, 2].map(c => (
                <rect key={`cw${r}${c}`} x={28 + c * 8} y={125 + r * 12} width="4" height="6" rx="0.5" fill="#000" opacity="0.3" />
            )))}
            {[0, 1, 2, 3].map(r => [0, 1, 2].map(c => (
                <rect key={`cw${r}${c}`} x={114 + c * 8} y={125 + r * 12} width="4" height="6" rx="0.5" fill="#000" opacity="0.3" />
            )))}
            {[0, 1, 2, 3].map(r => [0, 1, 2].map(c => (
                <rect key={`cw${r}${c}`} x={28 + c * 8} y={173 + r * 12} width="4" height="6" rx="0.5" fill="#000" opacity="0.3" />
            )))}
            {[0, 1, 2, 3].map(r => [0, 1, 2].map(c => (
                <rect key={`cw${r}${c}`} x={114 + c * 8} y={173 + r * 12} width="4" height="6" rx="0.5" fill="#000" opacity="0.3" />
            )))}

            {[0, 1, 2].map(r => [0, 1, 2].map(c => (
                <rect key={`cw${r}${c}`} x={3 + c * 8} y={105 + r * 12} width="4" height="6" rx="0.5" fill="#fff" opacity="0.3" />
            )))}
            {[0, 1, 2].map(r => [0, 1, 2].map(c => (
                <rect key={`cw${r}${c}`} x={139 + c * 8} y={105 + r * 12} width="4" height="6" rx="0.5" fill="#fff" opacity="0.3" />
            )))}
            {[0, 1, 2].map(r => [0, 1, 2].map(c => (
                <rect key={`cw${r}${c}`} x={3 + c * 8} y={140 + r * 12} width="4" height="6" rx="0.5" fill="#fff" opacity="0.3" />
            )))}
            {[0, 1, 2].map(r => [0, 1, 2].map(c => (
                <rect key={`cw${r}${c}`} x={139 + c * 8} y={140 + r * 12} width="4" height="6" rx="0.5" fill="#fff" opacity="0.3" />
            )))}
                        {[0, 1, 2].map(r => [0, 1, 2].map(c => (
                <rect key={`cw${r}${c}`} x={3 + c * 8} y={175 + r * 12} width="4" height="6" rx="0.5" fill="#fff" opacity="0.3" />
            )))}
            {[0, 1, 2].map(r => [0, 1, 2].map(c => (
                <rect key={`cw${r}${c}`} x={139 + c * 8} y={175 + r * 12} width="4" height="6" rx="0.5" fill="#fff" opacity="0.3" />
            )))}

            {/* Bank name label */}
            {!isTotal && <text
                x={W / 2}
                y={H - 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="900"
                fontFamily="system-ui, sans-serif"
                fill="#000000"
                letterSpacing="1.5"
            >
                {name.toUpperCase()}
            </text>}
            <rect x="0" y="218" width={W} height="2" rx="1" fill={p.accent} opacity="0.3" />
        </svg>
    );
};

// Inject keyframes once
// Add this to your animStyles string:
export const animStyles = `
@keyframes floatY {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-5px); }
}
@keyframes buildingEnter {
    from { opacity: 0; transform: translateY(12px) scale(0.92); }
    to   { opacity: 1; transform: translateY(0px) scale(1); }
}
@keyframes buildingExit {
    from { opacity: 1; transform: translateY(0px) scale(1); }
    to   { opacity: 0; transform: translateY(-10px) scale(0.92); }
}
.bank-building {
    animation: floatY 3.5s ease-in-out infinite;
}
.building-enter {
    animation: buildingEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.building-exit {
    animation: buildingExit 0.25s ease-in forwards;
}
`;

// Separate animated building panel — sits OUTSIDE the scroll container
const BuildingPanel = ({ name, isTotal }: { name: string; isTotal: boolean }) => {
    const [displayName, setDisplayName] = useState(name);
    const [displayIsTotal, setDisplayIsTotal] = useState(isTotal);
    const [animClass, setAnimClass] = useState('building-enter');

    useEffect(() => {
        if (name === displayName) return;
        // Exit current
        setAnimClass('building-exit');
        const t = setTimeout(() => {
            // Swap content then enter
            setDisplayName(name);
            setDisplayIsTotal(isTotal);
            setAnimClass('building-enter');
        }, 250); // matches exit duration
        return () => clearTimeout(t);
    }, [name, isTotal]);

    return (
        <div
            className={`bank-building ${animClass} flex items-end justify-start`}
            style={{ width: '100px', height: '100%', flexShrink: 0, paddingRight: '20px' }}
        >
            <BankBuilding name={displayName} isTotal={displayIsTotal} />
        </div>
    );
};

export default BuildingPanel;