
import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import SignupUI from './signup-ui'

const SignUpPage = async () => {

    const {userId} = await auth();

    if (userId) redirect('/dashboard')

    return <SignupUI/>
}

export default SignUpPage