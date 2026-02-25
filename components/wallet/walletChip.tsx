import React from 'react'
import Chip from '../ui/chip'

type WalletChipProp = {
    text: string;
    isAll?: boolean;
    handleClick?: () => void;
    logo?: string;
    selected?: boolean;
    disabled?: boolean;
}

const WalletChip = ({ text, isAll, handleClick, logo, selected = false, disabled = false }: WalletChipProp) => {

    return (
        isAll ?
            <Chip className={`w-[50px] ${selected ? 'text-black bg-white' : 'text-white bg-black'}`} onClick={handleClick} selected={selected} disabled={disabled}>
                <h3 className={`text-sm font-extrabold ${selected ? 'text-black' : 'text-white'}`}>{text}</h3>
            </Chip>
            :
            <Chip onClick={handleClick} selected={selected} disabled={disabled}>
                <div className='flex w-[80px] justify-start items-center gap-2'>
                    <div className={`w-[21px] h-[21px] rounded-full  text-[9px] flex justify-center items-center font-bold ${selected ? 'bg-black text-white' : 'bg-slate-400 text-black'} `}>{logo}</div>
                    <h3 className={`text-sm flex items-center justify-center gap-1 font-extrabold hover:text-black ${selected ? 'text-black' : 'text-white'}`}> <span className="text-center">··</span>{text}</h3>
                </div >
            </Chip >
    )
}

export default WalletChip