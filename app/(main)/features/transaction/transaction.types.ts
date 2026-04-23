import { TransactionType } from "@/generated/prisma/client";

export type TransactionFormType = {
  type: TransactionType;
  repeat: boolean;
  amount: string;
  accountId: string;
  toAccountId: string;
  description: string;
  categoryId: string;
  contactId: string;
  groupId: string;
  account: string;
  toAccount: string;
  category: string;
  contact: string;
  group: string;
};

export type TransactionsContactItem = {
  id: string;
  name: string;
  splitType: string;
  obligationAmount: number;
};

export type FormBody = {
  amount?: string;
  description?: string;
  accountId?: string;
  categoryId?: string;
  groupId?: string;
  toAccountId?: string;
  contactId?: string;
  repeat?: string;
  contacts?: string;
  type: TransactionType;
};