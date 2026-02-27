import { TransactionType } from "@/generated/prisma/client";
import { TRANSACTION_FORM_ACTIONS, TransactionFormType } from "./transaction.types";


export const transactionFormInitalState: TransactionFormType = {
    type: TransactionType.EXPENSE,
    repeat: false,
    amount: '',
    accountId: '',
    description: '',
    categoryId: ''
};

export type TransactionFormAction =
    | { type: TRANSACTION_FORM_ACTIONS.SET_FIELD, field: keyof TransactionFormType, value: string | boolean }
    | { type: TRANSACTION_FORM_ACTIONS.RESET }
    | { type: TRANSACTION_FORM_ACTIONS.SET_ALL, payload: TransactionFormType }


export const transactionFormReducer = (state: TransactionFormType, action: TransactionFormAction): TransactionFormType => {
    switch (action.type) {
        case TRANSACTION_FORM_ACTIONS.SET_FIELD:
            return { ...state, [action.field]: action.value };

        case TRANSACTION_FORM_ACTIONS.RESET:
            return transactionFormInitalState;

        case TRANSACTION_FORM_ACTIONS.SET_ALL:
            return action.payload;

        default:
            return state;
    }
};
