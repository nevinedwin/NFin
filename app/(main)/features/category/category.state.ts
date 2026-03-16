import { Category, CategoryType, TransactionType } from "@/generated/prisma/client";
import { CategoryFormType } from "./category.types";

export const categoryFormInitalState: CategoryFormType = {
    id: '',
    name: '',
    type: CategoryType.MAIN,
    forType: TransactionType.EXPENSE,
    isActive: true,
    isDeleted: false,
    parentId: null,
    icon: ''
};

