"use client";

type YesNoToggleProps = {
    value: boolean;
    onChange: (value: boolean) => void;
    label?: string;
    name?: string;
};

export default function YesNoToggle({
    value,
    onChange,
    label,
    name,
}: YesNoToggleProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm text-text-secondary">{label}</label>}

            <div className="flex w-full rounded-lg overflow-hidden border border-border">
                <button
                    type="button"
                    onClick={() => onChange(true)}
                    className={`flex-1 py-2 text-sm font-medium transition 
            ${value ? "bg-primary text-text-primary" : "bg-surface text-text-muted"}`}
                >
                    Yes
                </button>

                <button
                    type="button"
                    onClick={() => onChange(false)}
                    className={`flex-1 py-2 text-sm font-medium transition 
            ${!value ? "bg-accent text-text-primary" : "bg-surface text-text-muted"}`}
                >
                    No
                </button>
            </div>

            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={value ? "true" : "false"}
                />
            )}
        </div>
    );
}