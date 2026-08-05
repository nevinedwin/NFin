import { NextResponse } from "next/server";


type OutputRespParams = {
    message: string;
    status: 500 | 400 | 404 | 401;
    error?: unknown;
};


export function outputResp({ message, status, error = null }: OutputRespParams) {
    const body: Record<string, unknown> = { message };
    if (error !== null && error !== undefined) body.error = error;
    return NextResponse.json(body, { status });
}