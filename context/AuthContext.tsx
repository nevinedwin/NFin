

// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, signupUser, logoutUser, getCurrentUser, refreshToken } from "@/lib/auth.frontend";
import { useRouter } from "next/navigation";

type User = { id: string; name: string; email: string } | null;

interface AuthContextType {
    user: User;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const router = useRouter();

    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const data = await getCurrentUser();
            console.log(data);
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const data = await loginUser({ email, password });
            
            // setAccessToken(data.accessToken)
            
            await fetchUser();
            router.replace('/dashboard')
        } catch (error) {
            // alert()
        }
    };
    
    const signup = async (name: string, email: string, password: string) => {
        const data = await signupUser({ name, email, password });
        
        // setAccessToken(data.accessToken)
        
        await fetchUser();
        router.replace('/dashboard')
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    const memoizedValues = useMemo(() =>
        ({ user, login, signup, loading, logout }),
        [user, login, signup, loading, logout]
    )

    return (
        <AuthContext.Provider value={memoizedValues}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};