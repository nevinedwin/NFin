"use client";

import { redirect } from "next/navigation";
import NavigationButton from "../components/navigationButton";

const Unauthorized = () => {

    const navigateToLogIn = () => {
        redirect("/sign-up");
    }


    return (
        <div className="flex h-screen items-center justify-center bg-black text-white">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Access Denied</h1>
                <p className="text-zinc-400 mt-2">
                    You are not authorized to log in.
                </p>
                <NavigationButton label={'Sign In'} handler={navigateToLogIn}/>
            </div>
        </div>
    )
}

export default Unauthorized;