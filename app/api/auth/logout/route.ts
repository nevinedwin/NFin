import { revokeRefreshToken, validateRefreshToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const refreshToken = await req.cookies.get("refreshToken")?.value;
    if (!refreshToken) return NextResponse.json({});

    const tokenRecord = await validateRefreshToken(refreshToken);
    if (tokenRecord) await revokeRefreshToken(tokenRecord.id);

    const res = NextResponse.json({ success: true });
    res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
    return res;
}