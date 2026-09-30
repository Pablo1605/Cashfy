import type { AuthUser } from "../types/AuthUser";
import type { LoginRequest } from "../types/LoginRequest";
import type { RegisterRequest } from "../types/RegisterRequest";
import apiClient from "./http";

export const registerUser = async(data: RegisterRequest): Promise<void> => {
    await apiClient.post("/api/auth/register", data);
}

export const loginUser = async(data: LoginRequest): Promise<AuthUser> => {
    const response = await apiClient.post("/api/auth/login", data);
    const {token, username, email} = response.data;
    return {token, username, email}
}