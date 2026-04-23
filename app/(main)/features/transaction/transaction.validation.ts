import { TransactionType } from "@/generated/prisma/client"
import { TransactionFormType } from "./transaction.types"
import { isAfter } from "date-fns";


export const transactionFormErrors = (state: TransactionFormType) => {
    let error = '';
    if (state.type === TransactionType.GROUP_SPLIT) {
        if (Number(state.amount) <= 0) {
            error = 'Amount should be Greater than 0.'
            return error;
        }

        if (!state.groupId) {
            error = 'Please select a group';
            return error;
        }

        if (!state.categoryId) {
            error = 'Please select a category';
            return error;
        }

        if (!state.accountId) {
            error = 'Account Id is Required';
            return error;
        }
    }
    return error;
};