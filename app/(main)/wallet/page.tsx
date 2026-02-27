
import React from 'react'
import AccountCard from '@/components/wallet/accountCard'
import BalanceCard from '@/components/wallet/balanceCard'
import { PlusCircle } from 'lucide-react'
import WalletChip from '@/components/wallet/walletChip';
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/db';

type WalletProp = {
  params: Promise<{
    accountId?: string;
  }>
}

const Wallet = async ({ params }: WalletProp) => {

  const user = await getCurrentUser();

  if (!user) {
    return <div>Unauthorized</div>
  }

  const { accountId } = await params;
  const selectedAccount = accountId || 'all';

  const accounts = await prisma.account.findMany({
    where: {
      userId: user.id,
      ...(
        selectedAccount && selectedAccount !== 'all'
          ? { id: selectedAccount }
          : {}
      )
    },
    orderBy: { name: "desc" }
  });

  const allAccounts = await prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { name: "desc" }
  });

  const totalBalance = accounts.reduce((sum, acc) => {
    return sum + acc.balance;
  }, 0)

  return (
    <div className='flex flex-col justify-center items-center p-4 gap-6'>
      <div className='w-full flex justify-start items-center gap-3 overflow-x-scroll scrollbar-hide'>
        <WalletChip
          text="All"
          isAll
          selected={selectedAccount === "all"}
          href="/wallet"
        />
        {
          allAccounts.map(acc => (
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
      <div className='w-full'>
        <BalanceCard showBalance={true} totalBalance={totalBalance} />
      </div>
      <div className='w-full flex flex-col gap-4'>
        {accounts.map(acc => (
          <Link href={`/wallet/${acc.id}`} key={acc.id} className="active:scale-[0.98] transition-transform cursor-pointer">
            <AccountCard
              name={acc.name}
              accountNumber={acc.accountNumber ?? "—"}
              balance={acc.balance}
              lastUpdated={new Date(acc.createdAt).toLocaleDateString("en-IN")}
            />
          </Link>
        ))}
      </div>
      <Link className='flex justify-center items-center gap-2 cursor-pointer' href={'/account'}>
        <div ><PlusCircle size={20} className='text-green-400' /></div>
        <h3 className='text-sm font-bold text-green-400'>Add another Account</h3>
      </Link>
    </div>
  )
}

export default Wallet