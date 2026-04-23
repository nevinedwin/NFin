import { Prisma, TransactionType } from "@/generated/prisma/client";
import { z } from "zod";

// ─── Contact Schema (for group split) ─────────────────────────────

const contactSchema = z.object({
    id: z.string(),
    obligationAmount: z.number(),
    shareAmount: z.number(),
    splitType: z.string().optional()
});

// ─── Base Transaction ─────────────────────────────────────────────

const baseTransactionSchema = z.object({
    amount: z.string()
        .min(1, "Amount is required")
        .refine((val) => !isNaN(Number(val)), "Invalid amount")
        .transform((val) => new Prisma.Decimal(val)),

    type: z.nativeEnum(TransactionType),

    description: z.string().optional(),

    repeat: z.union([z.boolean(), z.string()])
        .transform((v) => v === true || v === "true"),

    accountId: z.string().uuid(),

    toAccountId: z.string().uuid().optional(),

    categoryId: z.string().uuid().nullable().optional(),

    groupId: z.string().uuid().optional(),

    date: z.union([z.string().datetime(), z.date()])
        .optional()
        .transform((v) => (v ? new Date(v) : new Date()))
});

export const createTransactionSchema = baseTransactionSchema.extend({
    contacts: z.array(contactSchema).optional(),
    contactId: z.string().optional(),
    groupId: z.string().optional() // ✅ ADD THIS
}).superRefine((data, ctx) => {

    if (
        data.type === TransactionType.EXPENSE ||
        data.type === TransactionType.INCOME
    ) {
        if (!data.categoryId) {
            ctx.addIssue({
                path: ["categoryId"],
                code: z.ZodIssueCode.custom,
                message: "Category is required"
            });
        }
    }

    if (data.type === TransactionType.TRANSFER) {
        if (!data.toAccountId) {
            ctx.addIssue({
                path: ["toAccountId"],
                code: z.ZodIssueCode.custom,
                message: "To Account is required"
            });
        }

        if (data.accountId === data.toAccountId) {
            ctx.addIssue({
                path: ["toAccountId"],
                code: z.ZodIssueCode.custom,
                message: "Accounts must be different"
            });
        }
    }

    if (data.type === TransactionType.GROUP_SPLIT) {
        if (!data.contacts || data.contacts.length === 0) {
            ctx.addIssue({
                path: ["contacts"],
                code: z.ZodIssueCode.custom,
                message: "At least one contact is required"
            });
        }
    }
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;