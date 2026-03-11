import { COOKIE_SESSION_KEY, getUserFromSession, updateSessionExpiration } from '@/auth/core/session';
import { UserRoles } from '@/generated/prisma/client';
import { NextResponse, type NextRequest } from 'next/server';

const privateRoutes = ["/dashboard", '/wallet']
const adminRoutes: string[] = []

const middleware = async (request: NextRequest) => {
    const response = (await middlewareAuth(request)) ?? NextResponse.next();

    await updateSessionExpiration({
        set: (key, value, options) => {
            response.cookies.set({ ...options, name: key, value })
        },
        get: key => response.cookies.get(key)
    });

    return response;
}

export const middlewareAuth = async (request: NextRequest) => {

    const session = request.cookies.get(COOKIE_SESSION_KEY);

    if (privateRoutes.includes(request.nextUrl.pathname)) {
        if (!session) {
            return NextResponse.redirect(new URL('/sign-up', request.url));
        }
    }

    if (adminRoutes.includes(request.nextUrl.pathname)) {
        if (!session) {
            return NextResponse.redirect(new URL('/sign-up', request.url));
        }
        // if (user.role !== UserRoles.ADMIN) {
        //     return NextResponse.redirect(new URL('/', request.url));
        // }
    }
}

export default middleware;

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    ]
} 