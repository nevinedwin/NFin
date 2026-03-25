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
    description: string | undefined;
    category: Category;
    date: Date;
    updateAt?: Date;
    account: Account;
    type: TransactionType;
    balance: number;
    transferType?: TransferType,
    transferGroupId?: string;
}