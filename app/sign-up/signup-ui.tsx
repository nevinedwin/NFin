"use client"

import React from 'react'
import SignupLogo from '../components/signupLogo'
import { SIGNUP_DATA } from '../constants'
import { SignUp } from "@clerk/clerk-react"


const SignupUI = () => {

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">

            {/* Top Branding (40%) */}
            <div className="h-[40vh] flex items-center justify-center px-6 text-center">
                <SignupLogo
                    title={SIGNUP_DATA.TITLE}
                    subtitle={SIGNUP_DATA.SUBTITLE}
                />
            </div>

            <div className="h-[60vh] bg-gradient-to-b from-zinc-950 to-black rounded-t-[2.5rem] border-t border-zinc-800 shadow-2xl flex flex-col items-center justify-center">


                <h1 className="text-2xl font-semibold mb-1">
                    Create Account
                </h1>
                <p className="text-sm text-zinc-400 mb-6">
                    Start your financial journey today ✨
                </p>

                <SignUp
                    appearance={{
                        elements: {
                            /* Card */
                            card: "bg-transparent shadow-none",
                            form: "hidden",

                            /* Hide default header */
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",

                            /* Input fields (if shown) */
                            formFieldInput: "hidden",
                            formFieldLabel: "hidden",
                            formFieldHintText: "hidden",

                            /* Primary button */
                            formButtonPrimary: "hidden",

                            /* Social buttons */
                            socialButtonsBlockButton:
                                "bg-white text-black hover:text-white",

                            /* Show ONLY Google */
                            socialButtonsBlockButton__github: "hidden",
                            socialButtonsBlockButton__facebook: "hidden",

                            /* Remove divider */
                            dividerRow: "hidden",

                            /* Remove footer */
                            footer: "hidden",
                            footerAction: "hidden",
                            footerActionLink: "hidden",
                        },
                    }}
                />
            </div>
        </div>
    )
}

export default SignupUI;