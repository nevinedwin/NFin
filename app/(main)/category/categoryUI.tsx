"use client";

import { useCallback, useEffect, useState } from "react";
import CategoryForm from "../features/category/categoryForm";
import CloseButton from "@/components/ui/closeButton";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import BackArrowButton from "@/components/ui/backArrowbutton";
import SearchInput from "@/components/ui/searchInput";
import useDebounceValue from "@/hooks/useDebounceValue";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { CategoryType, TransactionType } from "@/generated/prisma/client";
import { getCategories } from "@/actions/category";
import CategoryItem from "../features/category/categoryItem";
import FilterBars from "@/components/ui/FilterBars/filterBars";
import { CategoryActiveFilters, CategoryFilterType, EMPTY_CATEGORY_FILTERS } from "@/types/filters";
import { CATEGORY_FILTER_BUTTONS, getCategoryPanel } from "@/components/category/filterKeys";
import FilterSheet from "@/components/ui/FilterBars/filterSheet";

const PAGE_SIZE = 10;

type Cursor = { name: string; id: string } | null;

type Category = {
    id: string,
    name: string,
    type: CategoryType,
    forType: TransactionType,
    icon: string | null
};

export type ActiveFilters = {
    parent: string | null;
    type: TransactionType | null;
};

export const EMPTY_FILTERS: ActiveFilters = {
    parent: null,
    type: null
};

export default function CategoryPageClient({ parentCategories }: any) {

    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [filters, setFilters] = useState<CategoryActiveFilters>(EMPTY_CATEGORY_FILTERS);
    const [openSheet, setOpenSheet] = useState<CategoryFilterType | null>(null);

    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounceValue(query, 400);

    const {
        loading: loadingQuery,
        data: categories,
        scrollElementRef,
        refetch
    } = useInfiniteScroll<Cursor, Category>({
        query: debouncedQuery,
        action: getCategories,
        size: PAGE_SIZE,
        format: (prev, incoming) => {
            const ids = new Set(prev.map(c => c.id));
            return [...prev, ...incoming.filter(c => !ids.has(c.id))]
        },
        extraParams: { filters }
    });


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
    };

    const handleClearAll = useCallback(() => {
        setFilters(EMPTY_FILTERS);
    }, []);

    const clearFilter = (key: CategoryFilterType) => {
        setFilters(prev => ({ ...prev, [key]: null }));
    };


    useEffect(() => {
        if (!open) {
            refetch();
        }
    }, [open, filters]);

    return (
        <div className="w-full h-full flex flex-col mx-auto px-4 py-6 gap-6">

            <div className="flex-shrink-0 flex justify-between items-center">
                <div className="flex gap-2 justify-start items-center">
                    <div>
                        <BackArrowButton href="/dashboard" size={30} />
                    </div>
                    <h1 className="text-xl font-semibold">Categories</h1>
                </div>

                <button
                    onClick={handleCreate}
                    className="px-3 py-2 bg-white text-black rounded-lg font-medium flex justify-center items-center"
                >
                    <Plus size={15} className="font-bold" /> New
                </button>
            </div>

            <div className="flex-shrink-0">
                <SearchInput
                    name="category-search"
                    placeholder="Search Category"
                    value={query}
                    onChange={(v: string) => setQuery(v)}
                />
            </div>
            <div className="w-full px-4">
                <FilterBars
                    filters={filters}
                    filterButtons={CATEGORY_FILTER_BUTTONS}
                    isActive={(key, f) => !!f[key]}
                    onFilterClick={(type) => setOpenSheet(type)}
                    onClearFilter={(key) => clearFilter(key)}
                    onClearAll={handleClearAll}
                />
            </div>

            <div className="flex-1  min-h-0 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col space-y-2 pb-6">
                    {categories.length > 0 && categories.map((category: any, index) => {
                        if (categories.length - 3 === index + 1) {
                            return (
                                <CategoryItem ref={scrollElementRef} key={category.id} category={category} onEdit={handleEdit} onDelete={handleDelete} loading={loading}
                                />
                            )
                        }
                        return (
                            <CategoryItem key={category.id} category={category} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
                        )
                    })}
                    {loadingQuery && (
                        <div className="flex justify-center py-4">
                            <Loader2 className="animate-spin" />
                        </div>
                    )}
                    {!loadingQuery && categories.length === 0 && (
                        <div className="text-center text-slate-500 py-10">
                            No category found
                        </div>
                    )}
                </div>
            </div>
            {/* {categories.length > 0 && <CategoryTree categories={categories} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />} */}
            {/* {categories.length <= 0 && <div className="w-full h-full flex justify-center items-center">No categories found</div>} */}
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

            <FilterSheet
                open={!!openSheet}
                activeKey={openSheet}
                filters={filters}
                panels={getCategoryPanel()}
                onClose={() => setOpenSheet(null)}
                onApply={(patch) => setFilters(prev => ({ ...prev, ...patch }))}
            />

        </div>
    );
}