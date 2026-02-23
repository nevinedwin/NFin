"use client"

import React from 'react'
import SignupLogo from '../../../components/ui/signupLogo'
import { SIGNUP_DATA } from '../../constants'
import { SignUp } from "@clerk/clerk-react"


const SignupUI = () => {

    return (
        <div className="min-h-dvh bg-background flex flex-col">

            {/* Top Branding (40%) */}
            <div className="h-[42vh] flex items-center justify-center px-6 text-center">
                <SignupLogo
                    title={SIGNUP_DATA.TITLE}
                    subtitle={SIGNUP_DATA.SUBTITLE}
                />
            </div>

            <div className="flex-1
                rounded-t-[2.5rem]
                border-t border-border
                bg-surface
                shadow-2xl
                px-6
                pt-10
                pb-8
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

                <div className="relative z-10 flex flex-col items-center">

                    <h1 className="text-2xl font-semibold text-text-primary mb-1">
                        Create Account
                    </h1>

                    <p className="text-sm text-text-secondary mb-8">
                        Start your financial journey today ✨
                    </p>

                    <div className="w-full max-w-sm">
                        <SignUp
                            appearance={{
                                elements: {
                                    card: "bg-transparent shadow-none",
                                    form: "hidden",

                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",

                                    formFieldInput: "hidden",
                                    formFieldLabel: "hidden",
                                    formFieldHintText: "hidden",

                                    formButtonPrimary: "hidden",

                                    socialButtonsBlockButton:
                                        `bg-background
                                        border border-border
                                        text-text-primary
                                        hover:bg-primary
                                        hover:text-white
                                        transition-all duration-300
                                        rounded-xl
                                        h-11
                                        font-medium
                                        shadow-sm`,
                                    socialButtonsBlockButton__github: "hidden",
                                    socialButtonsBlockButton__facebook: "hidden",

                                    dividerRow: "hidden",

                                    footer: "hidden",
                                    footerAction: "hidden",
                                    footerActionLink: "hidden",
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupUI;