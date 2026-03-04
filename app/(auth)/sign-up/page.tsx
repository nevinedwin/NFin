
import React from 'react'
import { redirect } from 'next/navigation'
import SignupUI from './signup-ui'
import { getServerUser } from '@/lib/auth.server';

const SignUpPage = async () => {

    const user = await getServerUser();

    if (user) redirect('/dashboard')

    return <SignupUI />
}

export default SignUpPage