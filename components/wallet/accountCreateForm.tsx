"use client";

import { useState } from "react";
import Input from "../ui/input";
import FormSubmitBtn from "../ui/formSubmitBtn";
import CustomDatePicker from "../ui/datePicker";
import CloseButton from "../ui/closeButton";
import { useRouter } from "next/navigation";
import { createAccountAction } from "@/app/actions/accounts";

export default function AccountForm() {
    const [submitting, setSubmitting] = useState(false);
    const [monthYear, setMonthYear] = useState<Date | null>(null);

    const router = useRouter()

    return (
        <form
            action={async (formData: FormData) => {
                setSubmitting(true);
                try {
                    await createAccountAction(formData);
                    alert("Account created successfully!");
                    const form = document.getElementById("account-form") as HTMLFormElement | null;
                    form?.reset();
                    setMonthYear(null);
                } catch (err) {
                    alert((err as Error).message);
                } finally {
                    setSubmitting(false);
                }
            }}
            id="account-form"
            className="max-w-md mx-auto bg-background rounded-3xl p-6  space-y-4 animate-fade-in grid"
        >
            <div className="w-full flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white mb-4">Create New Account</h2>
                <CloseButton onClick={() => { router.push('/wallet') }} />
            </div>

            <Input
                type="text"
                name="name"
                requiredLabel
                required
                label="Account Name"
                placeholder="Enter Account Name"
            />

            <Input
                type="text"
                name="accountNumber"
                label="Account Number"
                inputMode="numeric"
                placeholder="abcd0123456789"
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
                />
                <Input
                    type="text"
                    name="ifscCode"
                    label="IFSC Code"
                    placeholder="ABCD0123456"
                />
            </div>
            <Input
                type="text"
                name="branch"
                label="Branch Name"
                placeholder="Enter Bank Branch Name"
            />

            <h3 className="text-sm pt-5">ATM Details (optional)</h3>

            <Input
                type="text"
                name="atmNumber"
                inputMode="numeric"
                label="ATM Number"
                placeholder="1234 4567 7890 0123"
            />

            <div className="w-full grid grid-cols-2 gap-3">
                <CustomDatePicker
                    label="Expiry Date"
                    name="expiryDate"
                    selected={monthYear}
                    onChange={setMonthYear}
                    mode="monthYear"
                />
                <Input
                    type="text"
                    name="cvv"
                    inputMode="numeric"
                    label="CVV"
                    placeholder="123"
                />
            </div>

            <FormSubmitBtn
                label="Create Account"
                type="submit"
                disabled={submitting}
                className="font-bold !bg-black !text-white border border-gray-800"
            />
        </form>
    );
}