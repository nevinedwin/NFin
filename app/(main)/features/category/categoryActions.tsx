import { Edit, Trash, X } from "lucide-react";
import Link from "next/link";

export default function CategoryActions({ category, onEdit, closeAction }: any) {

    return (
        <div className="flex gap-3 text-sm">

            <button>
                <Edit size={20} className="" onClick={() => { closeAction(); onEdit(category) }} />
            </button>
            <button>
                <Trash size={20} className="text-red-500" />
            </button>
            <button>
                <X size={20} className="" onClick={() => closeAction()} />
            </button>
        </div>
    );
}