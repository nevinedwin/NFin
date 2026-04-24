"use client";

import { useTransition } from 'react';
import { Card } from '../ui/card/card';
import CardContent from '../ui/card/cardContent';
import { ArrowDown, ArrowUp, EyeIcon, EyeOffIcon, Wallet2 } from 'lucide-react'
import { RUPEE_SYMBOL } from '@/lib/constants/constants';
import useCountUp from '@/hooks/useCountUp';
import { useRouter } from 'next/navigation';
import { useMainShellContext } from '@/app/(main)/context/mainShellContext';
import ShowBalanceComp from '../ui/showBalance';

type HeaderCardProp = {
    balance: number;
    expense: number;
    income: number;
}

const HeaderCard = ({ balance: bal = 0, income: inc = 0, expense: exp = 0 }: HeaderCardProp) => {

    const router = useRouter();

    const { showBalance, setShowBalance, startLoading } = useMainShellContext();
    const [isPending, startTransition] = useTransition();


    const balance = useCountUp(bal, 100);
    const income = useCountUp(inc, 100);
    const expense = useCountUp(exp, 100);

    const handleWalletClick = () => {
        startLoading();
        startTransition(() => {
            router.push('/wallet');
        })
    };




    return (
        <Card className="rounded-none rounded-b-3xl w-full border-none h-[160px] bg-bar p-0 
                 transition-all duration-300 ease-out 
                 hover:shadow-md hover:scale-[1.01]">
            <CardContent className="bg-bar h-[110px] animate-fade-in">
                <div className="h-full flex justify-between items-center">
                    <div>
                        <h2 className="font-normal text-md text-slate-300 tracking-wider">Total Balance</h2>
                        <div className='flex justify-center items-center gap-4'>
                            {showBalance ? <ShowBalanceComp balance={balance} /> : <span className='text-2xl'>{RUPEE_SYMBOL} ----</span>}
                            {
                                showBalance ? <EyeIcon onClick={() => setShowBalance(false)} /> : <EyeOffIcon onClick={() => setShowBalance(true)} />
                            }
                        </div>
                    </div>
                    <div className='h-full flex flex-col justify-center items-center group pr-3'>
                        <Wallet2 width={40} height={40} className="text-text-dull" onClick={handleWalletClick} />
                        <p className='text-[10px] text-text-dull'>Wallet</p>
                    </div>
                </div>
                <div className='h-px bg-text-dull'></div>
                <div className="flex justify-start items-center pt-3 gap-16">
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex justify-center items-center bg-green-100">
                            <ArrowDown className="text-green-600" size={16} />
                        </div>
                        <div className="flex flex-col justify-center items-start">
                            <h2 className="text-xs text-slate-500">Income</h2>
                            <h3 className="text-sm font-semibold text-green-600"><span>{RUPEE_SYMBOL}</span>{income.toFixed(2)}</h3>
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex justify-center items-center bg-red-100">
                            <ArrowUp className="text-red-600" size={16} />
                        </div>
                        <div className="flex flex-col justify-center items-start">
                            <h2 className="text-xs text-slate-500">Expense</h2>
                            <h3 className="text-sm font-semibold text-red-500"><span>{RUPEE_SYMBOL}</span>{expense.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default HeaderCard