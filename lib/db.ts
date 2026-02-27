import { auth } from "@clerk/nextjs/server"
import { prisma } from "./prisma";


export const getCurrentUser = async (): Promise<{ id: string, email: string } | null> => {
    const { userId } = await auth();

    if (!userId) return null;

    return prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: { id: true, email: true }
    })
}