// app/api/auth/me/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        // Get Authorization header
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        //  Verify token
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        ) as { sub: string };

        //  Fetch user from DB
        const user = await prisma.user.findUnique({
            where: { id: decoded.sub },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
}