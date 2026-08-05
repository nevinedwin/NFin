"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus, Repeat, Percent, Clock3 } from "lucide-react";
import { BudgetSummary, BudgetCategoryPayload } from "@/actions/budget";
import SearchSelect from "../ui/searchSelect";
import { getCategories } from "@/actions/category";
import { Card } from "../ui/card/card";
import CardContent from "../ui/card/cardContent";
import { formatDate } from "@/lib/utils/dates";

const EMPTY_ROW = { id: "", categoryId: "", categoryName: "", allocatedAmount: "" };

type BudgetPageProps = {
    budgets: BudgetSummary[];
};

const BudgetPage = ({ budgets }: BudgetPageProps) => {
    const [budgetRows, setBudgetRows] = useState<Array<(BudgetCategoryPayload & { id: string; categoryName: string })>>([
        { id: "row-1", categoryId: "", categoryName: "", allocatedAmount: "" }
    ]);
    const [name, setName] = useState(`Budget ${formatDate(new Date(), "MMMM yyyy")}`);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [budgetsState, setBudgetsState] = useState(budgets);
    const [isPending, startTransition] = useTransition();

    const currentMonth = formatDate(new Date(), "MMMM yyyy");
    const currentBudget = useMemo(() => budgetsState.find((budget) => budget.startDate.startsWith(new Date().toISOString().slice(0, 7))), [budgetsState]);
    const lastBudget = budgetsState[0];

    const totalAllocated = useMemo(
        () => budgetRows.reduce((sum, row) => sum + Number(row.allocatedAmount || 0), 0),
        [budgetRows]
    );

    const totalSpent = currentBudget ? Number(currentBudget.totalSpent) : 0;
    const remaining = currentBudget ? Number(currentBudget.totalAllocated) - totalSpent : 0;

    const categories = useMemo(
        () => currentBudget?.categories ?? [],
        [currentBudget]
    );

    const addRow = () => {
        setBudgetRows((prev) => [
            ...prev,
            { id: `row-${prev.length + 1}`, categoryId: "", categoryName: "", allocatedAmount: "" }
        ]);
    };

    const updateRow = (id: string, changes: Partial<BudgetCategoryPayload & { categoryName: string }>) => {
        setBudgetRows((prev) => prev.map((row) => row.id === id ? { ...row, ...changes } : row));
    };

    const removeRow = (id: string) => {
        setBudgetRows((prev) => prev.filter((row) => row.id !== id));
    };

    const handleCreateBudget = async () => {
        setError("");
        setSuccess("");

        const payload = budgetRows
            .filter((row) => row.categoryId && Number(row.allocatedAmount) > 0)
            .map((row) => ({ categoryId: row.categoryId, allocatedAmount: String(Number(row.allocatedAmount)) }));

        if (payload.length === 0) {
            setError("Add at least one category with an allocated amount.");
            return;
        }

        startTransition(async () => {
            try {
                const response = await fetch("/api/budget", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, categories: payload })
                });

                const result = await response.json();

                if (!response.ok) {
                    setError(result.message || "Unable to create budget.");
                    return;
                }

                setBudgetsState((prev) => [result, ...prev]);
                setSuccess("Budget created successfully.");
                setBudgetRows([{ id: "row-1", categoryId: "", categoryName: "", allocatedAmount: "" }]);
            } catch (err) {
                setError("Failed to create budget. Try again.");
            }
        });
    };

    const handleDuplicateLastBudget = async () => {
        if (!lastBudget) {
            setError("No previous budget to copy.");
            return;
        }

        setError("");
        setSuccess("");
        startTransition(async () => {
            try {
                const response = await fetch("/api/budget", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ copyFromBudgetId: lastBudget.id })
                });

                const result = await response.json();
                if (!response.ok) {
                    setError(result.message || "Unable to duplicate budget.");
                    return;
                }

                setBudgetsState((prev) => [result, ...prev]);
                setSuccess("Budget copied from last month.");
            } catch (err) {
                setError("Failed to duplicate budget.");
            }
        });
    };

    return (
        <div className="min-h-screen pb-10 px-4 sm:px-6 lg:px-8 text-slate-100">
            <div className="mx-auto max-w-3xl lg:max-w-6xl pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Budget</p>
                        <h1 className="text-3xl font-semibold tracking-tight text-white">Plan every month with clarity</h1>
                        <p className="mt-2 max-w-2xl text-slate-400">Create a monthly budget, copy last month’s allocations, and track actual spend by category in real time.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleDuplicateLastBudget}
                            disabled={!lastBudget || isPending}
                            className="inline-flex min-w-0 w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            <Repeat size={16} />
                            Copy last month
                        </button>
                        <button
                            type="button"
                            onClick={handleCreateBudget}
                            disabled={isPending}
                            className="inline-flex min-w-0 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            <Plus size={16} />
                            Create budget
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
                    <Card className="bg-slate-950 border-slate-800">
                        <CardContent className="space-y-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Current month</p>
                                    <h2 className="text-2xl font-semibold tracking-tight text-white">{currentMonth}</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="rounded-3xl bg-slate-900/80 p-4">
                                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Allocated</p>
                                        <p className="mt-2 text-xl font-semibold text-white">₹ {currentBudget ? currentBudget.totalAllocated : "0.00"}</p>
                                    </div>
                                    <div className="rounded-3xl bg-slate-900/80 p-4">
                                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Spent</p>
                                        <p className="mt-2 text-xl font-semibold text-white">₹ {currentBudget ? currentBudget.totalSpent : "0.00"}</p>
                                    </div>
                                    <div className="rounded-3xl bg-slate-900/80 p-4">
                                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Remaining</p>
                                        <p className="mt-2 text-xl font-semibold text-white">₹ {currentBudget ? Math.max(Number(currentBudget.totalAllocated) - Number(currentBudget.totalSpent), 0).toFixed(2) : "0.00"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-slate-400">Budget status</p>
                                        <p className="text-base font-semibold text-white">{currentBudget ? currentBudget.name : "No active budget"}</p>
                                    </div>
                                    <div className="inline-flex rounded-2xl bg-slate-950 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                                        {currentBudget ? "Active" : "Ready"}
                                    </div>
                                </div>

                                {currentBudget ? (
                                    <div className="space-y-4">
                                        {currentBudget.categories.map((category) => {
                                            const budget = Number(category.allocatedAmount);
                                            const spent = Number(category.spendAmount);
                                            const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
                                            return (
                                                <div key={category.id} className="space-y-2 rounded-3xl bg-slate-950/80 p-4">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-sm font-semibold text-white">{category.categoryName}</p>
                                                            <p className="text-xs text-slate-500">Allocated ₹{Number(category.allocatedAmount).toFixed(2)} • Spent ₹{Number(category.spendAmount).toFixed(2)}</p>
                                                        </div>
                                                        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${spent > budget ? "bg-rose-500/15 text-rose-300" : "bg-emerald-500/10 text-emerald-300"}`}>
                                                            {spent > budget ? "Over budget" : "On track"}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                                                        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${percent}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 p-6 text-center">
                                        <p className="text-sm text-slate-400">No budget has been created for this month yet. Build a plan with categories and see spend update automatically as you log expenses.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <Card className="bg-slate-950 border-slate-800">
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">New budget</p>
                                        <h2 className="text-xl font-semibold text-white">Build your month</h2>
                                    </div>
                                    <div className="rounded-3xl bg-slate-900/80 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-400">Fast setup</div>
                                </div>

                                <div className="space-y-4 rounded-3xl bg-slate-900/80 p-4">
                                    <label className="block text-sm text-slate-400">Budget name</label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <div>
                                            <p className="text-sm text-slate-400">Category allocations</p>
                                            <p className="text-xs text-slate-500">Add categories and allocate budget per month.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addRow}
                                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                                        >
                                            <Plus size={14} />
                                            Add row
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {budgetRows.map((row, index) => (
                                            <div key={row.id} className="grid gap-3 md:grid-cols-[1.8fr_1fr_0.6fr]">
                                                <SearchSelect
                                                    name={`category-${row.id}`}
                                                    label="Category"
                                                    placeholder="Search category"
                                                    displayValue={row.categoryName}
                                                    method={getCategories}
                                                    mapOption={(item: any) => ({ label: item.name, value: item.id })}
                                                    type={undefined}
                                                    onChange={(val, label) => updateRow(row.id, { categoryId: val, categoryName: label })}
                                                />
                                                <div>
                                                    <label className="block text-sm text-slate-400">Allocate</label>
                                                    <input
                                                        value={row.allocatedAmount}
                                                        onChange={(e) => updateRow(row.id, { allocatedAmount: e.target.value.replace(/[^0-9.]/g, "") })}
                                                        placeholder="0.00"
                                                        className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(row.id)}
                                                    className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-200 transition hover:border-slate-500 md:mt-0"
                                                >Remove</button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3">
                                        <div>
                                            <p className="text-sm text-slate-400">Total allocation</p>
                                            <p className="text-lg font-semibold text-white">₹ {totalAllocated.toFixed(2)}</p>
                                        </div>
                                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                                            <Clock3 size={14} /> Future month
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-950 border-slate-800">
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Recent budgets</p>
                                        <h2 className="text-xl font-semibold text-white">Recent plans</h2>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {budgetsState.slice(0, 3).map((budget) => (
                                        <div key={budget.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{budget.name}</p>
                                                    <p className="text-xs text-slate-500">{formatDate(new Date(budget.startDate), "LLLL yyyy")}</p>
                                                </div>
                                                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">{budget.categories.length} categories</span>
                                            </div>
                                            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                <div className="rounded-3xl bg-slate-950/80 p-3">
                                                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Allocated</p>
                                                    <p className="mt-2 text-base font-semibold text-white">₹ {budget.totalAllocated}</p>
                                                </div>
                                                <div className="rounded-3xl bg-slate-950/80 p-3">
                                                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Spent</p>
                                                    <p className="mt-2 text-base font-semibold text-white">₹ {budget.totalSpent}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {(error || success) && (
                    <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-100">
                        {error ? <span className="text-rose-300">{error}</span> : <span className="text-emerald-300">{success}</span>}
                    </div>
                )}

                <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <Percent size={16} />
                        <p>Budgets are automatically updated as you log expense transactions with categories. Fixed costs and EMIs are tracked here as spending against category targets.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetPage;
