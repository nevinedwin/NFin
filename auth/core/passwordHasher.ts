import { ComparePassword } from '@/types/auth';
import crypto from 'crypto';

export const hashPassword = (password: string, salt: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password.normalize(), salt, 64, (error, derivedKey) => {
            if (error) return reject(error);
            resolve(Buffer.from(derivedKey).toString('hex'));
        });
    });
};

export const generateSalt = () => {
    // 32 bytes = 256 bits
    return crypto.randomBytes(32).toString('hex');
};

export const comparePassword = async ({ hashedPassword, password, salt }: ComparePassword) => {
    try {
        const inputHashedPassword = await hashPassword(password, salt);
        const a = Buffer.from(inputHashedPassword, 'hex');
        const b = Buffer.from(hashedPassword, 'hex');

        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(a, b);
    } catch (err) {
        // don't throw internal errors to callers; return mismatch
        return false;
    }
};