import { UserRoles } from '@/generated/prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from './prisma';
import { cookies } from 'next/headers';

const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || '';
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || '';
const ACCESS_TOKEN_EXPIRES = "15m";
export const REFRESH_TOKEN_EXPIRES: number = 60 * 60 * 24 * 15; // 15 days in seconds


export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export const generateAccessToken = async (userId: string, role: UserRoles) => {
    return jwt.sign({ sub: userId, role }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES })
};

export const generateRefreshToken = async (userId: string) => {
    return jwt.sign(
        { userId },
        REFRESH_TOKEN_SECRET!,
        { expiresIn: "7d" }
    );
};

export const setRefreshToken = async (userId: string, token: string) => {
    const hash = await bcrypt.hash(token, 12);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES * 1000);

    return prisma.refreshToken.create({
        data: { tokenHash: hash, userId, expiresAt }
    })
};

export const setAccessToken = async (userId: string, token: string) => {
    (await cookies()).set({
        name: "accessToken",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
};

export async function validateRefreshToken(token: string) {
    const tokenRecords = await prisma.refreshToken.findMany({
        where: { revoked: false },
    });

    for (const t of tokenRecords) {
        const match = await bcrypt.compare(token, t.tokenHash);
        if (match) return t;
    }

    return null;
}

export const revokeRefreshToken = async (tokenId: string) => {
    await prisma.refreshToken.update({
        where: { id: tokenId },
        data: { revoked: true },
    });
}

export const revokeAllUserTokens = async (userId: string) => {
    await prisma.refreshToken.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true },
    });
}

export const getAccessToken = async () => {
    return (await cookies()).get('accessToken')?.value;
};

export const clearAccessToken = async () => {
    const cookie = cookies();
    (await cookie).delete('accessToken');
}