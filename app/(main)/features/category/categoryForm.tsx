"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryType, TransactionType } from "@/generated/prisma/client";
import Input from "@/components/ui/input";
import SelectField from "@/components/transaction/selectField";
import { formatUnderScoredString } from "@/lib/utils/formats";
import { useForm } from "@/hooks/form/useForm";
import { categoryFormInitalState } from "./category.state";
import LoaderButton from "@/components/ui/loaderButton";
import { CategoryFormType } from "./category.types";

type Props = {
    parentCategories: any[];
    onClose: () => void;
    categoryFormState?: CategoryFormType
};

export default function CategoryForm({ parentCategories, onClose, categoryFormState }: Props) {

    const router = useRouter();

    const isEdit = !!categoryFormState?.id;

    const { state, setField, reset } = useForm(categoryFormState ?? categoryFormInitalState);
    const { name, forType, type, parentId } = state;

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);


        await fetch(
            isEdit ? `/api/category/${categoryFormState.id}` : "/api/category/",
            {
                method: isEdit ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(state)
            });

        reset();
        onClose();
        setLoading(false);
        router.refresh();
    };

    useEffect(() => {
        if (categoryFormState) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [categoryFormState]);

    return (


        <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col justify-center "
        >

            <div className="space-y-1">
                <Input
                    type="text"
                    name="name"
                    label="Category Name"
                    required
                    requiredLabel
                    value={name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="Food"
                    className="!bg-black !text-slate-400"
                />
            </div>

            <div className="flex gap-2 justify-center items-center">
                <SelectField
                    label="Category Type"
                    name="type"
                    required
                    selectClass="text-slate-400"
                    value={type ?? CategoryType.MAIN}
                    onChange={(e) => setField('type', e.target.value as CategoryType)}
                >
                    {Object.values(CategoryType).map((t) => (
                        <option key={t} value={t}>
                            {formatUnderScoredString(t)}
                        </option>
                    ))}
                </SelectField>

                <SelectField
                    label="Transaction Type"
                    name="forType"
                    required
                    selectClass="text-slate-400"
                    value={forType ?? TransactionType.EXPENSE}
                    onChange={(e) => setField('forType', e.target.value as TransactionType)}
                >
                    {Object.values(TransactionType).map((t) => (
                        <option key={t} value={t}>
                            {formatUnderScoredString(t)}
                        </option>
                    ))}
                </SelectField>
            </div>

            <div className="space-y-1">
                <SelectField
                    label="Parent Category"
                    name="parentId"
                    selectClass="text-slate-400"
                    containerClass={`${type === CategoryType.MAIN && 'hidden'}`}
                    value={parentId ?? ""}
                    onChange={(e) => setField('parentId', e.target.value || null)}
                >
                    <option value="">
                        None
                    </option>

                    {parentCategories.map((c) => (
                        <option
                            key={c.id}
                            value={c.id}
                        >
                            {c.name}
                        </option>
                    ))}
                </SelectField>
            </div>


            {/* actions */}

            <div className="flex justify-end gap-3 pt-3 fixed bottom-0 left-0 right-0 pb-6 px-4">

                <button
                    type="button"
                    onClick={onClose}
                    className="text-zinc-400"
                >
                    Cancel
                </button>

                <button
                    disabled={loading}
                    className="px-4 py-2 bg-white text-black rounded-lg font-medium"
                >
                    {loading ? <LoaderButton className="w-5 h-5" /> : isEdit ? "Update Category" : "Create Category"}
                </button>

            </div>

        </form>

    );
}