"use client";

import { useState } from "react";
import Input from "../ui/input";
import FormSubmitBtn from "../ui/formSubmitBtn";
import CloseButton from "../ui/closeButton";
import { useRouter } from "next/navigation";
import { createAccountAction, updateAccountAction } from "@/actions/accounts";
import SelectField from "../transaction/selectField";
import { Account, AccountType } from "@/generated/prisma/client";
import { formatUnderScoredString } from "@/lib/utils/formats";
import YesNoToggle from "../ui/toggleButton";
import { useFormStatus } from "react-dom";
import SectionToggle from "../ui/sectionToggle";
import { useForm } from "@/hooks/form/useForm";
import { walletFormInitalState } from "@/app/(main)/features/wallet/wallet.state";

type AccountFormProp = {
    account?: Account;
    isUpdate?: boolean;
}

export default function AccountForm({ account, isUpdate = false }: AccountFormProp) {
    const router = useRouter();

    const { state, setField } = useForm(account || walletFormInitalState);
    const { type, name, balance, accountNumber, billingDate, branch, cardNumber, countMeInTotal, creditLimit, currency, cvv, dueDate, expiryDate, ifscCode } = state;

    const [showBankDetails, setShowBankDetails] = useState(false);
    const [showAtmDetails, setShowAtmDetails] = useState(false);
    const [showCreditCardDetails, setShowCreditCardDetails] = useState(false);


    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">

            {/* Bottom Sheet */}
            <div className="w-full max-w-lg h-[90vh] bg-black rounded-t-3xl shadow-2xl flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4">
                    <h2 className="text-lg font-semibold text-white">
                        Create New Account
                    </h2>

                    <CloseButton
                        size={18}
                        onClick={() => router.back()}
                        className="bg-slate-800 p-2 rounded-full"
                    />
                </div>

                {/* Scrollable form */}
                <form
                    action={isUpdate ? updateAccountAction : createAccountAction}
                    className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
                >
                    <input type="hidden" name="id" value={account?.id} />
                    <Input
                        type="text"
                        name="name"
                        required
                        requiredLabel
                        value={name || ''}
                        onChange={(e) => setField('name', e.target.value)}
                        label="Account Name"
                        placeholder="Enter account name"
                        className="!bg-black !text-slate-400"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="number"
                            name="balance"
                            inputMode="decimal"
                            label="Balance"
                            required
                            requiredLabel
                            value={Number(balance) || 0}
                            onChange={(e) => setField('balance', parseInt(e.target.value))}
                            placeholder="0.00"
                            className="!bg-black !text-slate-400"
                        />

                        <SelectField
                            label="Account Type"
                            name="type"
                            required
                            selectClass="text-slate-400"
                            value={type || AccountType.BANK}
                            onChange={(e) => setField('type', e.target.value as AccountType)}
                        >
                            {Object.values(AccountType).map((t) => (
                                <option key={t} value={t}>
                                    {formatUnderScoredString(t)}
                                </option>
                            ))}
                        </SelectField>
                    </div>
                    <div>
                        <YesNoToggle
                            label="Add me in Total Balance"
                            value={countMeInTotal ?? true}
                            onChange={() => setField('countMeInTotal', !countMeInTotal)}
                            name="countMeInTotal"
                        />
                    </div>
                    {type === AccountType.BANK && (
                        <>
                            {/* Bank Details */}
                            <SectionToggle
                                title="Bank Details"
                                open={showBankDetails}
                                onToggle={() => setShowBankDetails((p) => !p)}
                            />

                            <div className={`space-y-3 ${!showBankDetails && 'hidden'}`}>
                                <Input
                                    name="accountNumber"
                                    label="Account Number"
                                    inputMode="numeric"
                                    value={accountNumber as string || ''}
                                    onChange={(e) => setField('accountNumber', e.target.value)}
                                    placeholder="XXXX XXXX XXXX"
                                    className="!bg-black !text-slate-400"
                                />

                                <Input
                                    name="branch"
                                    label="Branch"
                                    value={branch as string || ''}
                                    onChange={(e) => setField('branch', e.target.value)}
                                    placeholder="Bank branch"
                                    className="!bg-black !text-slate-400"
                                />

                                <Input
                                    name="ifscCode"
                                    label="IFSC Code"
                                    value={ifscCode as string || ''}
                                    onChange={(e) => setField('ifscCode', e.target.value)}
                                    placeholder="SBIN000000"
                                    className="!bg-black !text-slate-400"
                                />
                            </div>

                            {/* ATM Details */}
                            <SectionToggle
                                title="ATM Details"
                                open={showAtmDetails}
                                onToggle={() => setShowAtmDetails((p) => !p)}
                            />
                            <div className={`space-y-3 ${!showAtmDetails && 'hidden'}`}>
                                <Input
                                    name="cardNumber"
                                    label="ATM Card Number"
                                    inputMode="numeric"
                                    value={cardNumber as string || ''}
                                    onChange={(e) => setField('cardNumber', e.target.value)}
                                    placeholder="XXXX XXXX XXXX"
                                    className="!bg-black !text-slate-400"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        name="expiryDate"
                                        label="Expiry"
                                        value={expiryDate as string || ''}
                                        onChange={(e) => setField('expiryDate', e.target.value)}
                                        placeholder="MM/YY"
                                        className="!bg-black !text-slate-400"
                                    />

                                    <Input
                                        name="cvv"
                                        label="CVV"
                                        inputMode="numeric"
                                        value={cvv as string || ''}
                                        onChange={(e) => setField('cvv', e.target.value)}
                                        placeholder="..."
                                        className="!bg-black !text-slate-400"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    {type === AccountType.CREDIT_CARD && (
                        <>
                            {/* Bank Details */}
                            <SectionToggle
                                title="Credit Card Details"
                                open={showCreditCardDetails}
                                onToggle={() => setShowCreditCardDetails((p) => !p)}
                            />
                            <div className={`space-y-3 ${!showCreditCardDetails && 'hidden'}`}>
                                <Input
                                    name="cardNumber"
                                    label="Credit Card Number"
                                    inputMode="numeric"
                                    value={cardNumber as string || ''}
                                    onChange={(e) => setField('cardNumber', e.target.value)}
                                    placeholder="XXXX XXXX XXXX"
                                    className="!bg-black !text-slate-400"
                                />

                                <Input
                                    type="number"
                                    name="creditLimit"
                                    inputMode="decimal"
                                    label="Credit Card Limit"
                                    value={creditLimit as number || 0}
                                    onChange={(e) => setField('creditLimit', parseInt(e.target.value))}
                                    placeholder="0.00"
                                    className="!bg-black !text-slate-400"
                                />

                                <div className="flex gap-3">
                                    <Input
                                        name="billingDate"
                                        label="Billing Date"
                                        value={billingDate as string || ''}
                                        onChange={(e) => setField('billingDate', e.target.value)}
                                        placeholder="01"
                                        className="!bg-black !text-slate-400"
                                    />

                                    <Input
                                        name="dueDate"
                                        label="Due Date"
                                        value={dueDate as string || ''}
                                        onChange={(e) => setField('dueDate', e.target.value)}
                                        placeholder="02"
                                        className="!bg-black !text-slate-400"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Footer */}
                    <div className="pt-4 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="text-zinc-400"
                        >
                            Cancel
                        </button>
                        <FormSubmitBtn
                            label={isUpdate ? 'Update Account' : 'Create Account'}
                            type="submit"
                            className="font-semibold !bg-white !text-black px-4 py-2"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
