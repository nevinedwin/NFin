'use client';
import React from 'react'
import useThemeSwitcher from '../../hooks/useThemeSwicher';
import { MoonIcon, SunIcon } from '../ui/icons';

const Navbar = () => {

    const [mode, setMode] = useThemeSwitcher();

    return (
        <nav className=''>
            <button onClick={() => setMode(mode === "light" ? "dark" : "light")} className={`ml-3 flex items-center justify-center rounded-full p-1 ${mode === "light" ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
                {
                    mode === "dark" ? <SunIcon className={"fill-dark"} /> : <MoonIcon className={"fill-dark"} />
                }
            </button>
        </nav>
    )
}

export default Navbar;