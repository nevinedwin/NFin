"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus, Repeat, Percent, Clock3 } from "lucide-react";
import { BudgetSummary, BudgetCategoryPayload } from "@/actions/budget";
import SearchSelect from "../ui/searchSelect";
import { getCategories } from "@/actions/category";
import { Card } from "../ui/card/card";
import CardContent from "../ui/card/cardContent";
import { formatDate } from "@/lib/utils/dates";
import { BackArrowButton } from "../ui/backArrowbutton";
import Addbutton from "../ui/addbutton";
import BudgetSheet from "./budgetSheet";

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
    const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
    const [isBudgetSheetOpen, setIsBudgetSheetOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const isEditing = Boolean(editingBudgetId);
    const editingBudget = useMemo(
        () => budgetsState.find((budget) => budget.id === editingBudgetId) ?? null,
        [budgetsState, editingBudgetId]
    );

    const currentMonth = formatDate(new Date(), "MMMM yyyy");

    const resetForm = () => {
        setEditingBudgetId(null);
        setName(`Budget ${formatDate(new Date(), "MMMM yyyy")}`);
        setBudgetRows([{ id: "row-1", categoryId: "", categoryName: "", allocatedAmount: "" }]);
        setIsBudgetSheetOpen(false);
    };

    const loadBudgetForEdit = (budget: BudgetSummary) => {
        setEditingBudgetId(budget.id);
        setName(budget.name);
        setBudgetRows(
            budget.categories.map((category, index) => ({
                id: `row-${index + 1}`,
                categoryId: category.categoryId,
                categoryName: category.categoryName,
                allocatedAmount: category.allocatedAmount,
            }))
        );
        setIsBudgetSheetOpen(true);
    };
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

    const handleSaveBudget = async () => {
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
                    method: isEditing ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...(isEditing ? { budgetId: editingBudgetId } : {}),
                        name,
                        categories: payload,
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    setError(result.message || "Unable to save budget.");
                    return;
                }

                setBudgetsState((prev) => {
                    if (isEditing && result?.id) {
                        return prev.map((budget) => (budget.id === result.id ? result : budget));
                    }
                    return [result, ...prev];
                });
                setSuccess(isEditing ? "Budget updated successfully." : "Budget created successfully.");
                resetForm();
            } catch (err) {
                setError(isEditing ? "Failed to update budget. Try again." : "Failed to create budget. Try again.");
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

    const openBudgetSheet = () => {
        setEditingBudgetId(null);
        setName(`Budget ${formatDate(new Date(), "MMMM yyyy")}`);
        setBudgetRows([{ id: "row-1", categoryId: "", categoryName: "", allocatedAmount: "" }]);
        setIsBudgetSheetOpen(true);
    };

    return (
        <div className="min-h-screen bg-background text-slate-100 p-4">
            <div className="flex-shrink-0 flex justify-between items-center">
                <div className="flex gap-2 justify-start items-center">
                    <div>
                        <BackArrowButton href="/dashboard" size={30} />
                    </div>
                    <div className='flex flex-col justify-center items-start'>
                        <p className='font-semibold tracking-wide'>Budget</p>
                        <p className='text-text-secondary text-xs'>Organize Budgets</p>
                    </div>
                </div>

                <Addbutton disabled={isPending} onClick={openBudgetSheet} label="Create budget" />
            </div>

            <div className="mt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-500">Current month</p>
                        <h2 className="text-2xl font-semibold tracking-tight text-white">{currentMonth}</h2>
                    </div>
                    <div className="rounded-2xl bg-surface-soft/90 p-2 px-4">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Allocated</p>
                        <p className="mt-2 text-lg font-semibold text-white">₹ {currentBudget ? currentBudget.totalAllocated : "0.00"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
                        <div className="rounded-2xl bg-surface-soft/90 p-5">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Spent</p>
                            <p className="mt-2 text-lg font-semibold text-white">₹ {currentBudget ? currentBudget.totalSpent : "0.00"}</p>
                        </div>
                        <div className="rounded-2xl bg-surface-soft/90 p-5">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Remaining</p>
                            <p className="mt-2 text-lg font-semibold text-white">₹ {currentBudget ? Math.max(Number(currentBudget.totalAllocated) - Number(currentBudget.totalSpent), 0).toFixed(2) : "0.00"}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-border bg-surface-soft/80 p-4 mt-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Budget status</p>
                            <p className="text-base font-semibold text-white">{currentBudget ? currentBudget.name : "No active budget"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="inline-flex rounded-2xl bg-surface px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-slate-400">
                                {currentBudget ? "Active" : "Ready"}
                            </div>
                            {currentBudget && (
                                <button
                                    type="button"
                                    onClick={() => loadBudgetForEdit(currentBudget)}
                                    className="rounded-2xl border border-border bg-surface-soft/80 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>
                    {currentBudget ? (
                        currentBudget.categories.map((category) => {
                            const budget = Number(category.allocatedAmount);
                            const spent = Number(category.spendAmount);
                            const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
                            return (
                                <div key={category.id} className="space-y-2 rounded-3xl bg-surface p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex justify-between gap-1 item-center">
                                            <p className="text-sm font-semibold text-white">{category.categoryName}</p>
                                            <span className={`rounded-full p-3 font-semibold ${spent > budget ? "bg-rose-500/15 text-rose-300" : "bg-emerald-500 text-emerald-300"}`}>
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">Allocated ₹{Number(category.allocatedAmount).toFixed(2)} • Spent ₹{Number(category.spendAmount).toFixed(2)}</p>

                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-soft">
                                        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${percent}%` }} />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-3xl border border-dashed border-border bg-surface-soft/70 p-6 text-center">
                            <p className="text-sm text-slate-400">No budget has been created for this month yet. Build a plan with categories and see spend update automatically as you log expenses.</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4 mt-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Recent budgets</p>
                                    <h2 className="text-xl font-semibold text-white">Recent plans</h2>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {budgetsState.slice(0, 3).map((budget) => (
                                    <div key={budget.id} className="rounded-3xl border border-border bg-surface-soft/90 p-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-white">{budget.name}</p>
                                                <p className="text-xs text-slate-500">{formatDate(new Date(budget.startDate), "LLLL yyyy")}</p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">{budget.categories.length} categories</span>
                                                <button
                                                    type="button"
                                                    onClick={() => loadBudgetForEdit(budget)}
                                                    className="rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div className="rounded-3xl bg-surface-soft/90 p-3">
                                                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Allocated</p>
                                                <p className="mt-2 text-base font-semibold text-white">₹ {budget.totalAllocated}</p>
                                            </div>
                                            <div className="rounded-3xl bg-surface-soft/90 p-3">
                                                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Spent</p>
                                                <p className="mt-2 text-base font-semibold text-white">₹ {budget.totalSpent}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">

                <BudgetSheet
                    open={isBudgetSheetOpen}
                    isEditing={isEditing}
                    name={name}
                    budgetRows={budgetRows}
                    totalAllocated={totalAllocated}
                    isSaving={isPending}
                    onClose={resetForm}
                    onNameChange={setName}
                    onAddRow={addRow}
                    onUpdateRow={updateRow}
                    onRemoveRow={removeRow}
                    onSubmit={handleSaveBudget}
                />



                {(error || success) && (
                    <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-100">
                        {error ? <span className="text-rose-300">{error}</span> : <span className="text-emerald-300">{success}</span>}
                    </div>
                )}

            </div>
        </div>
    );
};

export default BudgetPage;
