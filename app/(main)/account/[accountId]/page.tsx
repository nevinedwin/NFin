

import React from 'react'
import { getCurrentUser } from '@/auth/currentUser';
import AccountForm from '@/components/wallet/accountCreateForm'
import { Account } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { AccountFormType } from '@/types/account';

type AccountEditFormProps = {
    params: Promise<{ accountId: string }>
}

const AccountEditForm = async ({ params }: AccountEditFormProps) => {


    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>

    const { accountId } = await params;

    const safeAccount = await prisma.account.findFirst({
        where: {
            id: accountId,
            userId: user.id
        }
    })
    const account = {
        ...safeAccount,
        balance: safeAccount?.balance?.toNumber(),
        creditLimit: safeAccount?.creditLimit?.toNumber()
    }

    return (
        <div>
            <AccountForm account={account as AccountFormType} isUpdate={true}/>
        </div>
    )
}

export default AccountEditForm