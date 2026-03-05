import React, { useEffect, useState } from 'react'
import Input from '@/components/ui/input'
import { signIn } from '@/auth/auth.actions'
import LoaderButton from '@/components/ui/loaderButton'

type LoginFormProp = {
    handleClick: () => void
}

const LoginForm = ({ handleClick }: LoginFormProp) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await signIn({ email, password });
            setError(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setError('');
    }, [email, password]);

    return (
        <div className="relative z-10 flex flex-col items-center">

            <h1 className="text-xl font-semibold text-text-primary mb-2">
                Sign In
            </h1>

            <p className="text-sm text-text-secondary mb-6 text-center">
                Welcome! Please fill in the details to get<br /> started.
            </p>

            <form className="w-full px-4 flex flex-col items-center justify-center gap-3" onSubmit={handleSubmit}>
                <Input placeholder='email' inputMode='text' className='text-sm' value={email} onChange={e => setEmail(e.target.value)} containerClassName='w-full md:w-[300px] px-4' />
                <Input placeholder='password' isPassword={true} className='text-sm' value={password} onChange={e => setPassword(e.target.value)} containerClassName='w-full md:w-[300px] px-4' />
                {error && <p className='text-red-500 text-sm'>{error}</p>}
                <div className='w-full px-4 flex justify-center items-center'>
                    <button type='submit' className='bg-black mt-2 border bodred-white w-full md:w-[200px] p-2 rounded-lg text-sm flex gap-3 justify-center items-center'>
                        {loading ? <LoaderButton className='w-5 h-5' /> : 'Sign In'}
                    </button>
                </div>
            </form>
            <div className='flex justify-center items-center gap-2 mt-2'>
                <p className='text-sm mt-2 text-text-secondary '>Create new account?</p>
                <button className='text-sm text-center font-bold mt-2' onClick={handleClick}>Sign Up</button>
            </div>
        </div>
    )
}

export default LoginForm