'use server';

import { prisma } from "@/lib/prisma";


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