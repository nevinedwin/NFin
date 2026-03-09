"use client";

import { useState } from "react";
import Input from "../ui/input";
import FormSubmitBtn from "../ui/formSubmitBtn";
import CloseButton from "../ui/closeButton";
import { useRouter } from "next/navigation";
import { createAccountAction } from "@/actions/accounts";
import SelectField from "../transaction/selectField";
import { AccountType } from "@/generated/prisma/client";
import { formatUnderScoredString } from "@/lib/utils/formats";
import { ChevronDown, ChevronUp } from "lucide-react";
import YesNoToggle from "../ui/toggleButton";
import { useFormStatus } from "react-dom";
import SectionToggle from "../ui/sectionToggle";

export default function AccountForm() {
    const router = useRouter();
    const { pending } = useFormStatus();

    const [showBankDetails, setShowBankDetails] = useState(false);
    const [showAtmDetails, setShowAtmDetails] = useState(false);
    const [showCreditCardDetails, setShowCreditCardDetails] = useState(false);

    const [type, setType] = useState<AccountType>(AccountType.BANK);
    const [countMeInTotal, setCountMeInTotal] = useState<boolean>(true);



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
                        onClick={() => router.push("/wallet")}
                        className="bg-slate-800 p-2 rounded-full"
                    />
                </div>

                {/* Scrollable form */}
                <form
                    action={createAccountAction}
                    className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
                >
                    <Input
                        type="text"
                        name="name"
                        required
                        requiredLabel
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
                            placeholder="0.00"
                            className="!bg-black !text-slate-400"
                        />

                        <SelectField
                            label="Account Type"
                            name="type"
                            required
                            selectClass="text-slate-400"
                            value={type}
                            onChange={(e) => setType(e.target.value as AccountType)}
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
                            value={countMeInTotal}
                            onChange={setCountMeInTotal}
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

                            {showBankDetails && (
                                <div className="space-y-3">
                                    <Input
                                        name="accountNumber"
                                        label="Account Number"
                                        inputMode="numeric"
                                        placeholder="XXXX XXXX XXXX"
                                        className="!bg-black !text-slate-400"
                                    />

                                    <Input
                                        name="branch"
                                        label="Branch"
                                        placeholder="Bank branch"
                                        className="!bg-black !text-slate-400"
                                    />

                                    <Input
                                        name="ifscCode"
                                        label="IFSC Code"
                                        placeholder="SBIN000000"
                                        className="!bg-black !text-slate-400"
                                    />
                                </div>
                            )}

                            {/* ATM Details */}
                            <SectionToggle
                                title="ATM Details"
                                open={showAtmDetails}
                                onToggle={() => setShowAtmDetails((p) => !p)}
                            />

                            {showAtmDetails && (
                                <div className="space-y-3">
                                    <Input
                                        name="cardNumber"
                                        label="ATM Card Number"
                                        inputMode="numeric"
                                        placeholder="XXXX XXXX XXXX"
                                        className="!bg-black !text-slate-400"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            name="expiryDate"
                                            label="Expiry"
                                            placeholder="MM/YY"
                                            className="!bg-black !text-slate-400"
                                        />

                                        <Input
                                            name="cvv"
                                            label="CVV"
                                            inputMode="numeric"
                                            placeholder="..."
                                            className="!bg-black !text-slate-400"
                                        />
                                    </div>
                                </div>
                            )}
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

                            {showCreditCardDetails && (
                                <div className="space-y-3">
                                    <Input
                                        name="cardNumber"
                                        label="Credit Card Number"
                                        inputMode="numeric"
                                        placeholder="XXXX XXXX XXXX"
                                        className="!bg-black !text-slate-400"
                                    />

                                    <Input
                                        type="number"
                                        name="creditLimit"
                                        inputMode="decimal"
                                        label="Credit Card Limit"
                                        placeholder="0.00"
                                        className="!bg-black !text-slate-400"
                                    />

                                    <div className="flex gap-3">
                                        <Input
                                            name="billingDate"
                                            label="Billing Date"
                                            placeholder="01"
                                            className="!bg-black !text-slate-400"
                                        />

                                        <Input
                                            name="dueDate"
                                            label="Due Date"
                                            placeholder="02"
                                            className="!bg-black !text-slate-400"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Footer */}
                    <div className="pt-4">
                        <FormSubmitBtn
                            label="Create Account"
                            type="submit"
                            disabled={pending}
                            className="font-semibold !bg-white !text-black"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
