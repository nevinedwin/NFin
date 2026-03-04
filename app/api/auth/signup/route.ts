import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
    REFRESH_TOKEN_EXPIRES,
    setRefreshToken
} from "@/lib/auth";


export const POST = async (req: NextRequest) => {
    const { email, password, name } = await req.json();

    console.log(process.env.NEXT_PUBLIC_EMAIL_RESTRICTION);

    if (!email || !password) return NextResponse.json({ error: "Missing email or password" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });

    const passwordHash = await hashPassword(password);

    console.log(passwordHash);

    const user = await prisma.user.create({ data: { email, passwordHash, name } });

    const accessToken = await generateAccessToken(user.id, 'USER');
    const refreshToken = await generateRefreshToken(user.id);
    await setRefreshToken(user.id, refreshToken);

    const res = NextResponse.json({ accessToken });
    res.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", maxAge: REFRESH_TOKEN_EXPIRES })
    return res;
}