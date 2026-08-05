'use server';

import { NextResponse, NextRequest } from "next/server";
import { createBudget, updateBudget } from "@/actions/budget";
import { getCurrentUser } from "@/auth/currentUser";

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const budget = await createBudget(body);

        return NextResponse.json(budget, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Failed to create budget." },
            { status: 400 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const budget = await updateBudget(body);

        return NextResponse.json(budget, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Failed to update budget." },
            { status: 400 }
        );
    }
}
