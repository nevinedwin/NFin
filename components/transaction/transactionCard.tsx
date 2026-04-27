"use client";

import { RUPEE_SYMBOL } from "@/lib/constants/constants";
import TypeButton, { ButtonColors } from "../ui/typeButton";
import { createTransaction } from "@/actions/transactions";
import FormSubmitBtn from "../ui/formSubmitBtn";
import { TransactionType } from "@/generated/prisma/client";
import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "@/hooks/form/useForm";
import { transactionFormInitalState } from "@/app/(main)/features/transaction/transaction.state";
import SearchSelect, { SearchSelectRef } from "../ui/searchSelect";
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
import { transactionFormErrors } from "@/app/(main)/features/transaction/transaction.validation";
import MultiSelect from "../ui/multiSelect";
import { getGroupMembers, getGroups } from "@/actions/groups";
import { TransactionsContactItem } from "@/app/(main)/features/transaction/transaction.types";
import { useSplitAllocations } from "@/hooks/useSplitAllocation";
import SplitContactRow from "./groupSplit/splitContactRow";
import LoaderButton from "../ui/loaderButton";
import ScanWrapper from "../camera/scanWrapper";

// ─── Types ───────────────────────────────────────────────────────────────────

type TransactionCardProp = {
    closeFn: () => void;
    stopCameraRef: { current: boolean };
};

type TabsType = "byEvenly" | "byAmount" | "byShares" | "byPercentages";

export type TabItem<T extends string> = {
    id: T;
    label: React.ReactNode;
};

// ─── Constants ───

const COLOR_BUTTON: Record<TransactionType, ButtonColors> = {
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

/** Types that suppress the "Repeat" toggle */
const NO_REPEAT_TYPES = new Set<TransactionType>([
    TransactionType.BORROW,
    TransactionType.LEND,
    TransactionType.GROUP_SPLIT,
]);

// ─── Component ───────────────────────────────────────────────────────────────

export default function TransactionCard({ closeFn, stopCameraRef }: TransactionCardProp) {
    const router = useRouter();

    const [openGroup, setOpenGroup] = useState(false);
    const [tab, setTab] = useState<TabsType>("byEvenly");
    const [error, setError] = useState<string>("");
    const [contacts, setContacts] = useState<TransactionsContactItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isManual, setIsManual] = useState<boolean>(false);

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
    const amountRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<SearchSelectRef>(null);
    const accountRef = useRef<SearchSelectRef>(null);
    const toAccountRef = useRef<SearchSelectRef>(null);
    const contactRef = useRef<SearchSelectRef>(null);
    const groupRef = useRef<SearchSelectRef>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    // ── Derived ─────────────────────────────────────────────────────────────

    useEffect(() => {
        resetOverrides();
    }, [tab]);

    /** Reset most fields when the transaction type changes, but keep `type` itself. */
    useEffect(() => {
        resetKeep(["type"]);
        setError("");
    }, [type]);


    // ── Handlers ────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        const payload = contacts.length > 0 ? buildPayload() : [];
        setLoading(true);

        if (contacts.length > 0 && !validateSplit()) {
            setError(splitValidationError)
            return;
        }

        const formData = new FormData();

        formData.append("type", type);
        formData.append("repeat", String(repeat));
        formData.append("amount", String(amount));
        formData.append("description", description || "");

        // IDs (IMPORTANT)
        formData.append("accountId", accountId || "");
        formData.append("categoryId", categoryId || "");
        formData.append("groupId", groupId || "");
        formData.append("toAccountId", toAccountId || "");
        formData.append("contactId", contactId || "");

        // group split
        formData.append("contacts", JSON.stringify(payload));

        const res = await createTransaction(null, formData);

        if (res?.success) {
            router.refresh();
            setLoading(false)
            reset();
            closeFn();
        } else {
            setLoading(false);
            setError(res?.errors || "Something went wrong");
        }
    };

    const handleFieldChange = useCallback(
        <K extends keyof typeof formState>(field: K, value: any) => {
            setError("");
            setField(field, value);
        },
        [setField]
    );

    const handleNextClick = useCallback(() => {
        setError("");
        const validationError = transactionFormErrors(formState);
        if (validationError) {
            setError(validationError);
            return;
        }
        setOpenGroup(true);
    }, [formState]);

    const handleAmountKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            if (type === TransactionType.TRANSFER) {
                accountRef.current?.focus();
            } else {
                categoryRef.current?.focus();
            }
        },
        [type]
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

    const handleMultiSelectChange = useCallback(
        (val: TransactionsContactItem[]) => {
            setContacts(val);
        },
        []
    );

    const groupMemberFetcher = useCallback(
        (params: any) => getGroupMembers({ ...params, groupId }),
        [groupId]
    );

    const handleManual = () => {
        setIsManual(true);
    };

    // ── Shared field helpers ─────────────────────────────────────────────────

    const categoryField = useMemo(
        () => (
            <SearchSelect
                key={`category-${type}`}
                method={getCategories}
                mapOption={accountOption}
                type={type}
                name="categoryId"
                label="Category"
                placeholder="Search Category"
                ref={categoryRef}
                onSelect={() => categoryRef.current?.focus?.()}
                onChange={(val, label) => {
                    handleFieldChange("categoryId", val);
                    handleFieldChange("category", label);
                }}
                value={categoryId}
                displayValue={category}
            />
        ),
        [type, category]
    );

    const accountField = useMemo(
        () => (
            <SearchSelect
                key={`account-${type}`}
                method={paginatedAccount}
                mapOption={accountOption}
                name="accountId"
                label="Account"
                placeholder="Search Account"
                ref={accountRef}
                onSelect={() => accountRef.current?.focus?.()}
                onChange={(val, label) => {
                    handleFieldChange("accountId", val);
                    handleFieldChange("account", label);
                }}
                value={accountId}
                displayValue={account}
            />
        ),
        [account]
    );

    // ── Render helpers ───────────────────────────────────────────────────────

    const renderTypeFields = () => {
        switch (type) {
            case TransactionType.EXPENSE:
            case TransactionType.INCOME:
                return (
                    <div className="grid gap-3 px-4">
                        {categoryField}
                        {accountField}
                    </div>
                );

            case TransactionType.TRANSFER:
                return (
                    <div className="grid grid-cols-2 gap-3 px-4">
                        {accountField}
                        <SearchSelect
                            key={`toAccount-${type}`}
                            method={paginatedAccount}
                            mapOption={accountOption}
                            name="toAccountId"
                            label="To Account"
                            placeholder="Search.."
                            ref={toAccountRef}
                            onSelect={() => toAccountRef.current?.focus?.()}
                            onChange={(val, label) => {
                                handleFieldChange("toAccountId", val);
                                handleFieldChange("toAccount", label);
                            }}
                            value={toAccountId}
                            displayValue={toAccount}
                        />
                    </div>
                );

            case TransactionType.BORROW:
            case TransactionType.LEND:
                return (
                    <div className="grid gap-3 px-4">
                        <SearchSelect
                            key={`contacts-${type}`}
                            method={getContacts}
                            mapOption={accountOption}
                            name="contactId"
                            label={type === TransactionType.BORROW ? "From Whom" : "To Whom"}
                            placeholder="Search.."
                            ref={contactRef}
                            onSelect={() => contactRef.current?.focus?.()}
                            onChange={(val, label) => {
                                handleFieldChange("contactId", val);
                                handleFieldChange("contact", label);
                            }}
                            value={contactId}
                            displayValue={contact}
                        />
                        {categoryField}
                        {accountField}
                    </div>
                );

            case TransactionType.GROUP_SPLIT:
                return (
                    <div className="grid gap-3 px-4">
                        <SearchSelect
                            key={`group-${type}`}
                            method={getGroups}
                            mapOption={accountOption}
                            name="groupId"
                            label="Group"
                            placeholder="Search.."
                            ref={groupRef}
                            onSelect={() => groupRef.current?.focus?.()}
                            onChange={(val, label) => {
                                handleFieldChange("groupId", val);
                                handleFieldChange("group", label);
                            }}
                            value={groupId}
                            displayValue={group}
                        />
                        {categoryField}
                        {accountField}
                    </div>
                );

            default:
                return null;
        }
    };

    const renderGroupSplitPanel = () => {

        const payload = contacts.length > 0 ? buildPayload() : [];

        return (
            <div className="w-full h-full flex flex-col justify-start items-center">
                {/* Hidden inputs carrying the final enriched contact data */}
                <input
                    type="hidden"
                    name="contacts"
                    value={JSON.stringify(payload)}
                />

                <div className="w-full flex flex-col justify-center items-center pb-4">
                    <p>Amount to Split</p>
                    <ShowBalanceComp
                        balance={Number(amount)}
                        mainClass="!text-3xl !font-bold text-white"
                        subClass="!text-xl text-white"
                    />
                </div>

                <div className="flex-shrink-0 w-full">
                    <div className="w-full shadow-inner">
                        <Tabs
                            tabs={TAB_ITEMS}
                            value={tab}
                            onChange={setTab}
                            className="relative"
                        />
                    </div>
                    <HorizontalLine />

                    <MultiSelect
                        value={contacts}
                        onChange={handleMultiSelectChange}
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
                                // byAmount
                                amountOverride={amountOverrides.get(item.id)}
                                onAmountChange={setAmountOverride}
                                // byShares
                                shareCount={shares.get(item.id) ?? 1}
                                onIncrement={incrementShare}
                                onDecrement={decrementShare}
                                // byPercentages
                                percentage={percentages.get(item.id)}
                                onPercentageChange={setPercentage}
                            />
                        )}
                    />

                    {contacts.length > 0 && splitValidationError && (
                        <div className="px-4 pt-2">
                            <p className="text-amber-400 text-sm text-center">{splitValidationError}</p>
                        </div>
                    )}
                </div>
            </div>
        )
    };

    const renderMainForm = () => (
        <>
            {/* Amount + Type */}
            <div className="grid grid-cols-2 gap-4 px-4">
                <div>
                    <label className="text-sm text-slate-500">Amount</label>
                    <div className="flex items-center border border-border rounded-xl px-3 h-14">
                        <span className="text-xl font-semibold mr-2">{RUPEE_SYMBOL}</span>
                        <input
                            name="amount"
                            type="number"
                            value={amount}
                            ref={amountRef}
                            onChange={(e) => handleFieldChange("amount", e.target.value)}
                            placeholder="0.00"
                            inputMode="decimal"
                            required
                            step={0.01}
                            min={0}
                            onKeyDown={handleAmountKeyDown}
                            className="w-full outline-none text-2xl font-bold bg-black"
                        />
                    </div>
                </div>

                {/* Type Buttons */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 w-full pr-3">
                    {(Object.keys(TransactionType) as TransactionType[]).map((t) => (
                        <div className="w-full flex" key={t}>
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

            {/* Dynamic type-specific fields */}
            {renderTypeFields()}

            {/* Description */}
            <div className="px-4">
                <label className="text-sm text-slate-500">Description</label>
                <textarea
                    name="description"
                    value={description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    placeholder="Add note..."
                    className="w-full mt-1 border border-border rounded-xl p-3 outline-none bg-black text-base"
                    rows={3}
                    ref={descriptionRef}
                />
            </div>

            {/* Repeat Toggle — hidden for BORROW / LEND / GROUP_SPLIT */}
            {!NO_REPEAT_TYPES.has(type!) && (
                <div className="px-4">
                    <YesNoToggle
                        label={`Mark as repeated ${formatUnderScoredString(type)}`}
                        value={repeat ?? true}
                        onChange={() => handleFieldChange("repeat", !repeat)}
                    />
                </div>
            )}
        </>
    );

    // ── Footer ───────────────────────────────────────────────────────────────

    const isGroupSplit = type === TransactionType.GROUP_SPLIT;
    const errorMessage = error?.toString() || error || "";

    const renderFooterActions = () => {
        const cancelOrBack =
            isGroupSplit && openGroup ? (
                <button
                    type="button"
                    onClick={() => setOpenGroup(false)}
                    className="text-zinc-400"
                >
                    Back
                </button>
            ) : (
                <button type="button" onClick={closeFn} className="text-zinc-400">
                    Cancel
                </button>
            );

        const primaryAction =
            isGroupSplit && !openGroup ? (
                <button
                    type="button"
                    className="font-semibold px-4 py-2 rounded-xl bg-slate-300 text-black transition-all duration-300 hover:scale-[1.02] active:scale-95 flex justify-center items-center"
                    onClick={handleNextClick}
                >
                    Next
                </button>
            ) : isGroupSplit && openGroup ? (
                // For GROUP_SPLIT save: validate splits client-side first
                <button
                    type="button"
                    className="font-semibold px-4 py-2 rounded-xl bg-slate-300 text-black transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    onClick={handleSubmit}
                >
                    {
                        loading ? <LoaderButton className='w-8 h-8' /> : 'Save Transaction'
                    }
                </button>
            ) : (
                <FormSubmitBtn
                    label="Save Transaction"
                    type="button"
                    className="font-semibold px-4 py-2"
                    onClick={handleSubmit}
                />
            );

        return (
            <>
                {cancelOrBack}
                {primaryAction}
            </>
        );
    };

    // ── JSX ──────────────────────────────────────────────────────────────────

    return (
        isManual
            ? <form
                className="flex flex-col h-full w-full max-w-md mx-auto bg-black rounded-3xl shadow-xl"
            >
                <input type="hidden" name="type" value={type} />
                <input type="hidden" name="repeat" value={String(repeat)} />

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto pt-4 space-y-6 pb-24">
                    {openGroup ? renderGroupSplitPanel() : renderMainForm()}
                </div>

                {/* Sticky footer */}
                <div className="border-t border-border p-4 flex flex-col justify-end gap-4 bg-black sticky bottom-0">
                    {errorMessage && (
                        <div className="flex justify-center">
                            <p className="text-red-500">{errorMessage}</p>
                        </div>
                    )}
                    <div className="flex justify-end gap-4">{renderFooterActions()}</div>
                </div>
            </form>
            : <ScanWrapper setManual={handleManual} />

    );
}