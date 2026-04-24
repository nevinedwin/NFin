'use server';

import React from 'react';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/auth/currentUser';
import { AccountSafeType } from '@/types/transaction';
import { ORDER_MAP } from '@/lib/utils/formats';
import { AccountType } from '@/generated/prisma/client';
import WalletUi from '@/components/wallet/walletUi';

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

  const groupTotals: Partial<Record<AccountType, number>> = {};

  const groupedAccounts = accounts.reduce<Partial<Record<AccountType, AccountSafeType[]>>>(
    (acc, account) => {
      const key = account.type as AccountType;

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
    <WalletUi
      selectedAccount={selectedAccount}
      accounts={accounts}
      totalBalance={totalBalance}
      sortedGroups={sortedGroups}
      groupTotals={groupTotals}
    />
  )
}

export default Wallet