'use server';

import { getCurrentUser } from "@/auth/currentUser";
import { MONTH } from "@/lib/constants/constants";
import { prisma } from "@/lib/prisma";


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
    ])

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
};