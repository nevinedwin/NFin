export type MonthGroup = {
    key: string;
    label: string;
    transactions: any[];
    totalIncome: number;
    totalExpense: number;
};

import { formatDate } from '@/lib/utils/dates';

export function groupByMonth(transactions: any[]): MonthGroup[] {
    const map = new Map<string, MonthGroup>();

    for (const tx of transactions) {
        const key = formatDate(tx.date, 'yyyy-MM');
        const label = formatDate(tx.date, 'LLLL yyyy');

        if (!map.has(key)) {
            map.set(key, { key, label, transactions: [], totalIncome: 0, totalExpense: 0 });
        }

        const group = map.get(key)!;
        group.transactions.push(tx);

        if (tx.type === "INCOME") group.totalIncome += tx.amount;
        if (tx.type === "EXPENSE") group.totalExpense += tx.amount;
    }

    return Array.from(map.values());
}