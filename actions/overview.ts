'use server';
import { getCurrentUser } from "@/auth/currentUser";
import { Prisma } from "@/generated/prisma/client";
import { MONTH } from "@/lib/constants/constants";
import { prisma } from "@/lib/prisma";

export type TopCategory = {
    categoryId: string;
    name: string;
    icon: string | null;
    amount: number;
    percentage: number;
};

export async function getOverView() {
    const user = await getCurrentUser();
    if (!user) return { data: [], nextCursor: null };

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [cashFlow, owedToMe, iOwe] = await Promise.all([
        prisma.transaction.groupBy({
            by: ['type'],
            where: {
                userId: user.id,
                isDeleted: false,
                date: { gte: start, lt: end },
                type: { in: ['INCOME', 'EXPENSE'] }
            },
            _sum: { amount: true }
        }),
        prisma.contactBalance.aggregate({
            where: {
                userId: user.id,
                netAmount: { gt: 0 }
            },
            _sum: { netAmount: true },
            _count: { _all: true }
        }),
        prisma.contactBalance.aggregate({
            where: {
                userId: user.id,
                netAmount: { lt: 0 }
            },
            _sum: { netAmount: true },
            _count: { _all: true },
        }),
    ]);

    const result = [];

    cashFlow.forEach((r) => {
        result.push({
            id: r.type.toLowerCase(),
            amount: r._sum.amount?.toNumber(),
            label: r.type === "EXPENSE" ? 'Monthly Spend' : 'Monthly Income',
            subHeading: `${MONTH[now.getMonth()]} ${now.getFullYear()}`
        });
    });

    result.push({
        id: 'iowe',
        amount: iOwe._sum.netAmount?.toNumber() || 0,
        label: 'You Owe',
        subHeading: `${iOwe._count._all} contacts`
    });

    result.push({
        id: 'owe',
        amount: owedToMe._sum.netAmount?.toNumber() || 0,
        label: 'You are Owed',
        subHeading: `${owedToMe._count._all} contacts`
    });

    return { data: result, success: true };
}

export async function getCategoryOverview() {
    const user = await getCurrentUser();
    if (!user) return { data: [], nextCursor: null };

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const result = await prisma.$queryRaw(
        Prisma.sql`
            WITH expense_total AS (
                SELECT SUM(amount) AS total
                FROM "Transaction"
                WHERE "userId"    = ${user.id}
                  AND type        = CAST('EXPENSE' AS "TransactionType")
                  AND "isDeleted" = false
                  AND date        >= ${start}
                  AND date        < ${end}
            )
            SELECT
                t."categoryId",
                c.name,
                c.icon,
                SUM(t.amount)::float                        AS amount,
                ROUND(SUM(t.amount) / et.total * 100)::int  AS percentage
            FROM "Transaction" t
            JOIN "Category" c      ON c.id = t."categoryId"
            CROSS JOIN expense_total et
            WHERE t."userId"    = ${user.id}
              AND t.type        = CAST('EXPENSE' AS "TransactionType")
              AND t."isDeleted" = false
              AND t.date        >= ${start}
              AND t.date        < ${end}
              AND t."categoryId" IS NOT NULL
            GROUP BY t."categoryId", c.name, c.icon, et.total
            ORDER BY amount DESC
            LIMIT 4
        `
    ) as TopCategory[];

    return { data: result, success: true };
}