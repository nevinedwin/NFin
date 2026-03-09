import { AccountType } from '@/generated/prisma/client';
import { z } from 'zod';


export const createAccountSchema = z.object({
    name: z.string().min(1, "Account name is required"),

    type: z.nativeEnum(AccountType),

    balance: z.coerce.number().default(0),

    countMeInTotal: z
        .union([z.literal("true"), z.literal("false")])
        .transform((v: string) => v === "true")
        .default(true),

    accountNumber: z.string().optional().nullable(),
    ifscCode: z.string().optional().nullable(),
    branch: z.string().optional().nullable(),

    cardNumber: z.string().optional().nullable(),
    cvv: z.string().optional().nullable(),
    expiryDate: z.string().optional().nullable(),

    creditLimit: z.coerce.number().optional(),
    billingDate: z.string().optional(),
    dueDate: z.string().optional()
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;