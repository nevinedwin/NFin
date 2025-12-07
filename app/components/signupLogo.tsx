import React from 'react'

type SignupLogoType = {
    title: string;
    subtitle: string[];
}


const SignupLogo: React.FC<SignupLogoType> = ({ title, subtitle}) => {
    return (
        <div className='flex flex-col items-center justify-center text-white'>
            <h1 className='text-[rgb(255 255 255/var(--tw-text-opacity,1))] font-bold text-6xl md:text-8xl tracking-widest'>
                {title}
            </h1>
            <div className='flex justify-center items-center gap-2 pt-3 text-gray-300'>
                {
                    subtitle.map((word, i) => (
                        <div key={i} className='flex items-center gap-2'>
                            <h3>{word}</h3>
                            { i !== subtitle.length -1 && <span className='pb-2'>.</span>}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SignupLogo;