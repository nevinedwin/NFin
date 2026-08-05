
export type ButtonColors = "red" | "green" | "blue" | "purple" | "yellow" | "orange";

type TypeButtonProp = {
    active: boolean;
    onClick: () => void;
    label: string;
    color: ButtonColors;
}

export const colorPallet = {
        red: "bg-primary text-text-primary",
        green: "bg-primary text-text-primary",
        blue: "bg-primary text-text-primary",
        yellow: "bg-primary text-text-primary",
        orange: "bg-primary text-text-primary",
        purple: "bg-primary text-text-primary"
    };


const TypeButton = ({ active, onClick, label, color }: TypeButtonProp) => {
    const colors = {
        red: active && colorPallet.red,
        green: active && colorPallet.green,
        blue: active && colorPallet.blue,
        yellow: active && colorPallet.yellow,
        orange: active && colorPallet.orange,
        purple: active && colorPallet.purple
    };

    return (
        <button
            onClick={onClick}
            type="button"
            className={`
                h-20 w-32
                rounded-2xl text-sm font-medium
                transition-all duration-200 ease-out
                bg-border
                ${colors[color]}
                
                /* depth */
                shadow-[0_2px_4px_rgba(0,0,0,0.12)]
                
                /* raised */
                ${!active && "hover:shadow-[0_4px_10px_rgba(0,0,0,0.18)] hover:-translate-y-[1px]"}
                
                /* pressed */
                ${active && "shadow-inner translate-y-[1px] scale-[0.98]"}
                
                active:translate-y-[2px]
            `}
        >
            {label}
        </button>
    );
}


export default TypeButton;