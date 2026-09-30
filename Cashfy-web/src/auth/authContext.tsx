import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser } from "../types/AuthUser";

interface AuthContextValue { 
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined); 

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null); 

  useEffect(() => {
    const stored = localStorage.getItem("authUser");

    if (stored) {
      try {
        const parsed: AuthUser = JSON.parse(stored); 
        setUser(parsed);
        localStorage.setItem("token", parsed.token); 
      } catch {
        localStorage.removeItem("authUser"); 
        localStorage.removeItem("token"); 
      }
    }
  }, []);

  const login = (authUser: AuthUser) => {
    setUser(authUser);
    localStorage.setItem("authUser", JSON.stringify(authUser)); 
    localStorage.setItem("token", authUser.token); 
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>; 
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};