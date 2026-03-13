'use server';

import { getCurrentUser } from "@/auth/currentUser";
import { prisma } from "@/lib/prisma";
import { outputResp } from "@/lib/utils/response";
import { createCategorySchema } from "@/schemas/category.schema";
import { NextRequest, NextResponse } from "next/server";



type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return outputResp({ message: 'Unauthorized', status: 401 })
        };

        const {id} = await params;

        const body = await req.json();
        const parsedBody = createCategorySchema.safeParse(body);

        if (!parsedBody.success) {
            return outputResp({ message: 'Invalid data', status: 400, error: parsedBody.error.flatten() });
        }

        const { name, type, forType, parentId } = parsedBody.data;

        const existingCategory = await prisma.category.findFirst({
            where: {
                id,
                userId: user.id,
                isDeleted: false
            },
            select: {
                id: true
            }
        });

        if (!existingCategory) return outputResp({ message: "Category not found", status: 404 });

        if (parentId) {
            const existingParent = await prisma.category.findFirst({
                where: {
                    id: parentId,
                    userId: user.id,
                    isDeleted: false
                },
                select: {
                    id: true
                }
            });

            if (!existingParent) return outputResp({ message: 'Parent Category not found', status: 400 });
        }

        if (parentId === id) {
            return outputResp(
                { message: "Category cannot be its own parent", status: 400 }
            );
        }

        const updateCategory = await prisma.category.update({
            where: {
                id
            },
            data: {
                name,
                type,
                forType,
                parentId
            },
            select: {
                id: true,
                name: true,
                parentId: true
            }
        });

        return NextResponse.json(outputResp);

    } catch (error) {
        console.log("CATEGORY PATH ERROR", error);

        return NextResponse.json(
            { message: "Failed to update category" },
            { status: 500 }
        );
    }
};


export async function DELETE(
    req: NextRequest,
    { params }: Params
) {
    try {

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const {id} = await params;

        const category = await prisma.category.findFirst({
            where: {
                id,
                userId: user.id,
                isDeleted: false
            },
            select: {
                id: true
            }
        });

        if (!category) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        const children = await prisma.category.count({
            where: {
                parentId: id,
                isDeleted: false
            }
        });

        if (children > 0) {
            return NextResponse.json(
                { message: "Cannot delete category with subcategories" },
                { status: 400 }
            );
        }

        await prisma.category.update({
            where: { id },
            data: {
                isDeleted: true
            }
        });

        return NextResponse.json(
            { message: "Category deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("CATEGORY_DELETE_ERROR", error);

        return NextResponse.json(
            { message: "Failed to delete category" },
            { status: 500 }
        );
    }
}