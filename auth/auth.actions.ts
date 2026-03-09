'use server';

import { prisma } from "@/lib/prisma";
import { FormData } from "@/types/auth";
import { redirect } from "next/navigation";
import { comparePassword, generateSalt, hashPassword } from "./core/passwordHasher";
import { createUserSession, removeUserFromSession } from "./core/session";
import { cookies } from "next/headers";
import { validateSignUp } from "./auth.validations";


export const signUp = async (unSafeData: FormData) => {

    const errorMsg = validateSignUp(unSafeData);
    if (errorMsg) return errorMsg;

    const existing = await prisma.user.findUnique({ where: { email: unSafeData.email } });
    if (existing) return 'Account already exists for this email';

    try {
        const salt = generateSalt()
        const hashedPassword = await hashPassword(unSafeData.password, salt)

        const user = await prisma.user.create({
            data: {
                email: unSafeData.email,
                passwordHash: hashedPassword,
                name: unSafeData.name,
                salt,
                showBalance: true
            }
        });

        if (user === null) return 'Unable to create account';

        await createUserSession(user, await cookies());

    } catch (error) {
        console.log(error);
        return 'Unable to create accout';
    }


    redirect('/');

};

export const signIn = async (data: { email: string, password: string }) => {
    const { email, password } = data;

    try {

        if (!email || !password) return 'Missing email or password';

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return 'Account does not exists. Please Sign Up to create an account';

        const isCorrectPassword = await comparePassword({
            hashedPassword: user.passwordHash!,
            salt: user.salt!,
            password
        })

        if (!isCorrectPassword) return 'Incorrect password';

        await createUserSession(user, await cookies());

    } catch (error) {
        return 'Unable to SignIn'
    }

    redirect('/');
}


export const logOut = async () => {
    await removeUserFromSession(await cookies());

    redirect('/');
}