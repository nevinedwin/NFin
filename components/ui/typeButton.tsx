import AccountLogo from "../wallet/accountLogo";

export type ButtonColors = "red" | "green" | "blue" | "purple" | "yellow" | "orange";

type TypeButtonProp = {
    active: boolean;
    onClick: () => void;
    label: string;
    color: ButtonColors;
}

export const colorPallet = {
    red: "bg-red-800 text-white",
    green: "bg-green-800 text-white",
    blue: "bg-blue-800 text-white",
    yellow: "bg-yellow-800 text-white",
    orange: "bg-orange-800 text-white",
    purple: "bg-purple-800 text-white"
};

const logoColors = {
    red: "bg-red-800",
    green: "bg-green-800",
    blue: "bg-blue-800",
    yellow: "bg-yellow-800",
    orange: "bg-orange-800",
    purple: "bg-purple-800",
};


const captions = {
    red: "Money going out",
    green: "Money Comming In",
    blue: "Between Accounts",
    yellow: "Giving to someone else ",
    orange: "Borrowing from someone else",
    purple: "Group expense splits",
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
                w-full min-h-[150px]
                rounded-lg text-sm font-medium
                transition-all duration-200 ease-out
                bg-gray-200 text-black
                flex items-center justify-center flex-col gap-1
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
            <p><AccountLogo name={label} className={`w-10 h-10 ${logoColors[color]}`} /></p>
            {label}
            <p className="text-text-dull text-xs px-2">{captions[color]}</p>
        </button>
    );
}


export default TypeButton;