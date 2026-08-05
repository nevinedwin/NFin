"use client";
import { RUPEE_SYMBOL } from "@/lib/constants/constants";
import TypeButton, { ButtonColors } from "../ui/typeButton";
import { createTransaction } from "@/actions/transactions";
import { TransactionType } from "@/generated/prisma/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "@/hooks/form/useForm";
import { transactionFormInitalState } from "@/app/(main)/features/transaction/transaction.state";
import { SearchSelectRef } from "../ui/searchSelect";
import { formatUnderScoredString, formatUnderScoredStringCut } from "@/lib/utils/formats";
import YesNoToggle from "../ui/toggleButton";
import { useRouter } from "next/navigation";
import { paginatedAccount } from "@/actions/accounts";
import { accountOption } from "@/app/(main)/features/account/account.map";
import { getCategories } from "@/actions/category";
import { getContacts } from "@/actions/contacts";
import { Tabs } from "../ui/tabComponent";
import { Percent, PersonStanding, PieChart } from "lucide-react";
import ShowBalanceComp from "../ui/showBalance";
import HorizontalLine from "../ui/horizontalLine";
import MultiSelect from "../ui/multiSelect";
import { getGroupMembers, getGroups } from "@/actions/groups";
import { TransactionsContactItem } from "@/app/(main)/features/transaction/transaction.types";
import { useSplitAllocations } from "@/hooks/useSplitAllocation";
import SplitContactRow from "./groupSplit/splitContactRow";
import LoaderButton from "../ui/loaderButton";
import TransactionOptions from "../ui/transactionOptions";

// ─── Types ───────────────────────────────────────────────────────────────────

type TransactionCardProp = {
    closeFn: () => void;
};

type TabsType = "byEvenly" | "byAmount" | "byShares" | "byPercentages";

export type TabItem<T extends string> = {
    id: T;
    label: React.ReactNode;
};

// A single wizard step definition
type StepDef = {
    // Unique key for this step
    id: string;
    // Which formState field(s) must be non-empty to proceed. Empty array = always valid.
    requiredFields: (keyof ReturnType<typeof useForm<typeof transactionFormInitalState>>["state"])[];
    // Render the step's content
    render: () => React.ReactNode;
    // Optionally skip this step entirely based on current form state
    skip?: (state: ReturnType<typeof useForm<typeof transactionFormInitalState>>["state"]) => boolean;
    // If true, this step auto-advances on selection — no Next button shown
    autoAdvance?: boolean;
};

// ─── Constants ───────────────────────────────────────────────────────────────

export const COLOR_BUTTON: Record<TransactionType, ButtonColors> = {
    EXPENSE: "red",
    INCOME: "green",
    TRANSFER: "blue",
    GROUP_SPLIT: "purple",
    LEND: "yellow",
    BORROW: "orange",
};

const TAB_ITEMS: TabItem<TabsType>[] = [
    {
        id: "byEvenly",
        label: (
            <div className="flex justify-center items-center">
                <PersonStanding />|<PersonStanding />
            </div>
        ),
    },
    {
        id: "byAmount",
        label: (
            <div className="text-white font-semibold flex justify-center items-center">
                123
            </div>
        ),
    },
    {
        id: "byShares",
        label: (
            <div className="flex justify-center items-center">
                <PieChart className="text-white" />
            </div>
        ),
    },
    {
        id: "byPercentages",
        label: (
            <div className="flex justify-center items-center">
                <Percent className="text-white" />
            </div>
        ),
    },
];

const MAX_DIGITS = 8;

const NO_REPEAT_TYPES = new Set<TransactionType>([
    TransactionType.BORROW,
    TransactionType.LEND,
    TransactionType.GROUP_SPLIT,
]);

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDots({ total, current }: { total: number; current: number }) {
    return (
        <div className="flex gap-1.5 items-center justify-center">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${i === current
                        ? "w-4 h-2 bg-slate-300"
                        : i < current
                            ? "w-2 h-2 bg-slate-500"
                            : "w-2 h-2 bg-slate-700"
                        }`}
                />
            ))}
        </div>
    );
}

// ─── Auto-sizing amount input ────────────────────────────────────────────────
// Mirrors the input value into a hidden span, reads its width, and keeps the
// input exactly that wide — so it starts compact and grows as the user types.

function AutoSizeAmountInput({
    value,
    onChange,
    onEnter
}: {
    value: string | number;
    onChange: (val: string) => void;
    onEnter?: () => void;
}) {
    const mirrorRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputWidth, setInputWidth] = useState(10); // initial px width

    // Measure the mirror span every time value changes
    useEffect(() => {
        if (mirrorRef.current) {
            const w = mirrorRef.current.offsetWidth;
            setInputWidth(Math.max(10, w + 35));
        }
    }, [value]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const displayText = value !== "" && value !== undefined ? String(value) : "0";

    return (
        <div className="relative flex items-center justify-center">
            <span
                ref={mirrorRef}
                aria-hidden
                className="absolute left-0 top-0 text-center font-bold whitespace-pre pointer-events-none"
                style={{ visibility: "hidden", fontSize: '2.9rem' }}
            >
                {displayText}
            </span>

            <input
                ref={inputRef}
                name="amount"
                type="number"
                value={value}
                onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    if (digits.length <= MAX_DIGITS) onChange(e.target.value);
                }}
                onKeyDown={(e) => {
                    const digits = String(value).replace(/\D/g, "");
                    const isDigit = /^\d$/.test(e.key);
                    if (isDigit && digits.length >= MAX_DIGITS) e.preventDefault();
                    if (e.key === "Enter" && value && Number(value) > 0) {
                        e.preventDefault();
                        onEnter?.(); // 👈 call parent handler
                    }
                }}
                onBlur={() => {
                    // 👈 iPhone Done button triggers blur
                    if (value && Number(value) > 0) {
                        onEnter?.();
                    }
                }}
                enterKeyHint="done"
                placeholder="0"
                inputMode="decimal"
                required
                step={0.01}
                min={0}
                style={{ width: inputWidth, fontSize: '2.9rem' }}
                className="outline-none border-none font-bold bg-transparent transition-[width] duration-100"
            />
        </div>
    );
}

// ─── Summary bar ─────────────────────────────────────────────────────────────
// Shows the entered amount + selected type on every step after the first two.

function TransactionSummaryBar({
    amount,
    type,
    colorMap,
}: {
    amount: string | number;
    type: TransactionType;
    colorMap: Record<TransactionType, ButtonColors>;
}) {
    const colorClass: Record<ButtonColors, string> = {
        red: "bg-red-900/40 text-red-300 border border-red-800",
        green: "bg-green-900/40 text-green-300 border border-green-800",
        blue: "bg-blue-900/40 text-blue-300 border border-blue-800",
        purple: "bg-purple-900/40 text-purple-300 border border-purple-800",
        yellow: "bg-yellow-900/40 text-yellow-300 border border-yellow-800",
        orange: "bg-orange-900/40 text-orange-300 border border-orange-800",
    };

    return (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <span className="text-2xl font-bold text-white">
                {RUPEE_SYMBOL}{" "}
                {Number(amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                })}
            </span>
            <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass[colorMap[type]]}`}
            >
                {formatUnderScoredStringCut(type)}
            </span>
        </div>
    );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TransactionCard({ closeFn }: TransactionCardProp) {
    const router = useRouter();
    const [stepIndex, setStepIndex] = useState(0);
    const [tab, setTab] = useState<TabsType>("byEvenly");
    const [error, setError] = useState<string>("");
    const [contacts, setContacts] = useState<TransactionsContactItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { state: formState, setField, reset, resetKeep } = useForm(transactionFormInitalState);

    const {
        amount,
        description,
        repeat,
        type,
        account,
        accountId,
        category,
        categoryId,
        contact,
        contactId,
        group,
        groupId,
        toAccount,
        toAccountId,
    } = formState;

    const {
        allocations,
        amountOverrides,
        setAmountOverride,
        shares,
        incrementShare,
        decrementShare,
        percentages,
        setPercentage,
        validationError: splitValidationError,
        validate: validateSplit,
        resetOverrides,
        buildPayload,
    } = useSplitAllocations(contacts, Number(amount), tab);

    // ── Refs ────────────────────────────────────────────────────────────────
    const categoryRef = useRef<SearchSelectRef>(null);
    const accountRef = useRef<SearchSelectRef>(null);
    const toAccountRef = useRef<SearchSelectRef>(null);
    const contactRef = useRef<SearchSelectRef>(null);
    const groupRef = useRef<SearchSelectRef>(null);

    // ── Effects ─────────────────────────────────────────────────────────────

    useEffect(() => {
        resetOverrides();
    }, [tab]);

    // When type changes: if amount is already set (user is mid-flow changing type),
    // keep them moving forward to step 2. On initial mount, just reset to step 0.
    useEffect(() => {
        resetKeep(["type", "amount"]);
        setError("");
        setContacts([]);
        if (amount && Number(amount) > 0) {
            // User already entered amount and is switching type — advance past type step
            setStepIndex(1);
            const t = setTimeout(() => setStepIndex(2), 180);
            return () => clearTimeout(t);
        } else {
            // Fresh load or no amount yet — start at step 0
            setStepIndex(0);
        }
    }, [type]);

    // ── Field helpers ────────────────────────────────────────────────────────

    const handleFieldChange = useCallback(
        <K extends keyof typeof formState>(field: K, value: any) => {
            setError("");
            setField(field, value);
        },
        [setField]
    );

    // ── Shared renderable fields ─────────────────────────────────────────────

    // ── Step definitions per type ─────────────────────────────────────────────
    //
    // To add a new step (e.g. contact for a new type), just add an entry here.
    // Steps are rendered in order; `requiredFields` drives Next-button disabling.
    //

    const stepsByType = useMemo((): StepDef[] => {
        // Step 0: Amount only — auto-focuses on mount
        const amountStep: StepDef = {
            id: "amount",
            requiredFields: ["amount"],
            render: () => (
                <div className="w-full h-full flex flex-col justify-center items-center gap-4 px-4 pt-6">
                    <label className="text-[17px] self-center text-slate-500">Enter transaction amount</label>
                    <div className="flex items-center gap-1">
                        <span className="text-2xl font-semibold text-slate-400">{RUPEE_SYMBOL}</span>
                        <AutoSizeAmountInput
                            value={amount}
                            onChange={(val) => handleFieldChange("amount", val)}
                            onEnter={goNext}
                        />
                    </div>
                </div>
            ),
        };

        // Step 1: Type selection — auto-advances when a type is picked.
        // We don't call goNextAuto here because the type-change useEffect resets
        // stepIndex to 0; instead a separate effect watches for type being set
        // while on the type step and advances forward.
        const typeStep: StepDef = {
            id: "type",
            requiredFields: [],
            autoAdvance: true,
            render: () => (
                <div className="px-4 flex flex-col justify-center items-center gap-8">
                    <p className="text-[17px] text-slate-500">Transaction type</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 w-full justify-items-center">
                        {(Object.keys(TransactionType) as TransactionType[]).map((t) => (
                            <div className="w-full justify-center flex" key={t}>
                                <TypeButton
                                    active={type === t}
                                    onClick={() => handleFieldChange("type", t)}
                                    label={formatUnderScoredStringCut(t)}
                                    color={COLOR_BUTTON[t]}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ),
        };

        // Shared first two steps
        const baseSteps = [amountStep, typeStep];

        switch (type) {
            case TransactionType.EXPENSE:
            case TransactionType.INCOME:
                return [
                    ...baseSteps,
                    {
                        id: "category",
                        requiredFields: ["categoryId"],
                        autoAdvance: true,
                        render: () => (
                            <div className="px-4 h-full w-full flex flex-col gap-4 pt-4">
                                <p className="text-[17px] text-slate-500 self-center">
                                    Select a category
                                </p>
                                <div className="flex-1 min-h-0 w-full">
                                    <TransactionOptions
                                        key={`category-${type}`}
                                        method={getCategories}
                                        mapOption={accountOption}
                                        type={type}
                                        name="categoryId"
                                        onSelect={() => categoryRef.current?.focus?.()}
                                        onChange={(val, label) => {
                                            handleFieldChange("categoryId", val);
                                            handleFieldChange("category", label);
                                            goNextAuto();
                                        }}
                                        value={categoryId}
                                    />
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: "account",
                        requiredFields: ["accountId"],
                        autoAdvance: true,
                        render: () => (
                            <div className="px-4 h-full w-full flex flex-col gap-4 pt-4">
                                <p className="text-[17px] text-slate-500 self-center">
                                    Which account
                                </p>
                                <div className="flex-1 min-h-0 w-full">
                                    <TransactionOptions
                                        key={`account-${type}`}
                                        method={paginatedAccount}
                                        mapOption={accountOption}
                                        name="accountId"
                                        onSelect={() => accountRef.current?.focus?.()}
                                        onChange={(val, label) => {
                                            handleFieldChange("accountId", val);
                                            handleFieldChange("account", label);
                                            goNextAuto();
                                        }}
                                        value={accountId}
                                    />
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: "description",
                        requiredFields: [],
                        render: () => renderDescriptionStep(),
                    },
                ];

            case TransactionType.TRANSFER:
                return [
                    ...baseSteps,
                    {
                        id: "from-account",
                        requiredFields: ["accountId"],
                        autoAdvance: true,
                        render: () => (
                            <div className="px-4 h-full w-full flex flex-col gap-4 pt-4">
                                <p className="text-[17px] text-slate-500 self-center">
                                    Tansfer From
                                </p>
                                <div className="flex-1 min-h-0 w-full">
                                    <TransactionOptions
                                        key={`account-transfer-from`}
                                        method={paginatedAccount}
                                        mapOption={accountOption}
                                        name="accountId"
                                        onSelect={() => accountRef.current?.focus?.()}
                                        onChange={(val, label) => {
                                            handleFieldChange("accountId", val);
                                            handleFieldChange("account", label);
                                            goNextAuto();
                                        }}
                                        value={accountId}
                                    />
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: "to-account",
                        requiredFields: ["toAccountId"],
                        autoAdvance: true,
                        render: () => (
                            <div className="px-4 h-full w-full flex flex-col gap-4 pt-4">
                                <p className="text-[17px] text-slate-500 self-center">
                                    Tansfer to
                                </p>
                                <div className="flex-1 min-h-0 w-full">
                                    <TransactionOptions
                                        key={`toAccount-${type}`}
                                        method={paginatedAccount}
                                        mapOption={accountOption}
                                        name="toAccountId"
                                        onSelect={() => toAccountRef.current?.focus?.()}
                                        onChange={(val, label) => {
                                            handleFieldChange("toAccountId", val);
                                            handleFieldChange("toAccount", label);
                                            goNextAuto();
                                        }}
                                        value={toAccountId}
                                    />
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: "description",
                        requiredFields: [],
                        render: () => renderDescriptionStep(),
                    },
                ];

            case TransactionType.BORROW:
            case TransactionType.LEND:
                return [
                    ...baseSteps,
                    {
                        id: "contact",
                        requiredFields: ["contactId"],
                        autoAdvance: true,
                        render: () => (
                            <div className="px-4 h-full w-full flex flex-col gap-4 pt-4">
                                <p className="text-[17px] text-slate-500 self-center">
                                    {type === TransactionType.BORROW ? "Borrowing from" : "Lending to"}
                                </p>
                                <div className="flex-1 min-h-0 w-full">
                                    <TransactionOptions
                                        key={`contacts-${type}`}
                                        method={getContacts}
                                        mapOption={accountOption}
                                        name="contactId"
                                        onSelect={() => contactRef.current?.focus?.()}
                                        onChange={(val, label) => {
                                            handleFieldChange("contactId", val);
                                            handleFieldChange("contact", label);
                                            goNextAuto();
                                        }}
                                        value={contactId}
                                    />
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: "category",
                        requiredFields: ["categoryId"],
                        autoAdvance: true,
                        render: () => (
                            <div className="px-4 h-full w-full flex flex-col gap-4 pt-4">
                                <p className="text-[17px] text-slate-500 self-center">
                                    Select a category
                                </p>
                                <div className="flex-1 min-h-0 w-full">
                                    <TransactionOptions
                                        key={`category-${type}`}
                                        method={getCategories}
                                        mapOption={accountOption}
                                        type={type}
                                        name="categoryId"
                                        onSelect={() => categoryRef.current?.focus?.()}
                                        onChange={(val, label) => {
                                            handleFieldChange("categoryId", val);
                                            handleFieldChange("category", label);
                                            goNextAuto();
                                        }}
                                        value={categoryId}
                                    />
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: "account",
                        requiredFields: ["accountId"],
                        autoAdvance: true,
                        render: () => (
                            <div className="px-4 h-full w-full flex flex-col gap-4 pt-4">
                                <p className="text-[17px] text-slate-500 self-center">
                                    Which account
                                </p>
                                <div className="flex-1 min-h-0 w-full">
                                    <TransactionOptions
                                        key={`account-${type}`}
                                        method={paginatedAccount}
                                        mapOption={accountOption}
                                        name="accountId"
                                        onSelect={() => accountRef.current?.focus?.()}
                                        onChange={(val, label) => {
                                            handleFieldChange("accountId", val);
                                            handleFieldChange("account", label);
                                            goNextAuto();
                                        }}
                                        value={accountId}
                                    />
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: "description",
                        requiredFields: [],
                        render: () => renderDescriptionStep(),
                    },
                ];

            case TransactionType.GROUP_SPLIT:
                return [
                    ...baseSteps,
                    {
                        id: "group",
                        requiredFields: ["groupId"],
                        autoAdvance: true,
                        render: () => (
                            <div className="px-4 h-full w-full flex flex-col gap-4 pt-4">
                                <p className="text-[17px] text-slate-500 self-center">
                                    Select Group
                                </p>
                                <div className="flex-1 min-h-0 w-full">
                                    <TransactionOptions
                                        key={`groups-${type}`}
                                        method={getGroups}
                                        mapOption={accountOption}
                                        name="groupId"
                                        onSelect={() => groupRef.current?.focus?.()}
                                        onChange={(val, label) => {
                                            handleFieldChange("groupId", val);
                                            handleFieldChange("group", label);
                                            goNextAuto();
                                        }}
                                        value={groupId}
                                    />
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: "category",
                        requiredFields: ["categoryId"],
                        autoAdvance: true,
                        render: () => (
                            <div className="px-4 h-full w-full flex flex-col gap-4 pt-4">
                                <p className="text-[17px] text-slate-500 self-center">
                                    Select a category
                                </p>
                                <div className="flex-1 min-h-0 w-full">
                                    <TransactionOptions
                                        key={`category-${type}`}
                                        method={getCategories}
                                        mapOption={accountOption}
                                        type={type}
                                        name="categoryId"
                                        onSelect={() => categoryRef.current?.focus?.()}
                                        onChange={(val, label) => {
                                            handleFieldChange("categoryId", val);
                                            handleFieldChange("category", label);
                                            goNextAuto();
                                        }}
                                        value={categoryId}
                                    />
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: "account",
                        requiredFields: ["accountId"],
                        autoAdvance: true,
                        render: () => (
                            <div className="px-4 h-full w-full flex flex-col gap-4 pt-4">
                                <p className="text-[17px] text-slate-500 self-center">
                                    Which account
                                </p>
                                <div className="flex-1 min-h-0 w-full">
                                    <TransactionOptions
                                        key={`account-${type}`}
                                        method={paginatedAccount}
                                        mapOption={accountOption}
                                        name="accountId"
                                        onSelect={() => accountRef.current?.focus?.()}
                                        onChange={(val, label) => {
                                            handleFieldChange("accountId", val);
                                            handleFieldChange("account", label);
                                            goNextAuto();
                                        }}
                                        value={accountId}
                                    />
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: "split",
                        requiredFields: [],
                        render: () => renderSplitStep(),
                    },
                ];

            default:
                return baseSteps;
        }
    }, [
        type, amount, categoryId, category, accountId, account,
        toAccountId, toAccount, contactId, contact, groupId, group,
        description, repeat, tab, contacts, allocations,
        amountOverrides, shares, percentages, splitValidationError,
    ]);

    // Compute visible steps (filter skipped)
    const visibleSteps = useMemo(
        () => stepsByType.filter((s) => !s.skip?.(formState)),
        [stepsByType, formState]
    );

    const currentStep = visibleSteps[stepIndex];
    const isLastStep = visibleSteps.length !== 2 && stepIndex === visibleSteps.length - 1;

    // ── Step validation ──────────────────────────────────────────────────────

    const isCurrentStepValid = useMemo(() => {
        if (!currentStep) return false;
        return currentStep.requiredFields.every((field) => {
            const val = formState[field];
            return val !== "" && val !== null && val !== undefined;
        });
    }, [currentStep, formState]);

    // ── Navigation ───────────────────────────────────────────────────────────

    const goNext = useCallback(() => {
        if (!isCurrentStepValid) return;
        setError("");
        setStepIndex((i) => Math.min(i + 1, visibleSteps.length - 1));
    }, [isCurrentStepValid, visibleSteps.length]);

    const goBack = useCallback(() => {
        setError("");
        setStepIndex((i) => Math.max(i - 1, 0));
    }, []);

    // Called by SearchSelect onChange on auto-advance steps.
    // Small delay lets the selection visually register before the slide.
    const goNextAuto = useCallback(() => {
        setError("");
        setTimeout(() => {
            setStepIndex((i) => Math.min(i + 1, visibleSteps.length - 1));
        }, 180);
    }, [visibleSteps.length]);

    // ── Submit ───────────────────────────────────────────────────────────────

    const handleSubmit = useCallback(async () => {
        if (type === TransactionType.GROUP_SPLIT && contacts.length > 0 && !validateSplit()) {
            setError(splitValidationError);
            return;
        }

        setLoading(true);
        const payload = contacts.length > 0 ? buildPayload() : [];

        const formData = new FormData();
        formData.append("type", type!);
        formData.append("repeat", String(repeat));
        formData.append("amount", String(amount));
        formData.append("description", description || "");
        formData.append("accountId", accountId || "");
        formData.append("categoryId", categoryId || "");
        formData.append("groupId", groupId || "");
        formData.append("toAccountId", toAccountId || "");
        formData.append("contactId", contactId || "");
        formData.append("contacts", JSON.stringify(payload));

        const res = await createTransaction(null, formData);
        setLoading(false);

        if (res?.success) {
            router.refresh();
            reset();
            closeFn();
        } else {
            setError(res?.errors || "Something went wrong");
        }
    }, [
        type, repeat, amount, description, accountId, categoryId,
        groupId, toAccountId, contactId, contacts, validateSplit,
        splitValidationError, buildPayload, router, reset, closeFn,
    ]);

    // ── Step renderers ────────────────────────────────────────────────────────

    const renderDescriptionStep = () => (
        <div className="px-4 space-y-4">
            <div>
                <label className="text-sm text-slate-500">Description (optional)</label>
                <textarea
                    name="description"
                    value={description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    placeholder="Add note..."
                    className="w-full mt-1 border border-border rounded-xl p-3 outline-none bg-black text-base"
                    rows={3}
                    autoFocus
                />
            </div>
            {type && !NO_REPEAT_TYPES.has(type) && (
                <YesNoToggle
                    label={`Mark as repeated ${formatUnderScoredString(type!)}`}
                    value={repeat ?? true}
                    onChange={() => handleFieldChange("repeat", !repeat)}
                />
            )}
        </div>
    );

    const mapGroupMemberOption = useCallback(
        (c: any): TransactionsContactItem => ({
            id: c.id,
            name: c.name,
            splitType: tab,
            obligationAmount: 0,
        }),
        [tab]
    );

    const groupMemberFetcher = useCallback(
        (params: any) => getGroupMembers({ ...params, groupId }),
        [groupId]
    );

    const renderSplitStep = () => (
        <div className="w-full flex flex-col items-center gap-4">
            <div className="flex flex-col items-center">
                <p className="text-sm text-slate-500">Amount to split</p>
                <ShowBalanceComp
                    balance={Number(amount)}
                    mainClass="!text-3xl !font-bold text-white"
                    subClass="!text-xl text-white"
                />
            </div>

            <div className="w-full">
                <Tabs tabs={TAB_ITEMS} value={tab} onChange={setTab} className="relative" />
                <HorizontalLine />
                <MultiSelect
                    value={contacts}
                    onChange={setContacts}
                    fetcher={groupMemberFetcher}
                    mapOption={mapGroupMemberOption}
                    getKey={(c) => c.id}
                    renderItem={(item, selected) => (
                        <SplitContactRow
                            id={item.id}
                            name={item.name}
                            selected={selected}
                            tab={tab}
                            amount={allocations.get(item.id) ?? 0}
                            amountOverride={amountOverrides.get(item.id)}
                            onAmountChange={setAmountOverride}
                            shareCount={shares.get(item.id) ?? 1}
                            onIncrement={incrementShare}
                            onDecrement={decrementShare}
                            percentage={percentages.get(item.id)}
                            onPercentageChange={setPercentage}
                        />
                    )}
                />
            </div>

            {contacts.length > 0 && splitValidationError && (
                <p className="text-amber-400 text-sm text-center px-4">{splitValidationError}</p>
            )}
        </div>
    );

    // ── JSX ──────────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col max-h-full w-full max-w-xl mx-auto bg-slate-950 rounded-[32px] shadow-[0_30px_80px_rgba(15,23,42,0.55)] overflow-hidden border border-white/10">
            <input type="hidden" name="type" value={type!} />
            <input type="hidden" name="repeat" value={String(repeat)} />
            {type === TransactionType.GROUP_SPLIT && (
                <input
                    type="hidden"
                    name="contacts"
                    value={JSON.stringify(contacts.length > 0 ? buildPayload() : [])}
                />
            )}

            <div className="px-5 py-4 border-b border-white/10 bg-slate-950">
                {visibleSteps.length > 1 && (
                    <div className="pt-1 pb-1">
                        <StepDots total={visibleSteps.length} current={stepIndex} />
                    </div>
                )}
                {stepIndex >= 2 && amount && type && (
                    <TransactionSummaryBar
                        amount={amount}
                        type={type}
                        colorMap={COLOR_BUTTON}
                    />
                )}
            </div>

            <div className="flex-1 min-h-[400px] overflow-y-auto">
                {currentStep?.render()}
            </div>

            <div className="border-t border-white/10 p-4 pb-6 bg-slate-950/95 backdrop-blur-sm">
                {error && (
                    <div className="flex justify-center">
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    </div>
                )}

                <div className="flex justify-between items-center gap-4">
                    {stepIndex > 0 ? (
                        <button
                            type="button"
                            onClick={goBack}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            Back
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={closeFn}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    )}

                    {/* Next / Save */}
                    {isLastStep ? (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="font-semibold px-4 py-3 rounded-2xl bg-white text-slate-950 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center min-w-[150px] disabled:opacity-60 disabled:pointer-events-none"
                        >
                            {loading ? <LoaderButton className="w-6 h-6" /> : "Save"}
                        </button>
                    ) : currentStep?.autoAdvance ? (
                        <span className="text-sm text-slate-400 italic">Select to continue</span>
                    ) : (
                        <button
                            type="button"
                            onClick={goNext}
                            disabled={!isCurrentStepValid}
                            className="font-semibold px-5 py-3 rounded-2xl bg-slate-800 text-white transition-all duration-300 hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                        >
                            Continue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}