import { User } from "@/generated/prisma/client";
import { AccountSafeType, TransactionCategoryType, transactionDataType } from "@/types/transaction"


export type MainShellContextType = {
    accounts: AccountSafeType[],
    category: TransactionCategoryType[],
    userData: User | null,
    recentTransaction: transactionDataType[]

    openTransactionCard: boolean;
    toggleTransactionCard: () => void;
    closeTransactionCard: () => void;

    loading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
};