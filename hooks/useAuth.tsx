"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserOut } from "@/types";
import { getMe } from "@/lib/api/auth";
import { getAuthToken, setAuthToken, removeAuthToken } from "@/lib/api/client";

interface AuthContextType {
  user: UserOut | null;
  isLoading: boolean;
  loginState: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          removeAuthToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    }

    loadUser();
  }, []);

  const loginState = async (token: string) => {
    setAuthToken(token);
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (e) {
      console.error(e);
      removeAuthToken();
      throw e;
    }
  };

  const logout = () => {
    setUser(null);
    removeAuthToken();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginState, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
