import CategoryItem from "./categoryItem";

export default function CategoryTree({ categories, onEdit, onDelete, loading }: any) {
    return (
        <div className="space-y-2">
            {categories.map((category: any) => (
                <CategoryItem key={category.id} category={category} onEdit={onEdit} onDelete={onDelete} loading={loading} />
            ))}
        </div>
    );
}