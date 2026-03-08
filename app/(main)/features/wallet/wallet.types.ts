import { AccountType } from "@/generated/prisma/client";

export type WalletFormType = {
    name: string;
    type: AccountType;
    balance: number;
    currency?: string;
    countMeInTotal?: boolean;

    creditLimit?: number;
    billingDate?: string;
    dueDate?: string;

    accountNumber?: string;
    ifscCode?: string;
    branch?: string;
    atmNumber?: string;
    cvv?: string;
    expiryDate?: string;

    isDeleted?: boolean;
}
