

type TypeButtonProp = {
    active: boolean;
    onClick: () => void;
    label: string;
    color: "red" | "green" | "blue";
}


const TypeButton = ({ active, onClick, label, color }: TypeButtonProp) => {
    const colors = {
        red: active && "bg-red-500 text-white",
        green: active && "bg-green-500 text-white",
        blue: active && "bg-blue-500 text-white"
    };

    return (
        <button
            onClick={onClick}
            className={`
                h-8 w-[78px]
                rounded-lg text-sm font-medium
                transition-all duration-200 ease-out
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