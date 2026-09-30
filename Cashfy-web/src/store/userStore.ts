import { create } from "zustand";
import type { AuthUser } from "../types/AuthUser";

interface UserState { 
    user: AuthUser | null;
    login: (user: AuthUser) => void;
    logout: () => void;
    setUser: (user: AuthUser | null) => void;
}

const loadUserFromStorage = (): AuthUser | null => {
    try {
        const stored = localStorage.getItem("authUser");
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

export const userStore = create<UserState>((set) => ({
    user: loadUserFromStorage(),
    login: (user: AuthUser) => {
        set({ user });
        localStorage.setItem("authUser", JSON.stringify(user));
        localStorage.setItem("token", user.token);
    },
    logout: () => {
        set({ user: null });
        localStorage.removeItem("authUser");
        localStorage.removeItem("token");
    },
    setUser: (user: AuthUser | null) => {
        set({ user });
        if (user) {
            localStorage.setItem("authUser", JSON.stringify(user));
            localStorage.setItem("token", user.token);
        } else {
            localStorage.removeItem("authUser");
            localStorage.removeItem("token");
        }
    },
}));