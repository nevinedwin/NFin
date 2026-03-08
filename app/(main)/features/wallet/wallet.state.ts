import { AccountType } from "@/generated/prisma/client";
import { WalletFormType } from "./wallet.types";


export const walletFormInitalState: WalletFormType = {
    name: '',
    type: AccountType.BANK,
    balance: 0,
    accountNumber: '',
    atmNumber: '',
    billingDate: '',
    branch: '',
    countMeInTotal: true,
    creditLimit: 0,
    currency: '',
    cvv: '',
    dueDate: '',
    expiryDate: '',
    ifscCode: '',
    isDeleted: false
};

