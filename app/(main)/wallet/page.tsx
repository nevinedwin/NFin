'use server';

import React from 'react'
import AccountCard from '@/components/wallet/accountCard'
import BalanceCard from '@/components/wallet/balanceCard'
import { PlusCircle } from 'lucide-react'
import WalletChip from '@/components/wallet/walletChip';
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/auth/currentUser';
import { AccountSafeType } from '@/types/transaction';
import { formatTimeDate, formatType, ORDER_MAP } from '@/lib/utils/formats';
import { AccountType } from '@/generated/prisma/client';
import { RUPEE_SYMBOL } from '@/lib/constants/constants';
import BalanceTotalGroup from '@/components/wallet/balanceTotalGroup';

type WalletProp = {
  params: {
    accountId?: string;
  }
}

const Wallet = async ({ params }: WalletProp) => {

  const user = await getCurrentUser();

  if (!user) {
    return redirect('/sign-up')
  }

  const { accountId } = params;
  const selectedAccount = accountId || 'all';

  const [rawAccounts, userData] = await Promise.all([
    prisma.account.findMany({
      where: { userId: user.id },
      orderBy: { name: "desc" }
    }),
    prisma.user.findUnique({
      where: { id: user.id }
    })
  ]);

  const accounts: AccountSafeType[] = rawAccounts.map(acc => ({
    ...acc,
    balance: acc.balance.toString()
  }));

  const filteredAccounts =
    selectedAccount === "all"
      ? accounts
      : accounts.filter(acc => acc.id === selectedAccount);

  const groupTotals: Partial<Record<AccountType, number>> = {};

  const groupedAccounts = accounts.reduce<Partial<Record<AccountType, AccountSafeType[]>>>(
    (acc, account) => {
      const key = account.type as AccountType;

      console.log(formatTimeDate(account.updatedAt!));

      if (!acc[key]) {
        acc[key] = [];
      }

      if (!groupTotals[key]) {
        groupTotals[key] = parseFloat(account.balance);
      } else {
        groupTotals[key] += parseFloat(account.balance);
      }

      acc[key].push(account);
      return acc;
    },
    {}
  );


  const ORDER: AccountType[] = [AccountType.BANK, AccountType.CREDIT_CARD, AccountType.WALLET, AccountType.CASH];

  const entries = Object.entries(groupedAccounts) as [
    AccountType,
    AccountSafeType[]
  ][];

  const sortedGroups = (Object.entries(groupedAccounts) as [
    AccountType,
    AccountSafeType[]
  ][]).sort(
    ([a], [b]) => ORDER_MAP[a] - ORDER_MAP[b]
  );

  const totalBalance = accounts.reduce((sum, acc) => {
    return sum + Number(acc.balance);
  }, 0)

  return (
    <div className='flex flex-col justify-center items-center py-4 gap-6'>
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
          sortedGroups.map(([type, group]) => (
            <div key={type} className='flex flex-col pb-8'>
              <BalanceTotalGroup type={type} groupTotal={groupTotals[type] ?? 0} />
              {group.map(acc => (
                <Link href={`/wallet/${acc.id}`} key={acc.id} className="active:scale-[0.98] transition-transform cursor-pointer">
                  <AccountCard
                    name={acc.name}
                    accountNumber={acc.accountNumber ?? "—"}
                    balance={parseFloat(acc.balance)}
                    lastUpdated={formatTimeDate(acc.updatedAt!)}
                  />
                </Link>
              ))}
            </div>
          ))
        }
      </div>
      <Link className='flex justify-center items-center gap-2 cursor-pointer' href={'/account'}>
        <div ><PlusCircle size={20} className='text-green-400' /></div>
        <h3 className='text-sm font-bold text-green-400'>Add another Account</h3>
      </Link>
    </div>
  )
}

export default Wallet