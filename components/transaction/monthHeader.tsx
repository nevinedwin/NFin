import { ArrowLeftRight } from "lucide-react";
import { MonthGroup } from "./monthGroup";

export default function MonthHeader({ group }: { group: MonthGroup }) {
    const net = group.totalIncome - group.totalExpense;

    return (
        <div className="flex items-center justify-between px-4 py-2 bg-border">
            <div className="flex flex-col items-start">
                <span className="text-[10px] font-semibold text-slate-300">{group?.label?.split(' ')[1]}</span>
                <span className="text-xl font-medium text-slate-200">{group?.label?.split(' ')[0]}
                    <span className="text-[10px] text-slate-400 pl-2">
                        {group.transactions.length} txn{group.transactions.length !== 1 ? "s" : ""}
                    </span>
                </span>
            </div>
            <div className="flex flex-col justify-center items-end">
                <span className={`text-xl font-semibold text-white`}>
                    ₹{Math.abs(net).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
                <div className="flex gap-3">
                    <span className={`text-[10px] font-light text-green-500`}>
                        ₹{Math.abs(group.totalIncome).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                    <span><ArrowLeftRight size={10}/></span>
                    <span className={`text-[10px] font-light text-red-500`}>
                        ₹{Math.abs(group.totalExpense).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    );
}