import { useReducer } from "react";

export enum FORM_ACTIONS {
    SET_FIELD = "SET_FIELD",
    RESET = "RESET",
    SET_ALL = "SET_ALL"
}

type SetFieldAction<T> = {
    type: FORM_ACTIONS.SET_FIELD;
    field: keyof T;
    value: T[keyof T];
};

type ResetAction = {
    type: FORM_ACTIONS.RESET,
};

type SetAllAction<T> = {
    type: FORM_ACTIONS.SET_ALL,
    payload: T
};

type FormAction<T> = SetFieldAction<T> | ResetAction | SetAllAction<T>;

const formReducer = <T>(state: T, action: FormAction<T>): T => {
    switch (action.type) {
        case FORM_ACTIONS.SET_FIELD:
            return {
                ...state,
                [action.field]: action.value
            };

        case FORM_ACTIONS.SET_ALL:
            return action.payload;

        default:
            return state;
    }
};


export const useForm = <T extends Record<string, any>>(intialState: T) => {

    const reducer = (state: T, action: FormAction<T>): T => {
        if (action.type === FORM_ACTIONS.RESET) {
            return intialState;
        }
        return formReducer(state, action);
    }

    const [state, dispatch] = useReducer(reducer, intialState);

    const setField = <K extends keyof T>(field: K, value: T[K]) => {
        dispatch({ type: FORM_ACTIONS.SET_FIELD, field, value });
    };

    const reset = () => {
        dispatch({ type: FORM_ACTIONS.RESET });
    };

    const setAll = (data: T) => {
        dispatch({ type: FORM_ACTIONS.SET_ALL, payload: data });
    };

    return { state, setField, reset, setAll };
}