type NavigationButtonPropsType = {
    label: string;
    handler?: () => void;
}


const NavigationButton = (props: NavigationButtonPropsType) => {

    const { label = "", handler } = props;

    return (
        <div className="bg-white text-black p-1 w-full rounded-lg font-semibold hover:bg-black/5 hover:text-white cursor-pointer" onClick={handler}>
            {label}
        </div>
    )
};


export default NavigationButton;