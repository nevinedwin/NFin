import { User } from "@/generated/prisma/client";
import { AccountSafeType, TransactionCategoryType, TransactionDataType } from "@/types/transaction"


export type MainShellContextType = {
    accounts: AccountSafeType[],
    category: TransactionCategoryType[],
    userData: User | null,
    recentTransaction: TransactionDataType[]

    openTransactionCard: boolean;
    toggleTransactionCard: () => void;
    closeTransactionCard: () => void;

    loading: boolean;
    startLoading: () => void;
    stopLoading: () => void;

    showBalance: boolean;
    setShowBalance: React.Dispatch<React.SetStateAction<boolean>>;

};