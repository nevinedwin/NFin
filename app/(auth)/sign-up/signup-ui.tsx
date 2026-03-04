"use client"

import React, { useState } from 'react'
import SignupLogo from '../../../components/ui/signupLogo'
import { SIGNUP_DATA } from '../../constants'
import SignupForm from './signupForm'
import LoginForm from './loginForm'


const SignupUI = () => {

    const [showSignup, setShowSignup] = useState<boolean>(false);

    const handleClick = () => {
        setShowSignup(prev => !prev);
    }

    return (
        <div className="min-h-dvh bg-background flex flex-col">

            {/* Top Branding (40%) */}
            <div className="h-[42vh] flex items-center justify-center px-6 text-center">
                <SignupLogo
                    title={SIGNUP_DATA.TITLE}
                    subtitle={SIGNUP_DATA.SUBTITLE}
                />
            </div>

            <div className="
                flex-1
                rounded-t-[2.5rem]
                border-t border-border
                bg-surface
                shadow-2xl
                px-6
                pt-4
                relative
                overflow-hidden"
            >
                <div className="absolute inset-0 pointer-events-none">
                    <div className="
                        absolute -top-24 left-1/2 -translate-x-1/2
                        w-[380px] h-[380px]
                        bg-secondary/20
                        blur-3xl
                        rounded-full
                    " />
                </div>
                {
                    showSignup ? <SignupForm handleClick={handleClick} /> : <LoginForm handleClick={handleClick} />
                }

            </div>
        </div>
    )
}

export default SignupUI;