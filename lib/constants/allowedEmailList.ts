
export const ENABLE_EMAIL_RESTRICTION = process.env.NEXT_PUBLIC_EMAIL_RESTRICTION === "true";

export type EnvType = 'development' | 'production';

const env = process.env.NEXT_PUBLIC_APP_ENV;

type AllowedEmails = Record<EnvType, string[]>

export const ALLOWED_EMAILS: AllowedEmails = {
    development: [
        // "nevinedwin100@gmail.com",
        "nevinedwin1000@gmail.com"
    ],
    production: [
        "nevinedwin1000@gmail.com",
        "kevinedwin59@gmail.com"
    ]
}