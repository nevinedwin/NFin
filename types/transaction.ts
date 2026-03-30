import { Account, AccountType, Category, CategoryType, Prisma, TransactionType, TransferType } from "@/generated/prisma/client";
import { string } from "zod";

export type TransactionAccountType = {
    id: string;
    name: string;
    accountNumber: string | null;
    balance: number;
    countMeInTotal: boolean;
}


export type AccountSafeType = {
    id: string;
    name: string;
    accountNumber: string | null;
    balance: string;
    countMeInTotal: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    type?: string;
}

export type TransactionAccountPayloadType = Prisma.AccountGetPayload<{
    select: {
        id: true
        name: true
        accountNumber: true
        balance: true
        countMeInTotal: true
    }
}>

export type TransactionCategoryType = {
    id: string;
    name: string;
}

export type TransactionDataType = {
    id: string;
    amount: number;
    type: TransactionType;
    date: Date;
    balance: number;
    description: string | undefined;
    category: Category;
    account: Account;
    transferType?: TransferType,
    transferGroupId?: string;
    updateAt?: Date;
}

export type TransactionDataSafeType = {
    id: string;
    amount: number;
    type: TransactionType;
    date: Date;
    balance: number;
    description: string | null;
    category: { id: string; name: string; icon: string | null } | null;
    account: { id: string, name: string, accountNumber: string | null };
    transferType: TransferType | null;
    transferGroupId: string | null;
    updatedAt: Date;
}