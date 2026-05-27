import { AccountType } from "@/generated/prisma/client";


export function accountOption(acc: any) {
    return {
        label: acc.name,
        value: acc.id
    };
};

export const categoryOption = (item: any) => ({
    label: item.name,
    value: item.id,
    icon: item.icon
});