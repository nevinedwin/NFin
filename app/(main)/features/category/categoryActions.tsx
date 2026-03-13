import LoaderButton from "@/components/ui/loaderButton";
import { Edit, Trash, X } from "lucide-react";
import Link from "next/link";

export default function CategoryActions({ category, onEdit, closeAction, onDelete, loading }: any) {

    return (
        <div className="flex gap-3 text-sm">

            <button>
                <Edit size={20} className="" onClick={() => { closeAction(); onEdit(category) }} />
            </button>
            <button>
                {
                    loading
                        ? <LoaderButton className="w-5 h-5 text-red-500" />
                        : <Trash size={20} className="text-red-500" onClick={() => onDelete(category)} />
                }
            </button>
            <button>
                <X size={20} className="" onClick={() => closeAction()} />
            </button>
        </div>
    );
}