"use client";

import { useState, useTransition } from "react";
import Input from "../ui/input";
import FormSubmitBtn from "../ui/formSubmitBtn";
import CustomDatePicker from "../ui/datePicker";
import CloseButton from "../ui/closeButton";
import { useRouter } from "next/navigation";
import { createAccountAction } from "@/actions/accounts";
import { useMainShellContext } from "@/app/(main)/context/mainShellContext";
import SelectField from "../transaction/selectField";
import { useForm } from "@/hooks/form/useForm";
import { walletFormInitalState } from "@/app/(main)/features/wallet/wallet.state";
import { AccountType } from "@/generated/prisma/client";
import { formatUnderScoredString } from "@/lib/utils/formats";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function AccountForm() {

    const { startLoading } = useMainShellContext();

    const { state, setField } = useForm(walletFormInitalState);
    const { type } = state

    const [showBankDetails, setShowBankDetails] = useState(false);
    const [showAtmDetails, setShowAtmDetails] = useState(false);

    const [isPending, startTransition] = useTransition();

    const router = useRouter()


    return (

        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
            <div className="w-full h-[90vh] bg-transparent rounded-t-3xl shadow-2xl flex flex-col">

                {/* Header */}
                <div className="flex justify-end items-center px-4 pt-4">
                    <CloseButton
                        size={20}
                        onClick={() => router.push("/wallet")}
                        className="bg-black p-2 rounded-full"
                    />
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 bg-black rounded-t-[30px]">
                    <form
                        action={async (formData: FormData) => {
                            startLoading();
                            startTransition(() => {
                                createAccountAction(formData);
                            });
                        }}
                        className="flex flex-col gap-4 animate-fade-in"
                    >

                        <div className="bg-black p-6 rounded-t-3xl flex flex-col gap-2">

                            <h2 className="text-xl font-semibold text-white mb-4">Create New Account</h2>
                            <Input
                                type="text"
                                name="name"
                                requiredLabel
                                required
                                label="Name"
                                placeholder="Enter Account Name"
                                className="!bg-black !text-slate-500"
                            />

                            <div className="w-full grid grid-cols-2 gap-3">
                                <Input
                                    type="number"
                                    name="balance"
                                    inputMode="decimal"
                                    label="Balance"
                                    required
                                    requiredLabel
                                    placeholder="0.00"
                                    className="!bg-black !text-slate-500"
                                />
                                <SelectField
                                    label="Account Type"
                                    name="type"
                                    value={type}
                                    onChange={(e) => setField("type", e.target.value as AccountType)}
                                    required
                                    selectClass="text-slate-500"
                                >
                                    {
                                        Object.values(AccountType).map((cat) => (
                                            <option key={cat} value={cat}>{formatUnderScoredString(cat)}</option>
                                        ))
                                    }
                                </SelectField>
                            </div>

                            {type === AccountType.BANK &&
                                <>
                                    <div className="pt-4 flex gap-3 items-center">
                                        <p className="text-slate-300">Bank Details (optional)</p>
                                        <button onClick={() => setShowBankDetails(prev => !prev)}>{showBankDetails ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>
                                    </div>
                                    {showBankDetails && <div className="flex flex-col gap-3">
                                        <Input
                                            type="text"
                                            name="accountNumber"
                                            label="Account Number"
                                            inputMode="numeric"
                                            placeholder="abcd0123456789"
                                            className="!bg-black !text-slate-500"
                                        />


                                        <Input
                                            type="text"
                                            name="branch"
                                            label="Branch Name"
                                            placeholder="Enter Bank Branch Name"
                                            className="!bg-black !text-slate-500"
                                        />
                                        <Input
                                            type="text"
                                            name="ifscCode"
                                            label="IFSC Code"
                                            placeholder="Enter Bank IFSC Code"
                                            className="!bg-black !text-slate-500"
                                        />
                                    </div>}

                                    <div className="pt-4 flex gap-3 items-center">
                                        <p className="text-slate-300">ATM Details (optional)</p>
                                        <button onClick={() => setShowAtmDetails(prev => !prev)}>{showAtmDetails ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>
                                    </div>

                                    {showAtmDetails && <div className="flex flex-col gap-3">
                                        <Input
                                            type="text"
                                            name="atmNumber"
                                            inputMode="numeric"
                                            label="ATM Number"
                                            placeholder="1234 4567 7890 0123"
                                            className="!bg-black !text-slate-500"
                                        />

                                        <div className="w-full grid grid-cols-2 gap-3 pb-5">
                                            <Input
                                                type="text"
                                                name="expiryDate"
                                                label="Expiry Date"
                                                placeholder="01/28"
                                                className="!bg-black !text-slate-500"
                                            />
                                            <Input
                                                type="text"
                                                name="cvv"
                                                inputMode="numeric"
                                                label="CVV"
                                                placeholder="123"
                                                className="!bg-black !text-slate-500"
                                            />
                                        </div>
                                    </div>}
                                </>
                            }

                            <div className="mt-3">
                                <FormSubmitBtn
                                    label="Create Account"
                                    type="submit"
                                    disabled={isPending}
                                    className="font-bold !bg-white !text-slate-900"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
}