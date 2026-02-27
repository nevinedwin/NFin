
type SelectedFieldProp = {
    label: string;
    children: React.ReactNode;
    name: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>
    required?: boolean
}

const SelectField = ({
    label,
    children,
    name,
    value,
    onChange,
    required
}: SelectedFieldProp) => {
    return (
        <div>
            <label className="text-sm text-slate-500">{label}</label>
            <select 
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full mt-1 border border-border rounded-xl h-11 px-3 text-base outline-none bg-black"
            >
                {children}
            </select>
        </div>
    );
}

export default SelectField;