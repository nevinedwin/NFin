import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    REFRESH_TOKEN_EXPIRES,
    setRefreshToken
} from "@/lib/auth";



export const POST = async (req: NextRequest) => {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.passwordHash!)))
        return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });

    const accessToken = await generateAccessToken(user.id, user.role);
    const refreshToken = await generateRefreshToken(user.id);
    await setRefreshToken(user.id, refreshToken);

    const res = NextResponse.json({ accessToken });
    res.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: '/', maxAge: REFRESH_TOKEN_EXPIRES })
    return res;
}