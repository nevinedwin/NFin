import { createContext, useContext, useMemo } from "react";
import { MainShellContextType } from "./mainShellContext.types";


const MainShellContext = createContext<MainShellContextType | null>(null);

type MainShellProviderProp = {
    children: React.ReactNode;
    value: MainShellContextType;
}

export const MainShellProvider = ({ children, value }: MainShellProviderProp) => {

    const memoizedValue = useMemo(() => value, [value]);

    return (
        <MainShellContext.Provider value={memoizedValue}>
            {children}
        </MainShellContext.Provider>
    )
};


export function useMainShellContext() {
    const context = useContext(MainShellContext);
    if (!context) {
        throw new Error("useMainShellContext must be used inside MainShellProvider.")
    }
    return context;
}