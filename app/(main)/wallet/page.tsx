'use client';

import React from 'react'
import AccountCard from '@/components/wallet/accountCard'
import BalanceCard from '@/components/wallet/balanceCard'
import { PlusCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import Chip from '@/components/ui/chip';
import WalletChip from '@/components/wallet/walletChip';

const Wallet = () => {
  return (
    <div className='flex flex-col justify-center items-center p-4 gap-6'>
      <div className='w-full flex justify-start items-center gap-3 overflow-x-scroll scrollbar-hide'>
        <WalletChip text='All' isAll selected={false}/>
        <WalletChip text='9239' logo='FE' selected={false}/>
        <WalletChip text='0032' logo='HD' selected={false}/>
        <WalletChip text='0032' logo='HD' selected={false}/>
        <WalletChip text='0032' logo='HD' selected={false}/>
        <WalletChip text='0032' logo='HD' selected={false}/>
        <WalletChip text='0032' logo='HD' selected={false}/>
      </div>
      <div className='w-full'>
        <BalanceCard showBalance={true} totalBalance={200} />
      </div>
      <div className='w-full flex flex-col gap-4'>
        <AccountCard accountNumber='bawscu723238' balance={200} lastUpdated="21 Jan '26" name='Federal Bank' />
        <AccountCard accountNumber='bawscu728403' balance={2100} lastUpdated="1 Feb '26" name='HDFC Bank' />
        <AccountCard accountNumber='bawscu7325' balance={100} lastUpdated="26 Feb '26" name='Central Bank of India' />
      </div>
      <div className='flex justify-center items-center gap-2 cursor-pointer' onClick={() => redirect('/account')}>
        <div ><PlusCircle size={20} className='text-green-400' /></div>
        <h3 className='text-sm font-bold text-green-400'>Add another Account</h3>
      </div>
    </div>
  )
}

export default Wallet