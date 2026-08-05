type NavigationButtonPropsType = {
    label: string;
    handler?: () => void;
}


const NavigationButton = (props: NavigationButtonPropsType) => {

    const { label = "", handler } = props;

    return (
        <div className="bg-surface text-text-primary p-2 w-full rounded-2xl font-semibold hover:bg-surface-soft hover:text-text-primary cursor-pointer" onClick={handler}>
            {label}
        </div>
    )
};


export default NavigationButton;