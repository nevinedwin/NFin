import { UserRoles } from "@/generated/prisma/client";

export type FormData = {
    name: string;
    email: string;
    password: string;
}

export type sessionPayload = {
    id: string;
    role: UserRoles
}

export type CookiesType = {
    set: (
        key: string,
        value: string,
        options: {
            secure?: boolean
            httpOnly?: boolean
            sameSite?: "strict" | "lax"
            expires?: number
        }
    ) => void
    get: (key: string) => { name: string; value: string } | undefined
    delete: (key: string) => void
}

export type ComparePassword = {
    password: string;
    hashedPassword: string;
    salt: string;
}
