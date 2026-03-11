"use client";

import { useEffect, useState } from "react";
import CategoryActions from "./categoryActions";
import { ChevronDown, ChevronUp, EllipsisVertical } from "lucide-react";
import { stringToColor } from "@/lib/utils/colors";

export default function CategoryItem({ category, onEdit }: any) {

    const [open, setOpen] = useState(true);
    const [openAction, setOpenAction] = useState(false);

    return (
        <div>

            <div className="flex justify-between items-center bg-zinc-900 px-4 py-3 rounded-lg">

                <div
                    className="w-full flex items-center justify-between gap-2 cursor-pointer"
                >
                    <div className="w-full flex gap-2" onClick={() => setOpen(!open)}>

                        {category.children?.length > 0 && (
                            <span className="text-xs">
                                {open ? <ChevronUp /> : <ChevronDown />}
                            </span>
                        )}
                        <div className="w-5 h-5 rounded-full" style={{ background: stringToColor(category.name) }}></div>
                        <span>{category.name}</span>
                    </div>
                    {!openAction && <button className="" onClick={() => setOpenAction(prev => !prev)}>
                        <EllipsisVertical />
                    </button>}
                </div>

                {openAction && <CategoryActions category={category} onEdit={onEdit} closeAction={()=>setOpenAction(false)}/>}

            </div>

            {open && category.children?.length > 0 && (
                <div className="ml-6 mt-2 space-y-2 border-l border-zinc-700 pl-4">
                    {category.children.map((child: any) => (
                        <CategoryItem key={child.id} category={child} />
                    ))}
                </div>
            )}

        </div>
    );
}