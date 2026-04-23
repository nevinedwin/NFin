import { useReducer } from "react";

export enum FORM_ACTIONS {
    SET_FIELD = "SET_FIELD",
    RESET = "RESET",
    SET_ALL = "SET_ALL",
    RESET_WITHOUT_TYPE = "RESET_WITHOUT_TYPE"
}

type SetFieldAction<T> = {
    type: FORM_ACTIONS.SET_FIELD;
    field: keyof T;
    value: T[keyof T];
};

type ResetAction = {
    type: FORM_ACTIONS.RESET,
};

type ResetKeepAction<T> = {
    type: FORM_ACTIONS.RESET_WITHOUT_TYPE;
    keep: (keyof T)[];
};

type SetAllAction<T> = {
    type: FORM_ACTIONS.SET_ALL,
    payload: T
};

type FormAction<T> = SetFieldAction<T> | ResetAction | SetAllAction<T> | ResetKeepAction<T>;;

const formReducer = <T>(state: T, action: FormAction<T>, initialState: T): T => {
    switch (action.type) {
        case FORM_ACTIONS.SET_FIELD:
            return {
                ...state,
                [action.field]: action.value
            };

        case FORM_ACTIONS.SET_ALL:
            return action.payload;

        case FORM_ACTIONS.RESET_WITHOUT_TYPE:
            const preserved = action.keep.reduce((acc, key) => {
                acc[key] = state[key];
                return acc;
            }, {} as Partial<T>);

            return {
                ...initialState,
                ...preserved
            };

        default:
            return state;
    }
};


export const useForm = <T extends Record<string, any>>(initialState: T) => {

    const reducer = (state: T, action: FormAction<T>): T => {
        if (action.type === FORM_ACTIONS.RESET) {
            return initialState;
        }
        return formReducer(state, action, initialState);
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    const setField = <K extends keyof T>(field: K, value: T[K]) => {
        dispatch({ type: FORM_ACTIONS.SET_FIELD, field, value });
    };

    const reset = () => {
        dispatch({ type: FORM_ACTIONS.RESET });
    };

    const resetKeep = (fields: (keyof T)[]) => {
        dispatch({ type: FORM_ACTIONS.RESET_WITHOUT_TYPE, keep: fields });
    };

    const setAll = (data: T) => {
        dispatch({ type: FORM_ACTIONS.SET_ALL, payload: data });
    };

    return { state, setField, reset, setAll, resetKeep };
}