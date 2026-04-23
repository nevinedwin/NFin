import { AccountType } from "@/generated/prisma/client";


export function accountOption(acc: any) {
    return {
        label: acc.name,
        value: acc.id
    };
};