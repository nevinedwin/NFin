"use client";

import { useEffect, useState } from "react";
import { Plus, Clock3, X } from "lucide-react";
import { BudgetCategoryPayload } from "@/actions/budget";
import SearchSelect from "../ui/searchSelect";
import { getCategories } from "@/actions/category";

export type BudgetRow = BudgetCategoryPayload & { id: string; categoryName: string };

type BudgetSheetProps = {
  open: boolean;
  isEditing: boolean;
  name: string;
  budgetRows: BudgetRow[];
  totalAllocated: number;
  isSaving: boolean;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onAddRow: () => void;
  onUpdateRow: (id: string, changes: Partial<BudgetRow>) => void;
  onRemoveRow: (id: string) => void;
  onSubmit: () => void;
};

const BudgetSheet = ({
  open,
  isEditing,
  name,
  budgetRows,
  totalAllocated,
  isSaving,
  onClose,
  onNameChange,
  onAddRow,
  onUpdateRow,
  onRemoveRow,
  onSubmit,
}: BudgetSheetProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) setVisible(true);
    else {
      const timer = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`w-full max-w-4xl rounded-t-[28px] bg-slate-950 shadow-2xl transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"}`}
        style={{ height: "85vh" }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{isEditing ? "Edit Budget" : "Create Budget"}</p>
            <h2 className="text-2xl font-semibold text-white">{isEditing ? "Update your monthly plan" : "Build a new budget"}</h2>
          </div>
          <button onClick={onClose} className="rounded-full border border-border bg-surface p-2 text-slate-200 hover:bg-surface-soft">
            <X size={18} />
          </button>
        </div>

        <div className="flex h-full flex-col overflow-hidden px-2 pb-6 pt-4">
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-5 rounded-3xl  p-2 shadow-sm">
              <div className="space-y-3 rounded-3xl bg-surface-soft/90 p-4">
                <label className="block text-sm text-slate-400">Budget name</label>
                <input
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="rounded-3xl border border-border bg-surface-soft/90 p-4">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div>
                    <p className="text-sm text-slate-400">Category allocations</p>
                    <p className="text-xs text-slate-500">Add categories and allocate budget per month.</p>
                  </div>
                  <button
                    type="button"
                    onClick={onAddRow}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                  >
                    <Plus size={14} />
                    Add row
                  </button>
                </div>

                <div className="space-y-4">
                  {budgetRows.map((row) => (
                    <div key={row.id} className="grid gap-2 md:grid-cols-[1.7fr_1fr_0.7fr]">
                      <SearchSelect
                        name={`category-${row.id}`}
                        label="Category"
                        placeholder="Search category"
                        displayValue={row.categoryName}
                        method={getCategories}
                        mapOption={(item: any) => ({ label: item.name, value: item.id })}
                        type={undefined}
                        onChange={(val, label) => onUpdateRow(row.id, { categoryId: val, categoryName: label })}
                      />
                      <div>
                        <label className="block text-sm text-slate-400">Allocate</label>
                        <input
                          value={row.allocatedAmount}
                          onChange={(e) => onUpdateRow(row.id, { allocatedAmount: e.target.value.replace(/[^0-9.]/g, "") })}
                          placeholder="0.00"
                          className="mt-1 w-full rounded-2xl border border-border bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveRow(row.id)}
                        className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-2xl border border-border bg-slate-800 text-sm font-semibold text-slate-200 transition hover:border-slate-500 md:mt-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 rounded-3xl border border-border bg-surface-soft/90 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Total allocation</p>
                <p className="text-lg font-semibold text-white">₹ {totalAllocated.toFixed(2)}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                <Clock3 size={14} /> Future month
              </span>
            </div>

            <button
              type="button"
              disabled={isSaving}
              onClick={onSubmit}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEditing ? "Save changes" : "Create budget"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSheet;
