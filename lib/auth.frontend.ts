import api from "./api";

export type LoginPayload = { email: string; password: string };
export type SignupPayload = { name: string; email: string; password: string };

export async function loginUser(payload: LoginPayload) {
    const { data } = await api.post("/auth/login", payload);
    return data; // { accessToken }
}

export async function signupUser(payload: SignupPayload) {
    const { data } = await api.post("/auth/signup", payload);
    return data; // { accessToken }
}

export async function logoutUser() {
    await api.post("/auth/logout");
}

export async function refreshToken() {
    const { data } = await api.post("/auth/refresh");
    return data; // { accessToken }
}

export async function getCurrentUser() {
    const { data } = await api.get("/auth/me");
    return data;
}