export const formatUnderScoredString = (str: string) => {
    const formatted = str.replace(/_/g, " ");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
}

export const formDataConverter = (formData: FormData) => {
    return Object.fromEntries(formData.entries());
};