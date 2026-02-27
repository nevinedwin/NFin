import { TransactionAccountType, TransactionCategoryType } from "@/types/transaction"


export type MainShellContextType = {
    accounts: TransactionAccountType[],
    category: TransactionCategoryType[],

    openTransactionCard: boolean;
    toggleTransactionCard: () => void;
    closeTransactionCard: () => void;

    loading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
};