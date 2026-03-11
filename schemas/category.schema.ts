import { CategoryType, TransactionType } from "@/generated/prisma/client";
import z from "zod";

const categoryBaseSchema = z.object({
    name: z.string().min(1, "Category name is required"),

    type: z.nativeEnum(CategoryType),
    forType: z.nativeEnum(TransactionType),

    parentId: z.string().optional().nullable(),
});

export const createCategorySchema = categoryBaseSchema;