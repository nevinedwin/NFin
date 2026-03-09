import { getCurrentUser } from '@/auth/currentUser';
import AccountForm from '@/components/wallet/accountCreateForm'
import { Account } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import React from 'react'

type AccountEditFormProps = {
    params: Promise<{ accountId: string }>
}

const AccountEditForm = async ({ params }: AccountEditFormProps) => {


    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>

    const { accountId } = await params;

    const account = await prisma.account.findFirst({
        where: {
            id: accountId,
            userId: user.id
        }
    })

    return (
        <div>
            <AccountForm account={account as Account} isUpdate={true}/>
        </div>
    )
}

export default AccountEditForm