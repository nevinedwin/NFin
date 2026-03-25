import { Prisma, TransactionType } from "@/generated/prisma/client";
import z from "zod";


const baseTransactionSchema = z.object({
    amount: z.string()
        .min(1, "Amount is required")
        .refine((val) => !isNaN(Number(val)), "Invalid amount")
        .transform((val) => new Prisma.Decimal(val)),
        
    type: z.nativeEnum(TransactionType),
    description: z.string().optional(),

    repeat: z.union([z.boolean(), z.string()]).transform((v) => v === true || v === 'true'),

    accountId: z.string().uuid(),
    toAccountId: z.string().uuid().optional(),

    categoryId: z.string().uuid().nullable().optional(),

    tranferType: z.nativeEnum(TransactionType).nullable().optional(),

    date: z
        .union([z.string().datetime(), z.date()])
        .optional()
        .transform((v) => (v ? new Date(v) : undefined))

})
    .superRefine((data, ctx) => {
        if (data.type === TransactionType.EXPENSE || data.type === TransactionType.INCOME) {
            if (!data.categoryId) {
                ctx.addIssue({
                    path: ["categoryId"],
                    code: z.ZodIssueCode.custom,
                    message: "Category Id is required"
                })
            }

            if (!data.accountId) {
                ctx.addIssue({
                    path: ["accountId"],
                    code: z.ZodIssueCode.custom,
                    message: "Account Id is required"
                })
            }
        }

        if (data.type === TransactionType.TRANSFER) {
            if (!data.accountId) {
                ctx.addIssue({
                    path: ["accountId"],
                    code: z.ZodIssueCode.custom,
                    message: "From Account Id is required"
                })
            }

            if (!data.toAccountId) {
                ctx.addIssue({
                    path: ["toAccountId"],
                    code: z.ZodIssueCode.custom,
                    message: "To Account Id is required"
                })
            }

            if (data.accountId === data.toAccountId) {
                ctx.addIssue({
                    path: ["toAccountId"],
                    code: z.ZodIssueCode.custom,
                    message: "Account must be different"
                })
            }
        }
    })


export const createTransactionSchema = baseTransactionSchema;


export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;