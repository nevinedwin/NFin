import axios from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "./auth";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
    refreshSubscribers.push(callback);
}

// Attach access token
api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    "/api/auth/refresh",
                    {},
                    { withCredentials: true }
                );

                setAccessToken(data.userId, data.accessToken);
                isRefreshing = false;

                onRefreshed(data.accessToken);

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                isRefreshing = false;
                clearAccessToken();
                // window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;