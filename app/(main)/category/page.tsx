import { prisma } from "@/lib/prisma";
import CategoryPageClient from "./categoryUI";
import { getCurrentUser } from "@/auth/currentUser";
import { redirect } from "next/navigation";

export default async function CategoryPage() {

  const user = await getCurrentUser();
  if (!user) return redirect('/sign-up')

  const categories = await prisma.category.findMany({
    where: { userId: user.id, isDeleted: false, type: "MAIN" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true
    }
  });

  const parentCategories = categories.map(c => ({
    id: c.id,
    name: c.name
  }));

  return (
    <CategoryPageClient
      // categories={rootCategories}
      parentCategories={parentCategories}
    />
  );
}