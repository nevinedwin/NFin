
const SelectField = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => {
    return (
        <div>
            <label className="text-sm text-slate-500">{label}</label>
            <select className="w-full mt-1 border border-border rounded-xl h-11 px-3 text-sm outline-none bg-black">
                {children}
            </select>
        </div>
    );
}

export default SelectField;