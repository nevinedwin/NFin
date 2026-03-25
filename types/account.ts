import { Account } from "@/generated/prisma/client";

export type AccountFormType = Omit<Account, "balance" | "creditLimit"> & {
    balance: number;
    creditLimit?: number | null;
};

export type AccountSafe = Omit<Account, 'balance' | 'creditLimit'> & {
    balance: string,
    creditLimit?: string | null;
    
}