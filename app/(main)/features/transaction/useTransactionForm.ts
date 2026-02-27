import { useReducer } from "react"
import { transactionFormInitalState, transactionFormReducer } from "./transaction.reducer"
import { TRANSACTION_FORM_ACTIONS } from "./transaction.types";


export const useTransactionForm = (intialState = transactionFormInitalState) => {
    const [state, dispatch] = useReducer(transactionFormReducer, transactionFormInitalState);

    const setField = (field: keyof typeof state, value: string | boolean) => {
        dispatch({ type: TRANSACTION_FORM_ACTIONS.SET_FIELD, field, value });
    };

    const reset = () => {
        dispatch({ type: TRANSACTION_FORM_ACTIONS.RESET });
    };

    const setAll = (data: typeof state) => {
        dispatch({ type: TRANSACTION_FORM_ACTIONS.SET_ALL, payload: data });
    };

    return { state, setField, reset, setAll };
}