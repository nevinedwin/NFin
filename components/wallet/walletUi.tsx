'use client';

import React from 'react';
import BackArrowButton from '../ui/backArrowbutton';
import Addbutton from '../ui/addbutton';
import WalletChip from './walletChip';
import { AccountSafeType } from '@/types/transaction';
import BalanceCard from './balanceCard';
import BalanceTotalGroup from './balanceTotalGroup';
import { AccountType } from '@/generated/prisma/client';
import Link from 'next/link';
import AccountCard from './accountCard';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMainShellContext } from '@/app/(main)/context/mainShellContext';

type WalletUiProp = {
    selectedAccount: string;
    accounts: AccountSafeType[];
    totalBalance: number;
    sortedGroups: [AccountType, AccountSafeType[]][];
    groupTotals: Partial<Record<AccountType, number>>;
}


const WalletUi = ({ selectedAccount, accounts, totalBalance, sortedGroups, groupTotals }: WalletUiProp) => {

    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const { startLoading } = useMainShellContext();

    const handleCreateAccount = () => {
        startLoading();
        startTransition(() => {
            router.push('/account');
        });
    }

    return (
        <div className='flex flex-col justify-center items-center py-4 gap-6'>
            <div className='w-full px-4 flex justify-between items-center'>
                <div className='flex justify-start items-center gap-2'>
                    <BackArrowButton size={30} href="/dashboard" />
                    <div className='flex flex-col justify-center items-start'>
                        <p className='font-semibold tracking-wide'>Wallet</p>
                        <p className='text-text-secondary text-xs'>Financial Overview</p>
                    </div>
                </div>
                <div>
                    <Addbutton onClick={handleCreateAccount} label='Create Account' />
                </div>
            </div>
            <div className='w-full flex justify-start items-center gap-3 overflow-x-scroll scrollbar-hide px-4'>
                <WalletChip
                    text="All"
                    isAll
                    selected={selectedAccount === "all"}
                    href="/wallet"
                />
                {
                    accounts.map(acc => (
                        <WalletChip
                            key={acc.id}
                            href={`/wallet/${acc.id}`}
                            text={acc.accountNumber?.slice(-4) || acc.name.slice(0, 4)}
                            logo={acc.name.slice(0, 2).toUpperCase()}
                            selected={selectedAccount === acc.id}
                        />
                    ))
                }
            </div>
            <div className='w-full px-4'>
                <BalanceCard totalBalance={totalBalance} label='Total Balance' />
            </div>
            <div className='w-full flex flex-col gap-3'>
                {
                    sortedGroups.length === 0 && (
                        <div className='flex flex-col justify-center items-center'>
                            <p>No accounts found.</p>
                            <p className='text-sm text-text-secondary mt-2'>Add your first account</p>
                        </div>
                    )
                }
                {
                    sortedGroups.map(([type, group]) => (
                        <div key={type} className='flex flex-col px-4 gap-2 pb-4'>
                            <BalanceTotalGroup type={type} groupTotal={groupTotals[type] ?? 0} />
                            {group.map(acc => (
                                <Link href={`/wallet/${acc.id}`} key={acc.id} className="active:scale-[0.98] transition-transform cursor-pointer">
                                    <AccountCard
                                        name={acc.name}
                                        accountNumber={acc.accountNumber ?? "—"}
                                        balance={parseFloat(acc.balance)}
                                        lastUpdated={acc.updatedAt!}
                                    />
                                </Link>
                            ))}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default WalletUi