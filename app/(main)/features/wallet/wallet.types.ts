import { AccountType } from "@/generated/prisma/client";

export type WalletFormType = {
    name: string;
    type: AccountType;
    balance: string;
    currency?: string;
    countMeInTotal?: boolean;

    creditLimit?: number;
    billingDate?: string;
    dueDate?: string;

    accountNumber?: string;
    ifscCode?: string;
    branch?: string;
    cardNumber?: string;
    cvv?: string;
    expiryDate?: string;

    isDeleted?: boolean;
}
