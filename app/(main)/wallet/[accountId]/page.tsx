import WalletChip from '@/components/wallet/walletChip';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'
import React from 'react'

type WalletSinglePageProps = {
  params: Promise<{ accountId: string }>
}

const WalletSinglePage = async ({ params }: WalletSinglePageProps) => {

  const { userId } = await auth();
  if (!userId) return <div>Unauthorized</div>

  const { accountId } = await params;
  console.log(accountId);

  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId
    }
  })


  const allAccounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { name: "desc" }
  });

  if (!account) return <div>Account Not Found</div>

  return (
    <div className='flex flex-col justify-center items-center p-4 gap-6'>
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
    </div>
  )
}

export default WalletSinglePage