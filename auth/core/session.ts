
import crypto from 'crypto';
import { CookiesType, sessionPayload } from "@/types/auth";
import { prisma } from '@/lib/prisma';

export const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
export const COOKIE_SESSION_KEY = 'session-key';

const getUserSessionById = async (sessionId?: string | null) => {
    if (!sessionId) return null;

    try {
        const rawUser = await prisma.refreshToken.findFirst({
            where: {
                sessionId,
                expiresAt: {
                    gt: new Date(),
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        showBalance: true,
                    },
                },
            },
        });

        return rawUser?.user ?? null;
    } catch (err) {
        // Don't leak details — caller will treat null as unauthenticated
        console.error('getUserSessionById failed');
        return null;
    }
};

export const getUserFromSession = async (cookies: Pick<CookiesType, 'get'>) => {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value ?? null;
    if (!sessionId) return null;

    // tidy up expired sessions occasionally
    try {
        await prisma.refreshToken.deleteMany({
            where: { expiresAt: { lt: new Date() } },
        });
    } catch {
        // ignore cleanup errors
    }

    return getUserSessionById(sessionId);
};

export const createUserSession = async (user: sessionPayload, cookie: Pick<CookiesType, 'set'>) => {
    // 32 bytes (256 bits) is sufficient for session id entropy
    const sessionId = crypto.randomBytes(32).toString('hex');

    // store/replace the refresh token entry atomically
    try {
        await prisma.refreshToken.upsert({
            where: { sessionId },
            update: { userId: user.id, expiresAt: new Date(Date.now() + SESSION_EXPIRY) },
            create: { sessionId, userId: user.id, expiresAt: new Date(Date.now() + SESSION_EXPIRY) },
        });
    } catch (err) {
        console.error('createUserSession db error');
        throw err;
    }

    setCookie(sessionId, cookie);
};

export const setCookie = (sessionId: string, cookie: Pick<CookiesType, 'set'>) => {
    const isSecure = process.env.NODE_ENV === 'production' || (process.env.COOKIE_SECURE ?? 'yes') !== 'no';

    cookie.set(COOKIE_SESSION_KEY, sessionId, {
        secure: isSecure,
        httpOnly: true,
        sameSite: isSecure ? 'strict' : 'lax',
        expires: Date.now() + SESSION_EXPIRY,
    });
};

export const removeUserFromSession = async (cookies: Pick<CookiesType, 'get' | 'delete'>) => {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value ?? null;
    if (!sessionId) return null;

    try {
        await prisma.refreshToken.deleteMany({ where: { sessionId } });
    } catch (err) {
        console.error('removeUserFromSession db error');
    }

    cookies.delete(COOKIE_SESSION_KEY);
};

export const updateSessionExpiration = async (cookies: Pick<CookiesType, 'get' | 'set'>) => {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value ?? null;
    if (!sessionId) return null;

    const user = await getUserSessionById(sessionId);
    if (!user) return null;

    try {
        await prisma.refreshToken.upsert({
            where: { sessionId },
            update: { expiresAt: new Date(Date.now() + SESSION_EXPIRY) },
            create: { sessionId, userId: user.id, expiresAt: new Date(Date.now() + SESSION_EXPIRY) },
        });
    } catch (err) {
        console.error('updateSessionExpiration db error');
    }

    setCookie(sessionId, cookies);
};