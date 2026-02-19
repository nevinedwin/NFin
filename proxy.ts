import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ALLOWED_EMAILS, ENABLE_EMAIL_RESTRICTION } from './lib/allowedEmailList';



const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();

    const { pathname } = req.nextUrl;

    // ✅ NEVER block auth pages
    if (
        pathname.startsWith("/sign-up") ||
        pathname.startsWith("/sign-in")
    ) {
        return NextResponse.next();
    }
    if (!userId && isProtectedRoute(req)) {
        const url = req.nextUrl.clone();
        url.pathname = "/sign-up";
        return NextResponse.redirect(url);
    }

    if (ENABLE_EMAIL_RESTRICTION && isProtectedRoute(req)) {
        const client = await clerkClient();
        const user = await client.users.getUser(userId!);

        const email = user.primaryEmailAddress?.emailAddress;

        console.log("🔥 USER EMAIL:", email);

        if (email && !ALLOWED_EMAILS.includes(email)) {
            const email = sessionClaims?.email as string | undefined;

            if (email && !ALLOWED_EMAILS.includes(email)) {
                console.log("🚫 Unauthorized email → signing out:", email);

                // ✅ Sign out by clearing Clerk session
                const res = NextResponse.redirect(new URL("/sign-up", req.url));

                res.cookies.delete("__session"); // Clerk session cookie
                return res;
            }
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};