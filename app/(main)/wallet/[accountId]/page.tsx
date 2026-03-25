'use server';

import React from 'react'
import WalletChip from '@/components/wallet/walletChip';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/auth/currentUser';
import BalanceIndCard from '@/components/wallet/accountIndCard';
import { CardSkeleton } from '@/components/ui/card/cardSkeleton';
import { AccountSafe } from '@/types/account';
import BackArrowButton from '@/components/ui/backArrowbutton';
import WalletBackHandler from '@/components/ui/walletBackHandler';

type WalletSinglePageProps = {
  params: Promise<{ accountId: string }>
}

const WalletSinglePage = async ({ params }: WalletSinglePageProps) => {

  const user = await getCurrentUser();
  if (!user) return <div>Unauthorized</div>

  const { accountId } = await params;

  const singleAccount = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId: user.id
    }
  });

  if (!singleAccount) return <div>Account Not Found</div>;

  const account: AccountSafe = {
    ...singleAccount,
    balance: singleAccount.balance.toString(),
    creditLimit: singleAccount.creditLimit?.toString() ?? null
  };

  const allAccounts = await prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { name: "desc" }
  });

  if (!account) return <div>Account Not Found</div>

  return (
    <div className='flex flex-col justify-center items-center p-4 gap-6'>
      <div className='w-full flex justify-start items-center'>
        <BackArrowButton size={20} href="/dashboard" />
      </div>
      <div className='w-full flex justify-start items-center gap-3 overflow-x-scroll scrollbar-hide'>
        <WalletChip
          text="All"
          isAll
          selected={accountId === "all"}
          href="/wallet"
        />
        {
          allAccounts.map(acc => (
            <WalletChip
              key={acc.id}
              href={`/wallet/${acc.id}`}
              text={acc.accountNumber?.slice(-4) || acc.name.slice(0, 4)}
              logo={acc.name.slice(0, 2).toUpperCase()}
              selected={accountId === acc.id}
            />
          ))
        }
      </div>
      <div className='w-full'>
        <BalanceIndCard account={account} />
      </div>
      <div className='w-full flex flex-col gap-3'>
        <CardSkeleton className='w-full' />
        <CardSkeleton className='w-full' />
        <CardSkeleton className='w-full' />
        <CardSkeleton className='w-full' />
        <CardSkeleton className='w-full' />
      </div>
      <WalletBackHandler />
    </div>
  )
}

export default WalletSinglePage