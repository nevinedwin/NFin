import { NextResponse } from "next/server";


type OutputRespParams = {
    message: string;
    status: 500 | 400 | 404 | 401;
    error?: any;
};


export async function outputResp({ message, status, error = null }: OutputRespParams) {
    return NextResponse.json(
        { message, ...(error && {error}) },
        { status }
    )
};