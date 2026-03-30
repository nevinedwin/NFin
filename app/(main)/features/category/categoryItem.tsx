"use client";

import { useEffect, useState } from "react";
import CategoryActions from "./categoryActions";
import { ChevronDown, ChevronUp, EllipsisVertical } from "lucide-react";
import { stringToColor } from "@/lib/utils/colors";
import DynamicIcon from "@/components/iconPicker/dynamicIcon";
import CategoryIcon from "@/components/ui/caetgoryIcon";
import { formatUnderScoredStringCut } from "@/lib/utils/formats";

export default function CategoryItem({ category, ref = null, onEdit, onDelete, loading, hasBorder = true }: any) {

    const [open, setOpen] = useState(false);
    const [openAction, setOpenAction] = useState(false);

    return (
        <div ref={ref}>

            <div className={`flex justify-between items-center  px-4 py-3 ${hasBorder ? 'border-b border-border' : ''}`}>

                <div
                    className="w-full flex items-center justify-between gap-2 cursor-pointer"
                >
                    <div className="w-full flex gap-4 items-center" onClick={() => setOpen(!open)}>

                        <div className="w-6 h-6 flex justify-center items-center font-bold" >
                            <CategoryIcon name={category.icon} className="w-full h-full" containerClassName="w-full h-full flex item-center justify-center" />
                        </div>
                        <div className="flex flex-col gap-2 justify-start items-start">
                            <div className="flex justify-center items-center">
                                <div>{category.name}</div>
                                {category.children?.length > 0 && (
                                    <div className="text-xs w-5 h-5 flex justify-center items-center">
                                        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                    </div>
                                )}
                            </div>
                            <div className="border border-border px-2 rounded-lg text-xs">{formatUnderScoredStringCut(category.forType)}</div>
                        </div>
                    </div>
                    {!openAction && <button className="" onClick={() => setOpenAction(prev => !prev)}>
                        <EllipsisVertical />
                    </button>}
                </div>

                {openAction && <CategoryActions category={category} onEdit={onEdit} onDelete={onDelete} loading={loading} closeAction={() => setOpenAction(false)} />}

            </div>

            {open && category.children?.length > 0 && (
                <div className="ml-6 mb-8 space-y-2 border-l border-border pl-4">
                    {category.children.map((child: any) => (
                        <CategoryItem key={child.id} category={child} hasBorder={true} />
                    ))}
                </div>
            )}

        </div>
    );
}