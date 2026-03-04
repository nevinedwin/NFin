
import React from 'react'
import SignupUI from './authUI'
import { getCurrentUser } from '@/auth/currentUser';
import { redirect } from 'next/navigation';

const SignUpPage = async () => {

    const user = await getCurrentUser();

    if (user) redirect('/dashboard')

    return <SignupUI />
}

export default SignUpPage