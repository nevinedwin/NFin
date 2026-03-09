import { User } from "@/generated/prisma/client";
import { TransactionAccountType, TransactionCategoryType } from "@/types/transaction"


export type MainShellContextType = {
    accounts: TransactionAccountType[],
    category: TransactionCategoryType[],
    userData: User | null,

    openTransactionCard: boolean;
    toggleTransactionCard: () => void;
    closeTransactionCard: () => void;

    loading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
};