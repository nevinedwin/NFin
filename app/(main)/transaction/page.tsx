'use server';

import React from 'react'
import TransactionList from '@/components/transaction/transactionList';
import { TransactionDataType } from '@/types/transaction';
import { getTransactions } from '@/actions/transactions';

const Transaction = async () => {

  const { data, nextCursor } = await getTransactions();

  return (
    <TransactionList
      initialTransaction={data}
      initialCursor={nextCursor}
    />
  )
}

export default Transaction;