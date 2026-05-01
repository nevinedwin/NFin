'use server';

import React from 'react'
import TransactionList from '@/components/transaction/transactionList';
import { getMonthlyTotals, getTransactions } from '@/actions/transactions';
import { getAccounts } from '@/actions/accounts';
import { ActiveFilters } from '@/types/filters';
import { DateFilterValue } from '@/components/ui/FilterBars/dateFilterPanel';

const Transaction = async ({ searchParams }: { searchParams: Record<string, string> }) => {

  const resolvedParams = await searchParams;


  const dateRange: DateFilterValue | null = resolvedParams?.dateFrom && resolvedParams?.dateTo
    ? { from: resolvedParams.dateFrom, to: resolvedParams.dateTo, preset: 'month' }
    : null;

  const initialFilters: ActiveFilters = {
    bank: resolvedParams?.bank ?? null,
    category: resolvedParams?.category ?? null,
    date: dateRange,
    type: (resolvedParams?.type as ActiveFilters['type']) ?? null
  };

  const [monthlyTotals, accounts, transactions] = await Promise.all([
    getMonthlyTotals(),
    getAccounts(),
    getTransactions({ cursor: null, filters: initialFilters, take: 10, search: '' })
  ]);

  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(Date.now() + IST_OFFSET_MS).toISOString();

  return (
    <TransactionList
      initialMonthlyTotals={monthlyTotals}
      accounts={accounts.map((a: any) => ({
        id: a.id,
        label: a.name,
        sub: a.accountNumber
      }))}
      initialFilters={initialFilters}
      initialTransaction={transactions.data}
      initialCursor={transactions.nextCursor}
      now={nowIST}
    />
  )
}

export default Transaction;