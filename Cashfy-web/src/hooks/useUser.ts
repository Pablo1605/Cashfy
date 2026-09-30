import { useShallow } from "zustand/shallow"
import { userStore } from "../store/userStore"
import type { LoginRequest } from "../types/LoginRequest";
import { loginUser } from "../api/userApi";


export const useUser = () => {
    const { login, logout} = userStore(useShallow((state) => ({
        login: state.login,
        logout: state.logout,
    })));

    const setLogin = async (requestUser: LoginRequest) => {
        try {
            const authUser = await loginUser(requestUser);
            login(authUser);
        } catch (error) {
            logout();
            console.error("Error login user:", error);
            throw error;
        }
    }

    return { setLogin };
}