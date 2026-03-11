import { prisma } from "@/lib/prisma";
import CategoryPageClient from "./categoryUI";

export default async function CategoryPage() {

  const categories = await prisma.category.findMany({
    where: { isDeleted: false },
    include: { children: true },
    orderBy: { createdAt: "desc" }
  });

  const rootCategories = categories.filter(c => !c.parentId);

  const parentCategories = rootCategories.map(c => ({
    id: c.id,
    name: c.name
  }));

  return (
    <CategoryPageClient
      categories={rootCategories}
      parentCategories={parentCategories}
    />
  );
}