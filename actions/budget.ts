import { getCurrentUser } from "@/auth/currentUser";
import { prisma } from "@/lib/prisma";
import { BudgetPeriod, Prisma } from "@/generated/prisma/client";

export type BudgetCategoryPayload = {
    categoryId: string;
    allocatedAmount: string;
};

export type BudgetCategorySummary = {
    id: string;
    categoryId: string;
    categoryName: string;
    allocatedAmount: string;
    spendAmount: string;
};

export type BudgetSummary = {
    id: string;
    name: string;
    period: BudgetPeriod;
    startDate: string;
    endDate: string | null;
    totalAllocated: string;
    totalSpent: string;
    categories: BudgetCategorySummary[];
};

function normalizeMonthStart(date = new Date()) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function normalizeMonthEnd(startDate: Date) {
    return new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() + 1, 1));
}

function formatBudget(budget: any): BudgetSummary {
    const categories = budget.categories.map((category: any) => ({
        id: category.id,
        categoryId: category.categoryId,
        categoryName: category.category?.name ?? "Unknown",
        allocatedAmount: category.allocatedAmount.toString(),
        spendAmount: category.spendAmount.toString(),
    }));

    const totalAllocated = categories.reduce((sum: number, category: { allocatedAmount: any }) => sum + Number(category.allocatedAmount), 0);
    const totalSpent = categories.reduce((sum: number, category: { spendAmount: any }) => sum + Number(category.spendAmount), 0);

    return {
        id: budget.id,
        name: budget.name,
        period: budget.period,
        startDate: budget.startDate.toISOString(),
        endDate: budget.endDate?.toISOString() ?? null,
        totalAllocated: totalAllocated.toFixed(2),
        totalSpent: totalSpent.toFixed(2),
        categories,
    };
}

export async function getBudgets() {
    const user = await getCurrentUser();
    if (!user) return [];

    const budgets = await prisma.budget.findMany({
        where: { userId: user.id },
        include: {
            categories: {
                include: { category: { select: { id: true, name: true } } }
            }
        },
        orderBy: { startDate: "desc" },
        take: 6,
    });

    return budgets.map(formatBudget);
}

export async function createBudget({
    name,
    copyFromBudgetId,
    categories,
}: {
    name?: string;
    copyFromBudgetId?: string;
    categories?: BudgetCategoryPayload[];
}) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const startDate = normalizeMonthStart();
    const endDate = normalizeMonthEnd(startDate);

    const existingBudget = await prisma.budget.findFirst({
        where: {
            userId: user.id,
            startDate,
        },
    });

    if (existingBudget) {
        throw new Error("A budget already exists for the current month.");
    }

    if (copyFromBudgetId) {
        const previousBudget = await prisma.budget.findFirst({
            where: { id: copyFromBudgetId, userId: user.id },
            include: { categories: true },
        });

        if (!previousBudget) {
            throw new Error("Previous budget not found.");
        }

        const budgetName = name?.trim() || `Budget ${startDate.toLocaleString("default", { month: "long", year: "numeric" })}`;

        const budget = await prisma.budget.create({
            data: {
                name: budgetName,
                period: BudgetPeriod.MONTHLY,
                startDate,
                endDate,
                user: { connect: { id: user.id } },
                categories: {
                    create: previousBudget.categories.map((category) => ({
                        category: { connect: { id: category.categoryId } },
                        allocatedAmount: new Prisma.Decimal(category.allocatedAmount),
                        spendAmount: new Prisma.Decimal(0),
                    }))
                }
            },
            include: {
                categories: { include: { category: { select: { id: true, name: true } } } }
            }
        });

        return formatBudget(budget);
    }

    if (!categories || categories.length === 0) {
        throw new Error("At least one budget category is required.");
    }

    const validatedCategories = categories.filter((category) => category.categoryId && category.allocatedAmount && !isNaN(Number(category.allocatedAmount)));
    if (validatedCategories.length === 0) {
        throw new Error("Provide valid categories and amounts.");
    }

    const budgetName = name?.trim() || `Budget ${startDate.toLocaleString("default", { month: "long", year: "numeric" })}`;

    const budget = await prisma.budget.create({
        data: {
            name: budgetName,
            period: BudgetPeriod.MONTHLY,
            startDate,
            endDate,
            user: { connect: { id: user.id } },
            categories: {
                create: validatedCategories.map((category) => ({
                    category: { connect: { id: category.categoryId } },
                    allocatedAmount: new Prisma.Decimal(category.allocatedAmount),
                    spendAmount: new Prisma.Decimal(0),
                }))
            }
        },
        include: {
            categories: { include: { category: { select: { id: true, name: true } } } }
        }
    });

    return formatBudget(budget);
}
