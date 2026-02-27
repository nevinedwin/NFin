export type TransactionAccountType = {
    id: string;
    name: string;
    accountNumber: string | null;
    balance: number;
    countMeInTotal: boolean
}

export type TransactionCategoryType = {
    id: string;
    name: string;
} 