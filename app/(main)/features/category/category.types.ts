import { Category } from "@/generated/prisma/client";

export type CategoryFormType = Pick<Category, 'id' | 'name' | 'type' | 'forType' | 'isActive' | 'isDeleted' | 'parentId' | 'icon'>
