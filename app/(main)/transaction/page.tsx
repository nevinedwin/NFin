'use server';

import React from 'react'
import TransactionList from '@/components/transaction/transactionList';
import { getMonthlyTotals, getTransactions } from '@/actions/transactions';
import { getAccounts } from '@/actions/accounts';

const Transaction = async () => {

  const [monthlyTotals, accounts] = await Promise.all([
    getMonthlyTotals(),
    getAccounts()
  ]);

  return (
    <TransactionList
      initialMonthlyTotals={monthlyTotals}
      accounts={accounts.map((a: any) => ({
        id: a.id,
        label: a.name,
        sub: a.accountNumber
      }))}
    />
  )
}

export default Transaction;