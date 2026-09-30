import axios from "axios";
import { userStore } from "../store/userStore";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn("⚠️ No token found in localStorage for request to", config.url);
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            console.error(`❌ ${status} response for`, error.config?.url);
            console.error("Request headers:", error.config?.headers);
            userStore.getState().logout();
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;