import CategoryItem from "./categoryItem";

export default function CategoryTree({ categories, onEdit }: any) {
    return (
        <div className="space-y-8">
            {categories.map((category: any) => (
                <CategoryItem key={category.id} category={category} onEdit={onEdit}/>
            ))}
        </div>
    );
}