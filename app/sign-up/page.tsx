import React from 'react'
import SignupLogo from '../components/signupLogo'
import { SIGNUP_DATA } from '../constants'
import { Formik } from 'formik'

const SignUp = () => {
    return (
        <div className='w-full h-screen text-white'>
            <div className='h-[40%] flex items-center justify-center'>
                <SignupLogo title={SIGNUP_DATA.TITLE} subtitle={SIGNUP_DATA.SUBTITLE} />
            </div>
            <div className='bg-black rounded-t-[10%] h-[60%]'>
                <div className='flex h-full items-center justify-center'>
                    Nevin Finance App
                </div>
            </div>
        </div>
    )
}

export default SignUp