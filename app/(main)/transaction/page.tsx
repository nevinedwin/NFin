'use server';

import React from 'react'
import TransactionList from '@/components/transaction/transactionList';
import { TransactionDataType } from '@/types/transaction';
import { getMonthlyTotals, getTransactions } from '@/actions/transactions';
import { prisma } from '@/lib/prisma';
import { getAccounts } from '@/actions/accounts';
import { getCategories } from '@/actions/category';

const Transaction = async () => {

  const [{ data, nextCursor }, monthlyTotals, accounts, categories] = await Promise.all([
    getTransactions(),
    getMonthlyTotals(),
    getAccounts(),
    getCategories()
  ]);

  return (
    <TransactionList
      initialTransaction={data}
      initialCursor={nextCursor}
      initialMonthlyTotals={monthlyTotals}
      accounts={accounts.map((a: any) => ({
        id: a.id,
        label: a.name,
        sub: a.accountNumber
      }))}
      categories={categories.map((c: any) => ({ id: c.id, label: c.name }))}
    />
  )
}

export default Transaction;