import { useCallback, useMemo, useState } from "react";
import type { TransactionsContactItem } from "@/app/(main)/features/transaction/transaction.types";

export type SplitTab = "byEvenly" | "byAmount" | "byShares" | "byPercentages";

/** Per-contact overrides stored as plain Maps for O(1) access. */
type OverrideMap = Map<string, number>;

export interface SplitAllocations {
  /** Derived amount (or share display value) per contact id */
  allocations: Map<string, number>;
  /** Manually set amount overrides — only used by byAmount */
  amountOverrides: OverrideMap;
  setAmountOverride: (id: string, value: number) => void;
  /** Share counts — only used by byShares */
  shares: OverrideMap;
  incrementShare: (id: string) => void;
  decrementShare: (id: string) => void;
  /** Percentage overrides — only used by byPercentages */
  percentages: OverrideMap;
  setPercentage: (id: string, value: number) => void;
  /** Validation error string (empty = valid) */
  validationError: string;
  validate: () => boolean;
  /** Reset all overrides (call on tab change or contacts reset) */
  resetOverrides: () => void;
  /** Build the final contacts array enriched with obligation_amount for form submission */
  buildPayload: () => TransactionsContactItem[];
}

export function useSplitAllocations(
  contacts: TransactionsContactItem[],
  totalAmount: number,
  tab: SplitTab
): SplitAllocations {
  const [amountOverrides, setAmountOverrides] = useState<OverrideMap>(new Map());
  const [shares, setShares] = useState<OverrideMap>(new Map());
  const [percentages, setPercentages] = useState<OverrideMap>(new Map());

  const resetOverrides = useCallback(() => {
    setAmountOverrides(new Map());
    setShares(new Map());
    setPercentages(new Map());
  }, []);

  // ── byAmount helpers ──────────────────────────────────────────────────────
  const setAmountOverride = useCallback((id: string, value: number) => {
    setAmountOverrides((prev) => {
      const next = new Map(prev);
      if (isNaN(value) || value < 0) {
        next.delete(id);
      } else {
        next.set(id, value);
      }
      return next;
    });
  }, []);

  // ── byShares helpers ──────────────────────────────────────────────────────
  const incrementShare = useCallback((id: string) => {
    setShares((prev) => {
      const next = new Map(prev);
      next.set(id, (prev.get(id) ?? 1) + 1);
      return next;
    });
  }, []);

  const decrementShare = useCallback((id: string) => {
    setShares((prev) => {
      const current = prev.get(id) ?? 1;
      if (current <= 1) return prev;
      const next = new Map(prev);
      next.set(id, current - 1);
      return next;
    });
  }, []);

  // ── byPercentages helpers ─────────────────────────────────────────────────
  const setPercentage = useCallback((id: string, value: number) => {
    setPercentages((prev) => {
      const next = new Map(prev);
      if (isNaN(value) || value < 0) {
        next.delete(id);
      } else {
        next.set(id, value);
      }
      return next;
    });
  }, []);

  // ── Derived allocations ───────────────────────────────────────────────────
  const allocations = useMemo<Map<string, number>>(() => {
    const result = new Map<string, number>();
    const count = contacts.length;
    if (count === 0) return result;

    switch (tab) {
      case "byEvenly": {
        const each = totalAmount / count;
        contacts.forEach((c) => result.set(c.id, each));
        break;
      }

      case "byAmount": {
        // Contacts with a manual override
        const editedIds = new Set(
          contacts.filter((c) => amountOverrides.has(c.id)).map((c) => c.id)
        );
        const editedTotal = [...editedIds].reduce(
          (sum, id) => sum + (amountOverrides.get(id) ?? 0),
          0
        );
        const uneditedContacts = contacts.filter((c) => !editedIds.has(c.id));
        const remainder = totalAmount - editedTotal;
        const evenRemainder =
          uneditedContacts.length > 0 ? remainder / uneditedContacts.length : 0;

        contacts.forEach((c) => {
          if (editedIds.has(c.id)) {
            result.set(c.id, amountOverrides.get(c.id)!);
          } else {
            result.set(c.id, Math.max(0, evenRemainder));
          }
        });
        break;
      }

      case "byShares": {
        const totalShares = contacts.reduce(
          (sum, c) => sum + (shares.get(c.id) ?? 1),
          0
        );
        const perShare = totalShares > 0 ? totalAmount / totalShares : 0;
        contacts.forEach((c) => {
          const s = shares.get(c.id) ?? 1;
          result.set(c.id, s * perShare);
        });
        break;
      }

      case "byPercentages": {
        contacts.forEach((c) => {
          const pct = percentages.get(c.id) ?? 0;
          result.set(c.id, (pct / 100) * totalAmount);
        });
        break;
      }
    }
    return result;
  }, [tab, contacts, totalAmount, amountOverrides, shares, percentages]);

  // ── Validation ────────────────────────────────────────────────────────────
  const getValidationError = useCallback((): string => {
    if (contacts.length === 0) return "";

    switch (tab) {
      case "byAmount": {
        const sum = [...allocations.values()].reduce((a, b) => a + b, 0);
        const diff = Math.abs(sum - totalAmount);
        if (diff > 0.01) {
          return sum < totalAmount
            ? `Amount is ₹${(totalAmount - sum).toFixed(2)} less than total`
            : `Amount is ₹${(sum - totalAmount).toFixed(2)} more than total`;
        }
        return "";
      }
      case "byPercentages": {
        const total = [...percentages.values()].reduce((a, b) => a + b, 0);
        const diff = Math.abs(total - 100);
        if (diff > 0.01) {
          return total < 100
            ? `Percentage is ${(100 - total).toFixed(1)}% less than 100%`
            : `Percentage is ${(total - 100).toFixed(1)}% more than 100%`;
        }
        // Also ensure all contacts have a percentage assigned
        const missing = contacts.filter((c) => !percentages.has(c.id));
        if (missing.length > 0) return "Assign percentages to all selected contacts";
        return "";
      }
      default:
        return "";
    }
  }, [tab, contacts, allocations, totalAmount, percentages]);

  const validate = useCallback((): boolean => {
    return getValidationError() === "";
  }, [getValidationError]);

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = useCallback((): TransactionsContactItem[] => {
    return contacts.map((c) => ({
      ...c,
      splitType: tab,
      obligationAmount: allocations.get(c.id) ?? 0,
    }));
  }, [contacts, tab, allocations]);

  return {
    allocations,
    amountOverrides,
    setAmountOverride,
    shares,
    incrementShare,
    decrementShare,
    percentages,
    setPercentage,
    validationError: getValidationError(),
    validate,
    resetOverrides,
    buildPayload,
  };
}