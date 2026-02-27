import { TransactionType } from "@/generated/prisma/client";

export type TransactionFormType = {
    type: TransactionType;
    repeat: boolean;
    amount: string;
    accountId: string;
    description: string;
    categoryId: string
}

export enum TRANSACTION_FORM_ACTIONS {
    SET_FIELD = "SET_FIELD",
    RESET = "RESET",
    SET_ALL = "SET_ALL"
}