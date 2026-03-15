import { User } from "@/generated/prisma/client";
import { AccountSafeType, TransactionCategoryType } from "@/types/transaction"


export type MainShellContextType = {
    accounts: AccountSafeType[],
    category: TransactionCategoryType[],
    userData: User | null,

    openTransactionCard: boolean;
    toggleTransactionCard: () => void;
    closeTransactionCard: () => void;

    loading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
};