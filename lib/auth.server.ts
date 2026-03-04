import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getAccessToken } from "./tokenstore";

type TokenPayload = {
    userId: string;
};
export async function getServerUser() {
    const token = getAccessToken();
    if (!token) return null;

    try {
        const { userId } = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        ) as { userId: string };

        return await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true },
        });
    } catch {
        return null;
    }
}