import { ActiveFilters, CategoryActiveFilters, CategoryFilterType } from "@/types/filters";
import { ArrowLeftRight, Tag } from "lucide-react";
import { FilterButtonConfig } from "../ui/FilterBars/filterBars";
import { FilterPanelConfig } from "../ui/FilterBars/filterSheet";
import RadioListStatic from "../ui/radioListStatic";
import { TYPE_OPTIONS } from "../transaction/filterKeys";
import RadioList from "../ui/radioList";
import { getCategories } from "@/actions/category";

export type FilterButtonType = { key: CategoryFilterType; label: string; icon: React.ReactNode }[]


export const CATEGORY_FILTER_BUTTONS: FilterButtonConfig<CategoryFilterType>[] = [
    { key: "type", label: "Type", icon: <ArrowLeftRight size={13} /> },
    { key: "parent", label: "Parent Category", icon: <Tag size={13} /> },
];

export function filterLabel(key: CategoryFilterType, filters: ActiveFilters): string {
    if (key === "type" && filters.type) return filters.type;
    return CATEGORY_FILTER_BUTTONS.find((b) => b.key === key)!.label;
};


export const getCategoryPanel = () => {
    const PANELS: FilterPanelConfig<CategoryActiveFilters>[] = [
        {
            key: "type",
            title: "Transaction Type",
            render: (value, onChange) => (
                <RadioListStatic
                    options={TYPE_OPTIONS}
                    selected={value as string | null}
                    onSelect={onChange}
                    type="type"
                />
            ),
        },
        {
            key: "parent",
            title: "Select Main Category",
            render: (value, onChange) => (
                <RadioList
                    selected={value as string | null}
                    onSelect={onChange}
                    type="category"
                    method={getCategories}
                    filters={{ onlyParent: true }}
                />
            ),
        }
    ];

    return PANELS;
}

