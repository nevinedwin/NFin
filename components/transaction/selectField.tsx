
type SelectedFieldProp = {
    label: string;
    children: React.ReactNode;
    name: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>
    required?: boolean;
    containerClass?: string;
    labelClass?: string;
    selectClass?: string;
}

const SelectField = ({
    label,
    children,
    name,
    value,
    onChange,
    required,
    containerClass = '',
    labelClass = '',
    selectClass = ''
}: SelectedFieldProp) => {
    return (
        <div className={`${containerClass}`}>
            <label className={`text-sm text-slate-500 ${labelClass}`}>{label} {required && <span className="text-red-500">*</span>}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full mt-1 border border-border rounded-xl h-11 px-3 text-base outline-none bg-black ${selectClass}`}
            >
                {children}
            </select>
        </div>
    );
}

export default SelectField;