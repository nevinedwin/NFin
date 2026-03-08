import { TransactionType } from "@/generated/prisma/client";
import { TransactionFormType } from "./transaction.types";


export const transactionFormInitalState: TransactionFormType = {
    type: TransactionType.EXPENSE,
    repeat: false,
    amount: '',
    accountId: '',
    description: '',
    categoryId: ''
};
