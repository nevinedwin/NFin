'use client';
import React from 'react';

type ThemeMode = 'light' | 'dark';

const useThemeSwitcher = (): [ThemeMode, React.Dispatch<React.SetStateAction<ThemeMode>>] => {

    const preferDarkMediaQuery = "(prefer-color-scheme: dark)";
    
    // Start with a neutral default - hydration will match
    const [mode, setMode] = React.useState<ThemeMode>('light');
    const [hydrated, setHydrated] = React.useState(false);

    React.useEffect(() => {
        // Only access localStorage after hydration
        const stored = localStorage.getItem('theme') as ThemeMode;
        if (stored) {
            setMode(stored);
        } else {
            const prefersDark = window.matchMedia(preferDarkMediaQuery).matches;
            setMode(prefersDark ? 'dark' : 'light');
        }
        setHydrated(true);
    }, [preferDarkMediaQuery]);

    React.useEffect(() => {
        if (!hydrated) return;
        
        if (mode === 'dark') {
            window.localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark');
        } else {
            window.localStorage.setItem('theme', 'light');
            document.documentElement.classList.remove('dark');
        }
    }, [mode, hydrated]);

    return [mode, setMode];
}

export default useThemeSwitcher