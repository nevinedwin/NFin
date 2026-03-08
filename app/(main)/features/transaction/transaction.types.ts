import { TransactionType } from "@/generated/prisma/client";

export type TransactionFormType = {
    type: TransactionType;
    repeat: boolean;
    amount: string;
    accountId: string;
    description: string;
    categoryId: string
}