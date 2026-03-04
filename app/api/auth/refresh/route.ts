import { NextRequest, NextResponse } from "next/server";
import {
    REFRESH_TOKEN_EXPIRES,
    generateAccessToken,
    generateRefreshToken,
    revokeRefreshToken,
    setRefreshToken,
    validateRefreshToken
} from "@/lib/auth";



export const POST = async (req: NextRequest) => {
    const refreshToken = await req.cookies.get("refreshToken")?.value;
    if (!refreshToken) return NextResponse.json({ error: "No refresh token" }, { status: 401 });


    const tokenRecord = await validateRefreshToken(refreshToken);
    if (!tokenRecord) return NextResponse.json({ error: "Invalid or revoked token" }, { status: 401 });

    // Rotate: revoke old, issue new
    await revokeRefreshToken(tokenRecord.id);
    const newRefreshToken = await generateRefreshToken(tokenRecord.userId);
    await setRefreshToken(tokenRecord.userId, newRefreshToken);

    const accessToken = await generateAccessToken(tokenRecord.userId, "USER");

    const res = NextResponse.json({ accessToken, userId: tokenRecord.userId });
    res.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: REFRESH_TOKEN_EXPIRES,
    });

    return res;
} 