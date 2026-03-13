import { CategoryType, TransactionType } from "@/generated/prisma/client";
import z from "zod";

const categoryBaseSchema = z.object({
    name: z.string().min(1, "Category name is required"),

    type: z.nativeEnum(CategoryType),
    forType: z.nativeEnum(TransactionType),

    parentId: z.string().optional().nullable(),
});

export const createCategorySchema = categoryBaseSchema;
export const updateCategorySchema = categoryBaseSchema.extend({
    id: z.string().min(1, 'Category id is required')
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;