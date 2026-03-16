"use client";

import { useState } from "react";
import CategoryTree from "../features/category/categorytree";
import CategoryForm from "../features/category/categoryForm";
import CloseButton from "@/components/ui/closeButton";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CategoryPageClient({
    categories,
    parentCategories
}: any) {

    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleCreate = () => {
        setEditingCategory(null);
        setOpen(true);
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setOpen(true);
    };

    const handleDelete = async (category: any) => {
        setLoading(true);
        if (!confirm("Delete this category?")) {
            setLoading(false)
            return;
        };

        await fetch(`/api/category/${category.id}`, {
            method: "DELETE"
        });

        router.refresh();
        setLoading(false);
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">

            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Categories</h1>

                <button
                    onClick={handleCreate}
                    className="px-3 py-2 bg-white text-black rounded-lg font-medium flex justify-center items-center"
                >
                    <Plus size={15} className="font-bold" /> New
                </button>
            </div>

            {categories.length > 0 && <CategoryTree categories={categories} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />}
            {categories.length <= 0 && <div className="w-full h-full flex justify-center items-center">No categories found</div>}
            {open && <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm
                    transition-opacity duration-300
                    ${open ? 'opacity-100' : '"opacity-0 pointer-events-none"'}`}
                onClick={() => setOpen(false)}
            />}

            {open && (
                <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out`}>
                    <div className="flex justify-end items-center pr-6 bg-transparent">
                        <CloseButton size={20} onClick={() => setOpen(false)} className="bg-black p-2 flex justify-center items-center rounded-full mb-1s" />
                    </div>
                    <div className="w-[100vw] h-[80vh] rounded-t-3xl bg-black shadow-2xl p-5 text-slate-500">
                        <div className="flex justify-between items-center mb-4 bg-transparent">
                            <h3 className="text-md font-semibold">Create Category</h3>
                        </div>

                        <div className="h-full pt-6">
                            <CategoryForm
                                parentCategories={parentCategories}
                                categoryFormState={editingCategory}
                                onClose={() => setOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}