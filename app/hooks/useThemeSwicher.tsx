'use client';
import React from 'react';

type ThemeMode = 'light' | 'dark';

const useThemeSwitcher = (): [ThemeMode, React.Dispatch<React.SetStateAction<ThemeMode>>] => {

    const preferDarkMediaQuery = "(prefer-color-scheme: dark)";
    const [mode, setMode] = React.useState<ThemeMode>((typeof window !== 'undefined' && (localStorage.getItem('theme') as ThemeMode)) || 'light');

    React.useEffect(() => {
        const mediaQuery = window.matchMedia(preferDarkMediaQuery);
        const userPref = window.localStorage.getItem("theme");

        const handleChange = () => {
            let check: ThemeMode;
            if (userPref) {
                check = userPref === 'dark' ? 'dark' : 'light';
            } else {
                check = mediaQuery.matches ? 'dark' : 'light';
            }

            setMode(check);

            if (check == 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        handleChange();

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    React.useEffect(() => {
        if (mode === 'dark') {
            window.localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark');
        }
        if (mode === 'light') {
            window.localStorage.setItem('theme', 'light');
            document.documentElement.classList.remove('dark');
        }
    }, [mode]);

    return [mode, setMode];
}

export default useThemeSwitcher