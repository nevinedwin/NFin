'use server';

import { getCurrentUser } from "@/auth/currentUser";
import { prisma } from "@/lib/prisma";
import { createCategorySchema } from "@/schemas/category.schema";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    const category = await prisma.category.findMany({
        where: {
            ...(q
                ? {
                    name: {
                        contains: q,
                        mode: "insensitive"
                    }
                }
                : {})
        },
        take: 20
    });

    return Response.json(
        category.map((a) => ({
            value: a.id,
            label: a.name
        }))
    );
}

export async function POST(req: NextRequest) {
    try {

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await req.json();
        const parsed = createCategorySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: "Invalid data", errors: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const { name, type, forType, parentId } = parsed.data;

        if (parentId) {
            const parentExists = await prisma.category.findFirst({
                where: {
                    id: parentId,
                    userId: user.id,
                    isDeleted: false
                },
                select: {
                    id: true
                }
            })

            if (!parentExists) {
                return NextResponse.json(
                    { message: "Parent category not found" },
                    { status: 400 }
                )
            }
        }

        const category = await prisma.category.create({
            data: {
                name,
                type,
                forType,
                parentId,
                userId: user.id
            },
            select: {
                id: true,
                name: true,
                parentId: true
            }
        });

        return NextResponse.json(category, { status: 201 });

    } catch (error) {
        console.error("CATEGORY_CREATE_ERROR", error);

        return NextResponse.json(
            { message: `Failed to create category, ${error}` },
            { status: 500 }
        );
    }
};