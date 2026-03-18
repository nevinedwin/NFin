import { ALLOWED_EMAILS, EnvType } from "@/lib/constants/allowedEmailList";
import { FormData } from "@/types/auth";

const isRestrictEmail = process.env.NEXT_PUBLIC_EMAIL_RESTRICTION;
const env: EnvType = process.env.NEXT_PUBLIC_APP_ENV as EnvType;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignUp = ({ email, password, name }: FormData) => {
    let error = '';

    if (!name) {
        error = 'Name is required';
    } else if (!email) {
        error = 'Email is required';
    } else if (!password) {
        error = 'Password is required';
    } else {

        if (isRestrictEmail === 'true') {
            const isValidEmail = ALLOWED_EMAILS[env].includes(email.toLowerCase());
            if (!isValidEmail) {
                error = 'Account creation requires permission. Please contact Nevin';
            }
        } else {
            const isEmailFormat = emailRegex.test(email);
            if (!isEmailFormat) {
                error = 'Email is not valid';
            }
        }
    }

    return error;
}