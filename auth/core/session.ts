
import crypto from 'crypto';
import { CookiesType, sessionPayload } from "@/types/auth";
import { prisma } from '@/lib/prisma';

export const SESSION_EXPIRY = 60 * 60 * 24 * 7 * 1000;
export const COOKIE_SESSION_KEY = 'session-key';

const getUserSessionById = async (sessionId: string) => {
    try {
        if (!sessionId) return null;

        const rawUser = await prisma.refreshToken.findFirst({

            where: {
                sessionId,
                expiresAt: {
                    gt: new Date()
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        if (!rawUser) return null;

        return rawUser.user;

    } catch (error) {
        return null;
    }
}

export const getUserFromSession = async (cookies: Pick<CookiesType, 'get'>) => {
    const sessionId: string = cookies.get(COOKIE_SESSION_KEY)?.value!;
    if (sessionId === null) return null;

    // delete expired sessions
    await prisma.refreshToken.deleteMany({
        where: {
            expiresAt: {
                lt: new Date()
            }
        }
    });

    return getUserSessionById(sessionId);
};

export const createUserSession = async (user: sessionPayload, cookie: Pick<CookiesType, 'set'>) => {
    const sessionId = crypto.randomBytes(512).toString('hex').normalize();

    await prisma.refreshToken.create({
        data: { sessionId, userId: user.id, expiresAt: new Date(Date.now() + SESSION_EXPIRY) }
    })

    setCookie(sessionId, cookie);
}

export const setCookie = (sessionId: string, cookie: Pick<CookiesType, 'set'>) => {
    cookie.set(COOKIE_SESSION_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        expires: Date.now() + SESSION_EXPIRY
    })
}

export const removeUserFromSession = async (cookies: Pick<CookiesType, 'get' | 'delete'>) => {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
    if (sessionId == null) return null;

    await prisma.refreshToken.delete({ where: { sessionId } });
    cookies.delete(COOKIE_SESSION_KEY);
}

export const updateSessionExpiration = async (cookies: Pick<CookiesType, 'get' | 'set'>) => {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
    if (sessionId == null) return null;

    const user = await getUserSessionById(sessionId);
    if (user == null) return;

    await prisma.refreshToken.create({
        data: { sessionId, userId: user.id, expiresAt: new Date(Date.now() + SESSION_EXPIRY) }
    })

    setCookie(sessionId, cookies);

}