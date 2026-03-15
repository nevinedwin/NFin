import { Prisma } from "@/generated/prisma/client";

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