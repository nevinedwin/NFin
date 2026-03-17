export type MonthGroup = {
    key: string;
    label: string;
    transactions: any[];
    totalIncome: number;
    totalExpense: number;
};

export function groupByMonth(transactions: any[]): MonthGroup[] {
    const map = new Map<string, MonthGroup>();

    for (const tx of transactions) {
        const date = new Date(tx.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const label = date.toLocaleString("default", { month: "long", year: "numeric" });

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