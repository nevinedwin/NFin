import React, { useState } from 'react'
import Input from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'


type SignupFormProp = {
    handleClick: () => void
}

const SignupForm = ({ handleClick }: SignupFormProp) => {

    const { signup } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await signup(name, email, password);
            console.log(data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="relative z-10 flex flex-col items-center">

            <h1 className="text-xl font-semibold text-text-primary mb-2">
                Create Your Account
            </h1>

            <p className="text-sm text-text-secondary mb-6 text-center">
                Welcome! Please fill in the details to get<br /> started.
            </p>

            <form className="w-full px-4 flex flex-col items-center justify-center gap-3" onSubmit={handleSubmit}>
                <Input placeholder='Name' value={name} onChange={e => setName(e.target.value)} className='text-sm' containerClassName='w-full md:w-[300px] px-4' />
                <Input placeholder='email' value={email} onChange={e => setEmail(e.target.value)} className='text-sm' containerClassName='w-full md:w-[300px] px-4' />
                <Input placeholder='password' value={password} onChange={e => setPassword(e.target.value)} className='text-sm' containerClassName='w-full md:w-[300px] px-4' />
                <div className='w-full px-4'>
                    <button type="submit" disabled={loading} className='bg-black mt-2 border bodred-white w-full md:w-[200px] p-2 rounded-lg text-sm'>Sign Up</button>
                </div>
            </form>
            <div className='flex justify-center items-center gap-2 mt-2'>
                <p className='text-sm mt-2 text-text-secondary '>Already have an account?</p>
                <button className='text-sm text-center font-bold mt-2' onClick={handleClick}>Sign In</button>
            </div>
        </div>
    )
}

export default SignupForm