import Image from 'next/image';
import React from 'react'

type SignupLogoType = {
    title: string;
    subtitle: string[];
}


const SignupLogo: React.FC<SignupLogoType> = ({ title, subtitle }) => {
    return (
        <div className='flex flex-col items-center justify-center relative z-10'>
            <Image
                src="/icons/nfin-icon-main.png"
                alt="NFin"
                width={64}
                height={64}
                priority
                className="mb-2 rounded-2xl"
            />
            {/* <h1 className='text-[rgb(255 255 255/var(--tw-text-opacity,1))] font-bold text-xl md:text-8xl tracking-widest'>
                {title}
            </h1> */}
            <div className='flex justify-center items-center gap-2 pt-3 text-gray-300'>
                {
                    subtitle.map((word, i) => (
                        <div key={i} className='flex items-center gap-2'>
                            <h3>{word}</h3>
                            {i !== subtitle.length - 1 && <span className='pb-2'>.</span>}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SignupLogo;